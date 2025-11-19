package com.yourorg.lgtm.logging.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.yourorg.lgtm.logging.config.LgtmLoggingProperties;
import com.yourorg.lgtm.logging.model.HttpLogEntry;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StreamUtils;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * Filter that logs HTTP requests and responses.
 * 
 * Features:
 * - Logs request method, URI, headers, body
 * - Logs response status, headers, body
 * - Configurable inclusion/exclusion patterns
 * - Sensitive header masking
 * - Request correlation ID
 * - Performance metrics
 */
public class RequestResponseLoggingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger("HTTP_LOG");
    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    private static final String CORRELATION_ID_KEY = "correlationId";
    
    private final LgtmLoggingProperties properties;
    private final ObjectMapper objectMapper;
    private final AntPathMatcher pathMatcher;

    public RequestResponseLoggingFilter(LgtmLoggingProperties properties) {
        this.properties = properties;
        this.objectMapper = new ObjectMapper();
        if (properties.isPrettyPrint()) {
            this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        }
        this.pathMatcher = new AntPathMatcher();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (!(request instanceof HttpServletRequest) || !(response instanceof HttpServletResponse)) {
            chain.doFilter(request, response);
            return;
        }

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Check if this request should be logged
        if (!shouldLog(httpRequest)) {
            chain.doFilter(request, response);
            return;
        }

        // Generate or retrieve correlation ID
        String correlationId = getOrCreateCorrelationId(httpRequest);
        MDC.put(CORRELATION_ID_KEY, correlationId);

        try {
            // Wrap request and response to cache body content
            ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(httpRequest);
            ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(httpResponse);

            // Record start time
            long startTime = System.currentTimeMillis();

            // Log request
            logRequest(wrappedRequest, correlationId);

            try {
                // Continue filter chain
                chain.doFilter(wrappedRequest, wrappedResponse);
            } finally {
                // Calculate duration
                long duration = System.currentTimeMillis() - startTime;

                // Log response
                logResponse(wrappedRequest, wrappedResponse, correlationId, duration);

                // Copy cached response content to actual response
                wrappedResponse.copyBodyToResponse();
            }
        } finally {
            MDC.remove(CORRELATION_ID_KEY);
        }
    }

    /**
     * Determine if the request should be logged based on configuration
     */
    private boolean shouldLog(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // Check excluded methods
        if (!properties.getExcludeMethods().isEmpty() && 
            properties.getExcludeMethods().contains(method.toUpperCase())) {
            return false;
        }

        // Check included methods
        if (!properties.getIncludeMethods().isEmpty() && 
            !properties.getIncludeMethods().contains(method.toUpperCase())) {
            return false;
        }

        // Check excluded patterns (takes precedence)
        if (!properties.getExcludePatterns().isEmpty()) {
            for (String pattern : properties.getExcludePatterns()) {
                if (pathMatcher.match(pattern, uri)) {
                    return false;
                }
            }
        }

        // Check included patterns
        if (!properties.getIncludePatterns().isEmpty()) {
            for (String pattern : properties.getIncludePatterns()) {
                if (pathMatcher.match(pattern, uri)) {
                    return true;
                }
            }
            return false; // No pattern matched
        }

        return true; // Include by default if no patterns specified
    }

    /**
     * Get or create correlation ID for request tracking
     */
    private String getOrCreateCorrelationId(HttpServletRequest request) {
        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }
        return correlationId;
    }

    /**
     * Log HTTP request details
     */
    private void logRequest(ContentCachingRequestWrapper request, String correlationId) {
        if (properties.isAsyncLogging()) {
            CompletableFuture.runAsync(() -> doLogRequest(request, correlationId));
        } else {
            doLogRequest(request, correlationId);
        }
    }

    private void doLogRequest(ContentCachingRequestWrapper request, String correlationId) {
        try {
            HttpLogEntry logEntry = new HttpLogEntry();
            logEntry.setTimestamp(Instant.now().toString());
            logEntry.setCorrelationId(correlationId);
            logEntry.setType("HTTP_REQUEST");
            logEntry.setMethod(request.getMethod());
            logEntry.setUri(request.getRequestURI());

            if (properties.isIncludeQueryParams() && request.getQueryString() != null) {
                logEntry.setQueryString(request.getQueryString());
            }

            if (properties.isIncludeHeaders()) {
                logEntry.setHeaders(extractHeaders(request));
            }

            if (properties.isIncludeRequestBody()) {
                String body = extractRequestBody(request);
                if (body != null && !body.isEmpty()) {
                    logEntry.setBody(truncateIfNeeded(body));
                }
            }

            if (properties.isIncludeClientInfo()) {
                logEntry.setRemoteAddress(request.getRemoteAddr());
                logEntry.setRemoteHost(request.getRemoteHost());
            }

            logHttpEntry(logEntry);

        } catch (Exception e) {
            log.error("Error logging request", e);
        }
    }

    /**
     * Log HTTP response details
     */
    private void logResponse(ContentCachingRequestWrapper request, 
                            ContentCachingResponseWrapper response, 
                            String correlationId, 
                            long duration) {
        if (properties.isAsyncLogging()) {
            CompletableFuture.runAsync(() -> doLogResponse(request, response, correlationId, duration));
        } else {
            doLogResponse(request, response, correlationId, duration);
        }
    }

    private void doLogResponse(ContentCachingRequestWrapper request,
                               ContentCachingResponseWrapper response,
                               String correlationId,
                               long duration) {
        try {
            HttpLogEntry logEntry = new HttpLogEntry();
            logEntry.setTimestamp(Instant.now().toString());
            logEntry.setCorrelationId(correlationId);
            logEntry.setType("HTTP_RESPONSE");
            logEntry.setMethod(request.getMethod());
            logEntry.setUri(request.getRequestURI());
            logEntry.setStatus(response.getStatus());
            logEntry.setDurationMs(duration);

            if (properties.isIncludeHeaders()) {
                logEntry.setHeaders(extractResponseHeaders(response));
            }

            if (properties.isIncludeResponseBody()) {
                String body = extractResponseBody(response);
                if (body != null && !body.isEmpty()) {
                    logEntry.setBody(truncateIfNeeded(body));
                }
            }

            logHttpEntry(logEntry);

        } catch (Exception e) {
            log.error("Error logging response", e);
        }
    }

    /**
     * Extract request headers and mask sensitive ones
     */
    private Map<String, String> extractHeaders(HttpServletRequest request) {
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
     * Extract response headers and mask sensitive ones
     */
    private Map<String, String> extractResponseHeaders(HttpServletResponse response) {
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
        return properties.getMaskedHeaders().stream()
            .anyMatch(masked -> masked.equalsIgnoreCase(headerName));
    }

    /**
     * Extract request body content
     */
    private String extractRequestBody(ContentCachingRequestWrapper request) {
        try {
            byte[] content = request.getContentAsByteArray();
            if (content.length > 0) {
                return new String(content, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.warn("Failed to extract request body", e);
        }
        return null;
    }

    /**
     * Extract response body content
     */
    private String extractResponseBody(ContentCachingResponseWrapper response) {
        try {
            byte[] content = response.getContentAsByteArray();
            if (content.length > 0) {
                return new String(content, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.warn("Failed to extract response body", e);
        }
        return null;
    }

    /**
     * Truncate body if it exceeds max size
     */
    private String truncateIfNeeded(String body) {
        if (body.length() > properties.getMaxBodySize()) {
            return body.substring(0, properties.getMaxBodySize()) + 
                   "... [TRUNCATED, total size: " + body.length() + " bytes]";
        }
        return body;
    }

    /**
     * Log the HTTP entry based on configured format
     */
    private void logHttpEntry(HttpLogEntry entry) {
        try {
            if (properties.getLogFormat() == LgtmLoggingProperties.LogFormat.JSON) {
                String json = objectMapper.writeValueAsString(entry);
                log.info(json);
            } else {
                log.info(entry.toPlainString());
            }
        } catch (Exception e) {
            log.error("Error formatting log entry", e);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
        // No initialization needed
    }

    @Override
    public void destroy() {
        // No cleanup needed
    }
}
