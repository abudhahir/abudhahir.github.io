package com.yourorg.lgtm.logging.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Configuration properties for LGTM HTTP request/response logging.
 * 
 * Usage:
 * <pre>
 * lgtm:
 *   logging:
 *     enabled: true
 *     include-patterns:
 *       - "/api/**"
 * </pre>
 */
@ConfigurationProperties(prefix = "lgtm.logging")
public class LgtmLoggingProperties {

    /**
     * Enable or disable HTTP request/response logging
     */
    private boolean enabled = true;

    /**
     * Include request body in logs
     */
    private boolean includeRequestBody = true;

    /**
     * Include response body in logs
     */
    private boolean includeResponseBody = true;

    /**
     * Include headers in logs
     */
    private boolean includeHeaders = true;

    /**
     * Include query parameters in logs
     */
    private boolean includeQueryParams = true;

    /**
     * Include client IP address
     */
    private boolean includeClientInfo = true;

    /**
     * Maximum body size to log (in bytes). Larger bodies will be truncated.
     * Default: 10KB
     */
    private int maxBodySize = 10000;

    /**
     * Ant-style path patterns to include for logging.
     * Empty list means include all endpoints.
     * Example: ["/api/**", "/v1/**"]
     */
    private List<String> includePatterns = new ArrayList<>();

    /**
     * Ant-style path patterns to exclude from logging.
     * Takes precedence over include patterns.
     * Example: ["/actuator/**", "/health"]
     */
    private List<String> excludePatterns = Arrays.asList("/actuator/**", "/health", "/metrics");

    /**
     * HTTP methods to include for logging.
     * Empty list means include all methods.
     * Example: ["GET", "POST", "PUT", "DELETE"]
     */
    private List<String> includeMethods = new ArrayList<>();

    /**
     * HTTP methods to exclude from logging.
     * Example: ["OPTIONS", "HEAD"]
     */
    private List<String> excludeMethods = Arrays.asList("OPTIONS", "HEAD", "TRACE");

    /**
     * Headers to mask in logs (case-insensitive).
     * Values will be replaced with "***MASKED***"
     */
    private List<String> maskedHeaders = Arrays.asList(
        "Authorization",
        "Proxy-Authorization",
        "Cookie",
        "Set-Cookie",
        "X-API-Key",
        "X-Auth-Token",
        "X-CSRF-Token"
    );

    /**
     * Request attributes to include in logs
     */
    private boolean includeRequestAttributes = false;

    /**
     * Log format: JSON or PLAIN
     */
    private LogFormat logFormat = LogFormat.JSON;

    /**
     * Pretty print JSON logs (for debugging)
     */
    private boolean prettyPrint = false;

    /**
     * Include stack trace for errors
     */
    private boolean includeErrorStackTrace = true;

    /**
     * Async logging to avoid blocking requests
     */
    private boolean asyncLogging = true;

    /**
     * Order of the logging filter
     */
    private int filterOrder = -1;

    // Getters and Setters

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isIncludeRequestBody() {
        return includeRequestBody;
    }

    public void setIncludeRequestBody(boolean includeRequestBody) {
        this.includeRequestBody = includeRequestBody;
    }

    public boolean isIncludeResponseBody() {
        return includeResponseBody;
    }

    public void setIncludeResponseBody(boolean includeResponseBody) {
        this.includeResponseBody = includeResponseBody;
    }

    public boolean isIncludeHeaders() {
        return includeHeaders;
    }

    public void setIncludeHeaders(boolean includeHeaders) {
        this.includeHeaders = includeHeaders;
    }

    public boolean isIncludeQueryParams() {
        return includeQueryParams;
    }

    public void setIncludeQueryParams(boolean includeQueryParams) {
        this.includeQueryParams = includeQueryParams;
    }

    public boolean isIncludeClientInfo() {
        return includeClientInfo;
    }

    public void setIncludeClientInfo(boolean includeClientInfo) {
        this.includeClientInfo = includeClientInfo;
    }

    public int getMaxBodySize() {
        return maxBodySize;
    }

    public void setMaxBodySize(int maxBodySize) {
        this.maxBodySize = maxBodySize;
    }

    public List<String> getIncludePatterns() {
        return includePatterns;
    }

    public void setIncludePatterns(List<String> includePatterns) {
        this.includePatterns = includePatterns;
    }

    public List<String> getExcludePatterns() {
        return excludePatterns;
    }

    public void setExcludePatterns(List<String> excludePatterns) {
        this.excludePatterns = excludePatterns;
    }

    public List<String> getIncludeMethods() {
        return includeMethods;
    }

    public void setIncludeMethods(List<String> includeMethods) {
        this.includeMethods = includeMethods;
    }

    public List<String> getExcludeMethods() {
        return excludeMethods;
    }

    public void setExcludeMethods(List<String> excludeMethods) {
        this.excludeMethods = excludeMethods;
    }

    public List<String> getMaskedHeaders() {
        return maskedHeaders;
    }

    public void setMaskedHeaders(List<String> maskedHeaders) {
        this.maskedHeaders = maskedHeaders;
    }

    public boolean isIncludeRequestAttributes() {
        return includeRequestAttributes;
    }

    public void setIncludeRequestAttributes(boolean includeRequestAttributes) {
        this.includeRequestAttributes = includeRequestAttributes;
    }

    public LogFormat getLogFormat() {
        return logFormat;
    }

    public void setLogFormat(LogFormat logFormat) {
        this.logFormat = logFormat;
    }

    public boolean isPrettyPrint() {
        return prettyPrint;
    }

    public void setPrettyPrint(boolean prettyPrint) {
        this.prettyPrint = prettyPrint;
    }

    public boolean isIncludeErrorStackTrace() {
        return includeErrorStackTrace;
    }

    public void setIncludeErrorStackTrace(boolean includeErrorStackTrace) {
        this.includeErrorStackTrace = includeErrorStackTrace;
    }

    public boolean isAsyncLogging() {
        return asyncLogging;
    }

    public void setAsyncLogging(boolean asyncLogging) {
        this.asyncLogging = asyncLogging;
    }

    public int getFilterOrder() {
        return filterOrder;
    }

    public void setFilterOrder(int filterOrder) {
        this.filterOrder = filterOrder;
    }

    public enum LogFormat {
        JSON,
        PLAIN
    }
}
