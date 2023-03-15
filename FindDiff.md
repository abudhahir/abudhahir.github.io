### Find Diff

``` java

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
