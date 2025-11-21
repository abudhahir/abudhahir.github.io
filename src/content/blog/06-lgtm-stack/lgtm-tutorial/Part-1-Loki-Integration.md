---
title: "Part 1: Loki Integration for Centralized Logging"
subtitle: "Programmatically Configure Logback to Ship Structured Logs Directly to Loki"
excerpt: "Learn how to integrate Grafana Loki for powerful, centralized logging. This part of the series walks you through programmatically configuring a Logback appender, creating structured JSON logs, and designing effective labels for efficient querying."
date: 2025-09-03
author: "Abu Dhahir"
tags: ["Spring Boot", "Loki", "Logging", "Logback", "Observability"]
series: "Building a Spring Boot Starter for LGTM"
draft: false
---
# Part 1: Loki Integration - Centralized Logging

## Table of Contents
1. [Understanding Loki](#understanding-loki)
2. [Integration Strategy](#integration-strategy)
3. [Creating Properties Classes](#creating-properties-classes)
4. [Implementing Auto-Configuration](#implementing-auto-configuration)
5. [Programmatic Logback Configuration](#programmatic-logback-configuration)
6. [Testing Loki Integration](#testing-loki-integration)
7. [Advanced Features](#advanced-features)

---

## Understanding Loki

### What is Loki?

Loki is a horizontally scalable, highly available log aggregation system inspired by Prometheus. Unlike other logging systems, Loki:
- **Doesn't index log content** - only indexes metadata (labels)
- **Stores logs as compressed chunks** - more cost-effective
- **Uses LogQL** - query language similar to PromQL
- **Integrates with Grafana** - unified observability

### How Loki Works

```
Application → Logback → Loki Appender → HTTP POST → Loki → Storage
                                                            ↓
                                                       Grafana (Query)
```

### Loki's Data Model

Logs in Loki consist of:
1. **Timestamp**: When the log was created
2. **Labels**: Key-value pairs (indexed)
3. **Log Line**: The actual log message (not indexed)

Example:
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "labels": {
    "app": "order-service",
    "environment": "production",
    "level": "ERROR"
  },
  "line": "Failed to process order #12345: Connection timeout"
}
```

**Key Concept**: Only labels are indexed, so choose them wisely!

### Good vs Bad Labels

**Good Labels** (Low Cardinality):
- Application name
- Environment (dev/staging/prod)
- Log level (INFO/WARN/ERROR)
- Datacenter/Region
- Service name

**Bad Labels** (High Cardinality):
- User IDs
- Request IDs
- Timestamps
- IP addresses
- Order numbers

**Why?** High cardinality labels create too many streams, degrading performance.

---

## Integration Strategy

### Goals

1. **Zero-Code Integration**: Works by adding dependency + properties
2. **Automatic Configuration**: Programmatically configure Logback
3. **Sensible Defaults**: Works out-of-the-box with local Loki
4. **Customizable**: Users can override any setting
5. **Resilient**: Doesn't break app if Loki is down
6. **Performance**: Async appender with batching

### Architecture

```
Spring Boot App
    ↓
LgtmAutoConfiguration (detects properties)
    ↓
LokiAutoConfiguration (if enabled)
    ↓
LokiAppenderConfigurer (configures Logback)
    ↓
Loki4jAppender (sends logs)
    ↓
Loki Server
```

### Implementation Approach

We'll use **programmatic configuration** instead of `logback.xml` because:
- Users don't need to modify their logging config
- We can use Spring properties for configuration
- More flexible and dynamic
- Can conditionally enable/disable

---

## Creating Properties Classes

### Step 1: Create LokiProperties

Create `LokiProperties.java` in `autoconfigure/loki/`:

```java
package com.yourorg.lgtm.autoconfigure.loki;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration properties for Loki integration.
 * 
 * <p>Binds to properties with prefix 'lgtm.loki'</p>
 * 
 * <p>Example configuration:</p>
 * <pre>
 * lgtm:
 *   loki:
 *     enabled: true
 *     url: http://localhost:3100
 *     batch-size: 100
 *     batch-timeout: 10s
 * </pre>
 */
public class LokiProperties {

    /**
     * Enable or disable Loki integration.
     */
    private boolean enabled = true;

    /**
     * Base URL of Loki server.
     * The push endpoint will be automatically appended.
     */
    private String url = "http://localhost:3100";

    /**
     * Number of log events to batch before sending.
     * Higher values reduce network calls but increase memory usage.
     */
    private int batchSize = 100;

    /**
     * Maximum time to wait before sending a batch.
     * Ensures logs are sent even if batch size isn't reached.
     */
    private Duration batchTimeout = Duration.ofSeconds(10);

    /**
     * Maximum number of log events to keep in memory.
     * If exceeded, oldest logs are dropped.
     */
    private int queueSize = 1000;

    /**
     * Whether to log a warning when queue is full.
     */
    private boolean logQueueFullWarning = true;

    /**
     * Connection timeout for HTTP requests to Loki.
     */
    private Duration connectionTimeout = Duration.ofSeconds(30);

    /**
     * Request timeout for HTTP requests to Loki.
     */
    private Duration requestTimeout = Duration.ofSeconds(30);

    /**
     * Whether to use JSON format for log lines.
     * If false, uses plain text.
     */
    private boolean useJsonFormat = true;

    /**
     * Static labels to attach to all log entries.
     * These should be low-cardinality values.
     * 
     * Example: {app: "my-service", env: "production"}
     */
    private Map<String, String> staticLabels = new HashMap<>();

    /**
     * Whether to include MDC (Mapped Diagnostic Context) as labels.
     * Use with caution - only include low-cardinality MDC keys.
     */
    private boolean includeMdcAsLabels = false;

    /**
     * Specific MDC keys to include as labels.
     * Only used if includeMdcAsLabels is true.
     */
    private String[] mdcKeysAsLabels = new String[0];

    /**
     * Whether to drop logs if Loki is unavailable.
     * If false, app startup may be delayed when Loki is down.
     */
    private boolean dropLogsOnError = true;

    /**
     * Minimum log level to send to Loki.
     * Options: TRACE, DEBUG, INFO, WARN, ERROR
     */
    private String minLevel = "INFO";

    // Getters and Setters

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getBatchSize() {
        return batchSize;
    }

    public void setBatchSize(int batchSize) {
        this.batchSize = batchSize;
    }

    public Duration getBatchTimeout() {
        return batchTimeout;
    }

    public void setBatchTimeout(Duration batchTimeout) {
        this.batchTimeout = batchTimeout;
    }

    public int getQueueSize() {
        return queueSize;
    }

    public void setQueueSize(int queueSize) {
        this.queueSize = queueSize;
    }

    public boolean isLogQueueFullWarning() {
        return logQueueFullWarning;
    }

    public void setLogQueueFullWarning(boolean logQueueFullWarning) {
        this.logQueueFullWarning = logQueueFullWarning;
    }

    public Duration getConnectionTimeout() {
        return connectionTimeout;
    }

    public void setConnectionTimeout(Duration connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    public Duration getRequestTimeout() {
        return requestTimeout;
    }

    public void setRequestTimeout(Duration requestTimeout) {
        this.requestTimeout = requestTimeout;
    }

    public boolean isUseJsonFormat() {
        return useJsonFormat;
    }

    public void setUseJsonFormat(boolean useJsonFormat) {
        this.useJsonFormat = useJsonFormat;
    }

    public Map<String, String> getStaticLabels() {
        return staticLabels;
    }

    public void setStaticLabels(Map<String, String> staticLabels) {
        this.staticLabels = staticLabels;
    }

    public boolean isIncludeMdcAsLabels() {
        return includeMdcAsLabels;
    }

    public void setIncludeMdcAsLabels(boolean includeMdcAsLabels) {
        this.includeMdcAsLabels = includeMdcAsLabels;
    }

    public String[] getMdcKeysAsLabels() {
        return mdcKeysAsLabels;
    }

    public void setMdcKeysAsLabels(String[] mdcKeysAsLabels) {
        this.mdcKeysAsLabels = mdcKeysAsLabels;
    }

    public boolean isDropLogsOnError() {
        return dropLogsOnError;
    }

    public void setDropLogsOnError(boolean dropLogsOnError) {
        this.dropLogsOnError = dropLogsOnError;
    }

    public String getMinLevel() {
        return minLevel;
    }

    public void setMinLevel(String minLevel) {
        this.minLevel = minLevel;
    }

    /**
     * Get the complete push URL (base URL + endpoint).
     */
    public String getPushUrl() {
        return url.endsWith("/") 
            ? url + "loki/api/v1/push" 
            : url + "/loki/api/v1/push";
    }
}
```

**Key Design Decisions:**

1. **Sensible Defaults**: Works with local Loki without configuration
2. **Duration Types**: Spring Boot automatically parses "10s", "5m", etc.
3. **Validation**: Could add `@Min`, `@Max` annotations for validation
4. **Documentation**: Comprehensive JavaDoc for each property
5. **Helper Methods**: `getPushUrl()` constructs the full endpoint

### Step 2: Update Main LgtmProperties

Update `LgtmProperties.java` in `autoconfigure/`:

```java
package com.yourorg.lgtm.autoconfigure;

import com.yourorg.lgtm.autoconfigure.loki.LokiProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

import java.util.HashMap;
import java.util.Map;

/**
 * Root configuration properties for LGTM stack integration.
 */
@ConfigurationProperties(prefix = "lgtm")
public class LgtmProperties {

    /**
     * Enable or disable entire LGTM stack.
     */
    private boolean enabled = true;

    /**
     * Application name used across all LGTM components.
     * Defaults to ${spring.application.name} if not set.
     */
    private String applicationName;

    /**
     * Environment identifier (dev, staging, production).
     * Defaults to active Spring profile.
     */
    private String environment;

    /**
     * Common tags to apply across all telemetry data.
     */
    private Map<String, String> commonTags = new HashMap<>();

    /**
     * Loki-specific configuration.
     */
    @NestedConfigurationProperty
    private LokiProperties loki = new LokiProperties();

    // Getters and Setters

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public Map<String, String> getCommonTags() {
        return commonTags;
    }

    public void setCommonTags(Map<String, String> commonTags) {
        this.commonTags = commonTags;
    }

    public LokiProperties getLoki() {
        return loki;
    }

    public void setLoki(LokiProperties loki) {
        this.loki = loki;
    }
}
```

**Note**: `@NestedConfigurationProperty` enables nested property binding.

---

## Implementing Auto-Configuration

### Step 1: Create LokiAutoConfiguration

Create `LokiAutoConfiguration.java`:

```java
package com.yourorg.lgtm.autoconfigure.loki;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

/**
 * Auto-configuration for Loki logging integration.
 * 
 * <p>Activates when:</p>
 * <ul>
 *   <li>Loki4j is on the classpath</li>
 *   <li>lgtm.loki.enabled=true (default)</li>
 * </ul>
 * 
 * <p>Programmatically configures Logback to send logs to Loki.</p>
 */
@AutoConfiguration
@ConditionalOnClass(name = "com.github.loki4j.logback.Loki4jAppender")
@ConditionalOnProperty(
    prefix = "lgtm.loki",
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true
)
@EnableConfigurationProperties(LgtmProperties.class)
@Order(Ordered.LOWEST_PRECEDENCE - 10) // Run late, after logging is initialized
public class LokiAutoConfiguration implements ApplicationListener<ContextRefreshedEvent> {

    private static final Logger log = LoggerFactory.getLogger(LokiAutoConfiguration.class);
    
    private final LgtmProperties lgtmProperties;
    private final LokiAppenderConfigurer appenderConfigurer;
    private boolean configured = false;

    public LokiAutoConfiguration(LgtmProperties lgtmProperties) {
        this.lgtmProperties = lgtmProperties;
        this.appenderConfigurer = new LokiAppenderConfigurer(lgtmProperties);
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // Only configure once
        if (configured) {
            return;
        }
        
        configured = true;
        
        try {
            log.info("Configuring Loki appender...");
            appenderConfigurer.configure();
            log.info("Loki appender configured successfully. Logs will be sent to: {}", 
                     lgtmProperties.getLoki().getPushUrl());
        } catch (Exception e) {
            if (lgtmProperties.getLoki().isDropLogsOnError()) {
                log.warn("Failed to configure Loki appender, continuing without it: {}", 
                         e.getMessage());
            } else {
                throw new RuntimeException("Failed to configure Loki appender", e);
            }
        }
    }
}
```

**Key Points:**

1. **`@AutoConfiguration`**: Spring Boot 2.7+ annotation for auto-configuration
2. **`@ConditionalOnClass`**: Only activates if Loki4j library is present
3. **`@ConditionalOnProperty`**: Respects user's enabled/disabled preference
4. **`ApplicationListener`**: Waits for application context to be ready
5. **Error Handling**: Gracefully degrades if Loki is unavailable

---

## Programmatic Logback Configuration

### Step 2: Create LokiAppenderConfigurer

Create `LokiAppenderConfigurer.java`:

```java
package com.yourorg.lgtm.autoconfigure.loki;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import com.github.loki4j.logback.AbstractLoki4jEncoder;
import com.github.loki4j.logback.ApacheHttpSender;
import com.github.loki4j.logback.JsonEncoder;
import com.github.loki4j.logback.Loki4jAppender;
import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Configures Logback programmatically to send logs to Loki.
 * 
 * <p>This class handles the complex Logback configuration without requiring
 * users to create a logback.xml file.</p>
 */
public class LokiAppenderConfigurer {

    private final LgtmProperties lgtmProperties;

    public LokiAppenderConfigurer(LgtmProperties lgtmProperties) {
        this.lgtmProperties = lgtmProperties;
    }

    /**
     * Configure and attach Loki appender to root logger.
     */
    public void configure() {
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        
        // Create Loki4j appender
        Loki4jAppender appender = createAppender(loggerContext);
        
        // Start the appender
        appender.start();
        
        // Attach to root logger
        Logger rootLogger = loggerContext.getLogger(Logger.ROOT_LOGGER_NAME);
        rootLogger.addAppender(appender);
        
        // Set minimum level
        Level minLevel = Level.toLevel(lgtmProperties.getLoki().getMinLevel(), Level.INFO);
        rootLogger.setLevel(minLevel);
    }

    /**
     * Create and configure Loki4jAppender.
     */
    private Loki4jAppender createAppender(LoggerContext context) {
        Loki4jAppender appender = new Loki4jAppender();
        appender.setContext(context);
        appender.setName("LOKI");
        
        // Configure HTTP sender
        ApacheHttpSender sender = createHttpSender();
        appender.setHttp(sender);
        
        // Configure encoder (format)
        AbstractLoki4jEncoder encoder = createEncoder(context);
        appender.setFormat(encoder);
        
        // Configure batching
        LokiProperties lokiProps = lgtmProperties.getLoki();
        appender.setBatchSize(lokiProps.getBatchSize());
        appender.setBatchTimeoutMs(lokiProps.getBatchTimeout().toMillis());
        
        // Configure queue
        appender.setSendQueueMaxBytes(lokiProps.getQueueSize() * 1024); // Convert to bytes
        appender.setDropRateLimitedBatches(lokiProps.isDropLogsOnError());
        appender.setVerbose(false); // Set to true for debugging
        
        return appender;
    }

    /**
     * Create HTTP sender for communicating with Loki.
     */
    private ApacheHttpSender createHttpSender() {
        LokiProperties lokiProps = lgtmProperties.getLoki();
        
        ApacheHttpSender sender = new ApacheHttpSender();
        sender.setUrl(lokiProps.getPushUrl());
        sender.setConnectionTimeoutMs((int) lokiProps.getConnectionTimeout().toMillis());
        sender.setRequestTimeoutMs((int) lokiProps.getRequestTimeout().toMillis());
        
        return sender;
    }

    /**
     * Create encoder for formatting log messages.
     */
    private AbstractLoki4jEncoder createEncoder(LoggerContext context) {
        LokiProperties lokiProps = lgtmProperties.getLoki();
        
        if (lokiProps.isUseJsonFormat()) {
            return createJsonEncoder(context);
        } else {
            return createSimpleEncoder(context);
        }
    }

    /**
     * Create JSON encoder with structured logging.
     */
    private JsonEncoder createJsonEncoder(LoggerContext context) {
        JsonEncoder encoder = new JsonEncoder();
        encoder.setContext(context);
        
        // Build static label string
        String labels = buildLabelString();
        encoder.setLabel(buildLabelPattern(labels));
        
        // Configure message format
        encoder.setMessage(buildMessagePattern());
        
        // Sort labels for better compression
        encoder.setSortByTime(true);
        
        return encoder;
    }

    /**
     * Create simple text encoder.
     */
    private AbstractLoki4jEncoder createSimpleEncoder(LoggerContext context) {
        // For simplicity, we'll use JsonEncoder even for "simple" format
        // But with minimal structured data
        JsonEncoder encoder = new JsonEncoder();
        encoder.setContext(context);
        
        String labels = buildLabelString();
        encoder.setLabel(buildLabelPattern(labels));
        encoder.setMessage("{\"message\":\"%msg\"}");
        
        return encoder;
    }

    /**
     * Build the label pattern for Loki.
     * 
     * Format: label1=value1,label2=value2
     */
    private String buildLabelPattern(String staticLabels) {
        StringBuilder pattern = new StringBuilder();
        
        // Add static labels
        if (!staticLabels.isEmpty()) {
            pattern.append(staticLabels);
        }
        
        // Add level as label
        if (pattern.length() > 0) {
            pattern.append(",");
        }
        pattern.append("level=%level");
        
        // Add logger name (be careful - can be high cardinality)
        // Uncomment if you want logger as label
        // pattern.append(",logger=%logger");
        
        // Add thread name
        pattern.append(",thread=%thread");
        
        return pattern.toString();
    }

    /**
     * Build static label string from properties.
     */
    private String buildLabelString() {
        LokiProperties lokiProps = lgtmProperties.getLoki();
        Map<String, String> labels = lokiProps.getStaticLabels();
        
        // Add default labels
        if (lgtmProperties.getApplicationName() != null) {
            labels.putIfAbsent("app", lgtmProperties.getApplicationName());
        }
        if (lgtmProperties.getEnvironment() != null) {
            labels.putIfAbsent("env", lgtmProperties.getEnvironment());
        }
        
        // Add common tags
        labels.putAll(lgtmProperties.getCommonTags());
        
        // Build comma-separated string
        return labels.entrySet().stream()
            .map(entry -> entry.getKey() + "=" + entry.getValue())
            .collect(Collectors.joining(","));
    }

    /**
     * Build message pattern for structured logging.
     */
    private String buildMessagePattern() {
        return "{"
            + "\"level\":\"%level\","
            + "\"logger\":\"%logger{36}\","
            + "\"thread\":\"%thread\","
            + "\"message\":\"%message\","
            + "\"exception\":\"%exception{full}\""
            + "}";
    }
}
```

**Deep Dive:**

1. **Logback Context**: Logback's `LoggerContext` manages all loggers
2. **Loki4jAppender**: The actual appender that sends logs to Loki
3. **ApacheHttpSender**: Uses Apache HttpClient for HTTP communication
4. **JsonEncoder**: Formats logs as JSON before sending
5. **Labels vs Message**: Labels are indexed (searchable), message content is not
6. **Batching**: Reduces network overhead by grouping logs

### Understanding the Label Pattern

```java
"level=%level,thread=%thread,app=my-service,env=production"
```

This creates Loki labels:
```
{level="INFO", thread="http-nio-8080-exec-1", app="my-service", env="production"}
```

These labels let you query like:
```logql
{app="my-service", level="ERROR"}
```

---

## Testing Loki Integration

### Step 1: Set Up Local Loki

Create `docker-compose.yml` in your test project:

```yaml
version: '3.8'

services:
  loki:
    image: grafana/loki:2.9.3
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - loki-data:/loki

  grafana:
    image: grafana/grafana:10.2.2
    ports:
      - "3000:3000"
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
    volumes:
      - ./grafana-datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml

volumes:
  loki-data:
```

Create `grafana-datasources.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    isDefault: true
    editable: true
```

Start services:
```bash
docker-compose up -d
```

### Step 2: Create Test Application

Create a simple Spring Boot test app:

```java
package com.example.lgtmtest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class LgtmTestApplication {
    public static void main(String[] args) {
        SpringApplication.run(LgtmTestApplication.class, args);
    }
}

@RestController
class TestController {
    private static final Logger log = LoggerFactory.getLogger(TestController.class);
    
    @GetMapping("/test")
    public String test(@RequestParam(defaultValue = "World") String name) {
        log.info("Test endpoint called with name: {}", name);
        log.debug("Debug message - might not appear depending on level");
        log.warn("This is a warning message");
        
        try {
            if ("error".equals(name)) {
                throw new RuntimeException("Intentional error for testing");
            }
        } catch (Exception e) {
            log.error("Error occurred while processing request", e);
        }
        
        return "Hello, " + name + "! Check Grafana for logs.";
    }
    
    @GetMapping("/stress")
    public String stress() {
        for (int i = 0; i < 100; i++) {
            log.info("Stress test log #{}", i);
        }
        return "Generated 100 log entries";
    }
}
```

### Step 3: Configure the Application

Create `application.yml`:

```yaml
spring:
  application:
    name: lgtm-test-app

lgtm:
  enabled: true
  application-name: ${spring.application.name}
  environment: local
  
  common-tags:
    team: platform
    version: 1.0.0
  
  loki:
    enabled: true
    url: http://localhost:3100
    batch-size: 10  # Small for testing
    batch-timeout: 5s
    min-level: DEBUG
    use-json-format: true
    
    static-labels:
      service: test-service
      region: us-east-1

# Enable debug logging for LGTM starter
logging:
  level:
    com.yourorg.lgtm: DEBUG
```

### Step 4: Add Starter Dependency

In your test app's `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>com.yourorg</groupId>
        <artifactId>lgtm-spring-boot-starter</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

### Step 5: Run and Test

1. **Start the application:**
```bash
mvn spring-boot:run
```

2. **Generate logs:**
```bash
# Normal request
curl http://localhost:8080/test?name=John

# Trigger error
curl http://localhost:8080/test?name=error

# Stress test
curl http://localhost:8080/stress
```

3. **Check logs in Grafana:**
   - Open http://localhost:3000
   - Go to Explore
   - Select Loki datasource
   - Run query:
   ```logql
   {app="lgtm-test-app"}
   ```

4. **Try different queries:**
```logql
# Only errors
{app="lgtm-test-app", level="ERROR"}

# Specific service
{service="test-service"}

# Contains text
{app="lgtm-test-app"} |= "Stress test"

# Exclude text
{app="lgtm-test-app"} != "Debug"

# Rate query (logs per second)
rate({app="lgtm-test-app"}[1m])
```

### Step 6: Verify in Application Logs

You should see startup logs:
```
INFO  c.y.l.a.l.LokiAutoConfiguration - Configuring Loki appender...
INFO  c.y.l.a.l.LokiAutoConfiguration - Loki appender configured successfully. Logs will be sent to: http://localhost:3100/loki/api/v1/push
```

---

## Advanced Features

### Feature 1: Dynamic Labels from MDC

MDC (Mapped Diagnostic Context) allows adding contextual information to logs.

**Enable MDC labels:**
```yaml
lgtm:
  loki:
    include-mdc-as-labels: true
    mdc-keys-as-labels:
      - requestId
      - userId
```

**Use in code:**
```java
import org.slf4j.MDC;

@RestController
class TestController {
    @GetMapping("/test")
    public String test() {
        MDC.put("requestId", UUID.randomUUID().toString());
        MDC.put("userId", "user123");
        
        try {
            log.info("Processing request");
            return "OK";
        } finally {
            MDC.clear();
        }
    }
}
```

**⚠️ Warning**: Only use low-cardinality MDC values as labels!

### Feature 2: Custom Log Patterns

Update `LokiAppenderConfigurer` to support custom patterns:

```java
private String buildMessagePattern() {
    LokiProperties lokiProps = lgtmProperties.getLoki();
    
    // Allow custom pattern from properties
    if (lokiProps.getCustomMessagePattern() != null) {
        return lokiProps.getCustomMessagePattern();
    }
    
    // Default pattern
    return "{"
        + "\"timestamp\":\"%d{ISO8601}\","
        + "\"level\":\"%level\","
        + "\"logger\":\"%logger{36}\","
        + "\"thread\":\"%thread\","
        + "\"message\":\"%message\","
        + "\"exception\":\"%exception{full}\""
        + "}";
}
```

### Feature 3: Filtering Sensitive Data

Add a filter to redact sensitive information:

```java
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.Filter;
import ch.qos.logback.core.spi.FilterReply;

public class SensitiveDataFilter extends Filter<ILoggingEvent> {
    
    @Override
    public FilterReply decide(ILoggingEvent event) {
        String message = event.getFormattedMessage();
        
        // Redact credit card numbers
        message = message.replaceAll("\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}", "****-****-****-****");
        
        // Redact email addresses
        message = message.replaceAll("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", "***@***.***");
        
        // More redaction logic...
        
        return FilterReply.NEUTRAL;
    }
}
```

Attach filter in `LokiAppenderConfigurer`:
```java
SensitiveDataFilter filter = new SensitiveDataFilter();
filter.setContext(context);
filter.start();
appender.addFilter(filter);
```

### Feature 4: Multi-Tenancy

Support sending logs to different Loki instances based on tenant:

```java
@Configuration
public class MultiTenantLokiConfig {
    
    @Bean
    public TenantResolver tenantResolver() {
        return () -> {
            // Get tenant from request context
            String tenant = RequestContextHolder.currentRequestAttributes()
                .getAttribute("tenant", RequestAttributes.SCOPE_REQUEST);
            return tenant != null ? tenant : "default";
        };
    }
    
    @Bean
    public Map<String, String> tenantLokiUrls() {
        Map<String, String> urls = new HashMap<>();
        urls.put("tenant1", "http://loki-tenant1:3100");
        urls.put("tenant2", "http://loki-tenant2:3100");
        urls.put("default", "http://loki-default:3100");
        return urls;
    }
}
```

---

## Troubleshooting

### Issue 1: Logs Not Appearing in Loki

**Check:**
1. Is Loki running? `curl http://localhost:3100/ready`
2. Is the URL correct in properties?
3. Is batching too large? Try smaller `batch-size` and shorter `batch-timeout`
4. Check application logs for errors

**Debug:**
```yaml
lgtm:
  loki:
    batch-size: 1  # Send immediately
    batch-timeout: 1s
    
logging:
  level:
    com.github.loki4j: DEBUG
    com.yourorg.lgtm: DEBUG
```

### Issue 2: High Cardinality Warning

**Error in Loki logs:**
```
too many streams for user
```

**Solution:**
- Remove high-cardinality labels (user IDs, request IDs, etc.)
- Use structured JSON in message instead
- Keep labels under 10-15 distinct combinations

### Issue 3: Application Slow to Start

**Cause**: Synchronous logging blocking startup

**Solution:**
```yaml
lgtm:
  loki:
    drop-logs-on-error: true  # Don't block if Loki is down
```

### Issue 4: Memory Issues

**Symptom**: OutOfMemoryError or high memory usage

**Solution:**
```yaml
lgtm:
  loki:
    queue-size: 500  # Reduce from 1000
    batch-size: 50   # Reduce batch size
```

---

## Summary

In this part, you learned:
- ✅ How Loki works and its data model
- ✅ Created comprehensive configuration properties
- ✅ Implemented auto-configuration with Spring Boot
- ✅ Programmatically configured Logback without XML
- ✅ Tested integration with local Loki
- ✅ Implemented advanced features (MDC, filtering)
- ✅ Troubleshooting common issues

**Next**: Part 2 - Implementing Tempo integration for distributed tracing.

## Additional Resources

- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [LogQL Query Language](https://grafana.com/docs/loki/latest/logql/)
- [Loki4j GitHub](https://github.com/loki4j/loki-logback-appender)
- [Best Practices for Loki](https://grafana.com/docs/loki/latest/best-practices/)
