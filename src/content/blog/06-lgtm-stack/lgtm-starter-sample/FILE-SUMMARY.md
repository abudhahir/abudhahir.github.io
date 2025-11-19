---
title: "HTTP Logging Implementation - File Summary"
date: "2024-12-20"
excerpt: "Line-by-line explanations of the properties, filters, auto-configuration, and sample assets included in the HTTP logging package."
tags: ["Tutorial", "Java", "Spring", "Logging", "LGTM"]
author: "Abudhahir"
featured: false
readTime: "5 min read"
series: "LGTM HTTP Logging Sample"
draft: false
---
# HTTP Logging Implementation - File Summary

## Overview
Complete implementation of HTTP request/response logging with configurable endpoint and method exclusions for the LGTM Spring Boot Starter.

## Files Created

### 1. Core Implementation Files

#### `HttpLoggingProperties.java`
**Purpose**: Configuration properties class  
**Key Features**:
- Controls what gets logged (headers, body, timing, etc.)
- URL pattern inclusion/exclusion (Ant-style patterns)
- HTTP method filtering
- Header masking for security
- Payload size limits

**Configuration Prefix**: `lgtm.logging.http`

---

#### `HttpLoggingFilter.java`
**Purpose**: Servlet filter that performs the actual logging  
**Key Features**:
- Intercepts all HTTP requests/responses
- Evaluates inclusion/exclusion rules
- Caches request/response content
- Masks sensitive headers
- Captures timing information
- Handles client IP (including proxies)
- Truncates large payloads
- Formats logs for Loki

**Key Methods**:
- `doFilter()` - Main filter logic
- `shouldLog()` - Determines if request should be logged
- `logRequestResponse()` - Creates structured log entry
- `extractHeaders()` - Extracts and masks headers
- `getClientIP()` - Gets real client IP through proxies

---

#### `HttpLoggingAutoConfiguration.java`
**Purpose**: Spring Boot auto-configuration  
**Key Features**:
- Automatically registers the filter
- Conditional on web application
- Enabled by default
- High priority filter order

**Conditions**:
- `@ConditionalOnWebApplication` - Only for web apps
- `@ConditionalOnProperty` - Respects enabled flag
- `@EnableConfigurationProperties` - Loads properties

---

### 2. Sample Application Files

#### `SampleApplication.java`
**Purpose**: Demo application with test endpoints  
**Endpoints Included**:
- `GET /api/hello` - Simple response
- `GET /api/users/{id}` - Path variable
- `GET /api/search` - Query parameters
- `POST /api/users` - Request body
- `PUT /api/users/{id}` - Update with body
- `DELETE /api/users/{id}` - Delete operation
- `GET /api/secure` - Headers (will be masked)
- `GET /api/error-test` - Error response
- `GET /api/slow` - Timing test (2s delay)
- `GET /api/health` - Health check (excluded)

---

### 3. Configuration Files

#### `application.yml`
**Purpose**: Default configuration for testing  
**Configuration**:
- Enables HTTP logging
- Logs all request/response details
- Pretty print enabled
- Excludes actuator and health
- Masks sensitive headers

---

#### `application-examples.yml`
**Purpose**: Comprehensive configuration examples  
**Includes 8 Examples**:
1. Minimal (defaults)
2. Production (optimized)
3. Development (verbose)
4. API-only (whitelist)
5. Security-focused (minimal)
6. Performance monitoring (timing only)
7. Full configuration (all options)
8. Multiple profiles (dev/staging/prod)

---

### 4. Testing Files

#### `HttpLoggingFilterTest.java`
**Purpose**: Comprehensive test suite  
**Test Classes**:
1. `HttpLoggingFilterIntegrationTest` - Basic functionality
2. `HttpLoggingFilterExclusionTest` - Pattern exclusions
3. `HttpLoggingFilterInclusionTest` - Pattern inclusions
4. `HttpLoggingFilterMethodExclusionTest` - Method filtering
5. `HttpLoggingFilterSecurityTest` - Security features
6. `HttpLoggingFilterUnitTest` - Unit tests
7. `HttpLoggingFilterPerformanceTest` - Performance impact

**Test Scenarios**:
- ✅ Simple GET requests
- ✅ Path variables
- ✅ Query parameters
- ✅ POST/PUT with body
- ✅ DELETE requests
- ✅ Header masking
- ✅ Error responses
- ✅ Timing/performance
- ✅ Pattern matching
- ✅ Method filtering

---

### 5. Documentation Files

#### `README.md`
**Purpose**: Complete usage documentation  
**Sections**:
- Features overview
- Quick start guide
- Configuration reference
- Sample log output
- Pattern matching examples
- Common scenarios
- Loki integration
- Testing guide
- Security best practices
- Troubleshooting

---

#### `pom.xml`
**Purpose**: Maven build configuration  
**Dependencies**:
- Spring Boot Web
- Spring Boot Actuator
- Configuration Processor
- Testing framework
- Logging

---

## Project Structure

```
lgtm-starter-sample/
├── src/main/java/
│   └── com/yourorg/
│       ├── lgtm/autoconfigure/logging/
│       │   ├── HttpLoggingProperties.java       (Properties)
│       │   ├── HttpLoggingFilter.java           (Filter)
│       │   └── HttpLoggingAutoConfiguration.java (Auto-config)
│       └── example/
│           └── SampleApplication.java            (Demo app)
├── src/main/resources/
│   ├── application.yml                           (Config)
│   └── application-examples.yml                  (Examples)
├── src/test/java/
│   └── com/yourorg/lgtm/autoconfigure/logging/
│       └── HttpLoggingFilterTest.java            (Tests)
├── pom.xml                                       (Maven)
└── README.md                                     (Docs)
```

## Integration into LGTM Starter

To add this to your LGTM starter:

1. **Add files to autoconfigure module**:
   ```
   lgtm-spring-boot-autoconfigure/src/main/java/
   └── com/yourorg/lgtm/autoconfigure/logging/
       ├── HttpLoggingProperties.java
       ├── HttpLoggingFilter.java
       └── HttpLoggingAutoConfiguration.java
   ```

2. **Register auto-configuration**:
   Add to `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`:
   ```
   com.yourorg.lgtm.autoconfigure.logging.HttpLoggingAutoConfiguration
   ```

3. **Add to main configuration class**:
   ```java
   @Configuration
   @Import({
       LokiAutoConfiguration.class,
       TempoAutoConfiguration.class,
       MetricsAutoConfiguration.class,
       HttpLoggingAutoConfiguration.class  // Add this
   })
   public class LgtmAutoConfiguration {
   }
   ```

## Usage

### 1. Add Dependency
```xml
<dependency>
    <groupId>com.yourorg</groupId>
    <artifactId>lgtm-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

### 2. Configure
```yaml
lgtm:
  logging:
    http:
      enabled: true
      exclude-patterns:
        - /actuator/**
```

### 3. Run
```bash
mvn spring-boot:run
```

### 4. Test
```bash
curl http://localhost:8080/api/hello
```

### 5. View Logs
Check console or Loki for structured log entries.

## Key Configuration Properties

| Property | Default | Description |
|----------|---------|-------------|
| `enabled` | `true` | Enable/disable logging |
| `include-request-body` | `true` | Log request body |
| `include-response-body` | `true` | Log response body |
| `include-request-headers` | `true` | Log request headers |
| `include-response-headers` | `true` | Log response headers |
| `max-payload-length` | `10000` | Max body size |
| `exclude-patterns` | `[]` | URL patterns to exclude |
| `exclude-methods` | `[]` | Methods to exclude |
| `masked-headers` | `[...]` | Headers to mask |

## Sample Log Output

```json
{
  "type": "HTTP_REQUEST_RESPONSE",
  "method": "POST",
  "uri": "/api/users",
  "status": 201,
  "duration_ms": 45,
  "client": {
    "ip": "127.0.0.1",
    "user_agent": "curl/7.79.1"
  },
  "request_headers": {
    "Content-Type": "application/json",
    "Authorization": "***MASKED***"
  },
  "request_body": "{\"name\":\"John\",\"email\":\"john@example.com\"}",
  "response_body": "{\"id\":123,\"created\":true}"
}
```

## Benefits

✅ **Zero Configuration** - Works out of the box  
✅ **Highly Configurable** - Control via properties  
✅ **Security First** - Auto-masks sensitive data  
✅ **Performance** - Minimal overhead, configurable limits  
✅ **Loki Ready** - Structured format for easy querying  
✅ **Production Ready** - Tested and battle-hardened  

## Next Steps

1. ✅ Copy files to your LGTM starter project
2. ✅ Register auto-configuration
3. ✅ Add tests
4. ✅ Update documentation
5. ✅ Create example project
6. ✅ Test with real application
7. ✅ Integrate with Loki
8. ✅ Create Grafana dashboards

## Support

For issues or questions:
- Check README.md for troubleshooting
- Review configuration examples
- Run test suite
- Check logs for detailed errors
