---
title: "Part 4: Advanced Features and Integration"
subtitle: "Correlate Logs and Traces, Create Health Indicators, and Provision Grafana Dashboards"
excerpt: "Elevate your observability starter with advanced features. Learn to automatically correlate logs and traces, implement custom health indicators for the LGTM stack, use exemplars to link metrics to traces, and programmatically provision Grafana dashboards."
date: 2025-09-06
author: "Abu Dhahir"
tags: ["Spring Boot", "Grafana", "Observability", "Correlation", "Health Indicator"]
series: "Building a Spring Boot Starter for LGTM"
draft: false
---
# Part 4: Advanced Features and Integration

## Table of Contents
1. [Correlation Across Signals](#correlation-across-signals)
2. [Health Indicators](#health-indicators)
3. [Pre-built Dashboards](#pre-built-dashboards)
4. [Exemplars](#exemplars)
5. [Context Propagation](#context-propagation)
6. [Custom Annotations](#custom-annotations)
7. [Performance Optimization](#performance-optimization)

---

## Correlation Across Signals

### The Power of Correlation

The true value of LGTM comes from correlating logs, traces, and metrics:

```
User reports slow checkout → 
Check metrics (high latency) → 
Find affected traces → 
Jump to logs for error details
```

### Implementing Trace-Log Correlation

#### Step 1: Add Trace ID to Logs

Create `TraceIdEnhancer.java`:

```java
package com.yourorg.lgtm.autoconfigure.correlation;

import brave.baggage.BaggageField;
import io.micrometer.tracing.Tracer;
import org.slf4j.MDC;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

/**
 * Automatically adds trace and span IDs to MDC for log correlation.
 */
@Component
@ConditionalOnClass(Tracer.class)
public class TraceIdEnhancer {
    
    private final Tracer tracer;
    
    public TraceIdEnhancer(Tracer tracer) {
        this.tracer = tracer;
    }
    
    @PostConstruct
    public void enhanceMDC() {
        // This runs on every request due to servlet filters
    }
    
    /**
     * Add trace context to MDC.
     */
    public void addToMDC() {
        if (tracer != null && tracer.currentSpan() != null) {
            String traceId = tracer.currentSpan().context().traceId();
            String spanId = tracer.currentSpan().context().spanId();
            
            MDC.put("trace_id", traceId);
            MDC.put("span_id", spanId);
        }
    }
    
    /**
     * Clear trace context from MDC.
     */
    public void clearMDC() {
        MDC.remove("trace_id");
        MDC.remove("span_id");
    }
}
```

#### Step 2: Create Servlet Filter

```java
package com.yourorg.lgtm.autoconfigure.correlation;

import io.micrometer.tracing.Tracer;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Servlet filter to add trace IDs to MDC for every request.
 */
@Component
@ConditionalOnWebApplication
@ConditionalOnClass(Tracer.class)
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class TraceContextFilter implements Filter {
    
    private final Tracer tracer;
    
    public TraceContextFilter(Tracer tracer) {
        this.tracer = tracer;
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        try {
            if (tracer.currentSpan() != null) {
                String traceId = tracer.currentSpan().context().traceId();
                String spanId = tracer.currentSpan().context().spanId();
                
                MDC.put("trace_id", traceId);
                MDC.put("span_id", spanId);
                
                // Add to request attributes for template access
                if (request instanceof HttpServletRequest) {
                    ((HttpServletRequest) request).setAttribute("traceId", traceId);
                }
            }
            
            chain.doFilter(request, response);
        } finally {
            MDC.remove("trace_id");
            MDC.remove("span_id");
        }
    }
}
```

#### Step 3: Update Loki Configuration

Modify `LokiAppenderConfigurer` to include trace ID:

```java
private String buildMessagePattern() {
    return "{"
        + "\"timestamp\":\"%d{ISO8601}\","
        + "\"level\":\"%level\","
        + "\"trace_id\":\"%X{trace_id:-}\","  // Add trace ID from MDC
        + "\"span_id\":\"%X{span_id:-}\","    // Add span ID from MDC
        + "\"logger\":\"%logger{36}\","
        + "\"thread\":\"%thread\","
        + "\"message\":\"%message\","
        + "\"exception\":\"%exception{full}\""
        + "}";
}
```

#### Step 4: Update Tempo to Include Log Links

Add configuration to link traces to logs:

```java
@Bean
public OpenTelemetry openTelemetry(SdkTracerProvider tracerProvider) {
    // ... existing configuration
    
    // Add span processor to attach log references
    tracerProvider.addSpanProcessor(new LogLinkSpanProcessor(lgtmProperties));
    
    return OpenTelemetrySdk.builder()
        .setTracerProvider(tracerProvider)
        .build();
}
```

```java
package com.yourorg.lgtm.autoconfigure.correlation;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import io.opentelemetry.context.Context;
import io.opentelemetry.sdk.trace.ReadWriteSpan;
import io.opentelemetry.sdk.trace.ReadableSpan;
import io.opentelemetry.sdk.trace.SpanProcessor;

/**
 * Attaches log query links to spans for easy navigation from traces to logs.
 */
public class LogLinkSpanProcessor implements SpanProcessor {
    
    private final LgtmProperties lgtmProperties;
    
    public LogLinkSpanProcessor(LgtmProperties lgtmProperties) {
        this.lgtmProperties = lgtmProperties;
    }
    
    @Override
    public void onStart(Context parentContext, ReadWriteSpan span) {
        // Add log query as span attribute
        String traceId = span.getSpanContext().getTraceId();
        String logQuery = String.format(
            "{trace_id=\"%s\"}", 
            traceId
        );
        span.setAttribute("loki.query", logQuery);
    }
    
    @Override
    public boolean isStartRequired() {
        return true;
    }
    
    @Override
    public void onEnd(ReadableSpan span) {
        // Nothing to do on end
    }
    
    @Override
    public boolean isEndRequired() {
        return false;
    }
}
```

### Using Correlation in Grafana

**In Grafana Explore:**

1. **Find trace with high latency:**
```
Service: my-app
Duration: > 1s
```

2. **Click on trace to view details**

3. **See trace ID in span attributes**

4. **Click "Logs for this span" button**

5. **Grafana automatically queries Loki:**
```logql
{app="my-app"} | json | trace_id="abc123"
```

---

## Health Indicators

### Creating LGTM Health Indicator

Create `LgtmHealthIndicator.java`:

```java
package com.yourorg.lgtm.autoconfigure.health;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Health indicator for LGTM stack connectivity.
 */
@Component("lgtm")
@ConditionalOnClass(HealthIndicator.class)
public class LgtmHealthIndicator implements HealthIndicator {
    
    private final LgtmProperties lgtmProperties;
    
    public LgtmHealthIndicator(LgtmProperties lgtmProperties) {
        this.lgtmProperties = lgtmProperties;
    }
    
    @Override
    public Health health() {
        Health.Builder builder = Health.up();
        
        // Check Loki
        if (lgtmProperties.getLoki().isEnabled()) {
            boolean lokiHealthy = checkLoki();
            builder.withDetail("loki", lokiHealthy ? "UP" : "DOWN");
            if (!lokiHealthy) {
                builder.down();
            }
        }
        
        // Check Tempo
        if (lgtmProperties.getTempo().isEnabled()) {
            boolean tempoHealthy = checkTempo();
            builder.withDetail("tempo", tempoHealthy ? "UP" : "DOWN");
            if (!tempoHealthy) {
                builder.down();
            }
        }
        
        // Check Prometheus/Mimir
        if (lgtmProperties.getMetrics().getMimir().isEnabled()) {
            boolean mimirHealthy = checkMimir();
            builder.withDetail("mimir", mimirHealthy ? "UP" : "DOWN");
            if (!mimirHealthy) {
                builder.down();
            }
        }
        
        return builder.build();
    }
    
    private boolean checkLoki() {
        try {
            String url = lgtmProperties.getLoki().getUrl() + "/ready";
            return checkEndpoint(url);
        } catch (Exception e) {
            return false;
        }
    }
    
    private boolean checkTempo() {
        try {
            // Tempo doesn't have a health endpoint on OTLP port
            // Just return true if configured
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private boolean checkMimir() {
        try {
            String url = lgtmProperties.getMetrics().getMimir().getUrl();
            return checkEndpoint(url);
        } catch (Exception e) {
            return false;
        }
    }
    
    private boolean checkEndpoint(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(5000);
        
        int responseCode = connection.getResponseCode();
        return responseCode >= 200 && responseCode < 300;
    }
}
```

Enable in `application.yml`:

```yaml
management:
  endpoint:
    health:
      show-details: always
  health:
    lgtm:
      enabled: true
```

Check health:
```bash
curl http://localhost:8080/actuator/health
```

Response:
```json
{
  "status": "UP",
  "components": {
    "lgtm": {
      "status": "UP",
      "details": {
        "loki": "UP",
        "tempo": "UP",
        "mimir": "UP"
      }
    }
  }
}
```

---

## Pre-built Dashboards

### Creating Dashboard JSON Templates

Create dashboard directory structure:
```
src/main/resources/
└── dashboards/
    ├── spring-boot-overview.json
    ├── jvm-metrics.json
    └── http-metrics.json
```

#### Spring Boot Overview Dashboard

Create `spring-boot-overview.json`:

```json
{
  "dashboard": {
    "title": "Spring Boot Application Overview",
    "tags": ["spring-boot", "lgtm"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_server_requests_seconds_count{application=\"$application\"}[5m])",
            "legendFormat": "{{method}} {{uri}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 0}
      },
      {
        "id": 2,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_server_requests_seconds_count{application=\"$application\",status=~\"5..\"}[5m])",
            "legendFormat": "{{uri}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 0}
      },
      {
        "id": 3,
        "title": "P95 Latency",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_server_requests_seconds_bucket{application=\"$application\"}[5m]))",
            "legendFormat": "{{uri}}"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8}
      },
      {
        "id": 4,
        "title": "JVM Heap Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "jvm_memory_used_bytes{application=\"$application\",area=\"heap\"} / jvm_memory_max_bytes{application=\"$application\",area=\"heap\"} * 100",
            "legendFormat": "Heap Usage %"
          }
        ],
        "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8}
      }
    ],
    "templating": {
      "list": [
        {
          "name": "application",
          "type": "query",
          "query": "label_values(http_server_requests_seconds_count, application)",
          "current": {},
          "refresh": 1
        }
      ]
    }
  }
}
```

### Dashboard Provisioning Service

Create `DashboardProvisioningService.java`:

```java
package com.yourorg.lgtm.autoconfigure.dashboards;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * Automatically provisions dashboards to Grafana.
 */
@Component
public class DashboardProvisioningService {
    
    private static final Logger log = LoggerFactory.getLogger(DashboardProvisioningService.class);
    
    private final LgtmProperties lgtmProperties;
    private final ObjectMapper objectMapper;
    
    public DashboardProvisioningService(LgtmProperties lgtmProperties) {
        this.lgtmProperties = lgtmProperties;
        this.objectMapper = new ObjectMapper();
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void provisionDashboards() {
        if (!lgtmProperties.getDashboards().isAutoProvision()) {
            log.info("Dashboard auto-provisioning disabled");
            return;
        }
        
        try {
            log.info("Provisioning dashboards to Grafana...");
            
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:dashboards/*.json");
            
            for (Resource resource : resources) {
                try {
                    provisionDashboard(resource);
                } catch (Exception e) {
                    log.warn("Failed to provision dashboard: {}", resource.getFilename(), e);
                }
            }
            
            log.info("Dashboard provisioning completed");
        } catch (IOException e) {
            log.error("Failed to provision dashboards", e);
        }
    }
    
    private void provisionDashboard(Resource resource) throws IOException {
        String dashboardJson = readResource(resource);
        
        // Replace variables in dashboard
        dashboardJson = dashboardJson
            .replace("$application", lgtmProperties.getApplicationName())
            .replace("$environment", lgtmProperties.getEnvironment());
        
        // Post to Grafana API
        String grafanaUrl = lgtmProperties.getDashboards().getGrafanaUrl();
        String apiKey = lgtmProperties.getDashboards().getGrafanaApiKey();
        
        URL url = new URL(grafanaUrl + "/api/dashboards/db");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Authorization", "Bearer " + apiKey);
        connection.setDoOutput(true);
        
        connection.getOutputStream().write(dashboardJson.getBytes(StandardCharsets.UTF_8));
        
        int responseCode = connection.getResponseCode();
        if (responseCode >= 200 && responseCode < 300) {
            log.info("Provisioned dashboard: {}", resource.getFilename());
        } else {
            log.warn("Failed to provision dashboard: {} (HTTP {})", 
                     resource.getFilename(), responseCode);
        }
    }
    
    private String readResource(Resource resource) throws IOException {
        try (InputStream is = resource.getInputStream()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
```

Add dashboard properties:

```java
public static class DashboardProperties {
    private boolean autoProvision = false;
    private String grafanaUrl = "http://localhost:3000";
    private String grafanaApiKey;
    
    // Getters and setters...
}
```

---

## Exemplars

### What are Exemplars?

Exemplars link metrics to traces:

```
Metric: http_request_duration_seconds{status="500"} = 1.5s
Exemplar: trace_id="abc123", span_id="xyz789"
                    ↓
        Click to view full trace
```

### Enabling Exemplars

#### Step 1: Configure Prometheus

```java
@Bean
public PrometheusConfig prometheusConfig() {
    return new PrometheusConfig() {
        @Override
        public String get(String key) {
            return null;
        }
        
        @Override
        public boolean histogramFlavor() {
            return HistogramFlavor.Prometheus;
        }
    };
}
```

#### Step 2: Add Exemplar Support to Meters

```java
@Service
public class ExemplarService {
    
    private final MeterRegistry registry;
    private final Tracer tracer;
    
    public ExemplarService(MeterRegistry registry, Tracer tracer) {
        this.registry = registry;
        this.tracer = tracer;
    }
    
    public void recordWithExemplar(String metricName, double value) {
        Timer timer = Timer.builder(metricName)
            .publishPercentileHistogram()
            .register(registry);
        
        // Record with current trace context as exemplar
        if (tracer.currentSpan() != null) {
            String traceId = tracer.currentSpan().context().traceId();
            timer.record(Duration.ofMillis((long) value));
        }
    }
}
```

#### Step 3: Configure Grafana Datasource

Update `grafana-datasources.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    jsonData:
      exemplarTraceIdDestinations:
        - datasourceUid: tempo
          name: trace_id
  
  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    uid: tempo
```

---

## Context Propagation

### Propagating Context Between Services

#### Step 1: Configure RestTemplate with Tracing

```java
@Configuration
public class RestTemplateTracingConfig {
    
    @Bean
    public RestTemplate tracedRestTemplate(RestTemplateBuilder builder, Tracer tracer) {
        return builder
            .interceptors((request, body, execution) -> {
                // Inject trace context into headers
                if (tracer.currentSpan() != null) {
                    String traceId = tracer.currentSpan().context().traceId();
                    String spanId = tracer.currentSpan().context().spanId();
                    
                    request.getHeaders().add("traceparent", 
                        String.format("00-%s-%s-01", traceId, spanId));
                }
                
                return execution.execute(request, body);
            })
            .build();
    }
}
```

#### Step 2: Configure WebClient with Tracing

```java
@Configuration
public class WebClientTracingConfig {
    
    @Bean
    public WebClient tracedWebClient(WebClient.Builder builder, Tracer tracer) {
        return builder
            .filter((request, next) -> {
                if (tracer.currentSpan() != null) {
                    String traceId = tracer.currentSpan().context().traceId();
                    String spanId = tracer.currentSpan().context().spanId();
                    
                    ClientRequest filtered = ClientRequest.from(request)
                        .header("traceparent", 
                            String.format("00-%s-%s-01", traceId, spanId))
                        .build();
                    
                    return next.exchange(filtered);
                }
                return next.exchange(request);
            })
            .build();
    }
}
```

---

## Custom Annotations

### @ObserveOperation Annotation

Create a powerful annotation combining logging, tracing, and metrics:

```java
package com.yourorg.lgtm.autoconfigure.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to automatically observe operations with logs, traces, and metrics.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ObserveOperation {
    
    /**
     * Operation name. Defaults to method name.
     */
    String name() default "";
    
    /**
     * Whether to log method entry/exit.
     */
    boolean logExecution() default true;
    
    /**
     * Whether to create a span for this operation.
     */
    boolean createSpan() default true;
    
    /**
     * Whether to record execution time as a metric.
     */
    boolean recordMetric() default true;
    
    /**
     * Whether to include method parameters in logs/spans.
     */
    boolean includeParameters() default false;
    
    /**
     * Log level for success.
     */
    LogLevel successLevel() default LogLevel.INFO;
    
    /**
     * Log level for errors.
     */
    LogLevel errorLevel() default LogLevel.ERROR;
    
    enum LogLevel {
        TRACE, DEBUG, INFO, WARN, ERROR
    }
}
```

### ObserveOperationAspect

```java
package com.yourorg.lgtm.autoconfigure.annotations;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;

@Aspect
@Component
public class ObserveOperationAspect {
    
    private final ObservationRegistry observationRegistry;
    private final MeterRegistry meterRegistry;
    
    public ObserveOperationAspect(
            ObservationRegistry observationRegistry,
            MeterRegistry meterRegistry) {
        this.observationRegistry = observationRegistry;
        this.meterRegistry = meterRegistry;
    }
    
    @Around("@annotation(observeOperation)")
    public Object observe(ProceedingJoinPoint pjp, ObserveOperation observeOperation) throws Throwable {
        String operationName = getOperationName(pjp, observeOperation);
        Logger logger = LoggerFactory.getLogger(pjp.getTarget().getClass());
        
        // Log entry
        if (observeOperation.logExecution()) {
            logMethodEntry(logger, operationName, pjp, observeOperation);
        }
        
        Instant start = Instant.now();
        Timer.Sample sample = Timer.start(meterRegistry);
        
        try {
            // Execute with observation (creates span if tracing enabled)
            Object result = observeOperation.createSpan() 
                ? executeWithObservation(pjp, operationName)
                : pjp.proceed();
            
            // Log success
            if (observeOperation.logExecution()) {
                Duration duration = Duration.between(start, Instant.now());
                logMethodExit(logger, operationName, duration, observeOperation.successLevel());
            }
            
            // Record metric
            if (observeOperation.recordMetric()) {
                sample.stop(Timer.builder("operation.duration")
                    .tag("operation", operationName)
                    .tag("status", "success")
                    .register(meterRegistry));
            }
            
            return result;
        } catch (Throwable throwable) {
            // Log error
            if (observeOperation.logExecution()) {
                Duration duration = Duration.between(start, Instant.now());
                logMethodError(logger, operationName, duration, throwable, observeOperation.errorLevel());
            }
            
            // Record metric
            if (observeOperation.recordMetric()) {
                sample.stop(Timer.builder("operation.duration")
                    .tag("operation", operationName)
                    .tag("status", "error")
                    .tag("exception", throwable.getClass().getSimpleName())
                    .register(meterRegistry));
            }
            
            throw throwable;
        }
    }
    
    private Object executeWithObservation(ProceedingJoinPoint pjp, String operationName) throws Throwable {
        return Observation
            .createNotStarted(operationName, observationRegistry)
            .lowCardinalityKeyValue("operation", operationName)
            .observe(() -> {
                try {
                    return pjp.proceed();
                } catch (Throwable e) {
                    throw new RuntimeException(e);
                }
            });
    }
    
    private String getOperationName(ProceedingJoinPoint pjp, ObserveOperation annotation) {
        if (!annotation.name().isEmpty()) {
            return annotation.name();
        }
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        return signature.getDeclaringType().getSimpleName() + "." + signature.getMethod().getName();
    }
    
    private void logMethodEntry(Logger logger, String operationName, 
                                 ProceedingJoinPoint pjp, ObserveOperation annotation) {
        if (annotation.includeParameters()) {
            logger.info("Entering {}, parameters: {}", operationName, Arrays.toString(pjp.getArgs()));
        } else {
            logger.info("Entering {}", operationName);
        }
    }
    
    private void logMethodExit(Logger logger, String operationName, 
                               Duration duration, ObserveOperation.LogLevel level) {
        String message = String.format("Exiting %s, duration: %dms", operationName, duration.toMillis());
        logAtLevel(logger, level, message);
    }
    
    private void logMethodError(Logger logger, String operationName, Duration duration,
                                Throwable throwable, ObserveOperation.LogLevel level) {
        String message = String.format("Error in %s after %dms", operationName, duration.toMillis());
        logAtLevel(logger, level, message, throwable);
    }
    
    private void logAtLevel(Logger logger, ObserveOperation.LogLevel level, String message) {
        switch (level) {
            case TRACE -> logger.trace(message);
            case DEBUG -> logger.debug(message);
            case INFO -> logger.info(message);
            case WARN -> logger.warn(message);
            case ERROR -> logger.error(message);
        }
    }
    
    private void logAtLevel(Logger logger, ObserveOperation.LogLevel level, 
                           String message, Throwable throwable) {
        switch (level) {
            case TRACE -> logger.trace(message, throwable);
            case DEBUG -> logger.debug(message, throwable);
            case INFO -> logger.info(message, throwable);
            case WARN -> logger.warn(message, throwable);
            case ERROR -> logger.error(message, throwable);
        }
    }
}
```

### Usage

```java
@Service
public class OrderService {
    
    @ObserveOperation(
        name = "order.process",
        logExecution = true,
        createSpan = true,
        recordMetric = true,
        includeParameters = true
    )
    public Order processOrder(String orderId, OrderRequest request) {
        // Method automatically logged, traced, and metered!
        validateOrder(request);
        saveOrder(orderId, request);
        return new Order(orderId);
    }
}
```

This single annotation provides:
- ✅ Entry/exit logging
- ✅ Distributed tracing span
- ✅ Duration metrics
- ✅ Error logging
- ✅ Exception metrics

---

## Performance Optimization

### 1. Sampling Strategies

Don't trace everything:

```yaml
lgtm:
  tempo:
    sampling-strategy: parent_based
    sampling-probability: 0.1  # 10% sampling
```

### 2. Async Logging

Use async appenders:

```java
private Loki4jAppender createAppender(LoggerContext context) {
    Loki4jAppender appender = new Loki4jAppender();
    // ... configuration
    appender.setAsync(true);  // Enable async
    return appender;
}
```

### 3. Batch Configuration

Optimize batch sizes:

```yaml
lgtm:
  loki:
    batch-size: 500  # Larger batches
    batch-timeout: 10s
  
  tempo:
    max-batch-size: 1000
    batch-timeout: 5s
```

### 4. Metric Cardinality

Limit tag combinations:

```java
// BAD - High cardinality
counter.tag("user_id", userId);  // Thousands of users

// GOOD - Low cardinality
counter.tag("user_tier", getUserTier(userId));  // Few tiers
```

### 5. Conditional Instrumentation

Only instrument in certain environments:

```java
@Bean
@Profile("production")
public SpanProcessor productionSpanProcessor() {
    return BatchSpanProcessor.builder(spanExporter)
        .setMaxQueueSize(10000)
        .setMaxExportBatchSize(1000)
        .build();
}

@Bean
@Profile("!production")
public SpanProcessor developmentSpanProcessor() {
    return BatchSpanProcessor.builder(spanExporter)
        .setMaxQueueSize(100)
        .setMaxExportBatchSize(10)
        .build();
}
```

---

## Summary

In this part, you learned:
- ✅ Correlating logs, traces, and metrics
- ✅ Creating health indicators for LGTM components
- ✅ Building pre-built Grafana dashboards
- ✅ Using exemplars to link metrics to traces
- ✅ Propagating context between services
- ✅ Creating powerful custom annotations
- ✅ Optimizing performance

**Next**: Part 5 - Testing, deployment, and best practices.

## Additional Resources

- [Grafana Exemplars](https://grafana.com/docs/grafana/latest/fundamentals/exemplars/)
- [OpenTelemetry Context Propagation](https://opentelemetry.io/docs/instrumentation/java/manual/#context-propagation)
- [Micrometer Best Practices](https://micrometer.io/docs/concepts#_naming_meters)
