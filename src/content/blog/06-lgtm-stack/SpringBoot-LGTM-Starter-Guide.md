---
title: "Building a Spring Boot Starter for LGTM Stack"
date: "2024-12-15"
excerpt: "Step-by-step guide to designing dependencies, auto-configuration, and LGTM integrations across Loki, Tempo, Grafana, and Mimir."
tags: ["Tutorial", "Java", "Spring", "Observability", "LGTM"]
author: "Abudhahir"
featured: false
readTime: "8 min read"
series: "LGTM Starter Playbook"
draft: false
---
# Building a Spring Boot Starter for LGTM Stack

## Step 1: Understand Spring Boot Starters

### What is a Spring Boot Starter?
A Spring Boot starter is an opinionated dependency descriptor that:
- Bundles related dependencies together
- Provides auto-configuration
- Offers sensible defaults
- Allows customization through properties
- Follows Spring Boot's conventions

### Examples of Existing Starters
- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-actuator`

### Key Components
1. **Dependencies**: Transitively includes required libraries
2. **Auto-Configuration**: Automatic bean creation and setup
3. **Properties**: Externalized configuration via `application.yml`/`application.properties`
4. **Conditional Configuration**: Only activates when certain conditions are met

---

## Step 2: Understand LGTM Integration Points

### Loki (Logs)
**Integration via:**
- Logback/Log4j2 appenders (Loki appender)
- Common library: `loki-logback-appender`
- Sends logs directly to Loki endpoint

**What to configure:**
- Loki endpoint URL
- Labels (application name, environment, instance)
- Batch size and timeout
- Log format

### Grafana (Visualization)
**Integration:**
- No direct application integration needed
- Configure datasources (Loki, Tempo, Mimir/Prometheus)
- Import pre-built dashboards

**What to provide:**
- Dashboard JSON templates
- Default datasource configurations
- Documentation for setup

### Tempo (Traces)
**Integration via:**
- OpenTelemetry or Spring Cloud Sleuth
- Common library: `micrometer-tracing-bridge-otel`
- Exports trace data to Tempo

**What to configure:**
- Tempo endpoint URL
- Sampling strategy
- Trace propagation (W3C, B3)
- Service name and attributes

### Mimir/Prometheus (Metrics)
**Integration via:**
- Micrometer (already in Spring Boot)
- Prometheus scrape endpoint or push gateway
- Common library: `micrometer-registry-prometheus`

**What to configure:**
- Prometheus endpoint (or Remote Write to Mimir)
- Metrics export interval
- Common tags (application, environment)
- Custom metrics

---

## Step 3: Plan Your Starter Architecture

### Module Structure
```
lgtm-spring-boot-starter/
├── lgtm-spring-boot-autoconfigure/
│   ├── src/main/java/
│   │   └── com/yourorg/lgtm/autoconfigure/
│   │       ├── LgtmAutoConfiguration.java
│   │       ├── LgtmProperties.java
│   │       ├── loki/
│   │       │   ├── LokiAutoConfiguration.java
│   │       │   └── LokiProperties.java
│   │       ├── tempo/
│   │       │   ├── TempoAutoConfiguration.java
│   │       │   └── TempoProperties.java
│   │       └── metrics/
│   │           ├── MetricsAutoConfiguration.java
│   │           └── MetricsProperties.java
│   └── src/main/resources/
│       └── META-INF/
│           └── spring/
│               └── org.springframework.boot.autoconfigure.AutoConfiguration.imports
└── lgtm-spring-boot-starter/
    └── pom.xml (aggregates dependencies)
```

### Design Principles
1. **Convention over Configuration**: Sensible defaults
2. **Fail-Safe**: Graceful degradation if services unavailable
3. **Zero-Code Integration**: Works with just dependency + properties
4. **Extensible**: Allow custom configurations
5. **Environment-Aware**: Different configs for dev/staging/prod

---

## Step 4: Define Configuration Properties

### Example Properties Structure
```yaml
lgtm:
  enabled: true
  application-name: ${spring.application.name}
  environment: ${spring.profiles.active}
  
  loki:
    enabled: true
    url: http://localhost:3100
    batch-size: 100
    batch-timeout: 10s
    labels:
      application: ${lgtm.application-name}
      environment: ${lgtm.environment}
    
  tempo:
    enabled: true
    url: http://localhost:4317
    sampling-probability: 0.1
    protocol: grpc
    
  metrics:
    enabled: true
    prometheus:
      enabled: true
      path: /actuator/prometheus
    mimir:
      enabled: false
      remote-write-url: http://localhost:9009/api/v1/push
      
  common-tags:
    team: platform
    service: ${lgtm.application-name}
```

---

## Step 5: Implementation Steps

### 5.1 Project Setup

**1. Create Maven/Gradle Project**
```xml
<!-- Parent POM -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>

<modules>
    <module>lgtm-spring-boot-autoconfigure</module>
    <module>lgtm-spring-boot-starter</module>
</modules>
```

**2. Add Core Dependencies (autoconfigure module)**
```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
    </dependency>
    
    <!-- Configuration Processor -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-configuration-processor</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Loki -->
    <dependency>
        <groupId>com.github.loki4j</groupId>
        <artifactId>loki-logback-appender</artifactId>
        <version>1.4.1</version>
        <optional>true</optional>
    </dependency>
    
    <!-- Tempo (via OpenTelemetry) -->
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
    
    <!-- Metrics -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### 5.2 Create Configuration Properties Classes

**LgtmProperties.java**
```java
@ConfigurationProperties(prefix = "lgtm")
public class LgtmProperties {
    private boolean enabled = true;
    private String applicationName;
    private String environment;
    private Map<String, String> commonTags = new HashMap<>();
    private LokiProperties loki = new LokiProperties();
    private TempoProperties tempo = new TempoProperties();
    private MetricsProperties metrics = new MetricsProperties();
    
    // Getters and setters
}
```

**LokiProperties.java**
```java
public class LokiProperties {
    private boolean enabled = true;
    private String url = "http://localhost:3100";
    private int batchSize = 100;
    private Duration batchTimeout = Duration.ofSeconds(10);
    private Map<String, String> labels = new HashMap<>();
    
    // Getters and setters
}
```

### 5.3 Create Auto-Configuration Classes

**LgtmAutoConfiguration.java**
```java
@Configuration
@EnableConfigurationProperties(LgtmProperties.class)
@ConditionalOnProperty(prefix = "lgtm", name = "enabled", havingValue = "true", matchIfMissing = true)
public class LgtmAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public LgtmConfigurer lgtmConfigurer(LgtmProperties properties) {
        return new LgtmConfigurer(properties);
    }
}
```

**LokiAutoConfiguration.java**
```java
@Configuration
@ConditionalOnProperty(prefix = "lgtm.loki", name = "enabled", havingValue = "true", matchIfMissing = true)
@ConditionalOnClass(name = "com.github.loki4j.logback.Loki4jAppender")
public class LokiAutoConfiguration implements ApplicationListener<ApplicationReadyEvent> {
    
    private final LgtmProperties lgtmProperties;
    
    public LokiAutoConfiguration(LgtmProperties lgtmProperties) {
        this.lgtmProperties = lgtmProperties;
    }
    
    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        configureLokiAppender();
    }
    
    private void configureLokiAppender() {
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        
        // Create Loki4j appender programmatically
        Loki4jAppender loki4jAppender = new Loki4jAppender();
        loki4jAppender.setContext(context);
        loki4jAppender.setName("LOKI");
        
        // Configure URL
        HttpSender sender = new HttpSender();
        sender.setUrl(lgtmProperties.getLoki().getUrl() + "/loki/api/v1/push");
        loki4jAppender.setHttp(sender);
        
        // Configure format with labels
        JsonEncoder encoder = new JsonEncoder();
        encoder.setContext(context);
        
        // Build label string
        String labels = buildLabels();
        encoder.setLabel(labels);
        
        loki4jAppender.setFormat(encoder);
        loki4jAppender.start();
        
        // Attach to root logger
        Logger rootLogger = context.getLogger(Logger.ROOT_LOGGER_NAME);
        rootLogger.addAppender(loki4jAppender);
    }
    
    private String buildLabels() {
        StringBuilder sb = new StringBuilder();
        Map<String, String> labels = lgtmProperties.getLoki().getLabels();
        
        labels.forEach((key, value) -> {
            if (sb.length() > 0) sb.append(",");
            sb.append(key).append("=").append(value);
        });
        
        return sb.toString();
    }
}
```

**TempoAutoConfiguration.java**
```java
@Configuration
@ConditionalOnProperty(prefix = "lgtm.tempo", name = "enabled", havingValue = "true", matchIfMissing = true)
@ConditionalOnClass(name = "io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter")
public class TempoAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public OtlpGrpcSpanExporter otlpExporter(LgtmProperties properties) {
        return OtlpGrpcSpanExporter.builder()
            .setEndpoint(properties.getTempo().getUrl())
            .setTimeout(Duration.ofSeconds(10))
            .build();
    }
    
    @Bean
    public SpanProcessor batchSpanProcessor(OtlpGrpcSpanExporter exporter) {
        return BatchSpanProcessor.builder(exporter)
            .setScheduleDelay(Duration.ofSeconds(1))
            .build();
    }
    
    @Bean
    public OpenTelemetry openTelemetry(SpanProcessor spanProcessor, LgtmProperties properties) {
        SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
            .addSpanProcessor(spanProcessor)
            .setSampler(Sampler.traceIdRatioBased(properties.getTempo().getSamplingProbability()))
            .setResource(Resource.create(Attributes.builder()
                .put("service.name", properties.getApplicationName())
                .put("environment", properties.getEnvironment())
                .build()))
            .build();
        
        return OpenTelemetrySdk.builder()
            .setTracerProvider(tracerProvider)
            .build();
    }
}
```

**MetricsAutoConfiguration.java**
```java
@Configuration
@ConditionalOnProperty(prefix = "lgtm.metrics", name = "enabled", havingValue = "true", matchIfMissing = true)
public class MetricsAutoConfiguration {
    
    @Bean
    public MeterRegistryCustomizer<MeterRegistry> commonTagsCustomizer(LgtmProperties properties) {
        return registry -> {
            properties.getCommonTags().forEach(registry.config()::commonTags);
            registry.config().commonTags(
                "application", properties.getApplicationName(),
                "environment", properties.getEnvironment()
            );
        };
    }
    
    @Configuration
    @ConditionalOnProperty(prefix = "lgtm.metrics.mimir", name = "enabled", havingValue = "true")
    static class MimirConfiguration {
        
        @Bean
        public PrometheusConfig mimirConfig(LgtmProperties properties) {
            return new PrometheusConfig() {
                @Override
                public String get(String key) {
                    return null;
                }
                
                @Override
                public Duration step() {
                    return Duration.ofSeconds(15);
                }
            };
        }
    }
}
```

### 5.4 Register Auto-Configuration

**Create file: `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`**
```
com.yourorg.lgtm.autoconfigure.LgtmAutoConfiguration
com.yourorg.lgtm.autoconfigure.LokiAutoConfiguration
com.yourorg.lgtm.autoconfigure.TempoAutoConfiguration
com.yourorg.lgtm.autoconfigure.MetricsAutoConfiguration
```

### 5.5 Create the Starter Module

**lgtm-spring-boot-starter/pom.xml**
```xml
<dependencies>
    <dependency>
        <groupId>com.yourorg</groupId>
        <artifactId>lgtm-spring-boot-autoconfigure</artifactId>
        <version>${project.version}</version>
    </dependency>
    
    <!-- Include all required dependencies -->
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
</dependencies>
```

---

## Step 6: Testing Your Starter

### 6.1 Create a Test Application

```java
@SpringBootApplication
public class TestApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }
    
    @RestController
    public class TestController {
        private static final Logger log = LoggerFactory.getLogger(TestController.class);
        
        @GetMapping("/test")
        public String test() {
            log.info("Test endpoint called");
            return "LGTM Stack is working!";
        }
    }
}
```

### 6.2 Test Configuration

**application.yml**
```yaml
spring:
  application:
    name: lgtm-test-app

lgtm:
  enabled: true
  application-name: ${spring.application.name}
  environment: local
  
  loki:
    enabled: true
    url: http://localhost:3100
    
  tempo:
    enabled: true
    url: http://localhost:4317
    sampling-probability: 1.0
    
  metrics:
    enabled: true
```

### 6.3 Run Local LGTM Stack

**docker-compose.yml**
```yaml
version: '3.8'
services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    
  tempo:
    image: grafana/tempo:latest
    ports:
      - "4317:4317"
      - "4318:4318"
    command: -config.file=/etc/tempo/tempo.yaml
    
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
```

---

## Step 7: Add Advanced Features

### 7.1 Health Indicators

```java
@Component
@ConditionalOnEnabledHealthIndicator("lgtm")
public class LgtmHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // Check connectivity to Loki, Tempo, etc.
        return Health.up()
            .withDetail("loki", checkLoki())
            .withDetail("tempo", checkTempo())
            .build();
    }
}
```

### 7.2 Custom Annotations

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TraceSpan {
    String name() default "";
}

@Aspect
@Component
public class TraceSpanAspect {
    @Around("@annotation(traceSpan)")
    public Object traceMethod(ProceedingJoinPoint pjp, TraceSpan traceSpan) throws Throwable {
        // Create span, execute method, end span
    }
}
```

### 7.3 Dashboard Provisioning

Include pre-built Grafana dashboards in `src/main/resources/dashboards/`:
- `spring-boot-overview.json`
- `jvm-metrics.json`
- `application-logs.json`

### 7.4 Development Mode

```java
@Configuration
@Profile("dev")
public class DevelopmentConfig {
    @Bean
    public LgtmDevTools devTools() {
        // Start embedded Loki/Tempo for local development
        return new LgtmDevTools();
    }
}
```

---

## Step 8: Documentation & Distribution

### 8.1 README.md

Create comprehensive documentation:
- Quick start guide
- Configuration options
- Examples
- Troubleshooting

### 8.2 Publish to Maven Central

1. Configure deployment in `pom.xml`
2. Sign artifacts with GPG
3. Deploy to Sonatype OSSRH
4. Sync to Maven Central

### 8.3 Create Sample Projects

Provide example projects showing:
- Microservices architecture
- REST APIs
- Async processing
- Different profiles (dev/prod)

---

## Best Practices

1. **Graceful Degradation**: Don't fail app startup if LGTM services are down
2. **Performance**: Use async appenders, batching
3. **Security**: Support authentication (Basic, Bearer tokens)
4. **Flexibility**: Allow users to override any configuration
5. **Documentation**: Extensive JavaDoc and user guides
6. **Testing**: Unit tests, integration tests with Testcontainers
7. **Versioning**: Follow semantic versioning
8. **Backward Compatibility**: Maintain compatibility in minor versions

---

## Additional Resources

### Libraries to Consider
- **Micrometer**: Already in Spring Boot, great abstraction
- **OpenTelemetry**: Industry standard for observability
- **Resilience4j**: For circuit breakers when sending telemetry
- **Testcontainers**: For integration testing

### Learning Resources
- Spring Boot Auto-Configuration documentation
- Micrometer documentation
- OpenTelemetry Java SDK
- Grafana LGTM documentation

---

## Next Steps

1. Start with a proof of concept (PoC)
2. Focus on one component at a time (start with Loki)
3. Get feedback from users early
4. Iterate based on real-world usage
5. Consider contributing to existing projects before building from scratch
