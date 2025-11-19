package com.yourorg.lgtm.logging.config;

import com.yourorg.lgtm.logging.filter.RequestResponseLoggingFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/**
 * Auto-configuration for LGTM HTTP request/response logging.
 * 
 * This configuration is activated when:
 * - Running in a web application (servlet-based)
 * - Property lgtm.logging.enabled is true (default)
 */
@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@ConditionalOnProperty(
    prefix = "lgtm.logging",
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true
)
@EnableConfigurationProperties(LgtmLoggingProperties.class)
public class LgtmLoggingAutoConfiguration {

    private static final Logger log = LoggerFactory.getLogger(LgtmLoggingAutoConfiguration.class);

    @Bean
    public RequestResponseLoggingFilter requestResponseLoggingFilter(LgtmLoggingProperties properties) {
        log.info("Initializing LGTM Request/Response Logging Filter");
        logConfiguration(properties);
        return new RequestResponseLoggingFilter(properties);
    }

    @Bean
    public FilterRegistrationBean<RequestResponseLoggingFilter> loggingFilterRegistration(
            RequestResponseLoggingFilter filter,
            LgtmLoggingProperties properties) {
        
        FilterRegistrationBean<RequestResponseLoggingFilter> registration = 
            new FilterRegistrationBean<>(filter);
        
        registration.setOrder(properties.getFilterOrder() != 0 
            ? properties.getFilterOrder() 
            : Ordered.HIGHEST_PRECEDENCE);
        
        registration.addUrlPatterns("/*");
        registration.setName("lgtmRequestResponseLoggingFilter");
        
        log.info("LGTM Logging Filter registered with order: {}", registration.getOrder());
        
        return registration;
    }

    private void logConfiguration(LgtmLoggingProperties properties) {
        log.info("LGTM Logging Configuration:");
        log.info("  - Request Body Logging: {}", properties.isIncludeRequestBody());
        log.info("  - Response Body Logging: {}", properties.isIncludeResponseBody());
        log.info("  - Headers Logging: {}", properties.isIncludeHeaders());
        log.info("  - Max Body Size: {} bytes", properties.getMaxBodySize());
        log.info("  - Log Format: {}", properties.getLogFormat());
        log.info("  - Async Logging: {}", properties.isAsyncLogging());
        
        if (!properties.getIncludePatterns().isEmpty()) {
            log.info("  - Include Patterns: {}", properties.getIncludePatterns());
        }
        
        if (!properties.getExcludePatterns().isEmpty()) {
            log.info("  - Exclude Patterns: {}", properties.getExcludePatterns());
        }
        
        if (!properties.getIncludeMethods().isEmpty()) {
            log.info("  - Include Methods: {}", properties.getIncludeMethods());
        }
        
        if (!properties.getExcludeMethods().isEmpty()) {
            log.info("  - Exclude Methods: {}", properties.getExcludeMethods());
        }
    }
}
