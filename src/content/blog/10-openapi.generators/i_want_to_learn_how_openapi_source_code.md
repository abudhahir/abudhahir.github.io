---
title: "OpenAPI Source Code Generation for Spring Boot 4 and Java 21"
excerpt: "How OpenAPI Generator produces models, API interfaces, and delegate beans for a contract-first Spring Boot 4 service on Java 21 — Records, Jackson 3, Jakarta EE 11, and HttpExchange clients."
date: "Dec 21 2024"
author: "Abu Dhahir"
series: "OpenAPI Generators for Spring Boot 4"
tags:
- Tutorial
- Java
- Spring
- OpenAPI
- CodeGen
draft: false
---

In Spring Boot 4.x and Java 21, OpenAPI source code generation follows a "Contract-First" approach, primarily using the **OpenAPI Generator** (formerly Swagger Codegen). 

With Spring Boot 4 (built on Spring Framework 7 and Jakarta EE 11) and Java 21, the generation process has been modernized to leverage newer Java features (like Records) and the latest Spring ecosystem standards.

### 1. Key Tools and Setup
The most common way to integrate this is via the `openapi-generator-maven-plugin` or `openapi-generator-gradle-plugin`.

**Recommended Plugin Configuration (Maven Example):**
```xml
<plugin>
    <groupId>org.openapitools</groupId>
    <artifactId>openapi-generator-maven-plugin</artifactId>
    <version>7.x.x</version> <!-- Use the latest version supporting SB4 -->
    <executions>
        <execution>
            <goals>
                <goal>generate</goal>
            </goals>
            <configuration>
                <inputSpec>${project.basedir}/src/main/resources/api.yaml</inputSpec>
                <generatorName>spring</generatorName>
                <library>spring-boot</library>
                <configOptions>
                    <useSpringBoot4>true</useSpringBoot4>
                    <useJakartaEe>true</useJakartaEe>
                    <useJackson3>true</useJackson3> <!-- Targets tools.jackson package -->
                    <generateRecords>true</generateRecords> <!-- Leverages Java 21 Records -->
                    <interfaceOnly>true</interfaceOnly> <!-- Generates interfaces, not impls -->
                    <useBeanValidation>true</useBeanValidation>
                </configOptions>
            </configuration>
        </execution>
    </executions>
</plugin>
```

### 2. How Model Generation Works
For Java 21, models are typically generated as **Java Records** or POJOs with modern annotations.

*   **Records:** By setting `generateRecords=true`, the generator creates immutable Java Records, which are the standard for data carriers in Java 21.
*   **JSON Mapping:** Spring Boot 4 supports **Jackson 3**. The `useJackson3` flag ensures the generated code uses the new `tools.jackson` namespace instead of the older `com.fasterxml.jackson`.
*   **Validation:** It uses **Jakarta Bean Validation 3.0** (part of Jakarta EE 11). Models are annotated with `@NotNull`, `@Size`, `@Valid`, etc., which Spring’s `MethodValidationPostProcessor` handles at runtime.

### 3. How API Interface Generation Works
The generator creates a "Service Interface" that acts as the contract between the specification and your implementation.

*   **Annotations:** The interface is annotated with `@RequestMapping` (or the newer `@HttpExchange` introduced in Spring 6/7) and `@RestController`.
*   **Delegate Pattern:** It is highly recommended to use `delegatePattern=true`. This generates an interface with `default` methods that call a "delegate" bean. This keeps your generated code separate from your business logic.
    ```java
    // Generated Interface
    public interface PetsApi {
        @GetMapping("/pets/{id}")
        default ResponseEntity<Pet> getPetById(@PathVariable("id") Long id) {
            return getDelegate().getPetById(id);
        }
        PetsApiDelegate getDelegate();
    }
    ```
*   **Implementation:** You simply implement the `PetsApiDelegate` as a `@Service`, and Spring automatically wires it into the controller.

### 4. Modern Spring 7 / Boot 4 Features
*   **Declarative Clients:** For client-side code, the generator can now produce interfaces annotated with **`@HttpExchange`**. These can be used with Spring's `RestClient` or `WebClient` to create type-safe HTTP clients without writing any implementation code.
*   **Native Support:** The generated code is designed to be compatible with **GraalVM Native Image**, which is a core focus of Spring Boot 4. This means avoiding reflection where possible and using static metadata.

### 5. Summary of Workflow
1.  **Define Contract:** Write your API in `openapi.yaml`.
2.  **Generate:** Run `mvn compile`. The plugin generates Models (as Records) and API Interfaces in `target/generated-sources`.
3.  **Implement:** Create a class that implements the generated `Delegate` interface.
4.  **Run:** Spring Boot 4 picks up your implementation and maps the endpoints automatically based on the generated annotations.
