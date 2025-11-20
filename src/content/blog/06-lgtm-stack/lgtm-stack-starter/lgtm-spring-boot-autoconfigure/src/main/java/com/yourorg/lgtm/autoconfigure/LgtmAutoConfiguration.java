package com.yourorg.lgtm.autoconfigure;

import com.yourorg.lgtm.autoconfigure.http.HttpLoggingAutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@ConditionalOnProperty(prefix = "lgtm", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(LgtmProperties.class)
@Import({HttpLoggingAutoConfiguration.class})
public class LgtmAutoConfiguration {
}
