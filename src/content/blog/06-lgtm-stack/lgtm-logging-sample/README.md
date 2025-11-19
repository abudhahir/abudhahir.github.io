---
title: "LGTM Logging Sample - Automatic Request/Response Logging"
date: "2024-12-21"
excerpt: "Sample project showcasing configurable HTTP logging with filters, properties, and project structure ready for the LGTM starter."
tags: ["Tutorial", "Java", "Spring", "Logging", "LGTM"]
author: "Abudhahir"
featured: false
readTime: "3 min read"
series: "LGTM Logging Sample"
draft: false
---
# LGTM Logging Sample - Automatic Request/Response Logging

This sample demonstrates automatic logging of HTTP requests and responses with configurable inclusion/exclusion patterns.

## Features

- ✅ Automatic logging of all HTTP requests and responses
- ✅ Logs request method, URI, headers, body
- ✅ Logs response status, headers, body
- ✅ Configurable via properties
- ✅ Include/exclude specific endpoints via patterns
- ✅ Include/exclude specific HTTP methods
- ✅ Sensitive header masking (Authorization, Cookie, etc.)
- ✅ Request correlation ID for tracing
- ✅ Performance metrics (request duration)

## Project Structure

```
src/main/java/
├── config/
│   ├── LgtmLoggingProperties.java           # Configuration properties
│   └── LgtmLoggingAutoConfiguration.java    # Auto-configuration
├── filter/
│   ├── RequestResponseLoggingFilter.java    # Main logging filter
│   └── CachedBodyHttpServletRequest.java    # Request wrapper
│   └── CachedBodyHttpServletResponse.java   # Response wrapper
└── model/
    └── HttpLogEntry.java                     # Log entry model

src/main/resources/
└── META-INF/
    └── spring/
        └── org.springframework.boot.autoconfigure.AutoConfiguration.imports

application.yml                               # Example configuration
```

## Usage

### 1. Add to your Spring Boot project

```xml
<dependency>
    <groupId>com.yourorg</groupId>
    <artifactId>lgtm-logging-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 2. Configure via application.yml

```yaml
lgtm:
  logging:
    enabled: true
    include-request-body: true
    include-response-body: true
    include-headers: true
    max-body-size: 10000  # bytes
    
    # Include patterns (all endpoints by default)
    include-patterns:
      - "/api/**"
      - "/v1/**"
    
    # Exclude specific patterns
    exclude-patterns:
      - "/actuator/**"
      - "/health"
      - "/metrics"
    
    # Include specific HTTP methods (all by default)
    include-methods:
      - GET
      - POST
      - PUT
      - DELETE
      - PATCH
    
    # Exclude specific HTTP methods
    exclude-methods:
      - OPTIONS
      - HEAD
    
    # Sensitive headers to mask
    masked-headers:
      - Authorization
      - Cookie
      - Set-Cookie
      - X-API-Key
```

### 3. Run your application

Logs will automatically appear in your configured logger (Loki in LGTM stack).

## Log Output Example

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "correlationId": "abc123-def456",
  "type": "HTTP_REQUEST",
  "method": "POST",
  "uri": "/api/users",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "***MASKED***"
  },
  "body": "{\"name\":\"John Doe\",\"email\":\"john@example.com\"}",
  "remoteAddress": "192.168.1.100"
}

{
  "timestamp": "2024-01-15T10:30:45.456Z",
  "correlationId": "abc123-def456",
  "type": "HTTP_RESPONSE",
  "method": "POST",
  "uri": "/api/users",
  "status": 201,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"id\":123,\"name\":\"John Doe\"}",
  "durationMs": 333
}
```

## Advanced Configuration

### Custom Log Format

```java
@Component
public class CustomHttpLogFormatter implements HttpLogFormatter {
    @Override
    public String format(HttpLogEntry entry) {
        // Custom formatting logic
        return customFormat(entry);
    }
}
```

### Conditional Logging

```java
@Component
public class CustomLoggingCondition implements LoggingCondition {
    @Override
    public boolean shouldLog(HttpServletRequest request) {
        // Custom logic to determine if request should be logged
        return !request.getRequestURI().contains("/internal");
    }
}
```

## Performance Considerations

- Body caching is only done when logging is enabled
- Configurable maximum body size to prevent memory issues
- Async logging to not block request processing
- Pattern matching is cached for performance

## Security Notes

- Always mask sensitive headers (Authorization, API keys, etc.)
- Consider excluding endpoints that handle sensitive data
- Be careful with response body logging for large payloads
- Review logs for PII (Personally Identifiable Information) before long-term storage
