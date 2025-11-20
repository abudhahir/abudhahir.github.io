# Part 5: Testing, Deployment, and Best Practices

## Table of Contents
1. [Unit Testing](#unit-testing)
2. [Integration Testing](#integration-testing)
3. [Testcontainers Integration](#testcontainers-integration)
4. [Publishing to Maven Central](#publishing-to-maven-central)
5. [Documentation](#documentation)
6. [Best Practices](#best-practices)
7. [Production Checklist](#production-checklist)

---

## Unit Testing

### Testing Auto-Configuration

#### Test 1: Configuration Properties Binding

```java
package com.yourorg.lgtm.autoconfigure;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;

import static org.assertj.core.api.Assertions.assertThat;

class LgtmPropertiesTest {
    
    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
        .withUserConfiguration(TestConfiguration.class);
    
    @Test
    void shouldBindDefaultProperties() {
        contextRunner.run(context -> {
            LgtmProperties properties = context.getBean(LgtmProperties.class);
            
            assertThat(properties.isEnabled()).isTrue();
            assertThat(properties.getLoki().isEnabled()).isTrue();
            assertThat(properties.getTempo().isEnabled()).isTrue();
            assertThat(properties.getMetrics().isEnabled()).isTrue();
        });
    }
    
    @Test
    void shouldBindCustomProperties() {
        contextRunner
            .withPropertyValues(
                "lgtm.enabled=true",
                "lgtm.application-name=test-app",
                "lgtm.environment=staging",
                "lgtm.loki.url=http://loki:3100",
                "lgtm.tempo.endpoint=http://tempo:4317",
                "lgtm.tempo.sampling-probability=0.5"
            )
            .run(context -> {
                LgtmProperties properties = context.getBean(LgtmProperties.class);
                
                assertThat(properties.getApplicationName()).isEqualTo("test-app");
                assertThat(properties.getEnvironment()).isEqualTo("staging");
                assertThat(properties.getLoki().getUrl()).isEqualTo("http://loki:3100");
                assertThat(properties.getTempo().getEndpoint()).isEqualTo("http://tempo:4317");
                assertThat(properties.getTempo().getSamplingProbability()).isEqualTo(0.5);
            });
    }
    
    @Test
    void shouldDisableLokiWhenPropertySet() {
        contextRunner
            .withPropertyValues("lgtm.loki.enabled=false")
            .run(context -> {
                LgtmProperties properties = context.getBean(LgtmProperties.class);
                assertThat(properties.getLoki().isEnabled()).isFalse();
            });
    }
    
    @Configuration
    @EnableConfigurationProperties(LgtmProperties.class)
    static class TestConfiguration {
    }
}
```

#### Test 2: Conditional Bean Creation

```java
package com.yourorg.lgtm.autoconfigure.loki;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import static org.assertj.core.api.Assertions.assertThat;

class LokiAutoConfigurationTest {
    
    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
        .withConfiguration(AutoConfigurations.of(LokiAutoConfiguration.class))
        .withPropertyValues("lgtm.application-name=test-app");
    
    @Test
    void shouldNotLoadWhenLokiClassNotPresent() {
        contextRunner
            .withClassLoader(new FilteredClassLoader("com.github.loki4j"))
            .run(context -> {
                assertThat(context).doesNotHaveBean(LokiAutoConfiguration.class);
            });
    }
    
    @Test
    void shouldLoadWhenLokiClassPresent() {
        contextRunner.run(context -> {
            assertThat(context).hasSingleBean(LokiAutoConfiguration.class);
        });
    }
    
    @Test
    void shouldNotLoadWhenDisabled() {
        contextRunner
            .withPropertyValues("lgtm.loki.enabled=false")
            .run(context -> {
                assertThat(context).doesNotHaveBean(LokiAutoConfiguration.class);
            });
    }
    
    static class FilteredClassLoader extends ClassLoader {
        private final String filteredPackage;
        
        FilteredClassLoader(String filteredPackage) {
            this.filteredPackage = filteredPackage;
        }
        
        @Override
        protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
            if (name.startsWith(filteredPackage)) {
                throw new ClassNotFoundException();
            }
            return super.loadClass(name, resolve);
        }
    }
}
```

#### Test 3: Meter Registry Customization

```java
package com.yourorg.lgtm.autoconfigure.metrics;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import static org.assertj.core.api.Assertions.assertThat;

class MetricsAutoConfigurationTest {
    
    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
        .withUserConfiguration(MetricsAutoConfiguration.class)
        .withBean(MeterRegistry.class, SimpleMeterRegistry::new)
        .withPropertyValues(
            "lgtm.application-name=test-app",
            "lgtm.environment=test",
            "lgtm.common-tags.team=platform"
        );
    
    @Test
    void shouldAddCommonTags() {
        contextRunner.run(context -> {
            MeterRegistry registry = context.getBean(MeterRegistry.class);
            
            assertThat(registry.config().commonTags())
                .extracting("key")
                .contains("application", "environment", "team");
        });
    }
}
```

---

## Integration Testing

### Testing with Real Application Context

```java
package com.yourorg.lgtm.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.actuate.observability.AutoConfigureObservability;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureObservability
@TestPropertySource(properties = {
    "lgtm.enabled=true",
    "lgtm.application-name=integration-test",
    "lgtm.loki.enabled=false",  // Disable actual sending
    "lgtm.tempo.enabled=false",
    "lgtm.metrics.mimir.enabled=false"
})
class LgtmIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldExposePrometheusEndpoint() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/actuator/prometheus", 
            String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("jvm_memory_used_bytes");
    }
    
    @Test
    void shouldExposeHealthEndpoint() {
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/actuator/health", 
            String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("\"status\":\"UP\"");
    }
    
    @Test
    void shouldCreateTracesForHttpRequests() {
        // Make request
        ResponseEntity<String> response = restTemplate.getForEntity(
            "/api/test", 
            String.class
        );
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        
        // Check that trace headers are present in subsequent requests
        assertThat(response.getHeaders().get("traceparent")).isNotNull();
    }
}
```

---

## Testcontainers Integration

### Setting Up Testcontainers

Add dependency:
```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.19.3</version>
    <scope>test</scope>
</dependency>
```

### Complete Integration Test with LGTM Stack

```java
package com.yourorg.lgtm.integration;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.Duration;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class LgtmStackIntegrationTest {
    
    private static final Network network = Network.newNetwork();
    
    @Container
    static GenericContainer<?> loki = new GenericContainer<>(DockerImageName.parse("grafana/loki:2.9.3"))
        .withNetwork(network)
        .withNetworkAliases("loki")
        .withExposedPorts(3100)
        .withCommand("-config.file=/etc/loki/local-config.yaml")
        .waitingFor(Wait.forHttp("/ready").forStatusCode(200))
        .withStartupTimeout(Duration.ofMinutes(2));
    
    @Container
    static GenericContainer<?> tempo = new GenericContainer<>(DockerImageName.parse("grafana/tempo:2.3.1"))
        .withNetwork(network)
        .withNetworkAliases("tempo")
        .withExposedPorts(4317, 4318, 3200)
        .withCommand("-config.file=/etc/tempo.yaml")
        .waitingFor(Wait.forLogMessage(".*tempo is ready.*", 1))
        .withStartupTimeout(Duration.ofMinutes(2));
    
    @Container
    static GenericContainer<?> prometheus = new GenericContainer<>(DockerImageName.parse("prom/prometheus:v2.48.0"))
        .withNetwork(network)
        .withNetworkAliases("prometheus")
        .withExposedPorts(9090)
        .waitingFor(Wait.forHttp("/-/ready").forStatusCode(200))
        .withStartupTimeout(Duration.ofMinutes(2));
    
    @LocalServerPort
    private int port;
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Configure Loki
        registry.add("lgtm.loki.url", () -> 
            "http://localhost:" + loki.getMappedPort(3100));
        
        // Configure Tempo
        registry.add("lgtm.tempo.endpoint", () -> 
            "http://localhost:" + tempo.getMappedPort(4317));
        registry.add("lgtm.tempo.sampling-probability", () -> 1.0);
        
        // Configure application
        registry.add("lgtm.application-name", () -> "test-app");
        registry.add("lgtm.environment", () -> "test");
    }
    
    @BeforeAll
    static void setup() {
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }
    
    @Test
    void shouldSendLogsToLoki() throws InterruptedException {
        // Generate logs
        given()
            .port(port)
            .when()
            .get("/api/test")
            .then()
            .statusCode(200);
        
        // Wait for logs to be sent
        Thread.sleep(5000);
        
        // Query Loki
        String lokiUrl = "http://localhost:" + loki.getMappedPort(3100);
        given()
            .when()
            .get(lokiUrl + "/loki/api/v1/query?query={app=\"test-app\"}")
            .then()
            .statusCode(200)
            .body("data.result", not(empty()));
    }
    
    @Test
    void shouldSendTracesToTempo() throws InterruptedException {
        // Generate trace
        given()
            .port(port)
            .when()
            .get("/api/test")
            .then()
            .statusCode(200);
        
        // Wait for traces to be sent
        Thread.sleep(5000);
        
        // Search traces in Tempo
        String tempoUrl = "http://localhost:" + tempo.getMappedPort(3200);
        given()
            .when()
            .get(tempoUrl + "/api/search?tags=service.name=test-app")
            .then()
            .statusCode(200)
            .body("traces", not(empty()));
    }
    
    @Test
    void shouldExposeMetricsForPrometheus() {
        given()
            .port(port)
            .when()
            .get("/actuator/prometheus")
            .then()
            .statusCode(200)
            .body(containsString("jvm_memory_used_bytes"))
            .body(containsString("http_server_requests_seconds"));
    }
    
    @Test
    void shouldCorrelateLogsAndTraces() throws InterruptedException {
        // Make request (creates trace)
        String response = given()
            .port(port)
            .when()
            .get("/api/test")
            .then()
            .statusCode(200)
            .extract()
            .header("traceparent");
        
        // Extract trace ID
        String traceId = extractTraceId(response);
        
        // Wait for logs
        Thread.sleep(5000);
        
        // Query logs with trace ID
        String lokiUrl = "http://localhost:" + loki.getMappedPort(3100);
        given()
            .when()
            .get(lokiUrl + "/loki/api/v1/query?query={app=\"test-app\"} | json | trace_id=\"" + traceId + "\"")
            .then()
            .statusCode(200)
            .body("data.result", not(empty()));
    }
    
    private String extractTraceId(String traceparent) {
        // Format: 00-traceId-spanId-flags
        String[] parts = traceparent.split("-");
        return parts.length > 1 ? parts[1] : null;
    }
}
```

### Performance Testing

```java
package com.yourorg.lgtm.performance;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class LgtmPerformanceTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldHandleHighVolumeRequests() {
        int totalRequests = 1000;
        int concurrentThreads = 10;
        
        ExecutorService executor = Executors.newFixedThreadPool(concurrentThreads);
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        
        Instant start = Instant.now();
        
        for (int i = 0; i < totalRequests; i++) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                restTemplate.getForEntity("/api/test", String.class);
            }, executor);
            futures.add(future);
        }
        
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        
        Duration duration = Duration.between(start, Instant.now());
        double requestsPerSecond = totalRequests / (duration.toMillis() / 1000.0);
        
        System.out.println("Completed " + totalRequests + " requests in " + duration.toMillis() + "ms");
        System.out.println("Throughput: " + requestsPerSecond + " requests/second");
        
        // Assert reasonable performance
        assertThat(requestsPerSecond).isGreaterThan(100);
        
        executor.shutdown();
    }
}
```

---

## Publishing to Maven Central

### Step 1: Prepare POM for Publishing

Update parent `pom.xml`:

```xml
<project>
    <!-- Basic Info -->
    <groupId>io.github.yourorg</groupId>
    <artifactId>lgtm-spring-boot-parent</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>
    
    <n>LGTM Spring Boot Starter</n>
    <description>Spring Boot starter for LGTM observability stack</description>
    <url>https://github.com/yourorg/lgtm-spring-boot-starter</url>
    
    <!-- License -->
    <licenses>
        <license>
            <n>Apache License, Version 2.0</n>
            <url>https://www.apache.org/licenses/LICENSE-2.0.txt</url>
            <distribution>repo</distribution>
        </license>
    </licenses>
    
    <!-- Developers -->
    <developers>
        <developer>
            <n>Your Name</n>
            <email>your.email@example.com</email>
            <organization>Your Org</organization>
            <organizationUrl>https://yourorg.com</organizationUrl>
        </developer>
    </developers>
    
    <!-- SCM -->
    <scm>
        <connection>scm:git:git://github.com/yourorg/lgtm-spring-boot-starter.git</connection>
        <developerConnection>scm:git:ssh://github.com:yourorg/lgtm-spring-boot-starter.git</developerConnection>
        <url>https://github.com/yourorg/lgtm-spring-boot-starter/tree/main</url>
    </scm>
    
    <!-- Distribution Management -->
    <distributionManagement>
        <snapshotRepository>
            <id>ossrh</id>
            <url>https://s01.oss.sonatype.org/content/repositories/snapshots</url>
        </snapshotRepository>
        <repository>
            <id>ossrh</id>
            <url>https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/</url>
        </repository>
    </distributionManagement>
    
    <build>
        <plugins>
            <!-- Source Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>3.3.0</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            
            <!-- Javadoc Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>3.6.2</version>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            
            <!-- GPG Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-gpg-plugin</artifactId>
                <version>3.1.0</version>
                <executions>
                    <execution>
                        <id>sign-artifacts</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>sign</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            
            <!-- Nexus Staging Plugin -->
            <plugin>
                <groupId>org.sonatype.plugins</groupId>
                <artifactId>nexus-staging-maven-plugin</artifactId>
                <version>1.6.13</version>
                <extensions>true</extensions>
                <configuration>
                    <serverId>ossrh</serverId>
                    <nexusUrl>https://s01.oss.sonatype.org/</nexusUrl>
                    <autoReleaseAfterClose>true</autoReleaseAfterClose>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Step 2: Configure Credentials

Create `~/.m2/settings.xml`:

```xml
<settings>
    <servers>
        <server>
            <id>ossrh</id>
            <username>your-jira-id</username>
            <password>your-jira-password</password>
        </server>
    </servers>
    
    <profiles>
        <profile>
            <id>ossrh</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <properties>
                <gpg.executable>gpg</gpg.executable>
                <gpg.passphrase>your-gpg-passphrase</gpg.passphrase>
            </properties>
        </profile>
    </profiles>
</settings>
```

### Step 3: Deploy

```bash
# Deploy snapshot
mvn clean deploy

# Deploy release
mvn clean deploy -P release

# Close and release (if not auto-release)
mvn nexus-staging:release
```

---

## Documentation

### README.md Template

````markdown
# LGTM Spring Boot Starter

[![Maven Central](https://img.shields.io/maven-central/v/io.github.yourorg/lgtm-spring-boot-starter.svg)](https://search.maven.org/artifact/io.github.yourorg/lgtm-spring-boot-starter)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Spring Boot starter for seamless integration with the LGTM (Loki, Grafana, Tempo, Mimir) observability stack.

## Features

- ✨ Zero-configuration integration with LGTM stack
- 📊 Automatic metrics collection (JVM, HTTP, custom)
- 🔍 Distributed tracing with OpenTelemetry
- 📝 Centralized logging to Loki
- 🔗 Automatic correlation between logs, traces, and metrics
- ⚡ High performance with batching and async processing
- 🎯 Production-ready with health indicators
- 🛠️ Customizable via properties

## Quick Start

### 1. Add Dependency

```xml
<dependency>
    <groupId>io.github.yourorg</groupId>
    <artifactId>lgtm-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 2. Configure Properties

```yaml
lgtm:
  application-name: my-app
  environment: production
  
  loki:
    url: http://loki:3100
  
  tempo:
    endpoint: http://tempo:4317
    sampling-probability: 0.1
  
  metrics:
    prometheus:
      enabled: true
```

### 3. That's It!

Your application now automatically:
- Sends logs to Loki
- Exports traces to Tempo
- Exposes Prometheus metrics at `/actuator/prometheus`
- Correlates logs, traces, and metrics

## Configuration

See [Configuration Guide](docs/configuration.md) for complete configuration options.

## Examples

See [examples/](examples/) directory for sample applications.

## License

Apache License 2.0
````

### Configuration Guide

Create `docs/configuration.md` with comprehensive property documentation:

```markdown
# Configuration Guide

## Loki Configuration

| Property | Default | Description |
|----------|---------|-------------|
| `lgtm.loki.enabled` | `true` | Enable/disable Loki integration |
| `lgtm.loki.url` | `http://localhost:3100` | Loki server URL |
| `lgtm.loki.batch-size` | `100` | Number of logs per batch |
| `lgtm.loki.batch-timeout` | `10s` | Max time before sending batch |

... (continue for all properties)
```

---

## Best Practices

### 1. Label Cardinality

**❌ Bad:**
```java
counter.tag("user_id", userId);  // High cardinality
counter.tag("order_id", orderId);
```

**✅ Good:**
```java
counter.tag("user_tier", getUserTier(userId));  // Low cardinality
counter.tag("order_status", order.getStatus());
```

### 2. Sampling

Don't trace everything in production:

```yaml
lgtm:
  tempo:
    sampling-probability: 0.1  # 10% sampling
    sampling-strategy: parent_based
```

### 3. Structured Logging

**❌ Bad:**
```java
log.info("User " + userId + " ordered " + itemName);
```

**✅ Good:**
```java
log.info("User ordered item", 
    keyValue("user_id", userId),
    keyValue("item_name", itemName));
```

### 4. Async Operations

Use async appenders and processors:

```yaml
lgtm:
  loki:
    batch-size: 500
    batch-timeout: 10s
  tempo:
    max-batch-size: 1000
```

### 5. Resource Attributes

Always set meaningful resource attributes:

```yaml
lgtm:
  application-name: order-service
  environment: production
  common-tags:
    team: checkout
    version: 1.2.3
```

### 6. Error Handling

Don't let observability break your app:

```yaml
lgtm:
  loki:
    drop-logs-on-error: true
  tempo:
    timeout: 10s
```

---

## Production Checklist

### Before Going Live

- [ ] **Configuration**
  - [ ] Set appropriate sampling rates
  - [ ] Configure resource attributes
  - [ ] Set meaningful application name and environment
  - [ ] Configure batch sizes for your load

- [ ] **Performance**
  - [ ] Enable async logging/tracing
  - [ ] Test with production-like load
  - [ ] Monitor resource usage (CPU, memory)
  - [ ] Set appropriate timeouts

- [ ] **Security**
  - [ ] Use HTTPS for Loki/Tempo/Mimir endpoints
  - [ ] Configure authentication (API keys, basic auth)
  - [ ] Don't log sensitive data (PII, secrets)
  - [ ] Review label cardinality

- [ ] **Monitoring**
  - [ ] Set up alerts for LGTM component failures
  - [ ] Monitor observability system health
  - [ ] Track queue sizes and drop rates
  - [ ] Monitor batch processing metrics

- [ ] **Documentation**
  - [ ] Document custom metrics
  - [ ] Create runbooks for common issues
  - [ ] Document dashboard usage
  - [ ] Train team on querying logs/traces

### Recommended Production Configuration

```yaml
lgtm:
  enabled: true
  application-name: ${SPRING_APPLICATION_NAME}
  environment: ${ENVIRONMENT}
  
  common-tags:
    team: ${TEAM_NAME}
    version: ${APP_VERSION}
    datacenter: ${DATACENTER}
  
  loki:
    enabled: true
    url: ${LOKI_URL}
    batch-size: 500
    batch-timeout: 10s
    queue-size: 5000
    drop-logs-on-error: true
    min-level: INFO
    
    static-labels:
      service: ${SERVICE_NAME}
      cluster: ${CLUSTER_NAME}
  
  tempo:
    enabled: true
    endpoint: ${TEMPO_ENDPOINT}
    protocol: grpc
    sampling-probability: 0.1
    sampling-strategy: parent_based
    batch-timeout: 5s
    max-batch-size: 1000
    compression: gzip
  
  metrics:
    enabled: true
    prefix: ${SERVICE_NAME}
    
    prometheus:
      enabled: true
      path: /actuator/prometheus
    
    mimir:
      enabled: ${MIMIR_ENABLED:false}
      url: ${MIMIR_URL}
      step: 15s
      batch-size: 1000
      compression-enabled: true

management:
  endpoints:
    web:
      exposure:
        include: health,prometheus,info
  endpoint:
    health:
      show-details: when-authorized
  
  health:
    lgtm:
      enabled: true

logging:
  level:
    root: INFO
    com.yourapp: INFO
    com.yourorg.lgtm: WARN
```

---

## Troubleshooting

### Issue: Logs not appearing in Loki

**Symptoms:**
- Application starts fine
- No errors in logs
- Logs don't appear in Grafana

**Solutions:**
1. Check Loki connectivity:
   ```bash
   curl http://loki:3100/ready
   ```

2. Reduce batch size for faster sending:
   ```yaml
   lgtm:
     loki:
       batch-size: 10
       batch-timeout: 2s
   ```

3. Enable debug logging:
   ```yaml
   logging:
     level:
       com.yourorg.lgtm: DEBUG
       com.github.loki4j: DEBUG
   ```

### Issue: High Memory Usage

**Solutions:**
1. Reduce queue sizes:
   ```yaml
   lgtm:
     loki:
       queue-size: 1000
     tempo:
       max-queue-size: 1000
   ```

2. Increase batch frequency:
   ```yaml
   lgtm:
     loki:
       batch-timeout: 5s
     tempo:
       batch-timeout: 2s
   ```

### Issue: Performance Degradation

**Solutions:**
1. Reduce sampling:
   ```yaml
   lgtm:
     tempo:
       sampling-probability: 0.05  # 5% instead of 10%
   ```

2. Enable compression:
   ```yaml
   lgtm:
     tempo:
       compression: gzip
   ```

---

## Summary

In this final part, you learned:
- ✅ Unit testing auto-configuration
- ✅ Integration testing with Testcontainers
- ✅ Publishing to Maven Central
- ✅ Writing comprehensive documentation
- ✅ Production best practices
- ✅ Performance optimization
- ✅ Troubleshooting common issues

## Congratulations!

You now have a production-ready Spring Boot starter for the LGTM observability stack! 🎉

## Additional Resources

- [Spring Boot Starter Development Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.developing-auto-configuration)
- [Maven Central Publishing Guide](https://central.sonatype.org/publish/publish-guide/)
- [Testcontainers Documentation](https://www.testcontainers.org/)
- [LGTM Stack Documentation](https://grafana.com/docs/)
