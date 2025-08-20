---
title: "Java Object Difference Detection Using Reflection"
date: "2024-02-20"
excerpt: "A powerful utility for detecting differences between Java objects using reflection. Perfect for comparing data objects, tracking changes, and implementing audit functionality."
tags: ["Java", "Reflection", "Object Comparison", "Data Validation", "JSON", "Lombok"]
author: "Abudhahir"
featured: false
readTime: "12 min read"
---

# Java Object Difference Detection Using Reflection

When working with data objects in Java applications, you often need to detect what has changed between two versions of the same object. This is essential for audit trails, change tracking, and data validation. This utility provides a generic solution using Java reflection.

## The Problem

Common scenarios where object comparison is needed:
- **Audit Logging**: Track what fields changed in database updates
- **Data Validation**: Ensure critical fields haven't been modified
- **Change Detection**: Identify modifications in form submissions
- **Version Control**: Compare different versions of configuration objects

## Solution Overview

The `ObjectDiffer` utility uses Java reflection to:
1. Compare any two objects of the same type
2. Identify fields with different values
3. Handle inheritance hierarchies
4. Return structured difference data
5. Serialize results to JSON format

## Implementation

```java

package com.cleveloper.findiff;

import com.cleveloper.findiff.model.Diffection;
import com.cleveloper.findiff.model.Object11;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ObjectDiffer {
    public static void main(String[] args) {
        // Example objects to compare
        Object11 obj1 = new Object11();
        obj1.firstcheck = true;
        obj1.secondCheck = false;
        obj1.thirdCheck = true;
        obj1.fourthCheck = true;
        obj1.fifthCheck = false;
        obj1.sixthCheck = false;
        obj1.oneInteger = 1;
        obj1.oneString = "You";
        obj1.twoInteger = 4;
        obj1.twoString = "She";


        Object11 obj2 = new Object11();
        obj2.firstcheck = true;
        obj2.secondCheck = true;
        obj2.thirdCheck = false;
        obj2.fourthCheck = true;
        obj2.fifthCheck = false;
        obj2.sixthCheck = true;
        obj2.oneInteger = 2;
        obj2.oneString = "Me";
        obj2.twoInteger = 3;
        obj2.twoString = "He";

        List<Diffection> differences = findDifferences(obj1, obj2);
        String json = toJson(differences);
        System.out.println("Differences: " + json);
    }

    public static <T> List<Diffection> findDifferences(T obj1, T obj2) {
        List<Diffection> differences = new ArrayList<>();

        Class<?> currentClass = obj1.getClass();

        while (currentClass != null) {
            // Get the properties (fields) using Java Reflection
            Field[] fields = currentClass.getDeclaredFields();

            List<Diffection> currentDifferences = Stream.of(fields)
                    .peek(field -> {
                        if (!field.canAccess(obj1) || !field.canAccess(obj2)) {
                            field.setAccessible(true);
                        }
                    })
                    .filter(field -> {
                        try {
                            Object value1 = field.get(obj1);
                            Object value2 = field.get(obj2);
                            return value1 == null ? value2 != null : !value1.equals(value2);
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                            return false;
                        }
                    })
                    .map(field -> {
                        try {
                            Diffection diffection = new Diffection();
                            diffection.setFieldName(field.getName());
                            diffection.setSourceValue(field.get(obj1));
                            diffection.setTargetValue(field.get(obj2));
                            return diffection;
                        } catch (IllegalAccessException e) {
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .collect(Collectors.toList());

            differences.addAll(currentDifferences);

            currentClass = currentClass.getSuperclass();
        }

        return differences;
    }
    public static String toJson(List<Diffection> differences) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(differences);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

}


```

Diff holder

```
package com.cleveloper.findiff.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Diffection {

    public String fieldName;
    public Object sourceValue;
    public Object targetValue;

}
```
Sample Objs for testing
```
package com.cleveloper.findiff.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Object1 {
    public Boolean firstcheck;
    public Boolean secondCheck;
    public Boolean thirdCheck;

    public String oneString;
    public Integer oneInteger;

}
```

```
package com.cleveloper.findiff.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Object11 extends Object1 {
    public Boolean fourthCheck;
    public Boolean fifthCheck;
    public Boolean sixthCheck;

    public String twoString;

    public Integer twoInteger;

}

```

## Supporting Classes

### Diffection Model

The `Diffection` class holds information about field differences:

```java
package com.cleveloper.findiff.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Diffection {
    public String fieldName;
    public Object sourceValue;
    public Object targetValue;
}
```

### Test Objects

Base class with common fields:

```java
package com.cleveloper.findiff.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Object1 {
    public Boolean firstcheck;
    public Boolean secondCheck;
    public Boolean thirdCheck;
    
    public String oneString;
    public Integer oneInteger;
}
```

Extended class demonstrating inheritance:

```java
package com.cleveloper.findiff.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Object11 extends Object1 {
    public Boolean fourthCheck;
    public Boolean fifthCheck;
    public Boolean sixthCheck;
    
    public String twoString;
    public Integer twoInteger;
}
```

## Usage Examples

### Basic Comparison

```java
// Create and populate objects
Person person1 = new Person();
person1.setName("John");
person1.setAge(30);
person1.setEmail("john@example.com");

Person person2 = new Person();
person2.setName("John");
person2.setAge(31);
person2.setEmail("john.doe@example.com");

// Find differences
List<Diffection> differences = ObjectDiffer.findDifferences(person1, person2);
```

### Audit Trail Implementation

```java
@Service
public class AuditService {
    
    public void logChanges(Object oldEntity, Object newEntity, String userId) {
        List<Diffection> differences = ObjectDiffer.findDifferences(oldEntity, newEntity);
        
        if (!differences.isEmpty()) {
            AuditLog log = new AuditLog();
            log.setUserId(userId);
            log.setEntityType(oldEntity.getClass().getSimpleName());
            log.setChanges(ObjectDiffer.toJson(differences));
            log.setTimestamp(LocalDateTime.now());
            
            auditRepository.save(log);
        }
    }
}
```

### REST API Change Detection

```java
@RestController
public class UserController {
    
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User existingUser = userService.findById(id);
        
        // Log changes before update
        List<Diffection> differences = ObjectDiffer.findDifferences(existingUser, updatedUser);
        
        if (!differences.isEmpty()) {
            logger.info("User {} changes: {}", id, ObjectDiffer.toJson(differences));
        }
        
        User saved = userService.save(updatedUser);
        return ResponseEntity.ok(saved);
    }
}
```

## Output Format

The utility generates JSON output showing field differences:

```json
[
  {
    "fieldName": "secondCheck",
    "sourceValue": false,
    "targetValue": true
  },
  {
    "fieldName": "thirdCheck",
    "sourceValue": true,
    "targetValue": false
  },
  {
    "fieldName": "sixthCheck",
    "sourceValue": false,
    "targetValue": true
  },
  {
    "fieldName": "oneInteger",
    "sourceValue": 1,
    "targetValue": 2
  },
  {
    "fieldName": "oneString",
    "sourceValue": "You",
    "targetValue": "Me"
  },
  {
    "fieldName": "twoInteger",
    "sourceValue": 4,
    "targetValue": 3
  },
  {
    "fieldName": "twoString",
    "sourceValue": "She",
    "targetValue": "He"
  }
]
```

## Key Features

1. **Generic Implementation**: Works with any object type
2. **Inheritance Support**: Handles class hierarchies automatically
3. **Null Safety**: Properly handles null values
4. **Type Agnostic**: Compares any field types
5. **JSON Serialization**: Easy integration with APIs and logging
6. **Reflection-Based**: No need to implement comparison logic per class

## Enhancements

For production use, consider adding:

```java
// Enhanced version with filtering and configuration
public static <T> List<Diffection> findDifferences(T obj1, T obj2, 
                                                   Set<String> ignoreFields,
                                                   boolean includeNullChanges) {
    // Implementation with filtering logic
}

// Add field annotation support
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface IgnoreInComparison {
}
```

## Dependencies

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.24</version>
    <scope>provided</scope>
</dependency>
```

## Conclusion

This object difference detection utility provides a robust solution for change tracking in Java applications. Whether you need audit logging, data validation, or simple object comparison, this reflection-based approach offers flexibility and ease of use.

The utility handles complex object hierarchies, provides structured output, and integrates seamlessly with existing codebases through its generic design.

---

*Need help implementing audit systems or change tracking? Connect with me on [LinkedIn](https://www.linkedin.com/in/abudhahir/) to discuss enterprise Java solutions.*
