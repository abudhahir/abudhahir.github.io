package com.yourorg.lgtm.logging;

/**
 * Utility class for programmatic configuration of HTTP logging.
 * 
 * Example usage:
 * <pre>
 * &#64;Configuration
 * public class CustomLoggingConfig {
 *     &#64;Bean
 *     public HttpLoggingCustomizer myCustomizer() {
 *         return configurer -> {
 *             configurer.excludePath("/my-custom-path/**");
 *             configurer.excludeMethod("HEAD");
 *             configurer.addSensitiveHeader("X-My-Secret-Header");
 *         };
 *     }
 * }
 * </pre>
 * 
 * @author LGTM Team
 */
public class HttpLoggingConfigurer {

    private final HttpLoggingProperties properties;

    public HttpLoggingConfigurer(HttpLoggingProperties properties) {
        this.properties = properties;
    }

    /**
     * Add a path pattern to exclude from logging
     */
    public HttpLoggingConfigurer excludePath(String pathPattern) {
        if (!properties.getExcludedPaths().contains(pathPattern)) {
            properties.getExcludedPaths().add(pathPattern);
        }
        return this;
    }

    /**
     * Add an HTTP method to exclude from logging
     */
    public HttpLoggingConfigurer excludeMethod(String method) {
        String upperMethod = method.toUpperCase();
        if (!properties.getExcludedMethods().contains(upperMethod)) {
            properties.getExcludedMethods().add(upperMethod);
        }
        return this;
    }

    /**
     * Add a sensitive header that should be masked
     */
    public HttpLoggingConfigurer addSensitiveHeader(String headerName) {
        if (!properties.getSensitiveHeaders().contains(headerName)) {
            properties.getSensitiveHeaders().add(headerName);
        }
        return this;
    }

    /**
     * Enable or disable request body logging
     */
    public HttpLoggingConfigurer logRequestBody(boolean enable) {
        properties.setLogRequestBody(enable);
        return this;
    }

    /**
     * Enable or disable response body logging
     */
    public HttpLoggingConfigurer logResponseBody(boolean enable) {
        properties.setLogResponseBody(enable);
        return this;
    }

    /**
     * Set maximum payload length to log
     */
    public HttpLoggingConfigurer maxPayloadLength(int length) {
        properties.setMaxPayloadLength(length);
        return this;
    }

    /**
     * Set log level
     */
    public HttpLoggingConfigurer logLevel(String level) {
        properties.setLogLevel(level);
        return this;
    }

    /**
     * Get the underlying properties
     */
    public HttpLoggingProperties getProperties() {
        return properties;
    }
}
