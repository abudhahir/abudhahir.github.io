---
title: "HTTP Request/Response Logging Sample"
date: "2024-12-21"
excerpt: "Comprehensive example for enabling configurable HTTP logging with filters, payload options, and Loki-ready structured output."
tags: ["Tutorial", "Java", "Spring", "Logging", "LGTM"]
author: "Abudhahir"
featured: false
readTime: "5 min read"
series: "LGTM HTTP Logging Sample"
draft: false
---
# HTTP Request/Response Logging Sample

This sample demonstrates comprehensive HTTP request/response logging for Spring Boot applications with configurable exclusions.

## Features

- ✅ Logs all HTTP requests and responses by default
- ✅ Includes headers (with sensitive header masking)
- ✅ Logs request/response bodies
- ✅ Configurable exclusions by endpoint patterns
- ✅ Configurable exclusions by HTTP methods
- ✅ Performance metrics (response time)
- ✅ Correlation ID tracking
- ✅ Structured logging (JSON format ready for Loki)

## Quick Start

### 1. Add the Configuration

Copy the following classes to your project:
- `HttpLoggingProperties.java`
- `HttpLoggingFilter.java`
- `HttpLoggingAutoConfiguration.java`
- `CachedBodyHttpServletRequest.java`
- `CachedBodyHttpServletResponse.java`

### 2. Configure in application.yml

```yaml
lgtm:
  http-logging:
    enabled: true
    log-headers: true
    log-request-body: true
    log-response-body: true
    max-payload-length: 10000
    
    # Exclude specific endpoints
    excluded-paths:
      - /actuator/**
      - /health
      - /metrics
      - /swagger-ui/**
      - /v3/api-docs/**
    
    # Exclude specific HTTP methods
    excluded-methods:
      - OPTIONS
      - TRACE
    
    # Mask sensitive headers
    sensitive-headers:
      - Authorization
      - Cookie
      - Set-Cookie
      - X-API-Key
      - X-Auth-Token
```

### 3. Use It

That's it! Your application will now automatically log all HTTP requests and responses.

## Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `lgtm.http-logging.enabled` | boolean | true | Enable/disable HTTP logging |
| `lgtm.http-logging.log-headers` | boolean | true | Include headers in logs |
| `lgtm.http-logging.log-request-body` | boolean | true | Include request body |
| `lgtm.http-logging.log-response-body` | boolean | true | Include response body |
| `lgtm.http-logging.max-payload-length` | int | 10000 | Maximum payload size to log |
| `lgtm.http-logging.excluded-paths` | List<String> | [] | Ant-style path patterns to exclude |
| `lgtm.http-logging.excluded-methods` | List<String> | [] | HTTP methods to exclude |
| `lgtm.http-logging.sensitive-headers` | List<String> | [Authorization, Cookie, ...] | Headers to mask |
| `lgtm.http-logging.include-query-string` | boolean | true | Include query parameters |
| `lgtm.http-logging.log-level` | String | INFO | Log level (TRACE, DEBUG, INFO, WARN, ERROR) |

## Log Output Examples

### Request Log
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "type": "HTTP_REQUEST",
  "correlationId": "a1b2c3d4-e5f6-7890",
  "method": "POST",
  "uri": "/api/users",
  "queryString": "include=profile",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "***MASKED***",
    "User-Agent": "Mozilla/5.0..."
  },
  "body": "{\"name\":\"John Doe\",\"email\":\"john@example.com\"}",
  "remoteAddr": "192.168.1.100"
}
```

### Response Log
```json
{
  "timestamp": "2024-01-15T10:30:45.456Z",
  "type": "HTTP_RESPONSE",
  "correlationId": "a1b2c3d4-e5f6-7890",
  "method": "POST",
  "uri": "/api/users",
  "status": 201,
  "headers": {
    "Content-Type": "application/json",
    "Location": "/api/users/123"
  },
  "body": "{\"id\":123,\"name\":\"John Doe\",\"email\":\"john@example.com\"}",
  "durationMs": 333
}
```

## Advanced Usage

### Custom Exclusions

```yaml
lgtm:
  http-logging:
    # Exclude admin endpoints in production
    excluded-paths:
      - /admin/**
      - /internal/**
      
    # Only log errors and warnings
    log-level: WARN
```

### Development vs Production

```yaml
# application-dev.yml
lgtm:
  http-logging:
    enabled: true
    log-request-body: true
    log-response-body: true
    max-payload-length: 50000

# application-prod.yml
lgtm:
  http-logging:
    enabled: true
    log-request-body: false  # Don't log bodies in prod
    log-response-body: false
    excluded-paths:
      - /actuator/**
      - /health
```

### Programmatic Configuration

```java
@Configuration
public class CustomHttpLoggingConfig {
    
    @Bean
    public HttpLoggingCustomizer httpLoggingCustomizer() {
        return properties -> {
            // Add dynamic exclusions based on environment
            if (isProd()) {
                properties.getExcludedPaths().add("/debug/**");
            }
        };
    }
}
```

## Integration with Loki

The structured logs are automatically picked up by the Loki appender. In Grafana, you can query:

```logql
# All HTTP requests
{app="your-app"} |= "HTTP_REQUEST"

# Failed requests
{app="your-app"} |= "HTTP_RESPONSE" | json | status >= 400

# Slow requests (> 1 second)
{app="your-app"} |= "HTTP_RESPONSE" | json | durationMs > 1000

# Specific endpoint
{app="your-app"} |= "HTTP_RESPONSE" | json | uri =~ "/api/users.*"
```

## Performance Considerations

1. **Body Logging**: Disable in production for high-throughput APIs
2. **Max Payload Length**: Keep it reasonable (10KB default)
3. **Excluded Paths**: Exclude health checks and metrics endpoints
4. **Async Logging**: The filter uses buffered logging for minimal impact

## Security Notes

⚠️ **Important**: Sensitive headers are automatically masked, but ensure:
- Don't log credit card numbers
- Don't log passwords in request bodies
- Don't log personal identifiable information (PII) unless required
- Use `excluded-paths` for authentication endpoints if needed

## Troubleshooting

### Logs not appearing?

1. Check if `lgtm.http-logging.enabled=true`
2. Verify log level is appropriate
3. Check excluded paths don't match your endpoint
4. Ensure filter is registered (check logs for "HTTP logging filter initialized")

### Performance issues?

1. Disable body logging: `log-request-body=false`
2. Reduce `max-payload-length`
3. Add more exclusions
4. Use async logging profile

### Headers not showing?

1. Enable: `log-headers=true`
2. Check if header is in `sensitive-headers` list
3. Verify filter order in filter chain

## Files Structure

```
src/main/java/com/yourorg/lgtm/logging/
├── HttpLoggingProperties.java          # Configuration properties
├── HttpLoggingAutoConfiguration.java   # Auto-configuration
├── HttpLoggingFilter.java              # Main filter
├── CachedBodyHttpServletRequest.java   # Request wrapper
├── CachedBodyHttpServletResponse.java  # Response wrapper
└── HttpLoggingCustomizer.java          # Customization interface
```

## Next Steps

1. Review and adjust exclusion patterns
2. Test in development environment
3. Fine-tune for production
4. Set up Grafana dashboards for HTTP metrics
5. Create alerts for error rates

## License

Apache 2.0
