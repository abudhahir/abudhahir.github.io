package com.yourorg.lgtm.autoconfigure.http;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;

/**
 * Filter that logs HTTP request and response details.
 * Supports configurable inclusion/exclusion of endpoints and methods.
 */
public class HttpLoggingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(HttpLoggingFilter.class);
    private static final String MASKED_VALUE = "***MASKED***";

    private final HttpLoggingProperties properties;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public HttpLoggingFilter(HttpLoggingProperties properties) {
        this.properties = properties;
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

        // Wrap request and response to cache content
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(httpRequest);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(httpResponse);

        long startTime = System.currentTimeMillis();

        try {
            // Process the request
            chain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            long duration = System.currentTimeMillis() - startTime;

            // Log the request and response
            logRequestResponse(wrappedRequest, wrappedResponse, duration);

            // Copy response body back to the original response
            wrappedResponse.copyBodyToResponse();
        }
    }

    /**
     * Determines if the request should be logged based on configuration
     */
    private boolean shouldLog(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // Check method exclusions
        if (!properties.getExcludeMethods().isEmpty() &&
            properties.getExcludeMethods().contains(method.toUpperCase())) {
            return false;
        }

        // Check method inclusions
        if (!properties.getIncludeMethods().isEmpty() &&
            !properties.getIncludeMethods().contains(method.toUpperCase())) {
            return false;
        }

        // Check URL pattern exclusions
        for (String pattern : properties.getExcludePatterns()) {
            if (pathMatcher.match(pattern, uri)) {
                return false;
            }
        }

        // Check URL pattern inclusions
        if (!properties.getIncludePatterns().isEmpty()) {
            boolean matches = false;
            for (String pattern : properties.getIncludePatterns()) {
                if (pathMatcher.match(pattern, uri)) {
                    matches = true;
                    break;
                }
            }
            if (!matches) {
                return false;
            }
        }

        return true;
    }

    /**
     * Logs the request and response details
     */
    private void logRequestResponse(ContentCachingRequestWrapper request,
                                    ContentCachingResponseWrapper response,
                                    long duration) {
        try {
            Map<String, Object> logData = new LinkedHashMap<>();

            // Basic request info
            logData.put("type", "HTTP_REQUEST_RESPONSE");
            logData.put("method", request.getMethod());
            logData.put("uri", request.getRequestURI());
            logData.put("status", response.getStatus());

            if (properties.isIncludeTimings()) {
                logData.put("duration_ms", duration);
            }

            // Query parameters
            if (properties.isIncludeQueryString() && request.getQueryString() != null) {
                logData.put("query_string", request.getQueryString());
            }

            // Client info
            if (properties.isIncludeClientInfo()) {
                Map<String, String> clientInfo = new LinkedHashMap<>();
                clientInfo.put("ip", getClientIP(request));
                clientInfo.put("user_agent", request.getHeader("User-Agent"));
                logData.put("client", clientInfo);
            }

            // Request headers
            if (properties.isIncludeRequestHeaders()) {
                logData.put("request_headers", extractHeaders(request));
            }

            // Request body
            if (properties.isIncludeRequestBody()) {
                String requestBody = getRequestBody(request);
                if (requestBody != null && !requestBody.isEmpty()) {
                    logData.put("request_body", truncateIfNeeded(requestBody));
                }
            }

            // Response headers
            if (properties.isIncludeResponseHeaders()) {
                logData.put("response_headers", extractResponseHeaders(response));
            }

            // Response body
            if (properties.isIncludeResponseBody()) {
                String responseBody = getResponseBody(response);
                if (responseBody != null && !responseBody.isEmpty()) {
                    logData.put("response_body", truncateIfNeeded(responseBody));
                }
            }

            // Log as JSON-like structure (works well with Loki)
            log.info("HTTP Transaction: {}", formatLogData(logData));

        } catch (Exception e) {
            log.error("Error logging request/response", e);
        }
    }

    /**
     * Extract and mask sensitive headers
     */
    private Map<String, String> extractHeaders(HttpServletRequest request) {
        Map<String, String> headers = new LinkedHashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();

        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            String headerValue = request.getHeader(headerName);

            // Mask sensitive headers
            if (isSensitiveHeader(headerName)) {
                headerValue = MASKED_VALUE;
            }

            headers.put(headerName, headerValue);
        }

        return headers;
    }

    /**
     * Extract response headers
     */
    private Map<String, String> extractResponseHeaders(HttpServletResponse response) {
        Map<String, String> headers = new LinkedHashMap<>();

        for (String headerName : response.getHeaderNames()) {
            String headerValue = response.getHeader(headerName);

            // Mask sensitive headers
            if (isSensitiveHeader(headerName)) {
                headerValue = MASKED_VALUE;
            }

            headers.put(headerName, headerValue);
        }

        return headers;
    }

    /**
     * Check if header should be masked
     */
    private boolean isSensitiveHeader(String headerName) {
        return properties.getMaskedHeaders().stream()
            .anyMatch(masked -> masked.equalsIgnoreCase(headerName));
    }

    /**
     * Get request body from cached content
     */
    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] content = request.getContentAsByteArray();
        if (content.length > 0) {
            return getContentAsString(content, request.getCharacterEncoding());
        }
        return null;
    }

    /**
     * Get response body from cached content
     */
    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] content = response.getContentAsByteArray();
        if (content.length > 0) {
            return getContentAsString(content, response.getCharacterEncoding());
        }
        return null;
    }

    /**
     * Convert byte array to string with proper encoding
     */
    private String getContentAsString(byte[] content, String encoding) {
        try {
            return new String(content, encoding != null ? encoding : "UTF-8");
        } catch (UnsupportedEncodingException e) {
            return "[Unable to decode content]";
        }
    }

    /**
     * Truncate content if it exceeds max length
     */
    private String truncateIfNeeded(String content) {
        if (properties.getMaxPayloadLength() > 0 && content.length() > properties.getMaxPayloadLength()) {
            return content.substring(0, properties.getMaxPayloadLength()) + "... [TRUNCATED]";
        }
        return content;
    }

    /**
     * Get real client IP (handles proxies)
     */
    private String getClientIP(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // If multiple IPs, take the first one
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    /**
     * Format log data as a readable string
     */
    private String formatLogData(Map<String, Object> logData) {
        if (properties.isPrettyPrint()) {
            return formatPretty(logData, 0);
        }
        return logData.toString();
    }

    /**
     * Pretty print the log data
     */
    private String formatPretty(Object obj, int indent) {
        StringBuilder sb = new StringBuilder();
        String indentStr = "  ".repeat(indent);

        if (obj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) obj;
            sb.append("{\n");
            int count = 0;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                sb.append(indentStr).append("  ")
                  .append(entry.getKey()).append(": ")
                  .append(formatPretty(entry.getValue(), indent + 1));
                if (++count < map.size()) {
                    sb.append(",");
                }
                sb.append("\n");
            }
            sb.append(indentStr).append("}");
        } else {
            sb.append(obj);
        }

        return sb.toString();
    }
}
