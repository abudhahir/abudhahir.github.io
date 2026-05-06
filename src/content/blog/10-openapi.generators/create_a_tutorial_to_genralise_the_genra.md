---
title: "Scaling OpenAPI Code Generation Across Multiple Specs"
excerpt: "Generalise OpenAPI Generator across many YAML specs in Spring Boot 4 + Java 21 - dynamic Gradle tasks, Maven execution blocks, core config flags, and shared-model strategies."
date: "Dec 22 2024"
author: "Abu Dhahir"
series: "OpenAPI Generators for Spring Boot 4"
tags:
- Tutorial
- Java
- Spring
- OpenAPI
- Gradle
- Maven
draft: false
---

This tutorial covers how to generalize and scale OpenAPI code generation for modern Java 21 and Spring Boot 4.x environments. We will focus on managing multiple specification files and understanding the impact of various configuration options.

### 1. Generalizing Generation from Multiple YAMLs

The goal is to avoid duplicating plugin configurations for every new API spec.

#### A. Gradle: The Dynamic Task Approach (Recommended)
Gradle allows you to define a list of APIs and dynamically create generation tasks. This is the cleanest way to scale.

```kotlin
// build.gradle.kts
plugins {
    id("org.openapi.generator") version "7.x.x"
}

val openApiSpecs = mapOf(
    "user-service" to "src/main/resources/api/user-api.yaml",
    "order-service" to "src/main/resources/api/order-api.yaml"
)

openApiSpecs.forEach { (name, specPath) ->
    tasks.register<org.openapitools.generator.gradle.plugin.tasks.GenerateTask>("openApiGenerate-$name") {
        generatorName.set("spring")
        inputSpec.set("$rootDir/$specPath")
        outputDir.set("$buildDir/generated/openapi")
        
        // Generalize package naming
        apiPackage.set("com.example.api.$name")
        modelPackage.set("com.example.model.$name")
        
        configOptions.set(mapOf(
            "useSpringBoot4" to "true",
            "generateRecords" to "true",
            "interfaceOnly" to "true",
            "useJackson3" to "true"
        ))
    }
}

// Aggregate task to run all generations
tasks.register("openApiGenerateAll") {
    dependsOn(openApiSpecs.keys.map { "openApiGenerate-$it" })
}

// Ensure compilation depends on generation
tasks.withType<JavaCompile> {
    dependsOn("openApiGenerateAll")
}
```

#### B. Maven: The Execution Block Approach
In Maven, you use multiple `<execution>` blocks. To generalize, put common settings in the `<plugin>` level and spec-specific settings in the `<execution>` level.

```xml
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <version>7.x.x</version>
    <configuration>
        <!-- Common Configurations -->
        <generatorName>spring</generatorName>
        <library>spring-boot</library>
        <configOptions>
            <useSpringBoot4>true</useSpringBoot4>
            <generateRecords>true</generateRecords>
            <interfaceOnly>true</interfaceOnly>
        </configOptions>
    </configuration>
    <executions>
        <execution>
            <id>user-api</id>
            <goals><goal>generate</goal></goals>
            <configuration>
                <inputSpec>${project.basedir}/src/main/resources/user-api.yaml</inputSpec>
                <apiPackage>com.example.api.user</apiPackage>
                <modelPackage>com.example.model.user</modelPackage>
            </configuration>
        </execution>
        <execution>
            <id>order-api</id>
            <goals><goal>generate</goal></goals>
            <configuration>
                <inputSpec>${project.basedir}/src/main/resources/order-api.yaml</inputSpec>
                <apiPackage>com.example.api.order</apiPackage>
                <modelPackage>com.example.model.order</modelPackage>
            </configuration>
        </execution>
    </executions>
</plugin>
```

---

### 2. Core Configuration Options and Their Impact

| Option | Value (SB 4 / Java 21) | Impact |
| :--- | :--- | :--- |
| `useSpringBoot4` | `true` | Switches to Jakarta EE 11 namespaces and Spring 7 compatibility. |
| `useJackson3` | `true` | Moves from `com.fasterxml.jackson` to `tools.jackson`. **Note:** Often incompatible with `openApiNullable`. |
| `generateRecords` | `true` | Generates Java 21 **Records** instead of POJOs. Result: Immutable, concise data carriers. |
| `interfaceOnly` | `true` | Generates only `@RequestMapping` interfaces. You must implement them. Prevents generating "stub" controllers. |
| `delegatePattern` | `true` | Generates a Delegate interface. Keeps the generated Controller separate from business logic. |
| `useJakartaEe` | `true` | Uses `jakarta.*` instead of `javax.*`. Mandatory for Spring Boot 3+. |
| `useBeanValidation` | `true` | Adds `@Valid`, `@NotNull`, `@Size` etc. Impact: Automatic request validation via Hibernate Validator. |
| `useTags` | `true` | Groups operations by their `tags` into different API files. Default is grouping by the first path segment. |

---

### 3. Niche & Pro-Tip Options

These options solve specific "real-world" problems:

*   **`skipDefaultInterface = true`**
    *   **Impact:** By default, generated interfaces have `default` methods returning `501 Not Implemented`. If you set this to `true`, the methods are abstract.
    *   **Why use it?** To ensure at compile-time that you've implemented every endpoint defined in the spec.
*   **`additionalModelTypeAnnotations`**
    *   **Example:** `@lombok.Builder; @lombok.extern.jackson.Jacksonized`
    *   **Impact:** Injects custom annotations onto generated models. Essential if you want to use Lombok with generated code.
*   **`openApiNullable = false`**
    *   **Impact:** Disables `JsonNullable` (used for "patch" requests to distinguish between `null` and "not provided").
    *   **Why use it?** `JsonNullable` is often a pain to configure with modern Jackson 3 and can cause serialization issues if not handled correctly.
*   **`unhandledException = true`**
    *   **Impact:** Adds `throws Exception` to all API method signatures.
    *   **Why use it?** Allows you to use a global `@ControllerAdvice` to handle all exceptions without wrapping every service call in a try-catch block in the controller.
*   **`enumPropertyNaming`**
    *   **Values:** `original`, `camelCase`, `UPPERCASE`.
    *   **Impact:** Standardizes how Enums look in Java code regardless of how they are named in the YAML.

---

### 4. Handling Shared Models Across Specs

If multiple YAML files share the same schemas, you have two choices:

1.  **The Bundling Approach:** Use `$ref: 'common-models.yaml#/components/schemas/User'` in your YAMLs. The generator will generate the `User` model in both packages.
2.  **The Import Mapping Approach:** Generate "Common" models once into a specific package, then for other APIs, use `importMappings`:
    ```kotlin
    importMappings.set(mapOf("User" to "com.example.common.model.User"))
    ```
    This prevents duplicate classes and ensures type compatibility across different services in the same project.

### 5. Summary Recommendation for Java 21 / SB 4
For a clean, modern setup, use **Gradle** with **Records**, **Jackson 3**, and **Delegate Pattern**. This provides the best balance between modern Java features and clean architecture separation.
