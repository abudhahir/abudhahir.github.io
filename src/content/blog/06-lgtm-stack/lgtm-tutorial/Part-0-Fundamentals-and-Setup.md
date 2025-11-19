---
title: "Part 0: Fundamentals and Project Setup"
date: "2024-12-16"
excerpt: "Foundational walkthrough of LGTM starter architecture, multi-module setup, dependency management, and auto-configuration basics."
tags: ["Tutorial", "Java", "Spring", "Observability", "LGTM"]
author: "Abudhahir"
featured: false
readTime: "8 min read"
series: "LGTM Starter Tutorial"
draft: false
---
# Part 0: Fundamentals and Project Setup

## Table of Contents
1. [Understanding Spring Boot Starters](#understanding-spring-boot-starters)
2. [Project Structure](#project-structure)
3. [Setting Up the Multi-Module Project](#setting-up-the-multi-module-project)
4. [Core Dependencies](#core-dependencies)
5. [Understanding Auto-Configuration](#understanding-auto-configuration)

---

## Understanding Spring Boot Starters

### What is a Spring Boot Starter?

A Spring Boot starter is a special type of dependency that bundles together commonly used libraries and provides automatic configuration. It follows the "convention over configuration" principle.

**Key Characteristics:**
- **Dependency Management**: Brings in all required dependencies transitively
- **Auto-Configuration**: Automatically configures beans when certain conditions are met
- **Opinionated Defaults**: Provides sensible default values
- **Customizable**: Users can override defaults via properties
- **Conditional**: Only activates when needed

### Anatomy of a Starter

Every Spring Boot starter consists of two main modules:

1. **`-autoconfigure` module**: Contains the actual configuration logic
   - Configuration classes
   - Properties classes
   - Conditional beans
   - Auto-configuration metadata

2. **`-starter` module**: A simple POM that aggregates dependencies
   - Depends on the autoconfigure module
   - Includes all required runtime dependencies
   - No code, just dependency management

### Example: How Spring Boot Web Starter Works

```
spring-boot-starter-web (starter)
    ├── spring-boot-starter (core)
    ├── spring-boot-starter-tomcat (embedded server)
    ├── spring-webmvc (MVC framework)
    └── spring-boot-autoconfigure (auto-config)
        └── WebMvcAutoConfiguration.class
```

When you add this dependency, Spring Boot:
1. Detects `DispatcherServlet` on classpath
2. Auto-configures MVC components
3. Starts embedded Tomcat
4. Maps `/*` to DispatcherServlet

---

## Project Structure

Our LGTM starter will follow Spring Boot conventions:

```
lgtm-spring-boot/
│
├── pom.xml (parent)
│
├── lgtm-spring-boot-autoconfigure/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/yourorg/lgtm/autoconfigure/
│       │   │   ├── LgtmAutoConfiguration.java
│       │   │   ├── LgtmProperties.java
│       │   │   │
│       │   │   ├── loki/
│       │   │   │   ├── LokiAutoConfiguration.java
│       │   │   │   ├── LokiProperties.java
│       │   │   │   └── LokiAppenderConfigurer.java
│       │   │   │
│       │   │   ├── tempo/
│       │   │   │   ├── TempoAutoConfiguration.java
│       │   │   │   ├── TempoProperties.java
│       │   │   │   └── TempoTracingConfigurer.java
│       │   │   │
│       │   │   ├── metrics/
│       │   │   │   ├── MetricsAutoConfiguration.java
│       │   │   │   ├── MetricsProperties.java
│       │   │   │   └── MimirRemoteWriteConfigurer.java
│       │   │   │
│       │   │   └── health/
│       │   │       └── LgtmHealthIndicator.java
│       │   │
│       │   └── resources/
│       │       ├── META-INF/
│       │       │   ├── spring/
│       │       │   │   └── org.springframework.boot.autoconfigure.AutoConfiguration.imports
│       │       │   └── spring-configuration-metadata.json
│       │       │
│       │       └── dashboards/
│       │           ├── spring-boot-overview.json
│       │           └── jvm-metrics.json
│       │
│       └── test/
│           └── java/com/yourorg/lgtm/autoconfigure/
│               ├── LgtmAutoConfigurationTest.java
│               ├── LokiAutoConfigurationTest.java
│               └── TempoAutoConfigurationTest.java
│
└── lgtm-spring-boot-starter/
    └── pom.xml (dependency aggregator)
```

**Why This Structure?**
- **Separation of Concerns**: Logic separated from dependency management
- **Testability**: Autoconfigure module can be tested independently
- **Flexibility**: Users can depend on just autoconfigure if needed
- **Standard**: Follows Spring Boot conventions

---

## Setting Up the Multi-Module Project

### Step 1: Create Parent POM

Create `pom.xml` in the root directory:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- Inherit from Spring Boot Parent -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>

    <groupId>com.yourorg</groupId>
    <artifactId>lgtm-spring-boot-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <name>LGTM Spring Boot Starter Parent</name>
    <description>Parent POM for LGTM Stack Spring Boot Starter</description>

    <!-- Child Modules -->
    <modules>
        <module>lgtm-spring-boot-autoconfigure</module>
        <module>lgtm-spring-boot-starter</module>
    </modules>

    <properties>
        <java.version>17</java.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        
        <!-- Dependency Versions -->
        <loki-logback-appender.version>1.5.1</loki-logback-appender.version>
        <opentelemetry.version>1.32.0</opentelemetry.version>
        <micrometer-tracing.version>1.2.0</micrometer-tracing.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Internal Modules -->
            <dependency>
                <groupId>com.yourorg</groupId>
                <artifactId>lgtm-spring-boot-autoconfigure</artifactId>
                <version>${project.version}</version>
            </dependency>

            <!-- Loki -->
            <dependency>
                <groupId>com.github.loki4j</groupId>
                <artifactId>loki-logback-appender</artifactId>
                <version>${loki-logback-appender.version}</version>
            </dependency>

            <!-- OpenTelemetry -->
            <dependency>
                <groupId>io.opentelemetry</groupId>
                <artifactId>opentelemetry-bom</artifactId>
                <version>${opentelemetry.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

**Key Points:**
- Inherits from `spring-boot-starter-parent` for dependency management
- Defines version properties in one place
- Uses `<dependencyManagement>` to control versions across modules
- Java 17 minimum (for modern Spring Boot)

### Step 2: Create Autoconfigure Module

Create `lgtm-spring-boot-autoconfigure/pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.yourorg</groupId>
        <artifactId>lgtm-spring-boot-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>lgtm-spring-boot-autoconfigure</artifactId>
    <name>LGTM Spring Boot AutoConfigure</name>
    <description>Auto-configuration for LGTM Stack</description>

    <dependencies>
        <!-- Spring Boot AutoConfigure (Required) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-autoconfigure</artifactId>
        </dependency>

        <!-- Configuration Metadata Processor -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Loki (Optional - only loads if present) -->
        <dependency>
            <groupId>com.github.loki4j</groupId>
            <artifactId>loki-logback-appender</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- OpenTelemetry for Tempo (Optional) -->
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-tracing-bridge-otel</artifactId>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>io.opentelemetry</groupId>
            <artifactId>opentelemetry-exporter-otlp</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Metrics (comes with Spring Boot) -->
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Actuator (for health indicators) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-actuator</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Spring Boot Configuration Processor -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <skip>true</skip>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

**Important Notes:**
- Dependencies marked as `<optional>true</optional>` won't be transitively included
- Configuration processor generates metadata for IDE autocomplete
- Test dependencies for unit/integration tests

### Step 3: Create Starter Module

Create `lgtm-spring-boot-starter/pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.yourorg</groupId>
        <artifactId>lgtm-spring-boot-parent</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>lgtm-spring-boot-starter</artifactId>
    <name>LGTM Spring Boot Starter</name>
    <description>Starter for LGTM Stack integration</description>

    <dependencies>
        <!-- Our AutoConfigure Module -->
        <dependency>
            <groupId>com.yourorg</groupId>
            <artifactId>lgtm-spring-boot-autoconfigure</artifactId>
        </dependency>

        <!-- Spring Boot Starter (base) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <!-- Include ALL runtime dependencies (not optional) -->
        <dependency>
            <groupId>com.github.loki4j</groupId>
            <artifactId>loki-logback-appender</artifactId>
        </dependency>

        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-tracing-bridge-otel</artifactId>
        </dependency>

        <dependency>
            <groupId>io.opentelemetry</groupId>
            <artifactId>opentelemetry-exporter-otlp</artifactId>
        </dependency>

        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-actuator</artifactId>
        </dependency>
    </dependencies>
</project>
```

**Key Difference:**
- No `<optional>true</optional>` here - all deps are included
- This is what users will add to their projects
- Just a dependency aggregator - NO CODE

---

## Core Dependencies

### Understanding Each Dependency

#### 1. Loki (Logs)
```xml
<dependency>
    <groupId>com.github.loki4j</groupId>
    <artifactId>loki-logback-appender</artifactId>
    <version>1.5.1</version>
</dependency>
```

**What it does:**
- Provides Logback appender for Loki
- Batches log events before sending
- Supports labels and structured logging
- HTTP-based communication

**Alternatives:**
- `logstash-logback-encoder` (for Logstash)
- `fluentd-logback-appender` (for Fluentd)

#### 2. OpenTelemetry (Traces)
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-otel</artifactId>
</dependency>

<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-exporter-otlp</artifactId>
</dependency>
```

**What it does:**
- Bridges Micrometer tracing to OpenTelemetry
- Exports traces via OTLP protocol
- Industry-standard tracing format
- Works with Tempo, Jaeger, Zipkin

**Why OTLP?**
- Vendor-neutral protocol
- Efficient binary format (gRPC)
- Standardized by OpenTelemetry project

#### 3. Micrometer (Metrics)
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

**What it does:**
- Already included in Spring Boot
- Provides Prometheus scrape endpoint
- Can push to remote write endpoints (Mimir)
- Vendor-neutral metrics facade

---

## Understanding Auto-Configuration

### How Spring Boot Auto-Configuration Works

Spring Boot uses several mechanisms to automatically configure beans:

#### 1. Class Path Detection

```java
@ConditionalOnClass(name = "com.github.loki4j.logback.Loki4jAppender")
public class LokiAutoConfiguration {
    // Only loads if Loki4j is on classpath
}
```

#### 2. Property-Based Conditions

```java
@ConditionalOnProperty(
    prefix = "lgtm.loki", 
    name = "enabled", 
    havingValue = "true", 
    matchIfMissing = true
)
public class LokiAutoConfiguration {
    // Only loads if property is true (or missing)
}
```

#### 3. Bean Conditions

```java
@Bean
@ConditionalOnMissingBean(DataSource.class)
public DataSource dataSource() {
    // Only creates if no DataSource bean exists
}
```

### Configuration Properties

Spring Boot binds external configuration to Java objects:

```java
@ConfigurationProperties(prefix = "lgtm.loki")
public class LokiProperties {
    private boolean enabled = true;
    private String url = "http://localhost:3100";
    
    // Getters and setters
}
```

Binds to:
```yaml
lgtm:
  loki:
    enabled: true
    url: http://localhost:3100
```

### Auto-Configuration Registration

**Before Spring Boot 2.7:**
```
META-INF/spring.factories
```

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.yourorg.lgtm.autoconfigure.LgtmAutoConfiguration,\
com.yourorg.lgtm.autoconfigure.LokiAutoConfiguration
```

**Spring Boot 2.7+ (Recommended):**
```
META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

```
com.yourorg.lgtm.autoconfigure.LgtmAutoConfiguration
com.yourorg.lgtm.autoconfigure.LokiAutoConfiguration
com.yourorg.lgtm.autoconfigure.TempoAutoConfiguration
com.yourorg.lgtm.autoconfigure.MetricsAutoConfiguration
```

---

## Verification Steps

### Step 1: Build the Project

```bash
mvn clean install
```

Expected output:
```
[INFO] lgtm-spring-boot-parent ........................... SUCCESS
[INFO] lgtm-spring-boot-autoconfigure .................... SUCCESS
[INFO] lgtm-spring-boot-starter .......................... SUCCESS
```

### Step 2: Verify Module Structure

```bash
tree -L 3 -I target
```

Should show:
```
.
├── lgtm-spring-boot-autoconfigure
│   ├── pom.xml
│   └── src
│       ├── main
│       └── test
├── lgtm-spring-boot-starter
│   └── pom.xml
└── pom.xml
```

### Step 3: Check Dependencies

```bash
mvn dependency:tree -pl lgtm-spring-boot-starter
```

Should show all dependencies included.

---

## Common Issues and Solutions

### Issue 1: Parent POM Not Found

**Error:**
```
Could not resolve parent: Failed to resolve artifact
```

**Solution:**
Make sure parent POM is installed:
```bash
cd lgtm-spring-boot-parent
mvn install
```

### Issue 2: Version Conflicts

**Error:**
```
The project has multiple versions of Spring Boot dependencies
```

**Solution:**
Use `<dependencyManagement>` in parent POM to enforce versions.

### Issue 3: Configuration Processor Not Working

**Error:**
No autocomplete for custom properties in IDE

**Solution:**
1. Ensure `spring-boot-configuration-processor` is in dependencies
2. Rebuild project: `mvn clean compile`
3. Check `target/classes/META-INF/spring-configuration-metadata.json` exists

---

## Next Steps

Now that we have the basic project structure, we'll implement each component:

- **Part 1**: Loki Integration (Logs)
- **Part 2**: Tempo Integration (Traces)
- **Part 3**: Metrics Integration
- **Part 4**: Advanced Features
- **Part 5**: Testing and Deployment

Each part will build on this foundation with detailed implementation and testing.

---

## Summary

In this part, you learned:
- ✅ What Spring Boot starters are and why they're useful
- ✅ How to structure a multi-module starter project
- ✅ How to set up parent and child POMs
- ✅ The difference between autoconfigure and starter modules
- ✅ Core dependencies for LGTM integration
- ✅ How Spring Boot auto-configuration works
- ✅ How to register auto-configuration classes

**Next**: Part 1 - Implementing Loki integration for centralized logging.
