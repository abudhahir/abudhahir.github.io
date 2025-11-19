package com.yourorg.lgtm.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Filter to log HTTP requests and responses with configurable exclusions.
 * 
 * @author LGTM Team
 */
public class HttpLoggingFilter extends OncePerRequestFilter implements Ordered {

    private static final Logger log = LoggerFactory.getLogger(HttpLoggingFilter.class);
    private static final String CORRELATION_ID_LOG_VAR = "correlationId";
    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    private final HttpLoggingProperties properties;

    public HttpLoggingFilter(HttpLoggingProperties properties) {
        this.properties = properties;
        log.info("HTTP logging filter initialized with properties: enabled={}, logHeaders={}, logRequestBody={}, logResponseBody={}",
                properties.isEnabled(), properties.isLogHeaders(), 
                properties.isLogRequestBody(), properties.isLogResponseBody());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        if (!properties.isEnabled() || shouldExclude(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Set up correlation ID
        String correlationId = setupCorrelationId(request);

        // Wrap request and response to cache bodies
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        long startTime = System.currentTimeMillis();

        try {
            // Log request
            logRequest(wrappedRequest, correlationId);

            // Process the request
            filterChain.doFilter(wrappedRequest, wrappedResponse);

        } finally {
            long duration = System.currentTimeMillis() - startTime;

            // Log response
            logResponse(wrappedRequest, wrappedResponse, correlationId, duration);

            // Copy body to actual response
            wrappedResponse.copyBodyToResponse();

            // Clean up MDC
            MDC.remove(CORRELATION_ID_LOG_VAR);
        }
    }

    /**
     * Check if request should be excluded from logging
     */
    private boolean shouldExclude(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Check excluded paths
        for (String pattern : properties.getExcludedPaths()) {
            if (pathMatcher.match(pattern, path)) {
                log.trace("Excluding path: {} (matched pattern: {})", path, pattern);
                return true;
            }
        }

        // Check excluded methods
        if (properties.getExcludedMethods().contains(method.toUpperCase())) {
            log.trace("Excluding method: {}", method);
            return true;
        }

        return false;
    }

    /**
     * Set up correlation ID for request tracking
     */
    private String setupCorrelationId(HttpServletRequest request) {
        String correlationId = request.getHeader(properties.getCorrelationIdHeader());

        if (!StringUtils.hasText(correlationId) && properties.isGenerateCorrelationId()) {
            correlationId = UUID.randomUUID().toString();
        }

        if (StringUtils.hasText(correlationId)) {
            MDC.put(CORRELATION_ID_LOG_VAR, correlationId);
        }

        return correlationId;
    }

    /**
     * Log HTTP request details
     */
    private void logRequest(ContentCachingRequestWrapper request, String correlationId) {
        Map<String, Object> logData = new LinkedHashMap<>();
        
        logData.put("type", "HTTP_REQUEST");
        logData.put("timestamp", new Date());
        
        if (StringUtils.hasText(correlationId)) {
            logData.put("correlationId", correlationId);
        }
        
        logData.put("method", request.getMethod());
        logData.put("uri", request.getRequestURI());
        
        if (properties.isIncludeQueryString() && StringUtils.hasText(request.getQueryString())) {
            logData.put("queryString", request.getQueryString());
        }

        if (properties.isIncludeClientInfo()) {
            logData.put("remoteAddr", request.getRemoteAddr());
            logData.put("remoteHost", request.getRemoteHost());
        }

        // Log headers
        if (properties.isLogHeaders()) {
            logData.put("headers", getHeaders(request));
        }

        // Log request body
        if (properties.isLogRequestBody() && hasBody(request)) {
            String body = getRequestBody(request);
            if (StringUtils.hasText(body)) {
                logData.put("body", truncate(body));
            }
        }

        logAtConfiguredLevel("HTTP Request: {}", formatLogData(logData));
    }

    /**
     * Log HTTP response details
     */
    private void logResponse(ContentCachingRequestWrapper request, 
                            ContentCachingResponseWrapper response, 
                            String correlationId, 
                            long durationMs) {
        
        int status = response.getStatus();

        // Check if we should log this response based on status
        if (!shouldLogResponse(status, durationMs)) {
            return;
        }

        Map<String, Object> logData = new LinkedHashMap<>();
        
        logData.put("type", "HTTP_RESPONSE");
        logData.put("timestamp", new Date());
        
        if (StringUtils.hasText(correlationId)) {
            logData.put("correlationId", correlationId);
        }
        
        logData.put("method", request.getMethod());
        logData.put("uri", request.getRequestURI());
        logData.put("status", status);
        logData.put("durationMs", durationMs);

        // Log response headers
        if (properties.isLogHeaders()) {
            logData.put("headers", getHeaders(response));
        }

        // Log response body
        if (properties.isLogResponseBody() && hasBody(response)) {
            String body = getResponseBody(response);
            if (StringUtils.hasText(body)) {
                logData.put("body", truncate(body));
            }
        }

        logAtConfiguredLevel("HTTP Response: {}", formatLogData(logData));
    }

    /**
     * Check if response should be logged based on status and duration
     */
    private boolean shouldLogResponse(int status, long durationMs) {
        // Check minimum response time
        if (properties.getMinResponseTimeMs() > 0 && durationMs < properties.getMinResponseTimeMs()) {
            return false;
        }

        // Check status-based logging
        if (status >= 200 && status < 300) {
            return properties.isLogSuccessfulResponses();
        } else if (status >= 400 && status < 500) {
            return properties.isLogClientErrors();
        } else if (status >= 500) {
            return properties.isLogServerErrors();
        }

        return true;
    }

    /**
     * Extract and mask headers
     */
    private Map<String, String> getHeaders(HttpServletRequest request) {
        Map<String, String> headers = new LinkedHashMap<>();
        
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);
            
            // Mask sensitive headers
            if (isSensitiveHeader(headerName)) {
                headerValue = "***MASKED***";
            }
            
            headers.put(headerName, headerValue);
        }
        
        return headers;
    }

    /**
     * Extract and mask response headers
     */
    private Map<String, String> getHeaders(HttpServletResponse response) {
        Map<String, String> headers = new LinkedHashMap<>();
        
        for (String headerName : response.getHeaderNames()) {
            String headerValue = response.getHeader(headerName);
            
            // Mask sensitive headers
            if (isSensitiveHeader(headerName)) {
                headerValue = "***MASKED***";
            }
            
            headers.put(headerName, headerValue);
        }
        
        return headers;
    }

    /**
     * Check if header is sensitive and should be masked
     */
    private boolean isSensitiveHeader(String headerName) {
        return properties.getSensitiveHeaders().stream()
                .anyMatch(sensitive -> sensitive.equalsIgnoreCase(headerName));
    }

    /**
     * Extract request body from cached content
     */
    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] buf = request.getContentAsByteArray();
        if (buf.length > 0) {
            try {
                return new String(buf, 0, Math.min(buf.length, properties.getMaxPayloadLength()), 
                        getCharacterEncoding(request));
            } catch (UnsupportedEncodingException e) {
                log.warn("Failed to parse request body", e);
                return "[Failed to parse request body]";
            }
        }
        return null;
    }

    /**
     * Extract response body from cached content
     */
    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] buf = response.getContentAsByteArray();
        if (buf.length > 0) {
            try {
                return new String(buf, 0, Math.min(buf.length, properties.getMaxPayloadLength()), 
                        getCharacterEncoding(response));
            } catch (UnsupportedEncodingException e) {
                log.warn("Failed to parse response body", e);
                return "[Failed to parse response body]";
            }
        }
        return null;
    }

    /**
     * Get character encoding from request
     */
    private String getCharacterEncoding(HttpServletRequest request) {
        String encoding = request.getCharacterEncoding();
        return encoding != null ? encoding : StandardCharsets.UTF_8.name();
    }

    /**
     * Get character encoding from response
     */
    private String getCharacterEncoding(HttpServletResponse response) {
        String encoding = response.getCharacterEncoding();
        return encoding != null ? encoding : StandardCharsets.UTF_8.name();
    }

    /**
     * Check if request has body
     */
    private boolean hasBody(HttpServletRequest request) {
        String method = request.getMethod();
        return "POST".equals(method) || "PUT".equals(method) || 
               "PATCH".equals(method) || "DELETE".equals(method);
    }

    /**
     * Check if response has body
     */
    private boolean hasBody(ContentCachingResponseWrapper response) {
        return response.getContentSize() > 0;
    }

    /**
     * Truncate string to max length
     */
    private String truncate(String str) {
        if (str == null) {
            return null;
        }
        if (str.length() <= properties.getMaxPayloadLength()) {
            return str;
        }
        return str.substring(0, properties.getMaxPayloadLength()) + "... [TRUNCATED]";
    }

    /**
     * Format log data as string
     */
    private String formatLogData(Map<String, Object> logData) {
        if (properties.isPrettyPrint()) {
            return logData.entrySet().stream()
                    .map(e -> String.format("  %s: %s", e.getKey(), formatValue(e.getValue())))
                    .collect(Collectors.joining("\n", "\n", ""));
        } else {
            return logData.toString();
        }
    }

    /**
     * Format value for logging
     */
    private String formatValue(Object value) {
        if (value instanceof Map) {
            return ((Map<?, ?>) value).entrySet().stream()
                    .map(e -> e.getKey() + "=" + e.getValue())
                    .collect(Collectors.joining(", ", "{", "}"));
        }
        return String.valueOf(value);
    }

    /**
     * Log at configured level
     */
    private void logAtConfiguredLevel(String message, Object... args) {
        switch (properties.getLogLevel().toUpperCase()) {
            case "TRACE":
                log.trace(message, args);
                break;
            case "DEBUG":
                log.debug(message, args);
                break;
            case "WARN":
                log.warn(message, args);
                break;
            case "ERROR":
                log.error(message, args);
                break;
            case "INFO":
            default:
                log.info(message, args);
                break;
        }
    }

    @Override
    public int getOrder() {
        return properties.getFilterOrder();
    }
}
