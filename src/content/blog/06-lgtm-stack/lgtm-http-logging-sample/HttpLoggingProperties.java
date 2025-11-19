package com.yourorg.lgtm.logging;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Configuration properties for HTTP request/response logging.
 * 
 * @author LGTM Team
 */
@ConfigurationProperties(prefix = "lgtm.http-logging")
@Validated
public class HttpLoggingProperties {

    /**
     * Enable or disable HTTP logging
     */
    private boolean enabled = true;

    /**
     * Include request and response headers in logs
     */
    private boolean logHeaders = true;

    /**
     * Include request body in logs
     */
    private boolean logRequestBody = true;

    /**
     * Include response body in logs
     */
    private boolean logResponseBody = true;

    /**
     * Maximum payload length to log (in characters)
     * Bodies larger than this will be truncated
     */
    @Min(100)
    private int maxPayloadLength = 10000;

    /**
     * Include query string parameters in logs
     */
    private boolean includeQueryString = true;

    /**
     * Include client IP address
     */
    private boolean includeClientInfo = true;

    /**
     * Log level for HTTP logs (TRACE, DEBUG, INFO, WARN, ERROR)
     */
    private String logLevel = "INFO";

    /**
     * Ant-style path patterns to exclude from logging
     * Example: /actuator/**, /health, /swagger-ui/**
     */
    private List<String> excludedPaths = new ArrayList<>(Arrays.asList(
            "/actuator/**",
            "/health",
            "/health/**"
    ));

    /**
     * HTTP methods to exclude from logging
     * Example: OPTIONS, TRACE
     */
    private List<String> excludedMethods = new ArrayList<>(Arrays.asList(
            "OPTIONS"
    ));

    /**
     * Headers that should be masked in logs for security
     * Values will be replaced with ***MASKED***
     */
    private List<String> sensitiveHeaders = new ArrayList<>(Arrays.asList(
            "Authorization",
            "Cookie",
            "Set-Cookie",
            "X-API-Key",
            "X-Auth-Token",
            "X-CSRF-Token",
            "Proxy-Authorization"
    ));

    /**
     * Whether to use pretty-print for JSON bodies
     */
    private boolean prettyPrint = false;

    /**
     * Prefix for correlation ID header
     */
    private String correlationIdHeader = "X-Correlation-ID";

    /**
     * Whether to generate correlation ID if not present
     */
    private boolean generateCorrelationId = true;

    /**
     * Filter order (lower values = higher priority)
     */
    private int filterOrder = -999;

    /**
     * Whether to log successful responses (2xx)
     */
    private boolean logSuccessfulResponses = true;

    /**
     * Whether to log client errors (4xx)
     */
    private boolean logClientErrors = true;

    /**
     * Whether to log server errors (5xx)
     */
    private boolean logServerErrors = true;

    /**
     * Minimum response time (ms) to log (0 = log all)
     * Useful to only log slow requests
     */
    private long minResponseTimeMs = 0;

    // Getters and Setters

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isLogHeaders() {
        return logHeaders;
    }

    public void setLogHeaders(boolean logHeaders) {
        this.logHeaders = logHeaders;
    }

    public boolean isLogRequestBody() {
        return logRequestBody;
    }

    public void setLogRequestBody(boolean logRequestBody) {
        this.logRequestBody = logRequestBody;
    }

    public boolean isLogResponseBody() {
        return logResponseBody;
    }

    public void setLogResponseBody(boolean logResponseBody) {
        this.logResponseBody = logResponseBody;
    }

    public int getMaxPayloadLength() {
        return maxPayloadLength;
    }

    public void setMaxPayloadLength(int maxPayloadLength) {
        this.maxPayloadLength = maxPayloadLength;
    }

    public boolean isIncludeQueryString() {
        return includeQueryString;
    }

    public void setIncludeQueryString(boolean includeQueryString) {
        this.includeQueryString = includeQueryString;
    }

    public boolean isIncludeClientInfo() {
        return includeClientInfo;
    }

    public void setIncludeClientInfo(boolean includeClientInfo) {
        this.includeClientInfo = includeClientInfo;
    }

    public String getLogLevel() {
        return logLevel;
    }

    public void setLogLevel(String logLevel) {
        this.logLevel = logLevel;
    }

    public List<String> getExcludedPaths() {
        return excludedPaths;
    }

    public void setExcludedPaths(List<String> excludedPaths) {
        this.excludedPaths = excludedPaths;
    }

    public List<String> getExcludedMethods() {
        return excludedMethods;
    }

    public void setExcludedMethods(List<String> excludedMethods) {
        this.excludedMethods = excludedMethods;
    }

    public List<String> getSensitiveHeaders() {
        return sensitiveHeaders;
    }

    public void setSensitiveHeaders(List<String> sensitiveHeaders) {
        this.sensitiveHeaders = sensitiveHeaders;
    }

    public boolean isPrettyPrint() {
        return prettyPrint;
    }

    public void setPrettyPrint(boolean prettyPrint) {
        this.prettyPrint = prettyPrint;
    }

    public String getCorrelationIdHeader() {
        return correlationIdHeader;
    }

    public void setCorrelationIdHeader(String correlationIdHeader) {
        this.correlationIdHeader = correlationIdHeader;
    }

    public boolean isGenerateCorrelationId() {
        return generateCorrelationId;
    }

    public void setGenerateCorrelationId(boolean generateCorrelationId) {
        this.generateCorrelationId = generateCorrelationId;
    }

    public int getFilterOrder() {
        return filterOrder;
    }

    public void setFilterOrder(int filterOrder) {
        this.filterOrder = filterOrder;
    }

    public boolean isLogSuccessfulResponses() {
        return logSuccessfulResponses;
    }

    public void setLogSuccessfulResponses(boolean logSuccessfulResponses) {
        this.logSuccessfulResponses = logSuccessfulResponses;
    }

    public boolean isLogClientErrors() {
        return logClientErrors;
    }

    public void setLogClientErrors(boolean logClientErrors) {
        this.logClientErrors = logClientErrors;
    }

    public boolean isLogServerErrors() {
        return logServerErrors;
    }

    public void setLogServerErrors(boolean logServerErrors) {
        this.logServerErrors = logServerErrors;
    }

    public long getMinResponseTimeMs() {
        return minResponseTimeMs;
    }

    public void setMinResponseTimeMs(long minResponseTimeMs) {
        this.minResponseTimeMs = minResponseTimeMs;
    }
}
