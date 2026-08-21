package com.yourorg.lgtm.autoconfigure;

import com.yourorg.lgtm.autoconfigure.http.HttpLoggingProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

@ConfigurationProperties(prefix = "lgtm")
public class LgtmProperties {

    private boolean enabled = true;
    
    private String applicationName;
    
    private String environment;

    @NestedConfigurationProperty
    private HttpLoggingProperties http = new HttpLoggingProperties();

    // In a real scenario, you would add properties for loki, tempo, and metrics here.
    // private LokiProperties loki = new LokiProperties();
    // private TempoProperties tempo = new TempoProperties();
    // private MetricsProperties metrics = new MetricsProperties();


    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public HttpLoggingProperties getHttp() {
        return http;
    }

    public void setHttp(HttpLoggingProperties http) {
        this.http = http;
    }
}
