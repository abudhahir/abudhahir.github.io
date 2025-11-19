package com.yourorg.lgtm.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Auto-configuration for HTTP request/response logging.
 * 
 * Automatically enabled when:
 * - Application is a web application
 * - lgtm.http-logging.enabled=true (default)
 * 
 * @author LGTM Team
 */
@Configuration
@ConditionalOnWebApplication
@ConditionalOnProperty(
    prefix = "lgtm.http-logging",
    name = "enabled",
    havingValue = "true",
    matchIfMissing = true
)
@EnableConfigurationProperties(HttpLoggingProperties.class)
public class HttpLoggingAutoConfiguration {

    private static final Logger log = LoggerFactory.getLogger(HttpLoggingAutoConfiguration.class);

    public HttpLoggingAutoConfiguration() {
        log.info("Initializing HTTP Logging Auto-Configuration");
    }

    /**
     * Register the HTTP logging filter
     */
    @Bean
    public FilterRegistrationBean<HttpLoggingFilter> httpLoggingFilter(HttpLoggingProperties properties) {
        log.info("Registering HTTP logging filter with order: {}", properties.getFilterOrder());
        
        HttpLoggingFilter filter = new HttpLoggingFilter(properties);
        
        FilterRegistrationBean<HttpLoggingFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(properties.getFilterOrder());
        registration.addUrlPatterns("/*");
        
        return registration;
    }

    /**
     * Optional: Bean for programmatic customization
     */
    @Bean
    public HttpLoggingConfigurer httpLoggingConfigurer(HttpLoggingProperties properties) {
        return new HttpLoggingConfigurer(properties);
    }
}
