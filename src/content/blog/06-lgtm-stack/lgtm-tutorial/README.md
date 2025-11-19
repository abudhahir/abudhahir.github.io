---
title: "Complete Tutorial: Building a Spring Boot Starter for LGTM Stack"
date: "2024-12-16"
excerpt: "Overview and navigation guide for the multi-part LGTM starter tutorial covering setup through deployment."
tags: ["Tutorial", "Java", "Spring", "Observability", "LGTM"]
author: "Abudhahir"
featured: false
readTime: "8 min read"
series: "LGTM Starter Tutorial"
draft: false
---
# Complete Tutorial: Building a Spring Boot Starter for LGTM Stack

A comprehensive, step-by-step guide to creating a production-ready Spring Boot starter for the LGTM (Loki, Grafana, Tempo, Mimir) observability stack.

## 📚 Tutorial Series

### [Part 0: Fundamentals and Project Setup](Part-0-Fundamentals-and-Setup.md)
**What you'll learn:**
- Understanding Spring Boot starters
- Setting up multi-module Maven project
- Core dependencies and their purposes
- How auto-configuration works
- Project structure and organization

**Key Topics:**
- Starter architecture
- Parent POM configuration
- Dependency management
- Configuration property binding
- Auto-configuration registration

---

### [Part 1: Loki Integration - Centralized Logging](Part-1-Loki-Integration.md)
**What you'll learn:**
- How Loki works and its data model
- Integrating with Logback programmatically
- Creating configuration properties
- Implementing auto-configuration
- Testing with local Loki instance

**Key Topics:**
- Label design (low vs high cardinality)
- Programmatic Logback configuration
- Batch processing and performance
- Loki appender configuration
- Log correlation

**Code Highlights:**
- `LokiProperties.java` - Comprehensive configuration
- `LokiAutoConfiguration.java` - Conditional bean creation
- `LokiAppenderConfigurer.java` - Logback integration

---

### [Part 2: Tempo Integration - Distributed Tracing](Part-2-Tempo-Integration.md)
**What you'll learn:**
- Distributed tracing fundamentals
- OpenTelemetry integration
- Span creation and propagation
- Context propagation between services
- Testing traces in Grafana

**Key Topics:**
- Trace, span, and context concepts
- OTLP protocol (gRPC and HTTP)
- Sampling strategies
- Span processors and exporters
- Automatic vs manual instrumentation

**Code Highlights:**
- `TempoProperties.java` - Tracing configuration
- `TempoAutoConfiguration.java` - OpenTelemetry SDK setup
- `@Traced` annotation - Custom span creation

---

### [Part 3: Metrics Integration - Prometheus and Mimir](Part-3-Metrics-Integration.md)
**What you'll learn:**
- Metrics types (counter, gauge, timer, summary)
- Prometheus scrape endpoint configuration
- Mimir remote write integration
- Creating custom metrics
- Testing metrics collection

**Key Topics:**
- Metrics vs logs vs traces
- Prometheus pull vs Mimir push
- Micrometer abstraction
- Common tags and cardinality
- Metric naming conventions

**Code Highlights:**
- `MetricsProperties.java` - Metrics configuration
- `MetricsAutoConfiguration.java` - Registry customization
- `MimirAutoConfiguration.java` - Remote write setup

---

### [Part 4: Advanced Features and Integration](Part-4-Advanced-Features.md)
**What you'll learn:**
- Correlating logs, traces, and metrics
- Creating health indicators
- Building pre-built dashboards
- Using exemplars
- Context propagation patterns
- Custom annotations

**Key Topics:**
- Trace-log correlation via MDC
- Log-to-trace navigation
- Exemplars linking metrics to traces
- Dashboard provisioning
- `@ObserveOperation` annotation
- Performance optimization

**Code Highlights:**
- `TraceContextFilter.java` - MDC enhancement
- `LgtmHealthIndicator.java` - Health checks
- `ObserveOperationAspect.java` - All-in-one observability

---

### [Part 5: Testing, Deployment, and Best Practices](Part-5-Testing-and-Deployment.md)
**What you'll learn:**
- Unit testing auto-configuration
- Integration testing strategies
- Testcontainers for full stack testing
- Publishing to Maven Central
- Production best practices
- Performance optimization

**Key Topics:**
- ApplicationContextRunner for tests
- Testcontainers with LGTM stack
- Maven Central publishing process
- Production checklist
- Troubleshooting guide
- Documentation standards

**Code Highlights:**
- `LgtmPropertiesTest.java` - Property binding tests
- `LgtmStackIntegrationTest.java` - Full stack test
- Production configuration examples

---

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Maven 3.6+
- Docker & Docker Compose
- Basic Spring Boot knowledge

### Clone and Build

```bash
# Follow the tutorial to build from scratch, or use as reference

# Build all modules
mvn clean install

# Run tests
mvn test

# Start LGTM stack
docker-compose up -d
```

### Basic Usage

```xml
<dependency>
    <groupId>com.yourorg</groupId>
    <artifactId>lgtm-spring-boot-starter</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

```yaml
lgtm:
  application-name: my-app
  environment: dev
  
  loki:
    url: http://localhost:3100
  
  tempo:
    endpoint: http://localhost:4317
  
  metrics:
    prometheus:
      enabled: true
```

---

## 📊 What Gets Created

After completing this tutorial, you'll have:

### 1. **Two Maven Modules**
- `lgtm-spring-boot-autoconfigure` - Configuration logic
- `lgtm-spring-boot-starter` - Dependency aggregator

### 2. **Comprehensive Configuration**
```
lgtm.loki.*          - 15+ properties
lgtm.tempo.*         - 20+ properties
lgtm.metrics.*       - 25+ properties
```

### 3. **Auto-Configuration Classes**
- `LgtmAutoConfiguration` - Main configuration
- `LokiAutoConfiguration` - Logging setup
- `TempoAutoConfiguration` - Tracing setup
- `MetricsAutoConfiguration` - Metrics setup
- `PrometheusAutoConfiguration` - Scrape endpoint
- `MimirAutoConfiguration` - Remote write

### 4. **Advanced Features**
- Health indicators for all components
- Automatic trace-log correlation
- Custom annotations (`@Traced`, `@ObserveOperation`)
- Pre-built Grafana dashboards
- Context propagation helpers

### 5. **Testing Infrastructure**
- Unit tests for all auto-configuration
- Integration tests with Testcontainers
- Performance tests
- Sample applications

### 6. **Documentation**
- Comprehensive README
- Configuration guide
- Examples and best practices
- Troubleshooting guide

---

## 🎯 Learning Outcomes

By the end of this tutorial, you will understand:

### Spring Boot Internals
- How auto-configuration works
- Conditional bean creation
- Configuration properties binding
- Starter module patterns

### Observability Concepts
- Three pillars: logs, traces, metrics
- Correlation between signals
- Sampling strategies
- Label/tag design

### Integration Patterns
- Programmatic configuration
- Aspect-oriented programming
- Servlet filters
- Micrometer abstractions

### Production Readiness
- Testing strategies
- Performance optimization
- Error handling
- Health monitoring

---

## 📖 Tutorial Flow

```
Part 0: Foundation
   ↓
   Setup project structure
   Understand core concepts
   
Part 1: Loki
   ↓
   Implement logging
   Test with local Loki
   
Part 2: Tempo
   ↓
   Implement tracing
   Test with local Tempo
   
Part 3: Metrics
   ↓
   Implement metrics
   Prometheus + Mimir
   
Part 4: Advanced
   ↓
   Correlation
   Dashboards
   Custom features
   
Part 5: Production
   ↓
   Testing
   Publishing
   Best practices
```

---

## 🛠️ Technology Stack

### Core
- Spring Boot 3.2.0
- Java 17
- Maven

### Observability
- Loki 2.9.3 (Logging)
- Tempo 2.3.1 (Tracing)
- Prometheus 2.48.0 (Metrics)
- Mimir (optional)
- Grafana 10.2.2 (Visualization)

### Libraries
- Loki4j 1.5.1
- OpenTelemetry 1.32.0
- Micrometer (included in Spring Boot)
- Logback (included in Spring Boot)

### Testing
- JUnit 5
- Testcontainers 1.19.3
- AssertJ
- REST Assured

---

## 💡 Key Concepts Covered

### Auto-Configuration
- `@ConditionalOnClass`
- `@ConditionalOnProperty`
- `@ConditionalOnMissingBean`
- `@EnableConfigurationProperties`
- `@AutoConfiguration`

### Observability
- Structured logging
- Distributed tracing
- Metric types and cardinality
- Sampling strategies
- Context propagation

### Best Practices
- Low cardinality labels
- Async processing
- Batch optimization
- Error handling
- Resource management

---

## 🎓 Who Should Use This Tutorial

### Ideal for:
- **Spring Boot developers** wanting to create custom starters
- **Platform engineers** building observability solutions
- **DevOps engineers** standardizing monitoring
- **Architects** designing microservices platforms

### Prerequisites:
- Intermediate Spring Boot knowledge
- Basic understanding of logging and monitoring
- Familiarity with Maven
- Docker basics

---

## 📝 Common Use Cases

### 1. Enterprise Standardization
Create a company-wide observability starter that enforces standards across all Spring Boot applications.

### 2. Microservices Platform
Build a platform starter that provides out-of-the-box observability for microservices.

### 3. Open Source Contribution
Contribute to the observability ecosystem by sharing your starter.

### 4. Learning
Understand Spring Boot internals by building a real-world starter.

---

## 🔧 Customization Points

The tutorial teaches you to make everything customizable:

- ✅ All components can be enabled/disabled
- ✅ Every property has sensible defaults
- ✅ Users can override any configuration
- ✅ Graceful degradation if services unavailable
- ✅ Environment-specific configurations
- ✅ Custom metrics and spans
- ✅ Pluggable authentication

---

## 📚 Additional Resources

### Official Documentation
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Grafana LGTM Documentation](https://grafana.com/docs/)
- [OpenTelemetry Java](https://opentelemetry.io/docs/instrumentation/java/)
- [Micrometer Documentation](https://micrometer.io/docs)

### Related Projects
- [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth)
- [Micrometer Tracing](https://micrometer.io/docs/tracing)
- [Loki4j](https://github.com/loki4j/loki-logback-appender)

### Observability Learning
- [Observability Engineering Book](https://www.oreilly.com/library/view/observability-engineering/9781492076438/)
- [Distributed Systems Observability](https://www.oreilly.com/library/view/distributed-systems-observability/9781492033431/)

---

## 🤝 Contributing

This tutorial is designed to be comprehensive yet adaptable. Feel free to:
- Extend with additional features
- Adapt for your specific needs
- Share your improvements
- Report issues or suggestions

---

## 📄 License

Apache License 2.0 - Use freely in your projects!

---

## 🎉 Ready to Start?

Begin with **[Part 0: Fundamentals and Project Setup](Part-0-Fundamentals-and-Setup.md)** and work through each part sequentially. Each part builds on the previous one, creating a complete, production-ready solution.

---

## ⭐ Tutorial Highlights

### What Makes This Tutorial Special?

1. **Complete Code**: Every class is fully implemented with explanations
2. **Production Ready**: Includes testing, error handling, and optimization
3. **Real World**: Based on actual production patterns
4. **Hands-On**: Build something you can actually use
5. **Deep Dive**: Understand not just "how" but "why"
6. **Best Practices**: Industry-standard approaches throughout

### Estimated Time
- **Part 0**: 1-2 hours
- **Part 1**: 2-3 hours
- **Part 2**: 2-3 hours
- **Part 3**: 2-3 hours
- **Part 4**: 2-3 hours
- **Part 5**: 1-2 hours

**Total: 10-15 hours** for complete understanding and implementation.

---

Happy Learning! 🚀
