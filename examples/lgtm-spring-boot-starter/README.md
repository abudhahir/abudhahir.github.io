---
title: "Required"
date: 2025-09-02
excerpt: "Required"
tags:
  - "Required"
author: "Required"
draft: true
---

# HTTP Request/Response Logging for LGTM Spring Boot Starter

This sample implementation provides automatic logging of all HTTP requests and responses with configurable inclusion/exclusion of endpoints and methods.

## Features

✅ **Automatic Logging** - Logs all HTTP traffic by default  
✅ **Configurable** - Control what gets logged through properties  
✅ **Pattern Matching** - Include/exclude endpoints using Ant-style patterns  
✅ **Method Filtering** - Include/exclude specific HTTP methods  
✅ **Header Masking** - Automatically mask sensitive headers (Authorization, API Keys, etc.)  
✅ **Body Logging** - Captures request and response bodies  
✅ **Timing Info** - Tracks request duration  
✅ **Client Info** - Logs client IP and User-Agent  
✅ **Loki-Ready** - Structured logging format works perfectly with Loki  

## Files Included

1. **HttpLoggingProperties.java** - Configuration properties
2. **HttpLoggingFilter.java** - Servlet filter that performs logging
3. **HttpLoggingAutoConfiguration.java** - Spring Boot auto-configuration
4. **SampleApplication.java** - Demo application with test endpoints
5. **application.yml** - Sample configuration
6. **application-examples.yml** - Various configuration examples

## Quick Start

### 1. Add Dependencies

```xml
<dependencies>
    <!-- Your LGTM starter -->
    <dependency>
        <groupId>com.yourorg</groupId>
        <artifactId>lgtm-spring-boot-starter</artifactId>
        <version>1.0.0</version>
    </dependency>
    
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### 2. Configuration (application.yml)

**Minimal Configuration - Logs Everything:**
```yaml
lgtm:
  logging:
    http:
      enabled: true
```

**Production Configuration:**
```yaml
lgtm:
  logging:
    http:
      enabled: true
      include-request-body: true
      include-response-body: true
      max-payload-length: 5000
      
      # Exclude health checks and actuator
      exclude-patterns:
        - /actuator/**
        - /health
        - /metrics
      
      # Don't log OPTIONS requests
      exclude-methods:
        - OPTIONS
        - HEAD
      
      # Mask sensitive headers
      masked-headers:
        - Authorization
        - X-API-Key
        - Cookie
```

### 3. Run the Sample Application

```bash
mvn spring-boot:run
```

### 4. Test the Endpoints

```bash
# Simple GET request
curl http://localhost:8080/api/hello

# GET with path variable
curl http://localhost:8080/api/users/123

# GET with query parameters
curl "http://localhost:8080/api/search?query=test&page=0&size=10"

# POST with body
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'

# Request with headers (will be masked)
curl http://localhost:8080/api/secure \
  -H "Authorization: Bearer secret-token" \
  -H "X-API-Key: my-api-key"

# Test slow endpoint (timing)
curl http://localhost:8080/api/slow

# Health check (excluded by default)
curl http://localhost:8080/api/health
```

## Configuration Properties Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `lgtm.logging.http.enabled` | boolean | `true` | Enable/disable HTTP logging |
| `lgtm.logging.http.include-request-body` | boolean | `true` | Log request body |
| `lgtm.logging.http.include-response-body` | boolean | `true` | Log response body |
| `lgtm.logging.http.include-request-headers` | boolean | `true` | Log request headers |
| `lgtm.logging.http.include-response-headers` | boolean | `true` | Log response headers |
| `lgtm.logging.http.include-query-string` | boolean | `true` | Log query parameters |
| `lgtm.logging.http.include-client-info` | boolean | `true` | Log client IP and User-Agent |
| `lgtm.logging.http.include-timings` | boolean | `true` | Log request duration |
| `lgtm.logging.http.max-payload-length` | int | `10000` | Max body size to log (-1 = unlimited) |
| `lgtm.logging.http.pretty-print` | boolean | `false` | Pretty print JSON output |
| `lgtm.logging.http.exclude-patterns` | List<String> | `[]` | URL patterns to exclude |
| `lgtm.logging.http.include-patterns` | List<String> | `[]` | URL patterns to include |
| `lgtm.logging.http.exclude-methods` | List<String> | `[]` | HTTP methods to exclude |
| `lgtm.logging.http.include-methods` | List<String> | `[]` | HTTP methods to include |
| `lgtm.logging.http.masked-headers` | List<String> | `[Authorization, X-API-Key, ...]` | Headers to mask |

## Sample Log Output

### Standard Format (pretty-print: false)
```
2024-01-15 10:23:45.123 INFO [http-nio-8080-exec-1] c.y.l.a.l.HttpLoggingFilter : HTTP Transaction: {type=HTTP_REQUEST_RESPONSE, method=POST, uri=/api/users, status=201, duration_ms=45, query_string=null, client={ip=127.0.0.1, user_agent=curl/7.79.1}, request_headers={Content-Type=application/json, Host=localhost:8080}, request_body={"name":"John Doe","email":"john@example.com","password":"secret123"}, response_headers={Content-Type=application/json}, response_body={"id":123,"name":"John Doe","email":"john@example.com","created":true}}
```

### Pretty Print Format (pretty-print: true)
```
2024-01-15 10:23:45.123 INFO [http-nio-8080-exec-1] c.y.l.a.l.HttpLoggingFilter : HTTP Transaction: {
  type: HTTP_REQUEST_RESPONSE,
  method: POST,
  uri: /api/users,
  status: 201,
  duration_ms: 45,
  client: {
    ip: 127.0.0.1,
    user_agent: curl/7.79.1
  },
  request_headers: {
    Content-Type: application/json,
    Authorization: ***MASKED***
  },
  request_body: {"name":"John Doe","email":"john@example.com","password":"secret123"},
  response_body: {"id":123,"name":"John Doe","email":"john@example.com","created":true}
}
```

## Pattern Matching Examples

### Exclude Patterns
```yaml
exclude-patterns:
  - /actuator/**          # All actuator endpoints
  - /health              # Exact match
  - /api/internal/**     # All internal APIs
  - /**/*.css            # All CSS files
  - /static/**           # Static resources
```

### Include Patterns (Whitelist)
```yaml
include-patterns:
  - /api/**              # Only API endpoints
  - /v1/**               # Only v1 endpoints
  - /public/**           # Only public endpoints
```

## Common Configuration Scenarios

### 1. Development Environment
```yaml
lgtm:
  logging:
    http:
      enabled: true
      max-payload-length: -1  # No limit
      pretty-print: true
      exclude-patterns:
        - /actuator/**
```

### 2. Production Environment
```yaml
lgtm:
  logging:
    http:
      enabled: true
      include-response-body: false  # Don't log response bodies
      max-payload-length: 5000
      exclude-patterns:
        - /actuator/**
        - /health
        - /metrics
      exclude-methods:
        - OPTIONS
```

### 3. Security-Focused
```yaml
lgtm:
  logging:
    http:
      enabled: true
      include-request-body: false
      include-response-body: false
      include-query-string: false  # Might contain tokens
      masked-headers:
        - Authorization
        - X-API-Key
        - X-Auth-Token
        - Cookie
        - Set-Cookie
```

### 4. Performance Monitoring Only
```yaml
lgtm:
  logging:
    http:
      enabled: true
      include-request-body: false
      include-response-body: false
      include-request-headers: false
      include-response-headers: false
      include-timings: true  # Only track timing
```

### 5. API-Only Logging
```yaml
lgtm:
  logging:
    http:
      enabled: true
      include-patterns:
        - /api/**
      include-methods:
        - GET
        - POST
        - PUT
        - DELETE
```

## Integration with Loki

The structured log format works seamlessly with Loki. Configure Loki labels:

```yaml
lgtm:
  loki:
    enabled: true
    url: http://localhost:3100
    labels:
      application: ${spring.application.name}
      environment: ${spring.profiles.active}
      type: http_log
```

Query in Grafana:
```logql
{application="my-app", type="http_log"} 
| json 
| duration_ms > 1000  # Find slow requests
```

## Testing

### Unit Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
class HttpLoggingFilterTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldLogRequestAndResponse() throws Exception {
        mockMvc.perform(get("/api/hello"))
            .andExpect(status().isOk());
        
        // Verify log output contains expected fields
    }
    
    @Test
    void shouldExcludeHealthEndpoint() throws Exception {
        mockMvc.perform(get("/health"))
            .andExpect(status().isOk());
        
        // Verify no log output for health endpoint
    }
}
```

## Performance Considerations

1. **Filter Order**: Registered with high priority to capture all requests
2. **Content Caching**: Uses `ContentCachingRequestWrapper` and `ContentCachingResponseWrapper`
3. **Payload Limits**: Set `max-payload-length` to avoid logging huge bodies
4. **Async Logging**: SLF4J with Logback async appender recommended
5. **Exclusions**: Use patterns to exclude high-volume endpoints

## Security Best Practices

1. ✅ Always mask sensitive headers (Authorization, API keys, cookies)
2. ✅ Consider not logging request/response bodies in production
3. ✅ Be careful with query strings (might contain tokens)
4. ✅ Set appropriate max payload length
5. ✅ Use include/exclude patterns to avoid logging sensitive endpoints
6. ✅ Regular review of logged data for compliance (GDPR, PCI-DSS)

## Troubleshooting

### Logs not appearing
- Check `lgtm.logging.http.enabled=true`
- Verify logging level: `logging.level.com.yourorg.lgtm.autoconfigure.logging=INFO`
- Check exclude patterns aren't blocking your endpoint

### Missing request/response body
- Ensure `include-request-body` and `include-response-body` are `true`
- Check `max-payload-length` isn't set to 0

### Headers showing as "***MASKED***"
- This is intentional for security
- Modify `masked-headers` list to unmask specific headers (not recommended for sensitive data)

### Performance issues
- Reduce `max-payload-length`
- Disable body logging in production
- Add more exclude patterns for high-traffic endpoints

## Next Steps

1. Integrate with Loki for centralized logging
2. Create Grafana dashboards to visualize HTTP traffic
3. Set up alerts for slow requests or error rates
4. Add custom labels for better filtering
5. Consider adding request correlation IDs

## License

Apache 2.0
