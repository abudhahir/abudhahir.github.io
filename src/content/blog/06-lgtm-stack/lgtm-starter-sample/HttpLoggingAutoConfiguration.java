package com.yourorg.lgtm.autoconfigure.logging;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/**
 * Auto-configuration for HTTP request/response logging.
 */
@Configuration
@ConditionalOnWebApplication
@ConditionalOnProperty(prefix = "lgtm.logging.http", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(HttpLoggingProperties.class)
public class HttpLoggingAutoConfiguration {

    /**
     * Register the HTTP logging filter with high priority
     */
    @Bean
    public FilterRegistrationBean<HttpLoggingFilter> httpLoggingFilter(HttpLoggingProperties properties) {
        FilterRegistrationBean<HttpLoggingFilter> registrationBean = new FilterRegistrationBean<>();
        
        registrationBean.setFilter(new HttpLoggingFilter(properties));
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE + 1);
        registrationBean.setName("httpLoggingFilter");
        
        return registrationBean;
    }
}
