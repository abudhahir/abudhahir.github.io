package com.yourorg.lgtm.sample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Sample application demonstrating HTTP logging functionality
 */
@SpringBootApplication
public class SampleApplication {

    public static void main(String[] args) {
        SpringApplication.run(SampleApplication.class, args);
    }

    /**
     * Sample REST controller with various endpoints to test logging
     */
    @RestController
    @RequestMapping("/api")
    public static class SampleController {

        // Simple GET endpoint
        @GetMapping("/hello")
        public ResponseEntity<Map<String, String>> hello() {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Hello World!");
            response.put("timestamp", String.valueOf(System.currentTimeMillis()));
            return ResponseEntity.ok(response);
        }

        // GET with path variable
        @GetMapping("/users/{id}")
        public ResponseEntity<Map<String, Object>> getUser(@PathVariable Long id) {
            Map<String, Object> user = new HashMap<>();
            user.put("id", id);
            user.put("name", "John Doe");
            user.put("email", "john.doe@example.com");
            return ResponseEntity.ok(user);
        }

        // GET with query parameters
        @GetMapping("/search")
        public ResponseEntity<Map<String, Object>> search(
                @RequestParam String query,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
            Map<String, Object> result = new HashMap<>();
            result.put("query", query);
            result.put("page", page);
            result.put("size", size);
            result.put("results", "Sample results for: " + query);
            return ResponseEntity.ok(result);
        }

        // POST with request body
        @PostMapping("/users")
        public ResponseEntity<Map<String, Object>> createUser(@RequestBody CreateUserRequest request) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", 123L);
            response.put("name", request.getName());
            response.put("email", request.getEmail());
            response.put("created", true);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        // PUT with request body
        @PutMapping("/users/{id}")
        public ResponseEntity<Map<String, Object>> updateUser(
                @PathVariable Long id,
                @RequestBody UpdateUserRequest request) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", id);
            response.put("name", request.getName());
            response.put("email", request.getEmail());
            response.put("updated", true);
            return ResponseEntity.ok(response);
        }

        // DELETE endpoint
        @DeleteMapping("/users/{id}")
        public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            response.put("id", String.valueOf(id));
            return ResponseEntity.ok(response);
        }

        // Endpoint with headers
        @GetMapping("/secure")
        public ResponseEntity<Map<String, String>> secureEndpoint(
                @RequestHeader("Authorization") String authHeader,
                @RequestHeader(value = "X-API-Key", required = false) String apiKey) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Access granted");
            response.put("authenticated", "true");
            return ResponseEntity.ok(response);
        }

        // Endpoint that returns error
        @GetMapping("/error-test")
        public ResponseEntity<Map<String, String>> errorTest() {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Something went wrong");
            error.put("code", "ERR_001");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }

        // Slow endpoint to test timing
        @GetMapping("/slow")
        public ResponseEntity<Map<String, String>> slowEndpoint() throws InterruptedException {
            Thread.sleep(2000); // 2 second delay
            Map<String, String> response = new HashMap<>();
            response.put("message", "This was slow!");
            return ResponseEntity.ok(response);
        }

        // Health check (typically excluded from logging)
        @GetMapping("/health")
        public ResponseEntity<Map<String, String>> health() {
            Map<String, String> health = new HashMap<>();
            health.put("status", "UP");
            return ResponseEntity.ok(health);
        }
        
        // DTOs
        public static class CreateUserRequest {
            private String name;
            private String email;
            private String password;

            // Getters and Setters
            public String getName() { return name; }
            public void setName(String name) { this.name = name; }
            public String getEmail() { return email; }
            public void setEmail(String email) { this.email = email; }
            public String getPassword() { return password; }
            public void setPassword(String password) { this.password = password; }
        }

        public static class UpdateUserRequest {
            private String name;
            private String email;

            // Getters and Setters
            public String getName() { return name; }
            public void setName(String name) { this.name = name; }
            public String getEmail() { return email; }
            public void setEmail(String email) { this.email = email; }
        }
    }
}
