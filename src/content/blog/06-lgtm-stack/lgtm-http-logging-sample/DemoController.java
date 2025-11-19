package com.yourorg.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Example controller to demonstrate HTTP logging functionality.
 */
@RestController
@RequestMapping("/api/v1")
public class DemoController {

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false, defaultValue = "10") int limit) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("users", "List of users");
        response.put("filter", name);
        response.put("limit", limit);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", "user-123");
        response.put("name", user.get("name"));
        response.put("email", user.get("email"));
        response.put("status", "created");
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("updates", updates);
        response.put("status", "updated");
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUser(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("name", "John Doe");
        response.put("email", "john@example.com");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint that returns an error to test error logging.
     */
    @GetMapping("/error-test")
    public ResponseEntity<Map<String, Object>> errorTest() {
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Bad Request");
        error.put("message", "This is a test error");
        
        return ResponseEntity.badRequest().body(error);
    }

    /**
     * Endpoint with sensitive data to test header masking.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestHeader("Authorization") String authorization,
            @RequestBody Map<String, Object> credentials) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", "jwt-token-here");
        response.put("user", credentials.get("username"));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Internal endpoint that should be excluded from logging.
     */
    @GetMapping("/internal/health")
    public ResponseEntity<String> internalHealth() {
        return ResponseEntity.ok("OK");
    }
}
