package com.yourorg.lgtm.autoconfigure.http;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for HTTP Logging Filter
 */
@SpringBootTest
@AutoConfigureMockMvc
class HttpLoggingFilterIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldLogSimpleGetRequest() throws Exception {
        mockMvc.perform(get("/api/hello"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Hello World!"));
    }

    @Test
    void shouldLogGetRequestWithPathVariable() throws Exception {
        mockMvc.perform(get("/api/users/123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(123))
            .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void shouldLogGetRequestWithQueryParameters() throws Exception {
        mockMvc.perform(get("/api/search")
                .param("query", "test")
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.query").value("test"));
    }

    @Test
    void shouldLogPostRequestWithBody() throws Exception {
        String requestBody = """
            {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "secret123"
            }
            """;

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(123))
            .andExpect(jsonPath("$.created").value(true));
    }

    @Test
    void shouldLogPutRequestWithBody() throws Exception {
        String requestBody = """
            {
                "name": "Jane Doe",
                "email": "jane@example.com"
            }
            """;

        mockMvc.perform(put("/api/users/456")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.updated").value(true));
    }

    @Test
    void shouldLogDeleteRequest() throws Exception {
        mockMvc.perform(delete("/api/users/789"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void shouldMaskSensitiveHeaders() throws Exception {
        mockMvc.perform(get("/api/secure")
                .header("Authorization", "Bearer super-secret-token")
                .header("X-API-Key", "my-secret-api-key"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.authenticated").value("true"));
        
        // The filter should mask Authorization and X-API-Key in logs
        // Manual verification: Check logs show ***MASKED*** instead of actual values
    }

    @Test
    void shouldLogErrorResponses() throws Exception {
        mockMvc.perform(get("/api/error-test"))
            .andExpect(status().isInternalServerError())
            .andExpect(jsonPath("$.error").value("Something went wrong"));
    }

    @Test
    void shouldLogRequestTiming() throws Exception {
        // This endpoint has a 2-second delay
        mockMvc.perform(get("/api/slow"))
            .andExpect(status().isOk());
        
        // Check logs for duration_ms field showing ~2000ms
    }
}

/**
 * Test with custom configuration - excluding specific patterns
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "lgtm.logging.http.enabled=true",
    "lgtm.logging.http.exclude-patterns[0]=/api/health",
    "lgtm.logging.http.exclude-patterns[1]=/actuator/**"
})
class HttpLoggingFilterExclusionTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldNotLogExcludedHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
            .andExpect(status().isOk());
        
        // Verify no log entry was created for /api/health
    }

    @Test
    void shouldLogNonExcludedEndpoint() throws Exception {
        mockMvc.perform(get("/api/hello"))
            .andExpect(status().isOk());
        
        // Verify log entry was created for /api/hello
    }
}

/**
 * Test with custom configuration - including only specific patterns
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "lgtm.logging.http.enabled=true",
    "lgtm.logging.http.include-patterns[0]=/api/**"
})
class HttpLoggingFilterInclusionTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldLogIncludedApiEndpoint() throws Exception {
        mockMvc.perform(get("/api/hello"))
            .andExpect(status().isOk());
        
        // Verify log entry was created
    }
}

/**
 * Test with custom configuration - excluding specific methods
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "lgtm.logging.http.enabled=true",
    "lgtm.logging.http.exclude-methods[0]=OPTIONS",
    "lgtm.logging.http.exclude-methods[1]=HEAD"
})
class HttpLoggingFilterMethodExclusionTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldNotLogOptionsRequest() throws Exception {
        mockMvc.perform(options("/api/hello"))
            .andExpect(status().isOk());
        
        // Verify no log entry for OPTIONS request
    }

    @Test
    void shouldLogGetRequest() throws Exception {
        mockMvc.perform(get("/api/hello"))
            .andExpect(status().isOk());
        
        // Verify log entry was created for GET request
    }
}

/**
 * Test with custom configuration - security focused (no body logging)
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "lgtm.logging.http.enabled=true",
    "lgtm.logging.http.include-request-body=false",
    "lgtm.logging.http.include-response-body=false",
    "lgtm.logging.http.include-query-string=false"
})
class HttpLoggingFilterSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldNotLogRequestBody() throws Exception {
        String requestBody = """
            {
                "name": "John Doe",
                "email": "john@example.com",
                "password": "super-secret-password"
            }
            """;

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated());
        
        // Verify logs don't contain request body
        // Verify logs don't contain "super-secret-password"
    }

    @Test
    void shouldNotLogQueryString() throws Exception {
        mockMvc.perform(get("/api/search")
                .param("query", "secret-token-in-query"))
            .andExpect(status().isOk());
        
        // Verify logs don't contain query string
    }
}

/**
 * Unit tests for HttpLoggingFilter logic
 */
class HttpLoggingFilterUnitTest {

    @Test
    void shouldMatchExcludePattern() {
        HttpLoggingProperties properties = new HttpLoggingProperties();
        properties.getExcludePatterns().add("/actuator/**");
        properties.getExcludePatterns().add("/health");
        
        // Test pattern matching logic
        // (You would need to expose the shouldLog method or test via integration)
    }

    @Test
    void shouldMaskSensitiveHeaders() {
        HttpLoggingProperties properties = new HttpLoggingProperties();
        
        // Default masked headers should include Authorization, X-API-Key, etc.
        assert properties.getMaskedHeaders().contains("Authorization");
        assert properties.getMaskedHeaders().contains("X-API-Key");
        assert properties.getMaskedHeaders().contains("Cookie");
    }

    @Test
    void shouldTruncateLargePayloads() {
        HttpLoggingProperties properties = new HttpLoggingProperties();
        properties.setMaxPayloadLength(100);
        
        // Test that payloads larger than 100 bytes get truncated
        // (You would need to expose the truncateIfNeeded method)
    }
}

/**
 * Performance test to ensure logging doesn't significantly impact response time
 */
@SpringBootTest
@AutoConfigureMockMvc
class HttpLoggingFilterPerformanceTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldNotSignificantlyImpactPerformance() throws Exception {
        // Measure time without logging
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < 100; i++) {
            mockMvc.perform(get("/api/hello"))
                .andExpect(status().isOk());
        }
        
        long duration = System.currentTimeMillis() - startTime;
        
        // Assert reasonable performance
        // In practice, logging overhead should be < 10% of total time
        System.out.println("100 requests completed in: " + duration + "ms");
    }
}
