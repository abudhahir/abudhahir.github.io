---
title: "Part 3: Metrics Integration with Prometheus and Mimir"
subtitle: "Configure Micrometer for Scrape-Based and Push-Based Metric Collection"
excerpt: "Master metrics collection with Micrometer, Prometheus, and Mimir. This tutorial explains how to expose a Prometheus scrape endpoint, configure remote write for Mimir, and create custom metrics using counters, gauges, and timers."
date: 2025-09-05
author: "Abu Dhahir"
tags: ["Spring Boot", "Prometheus", "Mimir", "Metrics", "Micrometer"]
series: "Building a Spring Boot Starter for LGTM"
draft: false
---
# Part 3: Metrics Integration - Prometheus and Mimir

## Table of Contents
1. [Understanding Metrics](#understanding-metrics)
2. [Prometheus vs Mimir](#prometheus-vs-mimir)
3. [Creating Metrics Properties](#creating-metrics-properties)
4. [Implementing Auto-Configuration](#implementing-auto-configuration)
5. [Custom Metrics](#custom-metrics)
6. [Testing Metrics Integration](#testing-metrics-integration)
7. [Advanced Metrics Features](#advanced-metrics-features)

---

## Understanding Metrics

### What are Metrics?

Metrics are numerical measurements collected over time that help you understand system behavior:
- **Counters**: Values that only increase (requests, errors)
- **Gauges**: Values that can go up and down (memory, CPU)
- **Histograms**: Distribution of values (request duration)
- **Summaries**: Similar to histograms with percentiles

### Why Metrics Matter

```
Metrics answer: "What is happening?" and "How often?"
Logs answer: "What went wrong?"
Traces answer: "Where is the bottleneck?"
```

### Metric Types Explained

**1. Counter**
```java
// Total HTTP requests (ever-increasing)
counter.increment();
// Current value: 1000, 1001, 1002...
```

**2. Gauge**
```java
// Current active connections (can fluctuate)
gauge.set(42);
// Current value: 40, 42, 38, 45...
```

**3. Timer/Histogram**
```java
// Request duration distribution
timer.record(Duration.ofMillis(150));
// Tracks: count, sum, percentiles (p50, p95, p99)
```

**4. Distribution Summary**
```java
// Response size distribution
summary.record(1024);
// Tracks: count, sum, percentiles
```

---

## Prometheus vs Mimir

### Prometheus

**Architecture:**
```
Application → /actuator/prometheus → Prometheus Scraper → Local Storage
                                                                ↓
                                                          Grafana (Query)
```

**Characteristics:**
- ✅ Pull-based (scrapes metrics)
- ✅ Simple setup
- ✅ Great for single instance
- ❌ Limited scalability
- ❌ Single point of failure
- ❌ Short retention (15 days default)

### Mimir

**Architecture:**
```
Application → Remote Write → Mimir → Object Storage (S3/GCS)
                                            ↓
                                      Grafana (Query)
```

**Characteristics:**
- ✅ Horizontally scalable
- ✅ Multi-tenancy
- ✅ Long-term storage
- ✅ High availability
- ✅ Compatible with Prometheus API
- ❌ More complex setup

### Our Integration Strategy

Support both:
1. **Prometheus** (scrape) - Default for simplicity
2. **Mimir** (remote write) - Optional for production

---

## Creating Metrics Properties

### Step 1: Create MetricsProperties

Create `MetricsProperties.java` in `autoconfigure/metrics/`:

```java
package com.yourorg.lgtm.autoconfigure.metrics;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration properties for metrics integration.
 * 
 * <p>Supports both Prometheus (scrape) and Mimir (remote write).</p>
 * 
 * <p>Example configuration:</p>
 * <pre>
 * lgtm:
 *   metrics:
 *     enabled: true
 *     prometheus:
 *       enabled: true
 *     mimir:
 *       enabled: true
 *       url: http://mimir:9009/api/v1/push
 * </pre>
 */
public class MetricsProperties {

    /**
     * Enable or disable metrics integration.
     */
    private boolean enabled = true;

    /**
     * Common tags to add to all metrics.
     * Inherited from parent LgtmProperties but can be overridden.
     */
    private Map<String, String> commonTags = new HashMap<>();

    /**
     * Prometheus scrape endpoint configuration.
     */
    private PrometheusProperties prometheus = new PrometheusProperties();

    /**
     * Mimir remote write configuration.
     */
    private MimirProperties mimir = new MimirProperties();

    /**
     * Whether to enable JVM metrics.
     */
    private boolean enableJvmMetrics = true;

    /**
     * Whether to enable system metrics (CPU, memory, disk).
     */
    private boolean enableSystemMetrics = true;

    /**
     * Whether to enable HTTP server metrics.
     */
    private boolean enableHttpMetrics = true;

    /**
     * Whether to enable database metrics.
     */
    private boolean enableDatabaseMetrics = true;

    /**
     * Whether to enable cache metrics.
     */
    private boolean enableCacheMetrics = true;

    /**
     * Metric name prefix.
     * Example: "myapp" creates metrics like "myapp_http_requests_total"
     */
    private String prefix = "";

    // Getters and Setters

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Map<String, String> getCommonTags() {
        return commonTags;
    }

    public void setCommonTags(Map<String, String> commonTags) {
        this.commonTags = commonTags;
    }

    public PrometheusProperties getPrometheus() {
        return prometheus;
    }

    public void setPrometheus(PrometheusProperties prometheus) {
        this.prometheus = prometheus;
    }

    public MimirProperties getMimir() {
        return mimir;
    }

    public void setMimir(MimirProperties mimir) {
        this.mimir = mimir;
    }

    public boolean isEnableJvmMetrics() {
        return enableJvmMetrics;
    }

    public void setEnableJvmMetrics(boolean enableJvmMetrics) {
        this.enableJvmMetrics = enableJvmMetrics;
    }

    public boolean isEnableSystemMetrics() {
        return enableSystemMetrics;
    }

    public void setEnableSystemMetrics(boolean enableSystemMetrics) {
        this.enableSystemMetrics = enableSystemMetrics;
    }

    public boolean isEnableHttpMetrics() {
        return enableHttpMetrics;
    }

    public void setEnableHttpMetrics(boolean enableHttpMetrics) {
        this.enableHttpMetrics = enableHttpMetrics;
    }

    public boolean isEnableDatabaseMetrics() {
        return enableDatabaseMetrics;
    }

    public void setEnableDatabaseMetrics(boolean enableDatabaseMetrics) {
        this.enableDatabaseMetrics = enableDatabaseMetrics;
    }

    public boolean isEnableCacheMetrics() {
        return enableCacheMetrics;
    }

    public void setEnableCacheMetrics(boolean enableCacheMetrics) {
        this.enableCacheMetrics = enableCacheMetrics;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    /**
     * Prometheus-specific properties.
     */
    public static class PrometheusProperties {
        
        /**
         * Enable Prometheus scrape endpoint.
         */
        private boolean enabled = true;

        /**
         * Path for Prometheus scrape endpoint.
         */
        private String path = "/actuator/prometheus";

        /**
         * Whether to include descriptions in metrics output.
         */
        private boolean includeDescriptions = true;

        /**
         * Whether to include timestamps in metrics output.
         */
        private boolean includeTimestamps = true;

        // Getters and Setters

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public boolean isIncludeDescriptions() {
            return includeDescriptions;
        }

        public void setIncludeDescriptions(boolean includeDescriptions) {
            this.includeDescriptions = includeDescriptions;
        }

        public boolean isIncludeTimestamps() {
            return includeTimestamps;
        }

        public void setIncludeTimestamps(boolean includeTimestamps) {
            this.includeTimestamps = includeTimestamps;
        }
    }

    /**
     * Mimir remote write properties.
     */
    public static class MimirProperties {
        
        /**
         * Enable Mimir remote write.
         */
        private boolean enabled = false;

        /**
         * Mimir remote write endpoint URL.
         * Example: http://mimir:9009/api/v1/push
         */
        private String url;

        /**
         * Authentication username (if required).
         */
        private String username;

        /**
         * Authentication password (if required).
         */
        private String password;

        /**
         * Bearer token for authentication (alternative to username/password).
         */
        private String bearerToken;

        /**
         * How often to push metrics to Mimir.
         */
        private Duration step = Duration.ofSeconds(15);

        /**
         * Timeout for push requests.
         */
        private Duration timeout = Duration.ofSeconds(10);

        /**
         * Maximum number of metrics per push request.
         */
        private int batchSize = 1000;

        /**
         * Whether to compress push requests.
         */
        private boolean compressionEnabled = true;

        /**
         * Additional headers to include in push requests.
         */
        private Map<String, String> headers = new HashMap<>();

        /**
         * Number of threads for pushing metrics.
         */
        private int numThreads = 2;

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

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getBearerToken() {
            return bearerToken;
        }

        public void setBearerToken(String bearerToken) {
            this.bearerToken = bearerToken;
        }

        public Duration getStep() {
            return step;
        }

        public void setStep(Duration step) {
            this.step = step;
        }

        public Duration getTimeout() {
            return timeout;
        }

        public void setTimeout(Duration timeout) {
            this.timeout = timeout;
        }

        public int getBatchSize() {
            return batchSize;
        }

        public void setBatchSize(int batchSize) {
            this.batchSize = batchSize;
        }

        public boolean isCompressionEnabled() {
            return compressionEnabled;
        }

        public void setCompressionEnabled(boolean compressionEnabled) {
            this.compressionEnabled = compressionEnabled;
        }

        public Map<String, String> getHeaders() {
            return headers;
        }

        public void setHeaders(Map<String, String> headers) {
            this.headers = headers;
        }

        public int getNumThreads() {
            return numThreads;
        }

        public void setNumThreads(int numThreads) {
            this.numThreads = numThreads;
        }
    }
}
```

### Step 2: Update LgtmProperties

Add metrics properties:

```java
@NestedConfigurationProperty
private MetricsProperties metrics = new MetricsProperties();

public MetricsProperties getMetrics() {
    return metrics;
}

public void setMetrics(MetricsProperties metrics) {
    this.metrics = metrics;
}
```

---

## Implementing Auto-Configuration

### Step 1: Create MetricsAutoConfiguration

Create `MetricsAutoConfiguration.java`:

```java
package com.yourorg.lgtm.autoconfigure.metrics;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.jvm.*;
import io.micrometer.core.instrument.binder.system.*;
import io.micrometer.prometheus.PrometheusConfig;
import io.micrometer.prometheus.PrometheusMeterRegistry;
import io.prometheus.client.exporter.common.TextFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.autoconfigure.metrics.CompositeMeterRegistryAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.metrics.MetricsAutoConfiguration;
import org.springframework.boot.actuate.metrics.export.prometheus.PrometheusScrapeEndpoint;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * Auto-configuration for metrics integration.
 * 
 * <p>Configures Micrometer with Prometheus registry and common metrics.</p>
 */
@AutoConfiguration(after = {
    MetricsAutoConfiguration.class,
    CompositeMeterRegistryAutoConfiguration.class
})
@ConditionalOnClass(MeterRegistry.class)
@ConditionalOnProperty(
    prefix = "lgtm.metrics",
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true
)
@EnableConfigurationProperties(LgtmProperties.class)
public class MetricsAutoConfiguration {

    private static final Logger log = LoggerFactory.getLogger(MetricsAutoConfiguration.class);

    private final LgtmProperties lgtmProperties;

    public MetricsAutoConfiguration(LgtmProperties lgtmProperties) {
        this.lgtmProperties = lgtmProperties;
    }

    /**
     * Customize all meter registries with common tags.
     */
    @Bean
    public MeterRegistryCustomizer meterRegistryCustomizer() {
        return registry -> {
            MetricsProperties metricsProps = lgtmProperties.getMetrics();
            
            // Add application name
            if (lgtmProperties.getApplicationName() != null) {
                registry.config().commonTags("application", lgtmProperties.getApplicationName());
            }
            
            // Add environment
            if (lgtmProperties.getEnvironment() != null) {
                registry.config().commonTags("environment", lgtmProperties.getEnvironment());
            }
            
            // Add common tags from parent
            lgtmProperties.getCommonTags().forEach((key, value) -> 
                registry.config().commonTags(key, value)
            );
            
            // Add metrics-specific common tags
            metricsProps.getCommonTags().forEach((key, value) -> 
                registry.config().commonTags(key, value)
            );
            
            // Add metric prefix if configured
            if (!metricsProps.getPrefix().isEmpty()) {
                registry.config().commonTags("prefix", metricsProps.getPrefix());
            }
            
            log.info("Configured common tags for metrics");
        };
    }

    /**
     * Enable JVM metrics if configured.
     */
    @Bean
    @ConditionalOnProperty(prefix = "lgtm.metrics", name = "enable-jvm-metrics", havingValue = "true", matchIfMissing = true)
    @ConditionalOnMissingBean
    public JvmMetricsConfigurer jvmMetricsConfigurer(MeterRegistry registry) {
        log.info("Enabling JVM metrics");
        
        new JvmMemoryMetrics().bindTo(registry);
        new JvmGcMetrics().bindTo(registry);
        new JvmThreadMetrics().bindTo(registry);
        new ClassLoaderMetrics().bindTo(registry);
        
        return new JvmMetricsConfigurer();
    }

    /**
     * Enable system metrics if configured.
     */
    @Bean
    @ConditionalOnProperty(prefix = "lgtm.metrics", name = "enable-system-metrics", havingValue = "true", matchIfMissing = true)
    @ConditionalOnMissingBean
    public SystemMetricsConfigurer systemMetricsConfigurer(MeterRegistry registry) {
        log.info("Enabling system metrics");
        
        new ProcessorMetrics().bindTo(registry);
        new FileDescriptorMetrics().bindTo(registry);
        new UptimeMetrics().bindTo(registry);
        new DiskSpaceMetrics(new java.io.File(".")).bindTo(registry);
        
        return new SystemMetricsConfigurer();
    }
    
    // Placeholder classes for bean creation
    static class JvmMetricsConfigurer {}
    static class SystemMetricsConfigurer {}
}
```

### Step 2: Create Prometheus Configuration

Create `PrometheusAutoConfiguration.java`:

```java
package com.yourorg.lgtm.autoconfigure.metrics;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import io.micrometer.prometheus.PrometheusConfig;
import io.micrometer.prometheus.PrometheusMeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.autoconfigure.metrics.export.prometheus.PrometheusMetricsExportAutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

/**
 * Auto-configuration for Prometheus scrape endpoint.
 */
@AutoConfiguration(after = PrometheusMetricsExportAutoConfiguration.class)
@ConditionalOnClass(PrometheusMeterRegistry.class)
@ConditionalOnProperty(
    prefix = "lgtm.metrics.prometheus",
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true
)
@EnableConfigurationProperties(LgtmProperties.class)
public class PrometheusAutoConfiguration {

    private static final Logger log = LoggerFactory.getLogger(PrometheusAutoConfiguration.class);

    /**
     * Customize Prometheus configuration.
     */
    @Bean
    public PrometheusConfig prometheusConfig(LgtmProperties lgtmProperties) {
        MetricsProperties.PrometheusProperties prometheusProps = 
            lgtmProperties.getMetrics().getPrometheus();
        
        log.info("Configuring Prometheus scrape endpoint at: {}", prometheusProps.getPath());
        
        return new PrometheusConfig() {
            @Override
            public String get(String key) {
                return null; // Use defaults
            }
            
            @Override
            public boolean descriptions() {
                return prometheusProps.isIncludeDescriptions();
            }
        };
    }
}
```

### Step 3: Create Mimir Configuration

Create `MimirAutoConfiguration.java`:

```java
package com.yourorg.lgtm.autoconfigure.metrics;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import io.micrometer.core.instrument.Clock;
import io.micrometer.prometheus.PrometheusConfig;
import io.micrometer.prometheus.PrometheusMeterRegistry;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.exporter.PushGateway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.IOException;
import java.net.URL;
import java.util.Base64;
import java.util.Map;

/**
 * Auto-configuration for Mimir remote write.
 */
@AutoConfiguration
@ConditionalOnClass(PrometheusMeterRegistry.class)
@ConditionalOnProperty(
    prefix = "lgtm.metrics.mimir",
    name = "enabled",
    havingValue = "true"
)
@EnableConfigurationProperties(LgtmProperties.class)
@EnableScheduling
public class MimirAutoConfiguration {

    private static final Logger log = LoggerFactory.getLogger(MimirAutoConfiguration.class);

    private final LgtmProperties lgtmProperties;
    private final PrometheusMeterRegistry registry;

    public MimirAutoConfiguration(
            LgtmProperties lgtmProperties,
            PrometheusMeterRegistry registry) {
        this.lgtmProperties = lgtmProperties;
        this.registry = registry;
    }

    @Bean
    public MimirPusher mimirPusher() {
        MetricsProperties.MimirProperties mimirProps = lgtmProperties.getMetrics().getMimir();
        
        log.info("Configuring Mimir remote write to: {}", mimirProps.getUrl());
        
        try {
            URL url = new URL(mimirProps.getUrl());
            PushGateway pushGateway = new PushGateway(url);
            
            // Configure authentication if provided
            if (mimirProps.getUsername() != null && mimirProps.getPassword() != null) {
                String auth = mimirProps.getUsername() + ":" + mimirProps.getPassword();
                String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
                pushGateway.setConnectionFactory(connection -> {
                    connection.setRequestProperty("Authorization", "Basic " + encodedAuth);
                });
            } else if (mimirProps.getBearerToken() != null) {
                pushGateway.setConnectionFactory(connection -> {
                    connection.setRequestProperty("Authorization", "Bearer " + mimirProps.getBearerToken());
                });
            }
            
            // Add custom headers
            if (!mimirProps.getHeaders().isEmpty()) {
                pushGateway.setConnectionFactory(connection -> {
                    mimirProps.getHeaders().forEach(connection::setRequestProperty);
                });
            }
            
            return new MimirPusher(pushGateway, registry, lgtmProperties);
        } catch (Exception e) {
            log.error("Failed to configure Mimir remote write", e);
            throw new RuntimeException("Failed to configure Mimir", e);
        }
    }

    /**
     * Pusher service for Mimir.
     */
    public static class MimirPusher {
        private static final Logger log = LoggerFactory.getLogger(MimirPusher.class);
        
        private final PushGateway pushGateway;
        private final PrometheusMeterRegistry registry;
        private final LgtmProperties lgtmProperties;

        public MimirPusher(
                PushGateway pushGateway,
                PrometheusMeterRegistry registry,
                LgtmProperties lgtmProperties) {
            this.pushGateway = pushGateway;
            this.registry = registry;
            this.lgtmProperties = lgtmProperties;
        }

        @Scheduled(fixedDelayString = "#{@lgtmProperties.getMetrics().getMimir().getStep().toMillis()}")
        public void pushMetrics() {
            try {
                CollectorRegistry collectorRegistry = registry.getPrometheusRegistry();
                
                Map<String, String> grouping = Map.of(
                    "application", lgtmProperties.getApplicationName(),
                    "environment", lgtmProperties.getEnvironment()
                );
                
                pushGateway.pushAdd(collectorRegistry, "lgtm", grouping);
                
                log.debug("Successfully pushed metrics to Mimir");
            } catch (IOException e) {
                log.error("Failed to push metrics to Mimir", e);
            }
        }
    }
}
```

---

## Custom Metrics

### Creating Custom Metrics

**1. Counter Example:**
```java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    
    private final Counter orderCounter;
    private final Counter errorCounter;
    
    public OrderService(MeterRegistry registry) {
        this.orderCounter = Counter.builder("orders.created")
            .description("Total orders created")
            .tag("type", "online")
            .register(registry);
        
        this.errorCounter = Counter.builder("orders.errors")
            .description("Total order errors")
            .tag("type", "validation")
            .register(registry);
    }
    
    public void createOrder(Order order) {
        try {
            // Process order...
            orderCounter.increment();
        } catch (ValidationException e) {
            errorCounter.increment();
            throw e;
        }
    }
}
```

**2. Gauge Example:**
```java
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class ConnectionPoolService {
    
    private int activeConnections = 0;
    
    public ConnectionPoolService(MeterRegistry registry) {
        Gauge.builder("database.connections.active", this, ConnectionPoolService::getActiveConnections)
            .description("Number of active database connections")
            .register(registry);
    }
    
    public int getActiveConnections() {
        return activeConnections;
    }
    
    public void acquireConnection() {
        activeConnections++;
    }
    
    public void releaseConnection() {
        activeConnections--;
    }
}
```

**3. Timer Example:**
```java
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    
    private final Timer paymentTimer;
    
    public PaymentService(MeterRegistry registry) {
        this.paymentTimer = Timer.builder("payment.processing.time")
            .description("Time to process payment")
            .tag("provider", "stripe")
            .register(registry);
    }
    
    public Payment processPayment(PaymentRequest request) {
        return paymentTimer.record(() -> {
            // Process payment...
            return new Payment();
        });
    }
}
```

**4. Distribution Summary Example:**
```java
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    
    private final DistributionSummary orderValueSummary;
    
    public OrderService(MeterRegistry registry) {
        this.orderValueSummary = DistributionSummary.builder("order.value")
            .description("Distribution of order values")
            .baseUnit("dollars")
            .serviceLevelObjectives(50, 100, 200, 500, 1000)
            .register(registry);
    }
    
    public void recordOrder(Order order) {
        orderValueSummary.record(order.getTotalValue());
    }
}
```

### Using @Timed Annotation

```java
import io.micrometer.core.annotation.Timed;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Timed(
        value = "user.lookup.time",
        description = "Time to lookup user",
        histogram = true,
        percentiles = {0.5, 0.95, 0.99}
    )
    public User findUser(String id) {
        // Lookup user...
        return new User(id);
    }
}
```

Enable @Timed support:
```java
@Configuration
public class TimedConfig {
    
    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }
}
```

---

## Testing Metrics Integration

### Step 1: Set Up Local Prometheus

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.48.0
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'

  grafana:
    image: grafana/grafana:10.2.2
    ports:
      - "3000:3000"
    environment:
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
    volumes:
      - ./grafana-datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml
      - grafana-data:/var/lib/grafana

volumes:
  prometheus-data:
  grafana-data:
```

Create `prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'lgtm-test-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['host.docker.internal:8080']
        labels:
          application: 'lgtm-test-app'
          environment: 'local'
```

### Step 2: Configure Test Application

Update `application.yml`:

```yaml
spring:
  application:
    name: lgtm-test-app

lgtm:
  enabled: true
  application-name: ${spring.application.name}
  environment: local
  
  metrics:
    enabled: true
    prefix: myapp
    enable-jvm-metrics: true
    enable-system-metrics: true
    enable-http-metrics: true
    
    common-tags:
      team: platform
      version: 1.0.0
    
    prometheus:
      enabled: true
      path: /actuator/prometheus
      include-descriptions: true
    
    mimir:
      enabled: false
      # url: http://localhost:9009/api/v1/push
      # step: 15s

management:
  endpoints:
    web:
      exposure:
        include: "*"
  metrics:
    tags:
      application: ${spring.application.name}
```

### Step 3: Create Test Controller with Metrics

```java
package com.example.lgtmtest;

import io.micrometer.core.annotation.Timed;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.web.bind.annotation.*;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/metrics")
public class MetricsTestController {
    
    private final Counter requestCounter;
    private final Counter errorCounter;
    private final Timer customTimer;
    private final DistributionSummary responseSizeSummary;
    private final AtomicInteger activeRequests = new AtomicInteger(0);
    private final Random random = new Random();
    
    public MetricsTestController(MeterRegistry registry) {
        this.requestCounter = Counter.builder("custom.requests.total")
            .description("Total custom requests")
            .tag("endpoint", "test")
            .register(registry);
        
        this.errorCounter = Counter.builder("custom.errors.total")
            .description("Total custom errors")
            .register(registry);
        
        this.customTimer = Timer.builder("custom.operation.time")
            .description("Custom operation duration")
            .register(registry);
        
        this.responseSizeSummary = DistributionSummary.builder("custom.response.size")
            .description("Response size distribution")
            .baseUnit("bytes")
            .register(registry);
        
        Gauge.builder("custom.active.requests", activeRequests, AtomicInteger::get)
            .description("Currently active requests")
            .register(registry);
    }
    
    @GetMapping("/test")
    @Timed(value = "api.test.time", histogram = true)
    public String test() {
        activeRequests.incrementAndGet();
        try {
            requestCounter.increment();
            simulateWork(100);
            
            String response = "Test response";
            responseSizeSummary.record(response.length());
            
            return response;
        } finally {
            activeRequests.decrementAndGet();
        }
    }
    
    @GetMapping("/custom-timer")
    public String customTimer() {
        return customTimer.record(() -> {
            simulateWork(random.nextInt(300));
            return "Timed operation completed";
        });
    }
    
    @GetMapping("/error")
    public String error() {
        errorCounter.increment();
        throw new RuntimeException("Simulated error");
    }
    
    @GetMapping("/load")
    public String generateLoad(@RequestParam(defaultValue = "100") int count) {
        for (int i = 0; i < count; i++) {
            requestCounter.increment();
            responseSizeSummary.record(random.nextInt(1000));
        }
        return "Generated " + count + " metric entries";
    }
    
    private void simulateWork(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

### Step 4: Run Tests

1. **Start services:**
```bash
docker-compose up -d
```

2. **Start application:**
```bash
mvn spring-boot:run
```

3. **Generate metrics:**
```bash
# Normal requests
for i in {1..100}; do curl http://localhost:8080/api/metrics/test; done

# Timed operations
for i in {1..50}; do curl http://localhost:8080/api/metrics/custom-timer; done

# Errors
for i in {1..10}; do curl http://localhost:8080/api/metrics/error || true; done

# Load test
curl "http://localhost:8080/api/metrics/load?count=1000"
```

4. **Check Prometheus:**
   - Open http://localhost:9090
   - Query examples:
   ```promql
   # Request rate
   rate(custom_requests_total[1m])
   
   # Error rate
   rate(custom_errors_total[1m])
   
   # P95 latency
   histogram_quantile(0.95, rate(custom_operation_time_bucket[5m]))
   
   # Active requests
   custom_active_requests
   
   # JVM memory
   jvm_memory_used_bytes{area="heap"}
   ```

5. **Check in Grafana:**
   - Open http://localhost:3000
   - Create dashboard with queries above
   - Visualize metrics

---

## Advanced Metrics Features

### Feature 1: Dynamic Tags

Add tags based on runtime conditions:

```java
@Service
public class DynamicTagService {
    
    private final MeterRegistry registry;
    
    public DynamicTagService(MeterRegistry registry) {
        this.registry = registry;
    }
    
    public void recordRequest(String userId, String region) {
        Counter.builder("requests.by.user")
            .tag("region", region)
            .tag("user_tier", getUserTier(userId))
            .register(registry)
            .increment();
    }
    
    private String getUserTier(String userId) {
        // Determine user tier...
        return "premium";
    }
}
```

### Feature 2: Percentile Histograms

Track distribution with percentiles:

```java
Timer timer = Timer.builder("api.request.duration")
    .publishPercentiles(0.5, 0.75, 0.95, 0.99)
    .publishPercentileHistogram()
    .register(registry);
```

### Feature 3: Service Level Objectives (SLOs)

Define SLOs for metrics:

```java
DistributionSummary.builder("order.processing.time")
    .serviceLevelObjectives(
        Duration.ofMillis(100).toNanos(),
        Duration.ofMillis(500).toNanos(),
        Duration.ofSeconds(1).toNanos()
    )
    .register(registry);
```

### Feature 4: Composite Metrics

Calculate metrics from multiple sources:

```java
@Component
public class CompositeMetrics {
    
    public CompositeMetrics(MeterRegistry registry) {
        Gauge.builder("cache.hit.ratio", this, CompositeMetrics::calculateHitRatio)
            .register(registry);
    }
    
    private double calculateHitRatio() {
        long hits = cacheService.getHits();
        long misses = cacheService.getMisses();
        return hits / (double) (hits + misses);
    }
}
```

---

## Summary

In this part, you learned:
- ✅ Understanding metrics types and use cases
- ✅ Difference between Prometheus and Mimir
- ✅ Created comprehensive metrics configuration
- ✅ Implemented Prometheus scrape endpoint
- ✅ Implemented Mimir remote write
- ✅ Creating custom metrics (counters, gauges, timers)
- ✅ Testing metrics with Prometheus and Grafana
- ✅ Advanced metrics features

**Next**: Part 4 - Advanced features (correlation, dashboards, health indicators).

## Additional Resources

- [Micrometer Documentation](https://micrometer.io/docs)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Mimir Documentation](https://grafana.com/docs/mimir/latest/)
- [Spring Boot Metrics](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.metrics)
