package com.yourorg.lgtm.autoconfigure.logging;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuration properties for HTTP request/response logging.
 */
@ConfigurationProperties(prefix = "lgtm.logging.http")
public class HttpLoggingProperties {

    /**
     * Enable HTTP request/response logging
     */
    private boolean enabled = true;

    /**
     * Log request body
     */
    private boolean includeRequestBody = true;

    /**
     * Log response body
     */
    private boolean includeResponseBody = true;

    /**
     * Log request headers
     */
    private boolean includeRequestHeaders = true;

    /**
     * Log response headers
     */
    private boolean includeResponseHeaders = true;

    /**
     * Log query parameters
     */
    private boolean includeQueryString = true;

    /**
     * Log client info (IP, User-Agent)
     */
    private boolean includeClientInfo = true;

    /**
     * Maximum payload size to log (in bytes). -1 for unlimited.
     */
    private int maxPayloadLength = 10000;

    /**
     * URL patterns to exclude from logging (supports Ant-style patterns)
     * Example: ["/actuator/**", "/health", "/metrics"]
     */
    private List<String> excludePatterns = new ArrayList<>();

    /**
     * URL patterns to include in logging (supports Ant-style patterns)
     * If empty, all endpoints are included (except excluded ones)
     * Example: ["/api/**", "/v1/**"]
     */
    private List<String> includePatterns = new ArrayList<>();

    /**
     * HTTP methods to exclude from logging
     * Example: ["OPTIONS", "HEAD"]
     */
    private List<String> excludeMethods = new ArrayList<>();

    /**
     * HTTP methods to include in logging
     * If empty, all methods are included (except excluded ones)
     * Example: ["GET", "POST", "PUT", "DELETE"]
     */
    private List<String> includeMethods = new ArrayList<>();

    /**
     * Headers to mask in logs (for security)
     * Example: ["Authorization", "X-API-Key", "Cookie"]
     */
    private List<String> maskedHeaders = List.of(
        "Authorization",
        "X-API-Key",
        "X-Auth-Token",
        "Cookie",
        "Set-Cookie"
    );

    /**
     * Request attributes to log
     */
    private boolean includeRequestAttributes = false;

    /**
     * Log timing information (request duration)
     */
    private boolean includeTimings = true;

    /**
     * Use pretty print for JSON bodies
     */
    private boolean prettyPrint = false;

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

    public boolean isIncludeRequestHeaders() {
        return includeRequestHeaders;
    }

    public void setIncludeRequestHeaders(boolean includeRequestHeaders) {
        this.includeRequestHeaders = includeRequestHeaders;
    }

    public boolean isIncludeResponseHeaders() {
        return includeResponseHeaders;
    }

    public void setIncludeResponseHeaders(boolean includeResponseHeaders) {
        this.includeResponseHeaders = includeResponseHeaders;
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

    public int getMaxPayloadLength() {
        return maxPayloadLength;
    }

    public void setMaxPayloadLength(int maxPayloadLength) {
        this.maxPayloadLength = maxPayloadLength;
    }

    public List<String> getExcludePatterns() {
        return excludePatterns;
    }

    public void setExcludePatterns(List<String> excludePatterns) {
        this.excludePatterns = excludePatterns;
    }

    public List<String> getIncludePatterns() {
        return includePatterns;
    }

    public void setIncludePatterns(List<String> includePatterns) {
        this.includePatterns = includePatterns;
    }

    public List<String> getExcludeMethods() {
        return excludeMethods;
    }

    public void setExcludeMethods(List<String> excludeMethods) {
        this.excludeMethods = excludeMethods;
    }

    public List<String> getIncludeMethods() {
        return includeMethods;
    }

    public void setIncludeMethods(List<String> includeMethods) {
        this.includeMethods = includeMethods;
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

    public boolean isIncludeTimings() {
        return includeTimings;
    }

    public void setIncludeTimings(boolean includeTimings) {
        this.includeTimings = includeTimings;
    }

    public boolean isPrettyPrint() {
        return prettyPrint;
    }

    public void setPrettyPrint(boolean prettyPrint) {
        this.prettyPrint = prettyPrint;
    }
}
