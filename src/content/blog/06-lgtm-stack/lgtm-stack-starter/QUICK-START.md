# Quick Start Guide - HTTP Logging Implementation

## What You Have

A complete, production-ready HTTP request/response logging implementation with:
- ✅ Automatic logging of all endpoints
- ✅ Configurable via properties
- ✅ Pattern-based inclusion/exclusion
- ✅ Method filtering
- ✅ Header masking for security
- ✅ Loki-compatible structured logging
- ✅ Full test suite

## 5-Minute Setup

### Step 1: Copy the Files (2 min)

Copy these 3 core files to your `lgtm-spring-boot-autoconfigure` module:

```
your-project/lgtm-spring-boot-autoconfigure/
└── src/main/java/com/yourorg/lgtm/autoconfigure/logging/
    ├── HttpLoggingProperties.java
    ├── HttpLoggingFilter.java
    └── HttpLoggingAutoConfiguration.java
```

### Step 2: Register Auto-Configuration (1 min)

Add to `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`:

```
com.yourorg.lgtm.autoconfigure.LgtmAutoConfiguration
com.yourorg.lgtm.autoconfigure.LokiAutoConfiguration
com.yourorg.lgtm.autoconfigure.TempoAutoConfiguration
com.yourorg.lgtm.autoconfigure.MetricsAutoConfiguration
com.yourorg.lgtm.autoconfigure.logging.HttpLoggingAutoConfiguration
```

### Step 3: Build and Test (2 min)

```bash
# Build the starter
cd lgtm-spring-boot-starter
mvn clean install

# Create a test app
cd ../test-app
```

**application.yml**:
```yaml
spring:
  application:
    name: my-test-app

lgtm:
  logging:
    http:
      enabled: true
      exclude-patterns:
        - /actuator/**
```

**pom.xml**:
```xml
<dependency>
    <groupId>com.yourorg</groupId>
    <artifactId>lgtm-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Main App**:
```java
@SpringBootApplication
@RestController
public class TestApp {
    public static void main(String[] args) {
        SpringApplication.run(TestApp.class, args);
    }
    
    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello World!");
    }
}
```

```bash
# Run
mvn spring-boot:run

# Test
curl http://localhost:8080/hello
```

**Check logs** - you should see:
```
HTTP Transaction: {type=HTTP_REQUEST_RESPONSE, method=GET, uri=/hello, status=200, duration_ms=15, ...}
```

## Configuration Examples

### Development (Verbose Logging)
```yaml
lgtm:
  logging:
    http:
      enabled: true
      max-payload-length: -1
      pretty-print: true
```

### Production (Optimized)
```yaml
lgtm:
  logging:
    http:
      enabled: true
      include-response-body: false
      max-payload-length: 5000
      exclude-patterns:
        - /actuator/**
        - /health
        - /metrics
      exclude-methods:
        - OPTIONS
```

### Security-Focused (Minimal)
```yaml
lgtm:
  logging:
    http:
      enabled: true
      include-request-body: false
      include-response-body: false
      include-query-string: false
```

### API-Only (Whitelist)
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

## Common Use Cases

### 1. Exclude Health Checks
```yaml
lgtm:
  logging:
    http:
      exclude-patterns:
        - /health
        - /actuator/**
```

### 2. Log Only Errors (4xx/5xx)
Use a custom filter or Logback filter:
```xml
<logger name="com.yourorg.lgtm.autoconfigure.logging.HttpLoggingFilter" level="INFO">
    <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
        <level>WARN</level>
    </filter>
</logger>
```

### 3. Mask Custom Headers
```yaml
lgtm:
  logging:
    http:
      masked-headers:
        - Authorization
        - X-API-Key
        - X-Custom-Token
        - My-Secret-Header
```

### 4. Log Timing Only (Performance Monitoring)
```yaml
lgtm:
  logging:
    http:
      enabled: true
      include-request-body: false
      include-response-body: false
      include-request-headers: false
      include-response-headers: false
      include-timings: true
```

## Testing Your Implementation

### Run Sample Application
```bash
cd lgtm-starter-sample
mvn spring-boot:run
```

### Test Endpoints
```bash
# Simple GET
curl http://localhost:8080/api/hello

# With query params
curl "http://localhost:8080/api/search?query=test"

# POST with body
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# With headers (will be masked)
curl http://localhost:8080/api/secure \
  -H "Authorization: Bearer secret-token"

# Slow endpoint (timing)
curl http://localhost:8080/api/slow
```

### Run Tests
```bash
mvn test
```

## Integration with Loki

Once you have Loki running, logs are automatically sent. Query in Grafana:

```logql
# All HTTP requests
{application="my-app"} | json | type="HTTP_REQUEST_RESPONSE"

# Slow requests (> 1 second)
{application="my-app"} | json | type="HTTP_REQUEST_RESPONSE" | duration_ms > 1000

# Errors (5xx)
{application="my-app"} | json | type="HTTP_REQUEST_RESPONSE" | status >= 500

# Specific endpoint
{application="my-app"} | json | type="HTTP_REQUEST_RESPONSE" | uri="/api/users"

# POST requests only
{application="my-app"} | json | type="HTTP_REQUEST_RESPONSE" | method="POST"
```

## Troubleshooting

### Logs Not Appearing
```yaml
# Ensure it's enabled
lgtm.logging.http.enabled: true

# Check log level
logging.level.com.yourorg.lgtm.autoconfigure.logging: INFO
```

### Missing Bodies
```yaml
# Enable body logging
lgtm.logging.http.include-request-body: true
lgtm.logging.http.include-response-body: true
lgtm.logging.http.max-payload-length: 10000  # Not 0
```

### Everything is Masked
```yaml
# Review masked headers list
lgtm.logging.http.masked-headers:
  - Authorization
  # Remove headers you want to see (not recommended for sensitive data)
```

## Performance Tips

1. **Set Payload Limits**
   ```yaml
   max-payload-length: 5000  # 5KB max
   ```

2. **Exclude High-Traffic Endpoints**
   ```yaml
   exclude-patterns:
     - /metrics
     - /health
     - /static/**
   ```

3. **Disable Body Logging in Production**
   ```yaml
   include-request-body: false
   include-response-body: false
   ```

4. **Use Async Logging** (logback-spring.xml)
   ```xml
   <appender name="ASYNC" class="ch.qos.logback.classic.AsyncAppender">
     <appender-ref ref="CONSOLE" />
   </appender>
   ```

## Next Steps

1. ✅ **Run the sample** - `cd lgtm-starter-sample && mvn spring-boot:run`
2. ✅ **Test endpoints** - Use curl commands above
3. ✅ **Integrate into starter** - Copy files and register auto-config
4. ✅ **Configure for your needs** - Use examples above
5. ✅ **Add to real app** - Add dependency and configure
6. ✅ **Monitor in Loki** - Create Grafana dashboards
7. ✅ **Set up alerts** - Alert on slow requests or errors

## Files Reference

| File | Purpose | Location |
|------|---------|----------|
| HttpLoggingProperties.java | Configuration | autoconfigure/logging/ |
| HttpLoggingFilter.java | Filter implementation | autoconfigure/logging/ |
| HttpLoggingAutoConfiguration.java | Auto-config | autoconfigure/logging/ |
| application.yml | Default config | resources/ |
| application-examples.yml | Config examples | resources/ |
| SampleApplication.java | Demo app | example/ |
| HttpLoggingFilterTest.java | Tests | test/ |
| README.md | Full docs | root |

## Support & Documentation

- **Full Documentation**: See `README.md`
- **Configuration Examples**: See `application-examples.yml`
- **File Summary**: See `FILE-SUMMARY.md`
- **Test Examples**: See `HttpLoggingFilterTest.java`

## Success Checklist

- [ ] Files copied to autoconfigure module
- [ ] Auto-configuration registered
- [ ] Starter built and installed
- [ ] Test app created
- [ ] Sample endpoint added
- [ ] Logging working (check logs)
- [ ] Configuration tested
- [ ] Pattern exclusions working
- [ ] Header masking verified
- [ ] Tests passing
- [ ] Loki integration tested (optional)

## Quick Commands

```bash
# Build starter
mvn clean install

# Run sample
cd lgtm-starter-sample
mvn spring-boot:run

# Test endpoint
curl http://localhost:8080/api/hello

# Run tests
mvn test

# Check logs
tail -f logs/application.log

# Query Loki (if running)
curl -G http://localhost:3100/loki/api/v1/query \
  --data-urlencode 'query={application="my-app"}'
```

## You're Done! 🎉

Your HTTP logging is now:
- ✅ Production-ready
- ✅ Highly configurable
- ✅ Security-aware
- ✅ Performance-optimized
- ✅ Loki-integrated
- ✅ Fully tested

Start using it in your applications and monitor your HTTP traffic in Loki/Grafana!
