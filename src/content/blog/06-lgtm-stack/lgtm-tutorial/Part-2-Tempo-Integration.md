---
title: "Part 2: Tempo Integration - Distributed Tracing"
date: "2024-12-18"
excerpt: "Implements Tempo tracing support with OpenTelemetry setup, span instrumentation, configuration, and advanced propagation patterns."
tags: ["Tutorial", "Java", "Spring", "Observability", "Tracing"]
author: "Abudhahir"
featured: false
readTime: "16 min read"
series: "LGTM Starter Tutorial"
draft: false
---
# Part 2: Tempo Integration - Distributed Tracing

## Table of Contents
1. [Understanding Distributed Tracing](#understanding-distributed-tracing)
2. [Tempo Architecture](#tempo-architecture)
3. [OpenTelemetry Integration](#opentelemetry-integration)
4. [Creating Tempo Properties](#creating-tempo-properties)
5. [Implementing Auto-Configuration](#implementing-auto-configuration)
6. [Span Instrumentation](#span-instrumentation)
7. [Testing Tempo Integration](#testing-tempo-integration)
8. [Advanced Tracing Features](#advanced-tracing-features)

---

## Understanding Distributed Tracing

### What is Distributed Tracing?

Distributed tracing tracks a request as it flows through multiple services in a microservices architecture. It helps answer:
- Where is the bottleneck?
- Which service is failing?
- How long does each operation take?
- What's the call path through the system?

### Key Concepts

**1. Trace**: A complete request journey across services
```
Trace ID: abc123
├── Span: API Gateway (200ms)
│   ├── Span: Auth Service (50ms)
│   └── Span: Order Service (150ms)
│       ├── Span: Database Query (100ms)
│       └── Span: Payment Service (50ms)
```

**2. Span**: A single unit of work
- Has a start and end time
- Contains metadata (tags/attributes)
- Can have parent-child relationships
- Represents an operation (HTTP request, database query, etc.)

**3. Context Propagation**: Passing trace information between services
```
Service A → HTTP Header [trace-id: abc123, span-id: xyz789] → Service B
```

### Why Tempo?

**Tempo vs Jaeger/Zipkin:**
- ✅ Designed for Grafana ecosystem
- ✅ Uses object storage (S3/GCS) - cost-effective
- ✅ No database required
- ✅ TraceQL query language
- ✅ Native integration with Loki and Prometheus

**Tempo's Architecture:**
```
Application → OTLP → Tempo → Object Storage
                                    ↓
                              Grafana (Query)
```

---

## Tempo Architecture

### OTLP (OpenTelemetry Protocol)

OTLP is the standard protocol for sending telemetry data:
- **gRPC** (default, efficient)
- **HTTP** (firewall-friendly)

**OTLP Endpoint Structure:**
- gRPC: `http://tempo:4317`
- HTTP: `http://tempo:4318/v1/traces`

### Tempo Components

1. **Distributor**: Receives traces from applications
2. **Ingester**: Batches and writes traces
3. **Querier**: Queries traces
4. **Compactor**: Optimizes storage

For our starter, we only need to send to the distributor.

---

## OpenTelemetry Integration

### Why OpenTelemetry?

OpenTelemetry (OTel) is the industry standard for observability:
- Vendor-neutral
- Supports multiple languages
- Automatic instrumentation available
- Active community

### Spring Boot + OpenTelemetry

Spring Boot 3.x has excellent OpenTelemetry support through Micrometer:
```
Spring App → Micrometer Observation API → OTel Bridge → OTLP Exporter → Tempo
```

**Key Libraries:**
1. `micrometer-tracing-bridge-otel`: Bridges Micrometer to OTel
2. `opentelemetry-exporter-otlp`: Sends traces via OTLP
3. `opentelemetry-sdk`: Core OTel functionality

---

## Creating Tempo Properties

### Step 1: Create TempoProperties

Create `TempoProperties.java` in `autoconfigure/tempo/`:

```java
package com.yourorg.lgtm.autoconfigure.tempo;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration properties for Tempo distributed tracing.
 * 
 * <p>Binds to properties with prefix 'lgtm.tempo'</p>
 * 
 * <p>Example configuration:</p>
 * <pre>
 * lgtm:
 *   tempo:
 *     enabled: true
 *     endpoint: http://localhost:4317
 *     sampling-probability: 0.1
 *     protocol: grpc
 * </pre>
 */
public class TempoProperties {

    /**
     * Enable or disable Tempo integration.
     */
    private boolean enabled = true;

    /**
     * Tempo OTLP endpoint URL.
     * For gRPC: http://tempo:4317
     * For HTTP: http://tempo:4318
     */
    private String endpoint = "http://localhost:4317";

    /**
     * Protocol to use for sending traces.
     * Options: grpc, http
     */
    private Protocol protocol = Protocol.GRPC;

    /**
     * Sampling probability (0.0 to 1.0).
     * 1.0 = 100% sampling (all traces)
     * 0.1 = 10% sampling (1 in 10 traces)
     * 0.0 = No sampling (no traces)
     */
    private double samplingProbability = 0.1;

    /**
     * Sampling strategy.
     * Options: always_on, always_off, trace_id_ratio, parent_based
     */
    private SamplingStrategy samplingStrategy = SamplingStrategy.TRACE_ID_RATIO;

    /**
     * Timeout for sending spans to Tempo.
     */
    private Duration timeout = Duration.ofSeconds(10);

    /**
     * Compression type for OTLP.
     * Options: none, gzip
     */
    private Compression compression = Compression.GZIP;

    /**
     * Maximum time to wait before sending a batch of spans.
     */
    private Duration batchTimeout = Duration.ofSeconds(5);

    /**
     * Maximum number of spans to batch before sending.
     */
    private int maxBatchSize = 512;

    /**
     * Maximum queue size for spans waiting to be sent.
     */
    private int maxQueueSize = 2048;

    /**
     * Maximum time to wait for export to complete.
     */
    private Duration exportTimeout = Duration.ofSeconds(30);

    /**
     * Resource attributes to attach to all spans.
     * These describe the service producing the spans.
     */
    private Map<String, String> resourceAttributes = new HashMap<>();

    /**
     * Headers to include in OTLP requests.
     * Useful for authentication.
     */
    private Map<String, String> headers = new HashMap<>();

    /**
     * Whether to propagate trace context to downstream services.
     */
    private boolean propagateTraceContext = true;

    /**
     * Trace context propagation formats.
     * Options: w3c, b3, b3multi, jaeger
     */
    private PropagationFormat[] propagationFormats = {PropagationFormat.W3C, PropagationFormat.B3};

    /**
     * Whether to capture exception stack traces.
     */
    private boolean captureExceptionStackTrace = true;

    /**
     * Maximum length of span attributes.
     */
    private int maxAttributeLength = 1024;

    /**
     * Whether to enable automatic instrumentation for Spring components.
     */
    private boolean autoInstrumentation = true;

    // Enums

    public enum Protocol {
        GRPC,
        HTTP
    }

    public enum SamplingStrategy {
        ALWAYS_ON,
        ALWAYS_OFF,
        TRACE_ID_RATIO,
        PARENT_BASED
    }

    public enum Compression {
        NONE,
        GZIP
    }

    public enum PropagationFormat {
        W3C,
        B3,
        B3MULTI,
        JAEGER
    }

    // Getters and Setters

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public Protocol getProtocol() {
        return protocol;
    }

    public void setProtocol(Protocol protocol) {
        this.protocol = protocol;
    }

    public double getSamplingProbability() {
        return samplingProbability;
    }

    public void setSamplingProbability(double samplingProbability) {
        this.samplingProbability = samplingProbability;
    }

    public SamplingStrategy getSamplingStrategy() {
        return samplingStrategy;
    }

    public void setSamplingStrategy(SamplingStrategy samplingStrategy) {
        this.samplingStrategy = samplingStrategy;
    }

    public Duration getTimeout() {
        return timeout;
    }

    public void setTimeout(Duration timeout) {
        this.timeout = timeout;
    }

    public Compression getCompression() {
        return compression;
    }

    public void setCompression(Compression compression) {
        this.compression = compression;
    }

    public Duration getBatchTimeout() {
        return batchTimeout;
    }

    public void setBatchTimeout(Duration batchTimeout) {
        this.batchTimeout = batchTimeout;
    }

    public int getMaxBatchSize() {
        return maxBatchSize;
    }

    public void setMaxBatchSize(int maxBatchSize) {
        this.maxBatchSize = maxBatchSize;
    }

    public int getMaxQueueSize() {
        return maxQueueSize;
    }

    public void setMaxQueueSize(int maxQueueSize) {
        this.maxQueueSize = maxQueueSize;
    }

    public Duration getExportTimeout() {
        return exportTimeout;
    }

    public void setExportTimeout(Duration exportTimeout) {
        this.exportTimeout = exportTimeout;
    }

    public Map<String, String> getResourceAttributes() {
        return resourceAttributes;
    }

    public void setResourceAttributes(Map<String, String> resourceAttributes) {
        this.resourceAttributes = resourceAttributes;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
    }

    public boolean isPropagateTraceContext() {
        return propagateTraceContext;
    }

    public void setPropagateTraceContext(boolean propagateTraceContext) {
        this.propagateTraceContext = propagateTraceContext;
    }

    public PropagationFormat[] getPropagationFormats() {
        return propagationFormats;
    }

    public void setPropagationFormats(PropagationFormat[] propagationFormats) {
        this.propagationFormats = propagationFormats;
    }

    public boolean isCaptureExceptionStackTrace() {
        return captureExceptionStackTrace;
    }

    public void setCaptureExceptionStackTrace(boolean captureExceptionStackTrace) {
        this.captureExceptionStackTrace = captureExceptionStackTrace;
    }

    public int getMaxAttributeLength() {
        return maxAttributeLength;
    }

    public void setMaxAttributeLength(int maxAttributeLength) {
        this.maxAttributeLength = maxAttributeLength;
    }

    public boolean isAutoInstrumentation() {
        return autoInstrumentation;
    }

    public void setAutoInstrumentation(boolean autoInstrumentation) {
        this.autoInstrumentation = autoInstrumentation;
    }

    /**
     * Get the complete OTLP endpoint based on protocol.
     */
    public String getOtlpEndpoint() {
        if (protocol == Protocol.HTTP) {
            return endpoint.endsWith("/v1/traces") 
                ? endpoint 
                : endpoint + "/v1/traces";
        }
        return endpoint; // gRPC uses base endpoint
    }
}
```

### Step 2: Update LgtmProperties

Add Tempo properties to the main `LgtmProperties.java`:

```java
@NestedConfigurationProperty
private TempoProperties tempo = new TempoProperties();

public TempoProperties getTempo() {
    return tempo;
}

public void setTempo(TempoProperties tempo) {
    this.tempo = tempo;
}
```

---

## Implementing Auto-Configuration

### Step 1: Create TempoAutoConfiguration

Create `TempoAutoConfiguration.java`:

```java
package com.yourorg.lgtm.autoconfigure.tempo;

import com.yourorg.lgtm.autoconfigure.LgtmProperties;
import io.micrometer.tracing.otel.bridge.OtelTracer;
import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.propagation.ContextPropagators;
import io.opentelemetry.context.propagation.TextMapPropagator;
import io.opentelemetry.contrib.sampler.RuleBasedRoutingSampler;
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
import io.opentelemetry.exporter.otlp.trace.OtlpHttpSpanExporter;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import io.opentelemetry.sdk.trace.export.SpanExporter;
import io.opentelemetry.sdk.trace.samplers.Sampler;
import io.opentelemetry.semconv.ResourceAttributes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Auto-configuration for Tempo distributed tracing.
 * 
 * <p>Activates when:</p>
 * <ul>
 *   <li>OpenTelemetry is on the classpath</li>
 *   <li>lgtm.tempo.enabled=true (default)</li>
 * </ul>
 * 
 * <p>Configures OpenTelemetry SDK to export traces to Tempo.</p>
 */
@AutoConfiguration
@ConditionalOnClass(OpenTelemetry.class)
@ConditionalOnProperty(
    prefix = "lgtm.tempo",
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true
)
@EnableConfigurationProperties(LgtmProperties.class)
public class TempoAutoConfiguration {

    private static final Logger log = LoggerFactory.getLogger(TempoAutoConfiguration.class);

    private final LgtmProperties lgtmProperties;

    public TempoAutoConfiguration(LgtmProperties lgtmProperties) {
        this.lgtmProperties = lgtmProperties;
    }

    /**
     * Create OTLP span exporter based on configured protocol.
     */
    @Bean
    @ConditionalOnMissingBean
    public SpanExporter otlpSpanExporter() {
        TempoProperties tempo = lgtmProperties.getTempo();
        
        log.info("Configuring Tempo span exporter: protocol={}, endpoint={}", 
                 tempo.getProtocol(), tempo.getOtlpEndpoint());
        
        if (tempo.getProtocol() == TempoProperties.Protocol.GRPC) {
            return createGrpcExporter(tempo);
        } else {
            return createHttpExporter(tempo);
        }
    }

    /**
     * Create gRPC OTLP exporter.
     */
    private SpanExporter createGrpcExporter(TempoProperties tempo) {
        OtlpGrpcSpanExporter.Builder builder = OtlpGrpcSpanExporter.builder()
            .setEndpoint(tempo.getOtlpEndpoint())
            .setTimeout(tempo.getTimeout().toMillis(), TimeUnit.MILLISECONDS);
        
        // Add headers if configured
        if (!tempo.getHeaders().isEmpty()) {
            tempo.getHeaders().forEach(builder::addHeader);
        }
        
        // Configure compression
        if (tempo.getCompression() == TempoProperties.Compression.GZIP) {
            builder.setCompression("gzip");
        }
        
        return builder.build();
    }

    /**
     * Create HTTP OTLP exporter.
     */
    private SpanExporter createHttpExporter(TempoProperties tempo) {
        OtlpHttpSpanExporter.Builder builder = OtlpHttpSpanExporter.builder()
            .setEndpoint(tempo.getOtlpEndpoint())
            .setTimeout(tempo.getTimeout());
        
        // Add headers if configured
        if (!tempo.getHeaders().isEmpty()) {
            tempo.getHeaders().forEach(builder::addHeader);
        }
        
        // Configure compression
        if (tempo.getCompression() == TempoProperties.Compression.GZIP) {
            builder.setCompression("gzip");
        }
        
        return builder.build();
    }

    /**
     * Create batch span processor for efficient span export.
     */
    @Bean
    @ConditionalOnMissingBean
    public BatchSpanProcessor batchSpanProcessor(SpanExporter spanExporter) {
        TempoProperties tempo = lgtmProperties.getTempo();
        
        return BatchSpanProcessor.builder(spanExporter)
            .setScheduleDelay(tempo.getBatchTimeout().toMillis(), TimeUnit.MILLISECONDS)
            .setMaxQueueSize(tempo.getMaxQueueSize())
            .setMaxExportBatchSize(tempo.getMaxBatchSize())
            .setExporterTimeout(tempo.getExportTimeout().toMillis(), TimeUnit.MILLISECONDS)
            .build();
    }

    /**
     * Create sampler based on configured strategy.
     */
    @Bean
    @ConditionalOnMissingBean
    public Sampler sampler() {
        TempoProperties tempo = lgtmProperties.getTempo();
        
        switch (tempo.getSamplingStrategy()) {
            case ALWAYS_ON:
                return Sampler.alwaysOn();
            case ALWAYS_OFF:
                return Sampler.alwaysOff();
            case TRACE_ID_RATIO:
                return Sampler.traceIdRatioBased(tempo.getSamplingProbability());
            case PARENT_BASED:
                Sampler rootSampler = Sampler.traceIdRatioBased(tempo.getSamplingProbability());
                return Sampler.parentBased(rootSampler);
            default:
                return Sampler.traceIdRatioBased(tempo.getSamplingProbability());
        }
    }

    /**
     * Create resource with service metadata.
     */
    @Bean
    @ConditionalOnMissingBean
    public Resource otelResource() {
        TempoProperties tempo = lgtmProperties.getTempo();
        
        // Build resource attributes
        Map<String, String> attributes = new HashMap<>();
        
        // Add service name
        String serviceName = lgtmProperties.getApplicationName();
        if (serviceName != null) {
            attributes.put(ResourceAttributes.SERVICE_NAME.getKey(), serviceName);
        }
        
        // Add environment
        String environment = lgtmProperties.getEnvironment();
        if (environment != null) {
            attributes.put(ResourceAttributes.DEPLOYMENT_ENVIRONMENT.getKey(), environment);
        }
        
        // Add custom resource attributes
        attributes.putAll(tempo.getResourceAttributes());
        
        // Add common tags
        attributes.putAll(lgtmProperties.getCommonTags());
        
        // Build Resource
        Attributes.Builder attrBuilder = Attributes.builder();
        attributes.forEach(attrBuilder::put);
        
        return Resource.create(attrBuilder.build());
    }

    /**
     * Create TracerProvider with all components.
     */
    @Bean
    @ConditionalOnMissingBean
    public SdkTracerProvider sdkTracerProvider(
            BatchSpanProcessor spanProcessor,
            Sampler sampler,
            Resource resource) {
        
        log.info("Creating OpenTelemetry TracerProvider with sampling: {}", 
                 lgtmProperties.getTempo().getSamplingProbability());
        
        return SdkTracerProvider.builder()
            .addSpanProcessor(spanProcessor)
            .setSampler(sampler)
            .setResource(resource)
            .build();
    }

    /**
     * Create context propagators for distributed tracing.
     */
    @Bean
    @ConditionalOnMissingBean
    public ContextPropagators contextPropagators() {
        TempoProperties tempo = lgtmProperties.getTempo();
        
        // Build list of propagators based on configuration
        TextMapPropagator propagator = W3CTraceContextPropagator.getInstance();
        
        // Can add B3, Jaeger, etc. based on propagationFormats
        // For simplicity, using W3C (most common)
        
        return ContextPropagators.create(propagator);
    }

    /**
     * Create OpenTelemetry SDK instance.
     */
    @Bean
    @ConditionalOnMissingBean
    public OpenTelemetry openTelemetry(
            SdkTracerProvider tracerProvider,
            ContextPropagators contextPropagators) {
        
        OpenTelemetrySdk sdk = OpenTelemetrySdk.builder()
            .setTracerProvider(tracerProvider)
            .setPropagators(contextPropagators)
            .build();
        
        // Register shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            log.info("Shutting down OpenTelemetry SDK");
            tracerProvider.close();
        }));
        
        log.info("Tempo integration configured successfully");
        
        return sdk;
    }

    /**
     * Create Micrometer OTel Tracer for Spring Boot integration.
     */
    @Bean
    @ConditionalOnMissingBean
    @ConditionalOnClass(name = "io.micrometer.tracing.otel.bridge.OtelTracer")
    public io.micrometer.tracing.Tracer micrometerTracer(OpenTelemetry openTelemetry) {
        Tracer otelTracer = openTelemetry.getTracer(
            lgtmProperties.getApplicationName(),
            "1.0.0"
        );
        
        return new OtelTracer(otelTracer, null, null);
    }
}
```

**Key Components Explained:**

1. **SpanExporter**: Sends spans to Tempo via OTLP
2. **BatchSpanProcessor**: Batches spans for efficiency
3. **Sampler**: Controls which traces to capture
4. **Resource**: Metadata about the service
5. **ContextPropagators**: Propagates trace context between services
6. **OpenTelemetry SDK**: Orchestrates everything

---

## Span Instrumentation

### Automatic Instrumentation

Spring Boot 3.x automatically creates spans for:
- HTTP requests (client and server)
- Database queries
- Scheduled tasks
- Async methods

**Example - Automatic HTTP Span:**
```java
@RestController
public class OrderController {
    
    @GetMapping("/orders/{id}")
    public Order getOrder(@PathVariable String id) {
        // Span automatically created for this HTTP request
        return orderService.findOrder(id);
    }
}
```

### Manual Instrumentation

For custom operations, you can create spans manually:

```java
package com.yourorg.lgtm.autoconfigure.tempo;

import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation for creating custom spans.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Traced {
    /**
     * Custom span name. If empty, method name is used.
     */
    String value() default "";
    
    /**
     * Whether to include method parameters as span attributes.
     */
    boolean includeParameters() default false;
}

/**
 * Aspect for @Traced annotation.
 */
@Aspect
@Component
public class TracedAspect {
    
    private final ObservationRegistry observationRegistry;
    
    public TracedAspect(ObservationRegistry observationRegistry) {
        this.observationRegistry = observationRegistry;
    }
    
    @Around("@annotation(traced)")
    public Object trace(ProceedingJoinPoint pjp, Traced traced) throws Throwable {
        String spanName = traced.value().isEmpty() 
            ? pjp.getSignature().getName() 
            : traced.value();
        
        return Observation
            .createNotStarted(spanName, observationRegistry)
            .observe(() -> {
                try {
                    return pjp.proceed();
                } catch (Throwable e) {
                    throw new RuntimeException(e);
                }
            });
    }
}
```

**Usage:**
```java
@Service
public class OrderService {
    
    @Traced("order.process")
    public Order processOrder(Order order) {
        // Custom span created for this method
        validateOrder(order);
        saveOrder(order);
        notifyUser(order);
        return order;
    }
    
    @Traced("order.validate")
    private void validateOrder(Order order) {
        // Nested span
    }
}
```

### Adding Span Attributes

Enrich spans with contextual information:

```java
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;

@Service
public class PaymentService {
    
    private final ObservationRegistry registry;
    
    public PaymentService(ObservationRegistry registry) {
        this.registry = registry;
    }
    
    public Payment processPayment(String orderId, double amount) {
        return Observation
            .createNotStarted("payment.process", registry)
            .lowCardinalityKeyValue("payment.method", "credit_card")
            .highCardinalityKeyValue("order.id", orderId)
            .highCardinalityKeyValue("payment.amount", String.valueOf(amount))
            .observe(() -> {
                // Payment processing logic
                return new Payment(orderId, amount);
            });
    }
}
```

**Important:**
- **Low cardinality**: Limited set of values (payment method, status)
- **High cardinality**: Many possible values (order IDs, amounts)

---

## Testing Tempo Integration

### Step 1: Set Up Local Tempo

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  tempo:
    image: grafana/tempo:2.3.1
    command: [ "-config.file=/etc/tempo.yaml" ]
    volumes:
      - ./tempo-config.yaml:/etc/tempo.yaml
      - tempo-data:/tmp/tempo
    ports:
      - "4317:4317"  # OTLP gRPC
      - "4318:4318"  # OTLP HTTP
      - "3200:3200"  # Tempo HTTP
    
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
  tempo-data:
```

Create `tempo-config.yaml`:

```yaml
server:
  http_listen_port: 3200

distributor:
  receivers:
    otlp:
      protocols:
        grpc:
          endpoint: 0.0.0.0:4317
        http:
          endpoint: 0.0.0.0:4318

ingester:
  max_block_duration: 5m

compactor:
  compaction:
    block_retention: 1h

storage:
  trace:
    backend: local
    local:
      path: /tmp/tempo/blocks
    wal:
      path: /tmp/tempo/wal
```

Update `grafana-datasources.yml`:

```yaml
apiVersion: 1

datasources:
  - name: Tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    isDefault: true
    editable: true
```

Start services:
```bash
docker-compose up -d
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
  
  tempo:
    enabled: true
    endpoint: http://localhost:4317
    protocol: grpc
    sampling-probability: 1.0  # 100% for testing
    sampling-strategy: always_on
    
    resource-attributes:
      service.version: "1.0.0"
      deployment.environment: local

# Enable actuator endpoints
management:
  endpoints:
    web:
      exposure:
        include: "*"
  tracing:
    sampling:
      probability: 1.0

logging:
  level:
    com.yourorg.lgtm: DEBUG
    io.opentelemetry: DEBUG
```

### Step 3: Create Test Controller

```java
package com.example.lgtmtest;

import io.micrometer.observation.annotation.Observed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Random;

@RestController
@RequestMapping("/api")
public class TraceTestController {
    
    private static final Logger log = LoggerFactory.getLogger(TraceTestController.class);
    private final OrderService orderService;
    private final RestTemplate restTemplate;
    private final Random random = new Random();
    
    public TraceTestController(OrderService orderService, RestTemplate restTemplate) {
        this.orderService = orderService;
        this.restTemplate = restTemplate;
    }
    
    @GetMapping("/orders")
    @Observed(name = "orders.list")
    public String listOrders() {
        log.info("Listing orders");
        simulateWork(100);
        return "Orders: [1, 2, 3]";
    }
    
    @PostMapping("/orders")
    @Observed(name = "orders.create")
    public String createOrder(@RequestBody String orderData) {
        log.info("Creating order: {}", orderData);
        
        // Simulate complex workflow
        orderService.validateOrder(orderData);
        orderService.saveOrder(orderData);
        orderService.notifyUser(orderData);
        
        return "Order created";
    }
    
    @GetMapping("/orders/{id}")
    @Observed(name = "orders.get")
    public String getOrder(@PathVariable String id) {
        log.info("Getting order: {}", id);
        
        // Simulate database query
        simulateWork(50);
        
        // Simulate external API call
        try {
            restTemplate.getForObject("http://localhost:8080/api/payment/" + id, String.class);
        } catch (Exception e) {
            log.warn("Payment service unavailable");
        }
        
        return "Order #" + id;
    }
    
    @GetMapping("/payment/{orderId}")
    @Observed(name = "payment.get")
    public String getPayment(@PathVariable String orderId) {
        log.info("Getting payment for order: {}", orderId);
        simulateWork(30);
        return "Payment for order #" + orderId;
    }
    
    @GetMapping("/slow")
    @Observed(name = "slow.operation")
    public String slowOperation() {
        log.info("Starting slow operation");
        orderService.slowDatabaseQuery();
        orderService.externalApiCall();
        return "Completed";
    }
    
    @GetMapping("/error")
    @Observed(name = "error.test")
    public String errorTest() {
        log.info("Testing error handling");
        orderService.operationThatFails();
        return "Should not reach here";
    }
    
    private void simulateWork(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}

@Service
class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final Random random = new Random();
    
    @Observed(name = "order.validate")
    public void validateOrder(String orderData) {
        log.info("Validating order");
        simulateWork(20);
    }
    
    @Observed(name = "order.save")
    public void saveOrder(String orderData) {
        log.info("Saving order to database");
        simulateWork(80);
    }
    
    @Observed(name = "user.notify")
    public void notifyUser(String orderData) {
        log.info("Notifying user");
        simulateWork(30);
    }
    
    @Observed(name = "database.query.slow")
    public void slowDatabaseQuery() {
        log.info("Executing slow database query");
        simulateWork(500);
    }
    
    @Observed(name = "external.api.call")
    public void externalApiCall() {
        log.info("Calling external API");
        simulateWork(300);
    }
    
    @Observed(name = "operation.fail")
    public void operationThatFails() {
        log.error("Operation failed");
        throw new RuntimeException("Simulated failure");
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

### Step 4: Configure RestTemplate with Tracing

```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(5))
            .build();
    }
}
```

### Step 5: Run Tests

1. **Start the application:**
```bash
mvn spring-boot:run
```

2. **Generate traces:**
```bash
# Simple request
curl http://localhost:8080/api/orders

# Create order (complex workflow)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"item": "laptop", "quantity": 1}'

# Get specific order (with external call)
curl http://localhost:8080/api/orders/123

# Slow operation
curl http://localhost:8080/api/slow

# Error case
curl http://localhost:8080/api/error
```

3. **View traces in Grafana:**
   - Open http://localhost:3000
   - Go to Explore
   - Select Tempo datasource
   - Query:
   ```
   Search traces
   Service Name: lgtm-test-app
   ```

4. **Analyze trace:**
   - Click on a trace ID
   - See span hierarchy
   - Check durations
   - View span attributes
   - See error details

---

## Advanced Tracing Features

### Feature 1: Custom Sampling Rules

Sample different operations at different rates:

```java
@Bean
public Sampler customSampler() {
    return Sampler.parentBased(
        RuleBasedRoutingSampler.builder(SpanKind.SERVER, Sampler.alwaysOn())
            .addRule("http.route", "/api/health", Sampler.alwaysOff())
            .addRule("http.route", "/actuator/*", Sampler.alwaysOff())
            .addRule("http.route", "/api/orders/*", Sampler.traceIdRatioBased(1.0))
            .addRule("http.route", "/api/*", Sampler.traceIdRatioBased(0.1))
            .build()
    );
}
```

### Feature 2: Baggage (Propagating Context)

Propagate metadata across service boundaries:

```java
import io.opentelemetry.api.baggage.Baggage;
import io.opentelemetry.context.Context;

@Service
public class OrderService {
    
    public void processOrder(String orderId, String userId) {
        // Set baggage
        Baggage baggage = Baggage.builder()
            .put("user.id", userId)
            .put("order.id", orderId)
            .build();
        
        Context context = Context.current().with(baggage);
        
        context.makeCurrent();
        try {
            // This context is propagated to downstream services
            paymentService.processPayment(orderId);
        } finally {
            context.detach();
        }
    }
}
```

### Feature 3: Trace Correlation with Logs

Link logs to traces using MDC:

```java
import io.micrometer.tracing.Tracer;
import org.slf4j.MDC;

@Component
public class TraceLogger {
    
    private final Tracer tracer;
    
    public TraceLogger(Tracer tracer) {
        this.tracer = tracer;
    }
    
    @PostConstruct
    public void setupMDC() {
        // Add trace ID to MDC for every log statement
        MDC.put("trace_id", tracer.currentSpan().context().traceId());
        MDC.put("span_id", tracer.currentSpan().context().spanId());
    }
}
```

Now logs will include trace IDs, allowing you to jump from logs to traces!

---

## Summary

In this part, you learned:
- ✅ Distributed tracing concepts and terminology
- ✅ How Tempo works with OpenTelemetry
- ✅ Created comprehensive Tempo configuration
- ✅ Implemented OpenTelemetry SDK integration
- ✅ Automatic and manual span instrumentation
- ✅ Testing traces with Grafana
- ✅ Advanced features (sampling, baggage, correlation)

**Next**: Part 3 - Implementing metrics integration with Prometheus and Mimir.

## Additional Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Tempo Documentation](https://grafana.com/docs/tempo/latest/)
- [Spring Boot Observability](https://spring.io/blog/2022/10/12/observability-with-spring-boot-3)
- [Micrometer Tracing](https://micrometer.io/docs/tracing)
