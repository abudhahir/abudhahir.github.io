```java

package com.cleveloper.sboalc.restapp.utils;

public class MermaidDiagramGenerator {

    public static String toMermaidDiagram(String callHierarchy) {
        String[] lines = callHierarchy.split("\n");
        StringBuilder mermaidCode = new StringBuilder("sequenceDiagram\n");
        String previousClass = null;
        for (String line : lines) {
            if (line.trim().equals("---")) {
                continue;
            }
            String methodClass = line.split("\\(", 2)[0].trim();
            String[] splitMethodClass = methodClass.split("\\.");
            String className = splitMethodClass[splitMethodClass.length - 2];
            String methodName = splitMethodClass[splitMethodClass.length - 1];
            if (previousClass != null) {
                mermaidCode.append("    ").append(previousClass).append("->>+").append(className).append(": ").append(methodName).append("\n");
            }
            previousClass = className;
        }
        return mermaidCode.toString();
    }


}
```