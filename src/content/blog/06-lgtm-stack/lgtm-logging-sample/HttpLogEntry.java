package com.yourorg.lgtm.logging.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

/**
 * Model representing an HTTP log entry (request or response).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HttpLogEntry {

    private String timestamp;
    private String correlationId;
    private String type; // HTTP_REQUEST or HTTP_RESPONSE
    private String method;
    private String uri;
    private String queryString;
    private Integer status;
    private Map<String, String> headers;
    private String body;
    private String remoteAddress;
    private String remoteHost;
    private Long durationMs;
    private String error;

    // Constructors

    public HttpLogEntry() {
    }

    // Getters and Setters

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getQueryString() {
        return queryString;
    }

    public void setQueryString(String queryString) {
        this.queryString = queryString;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getRemoteAddress() {
        return remoteAddress;
    }

    public void setRemoteAddress(String remoteAddress) {
        this.remoteAddress = remoteAddress;
    }

    public String getRemoteHost() {
        return remoteHost;
    }

    public void setRemoteHost(String remoteHost) {
        this.remoteHost = remoteHost;
    }

    public Long getDurationMs() {
        return durationMs;
    }

    public void setDurationMs(Long durationMs) {
        this.durationMs = durationMs;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    /**
     * Convert to plain string format for logging
     */
    public String toPlainString() {
        StringBuilder sb = new StringBuilder();
        sb.append("[").append(type).append("] ");
        sb.append(method).append(" ").append(uri);
        
        if (queryString != null) {
            sb.append("?").append(queryString);
        }
        
        if (status != null) {
            sb.append(" - Status: ").append(status);
        }
        
        if (durationMs != null) {
            sb.append(" - Duration: ").append(durationMs).append("ms");
        }
        
        if (remoteAddress != null) {
            sb.append(" - Client: ").append(remoteAddress);
        }
        
        sb.append(" - CorrelationId: ").append(correlationId);
        
        if (headers != null && !headers.isEmpty()) {
            sb.append("\n  Headers: ").append(headers);
        }
        
        if (body != null && !body.isEmpty()) {
            sb.append("\n  Body: ").append(body);
        }
        
        if (error != null) {
            sb.append("\n  Error: ").append(error);
        }
        
        return sb.toString();
    }

    @Override
    public String toString() {
        return toPlainString();
    }
}
