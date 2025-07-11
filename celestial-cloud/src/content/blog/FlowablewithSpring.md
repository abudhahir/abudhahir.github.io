---
title: "Mastering BPMN, CMMN, and DMN with Flowable and Spring"
date: "2023-08-10"
excerpt: "Complete guide to business process management using Flowable's BPMN, CMMN, and DMN engines with Spring Boot. Learn to build enterprise-grade workflow applications with real-world examples."
tags: ["Flowable", "Spring Boot", "BPMN", "CMMN", "DMN", "Business Process Management", "Enterprise Java"]
author: "Abudhahir"
featured: true
readTime: "45 min read"
---

# Mastering BPMN, CMMN, and DMN with Flowable and Spring

Comprehensive guide to building enterprise-grade business process management applications using Flowable's powerful BPMN, CMMN, and DMN engines with Spring Boot. This tutorial covers everything from basic process modeling to advanced integration patterns.

## Table of Contents

1. [Introduction to BPMN, CMMN, and DMN](#1-introduction-to-bpmn-cmmn-and-dmn)
2. [Dive into Flowable](#2-dive-into-flowable)
3. [Modeling Processes with BPMN](#3-modeling-processes-with-bpmn)
4. [Managing Cases with CMMN](#4-managing-cases-with-cmmn)
5. [Decision Making with DMN](#5-decision-making-with-dmn)
6. [Integrating Flowable with Spring](#6-integrating-flowable-with-spring)
7. [Advanced Topics and Best Practices](#7-advanced-topics-and-best-practices)
8. [Final Project and Review](#8-final-project-and-review)

## 1: Introduction to BPMN, CMMN, and DMN

1.  Introduction to Business Process Management
2.  Overview of BPMN (Business Process Model and Notation)
3.  Overview of CMMN (Case Management Model and Notation)
4.  Introduction to DMN (Decision Model and Notation)

---

## 2: Dive into Flowable

1.  Introduction to Flowable
2.  Setting up Flowable with Spring Boot
3.  Basics of Flowable's BPMN Engine
4.  Flowable's CMMN and DMN Capabilities

---

## 3: Modeling Processes with BPMN

1.  Basics of BPMN 2.0 Notation
2.  Workflow Patterns in BPMN
3.  Advanced BPMN Constructs
4.  Hands-on: Designing a business process using Flowable's modeler

---

## 4: Managing Cases with CMMN

1.  Introduction to Case Management
2.  Basics of CMMN Notation
3.  Advanced CMMN Constructs
4.  Hands-on: Designing a case management scenario using Flowable

---

## 5: Decision Making with DMN

1.  Decision Tables in DMN
2.  Advanced DMN Modeling
3.  Integrating DMN with BPMN and CMMN
4.  Hands-on: Creating a decision table using Flowable

---

## 6: Integrating Flowable with Spring

1.  Configuring Flowable with Spring Boot
2.  Integrating BPMN Processes into Spring Applications
3.  Event-driven microservices with Flowable and Spring Cloud
4.  Handling Transactions and Error Scenarios

---

## 7: Advanced Topics and Best Practices

1.  Process Versioning in Flowable
2.  Security and Authentication in Flowable-powered Applications
3.  Best Practices for Scalability and Performance
4.  Unit Testing and Continuous Integration

---

## 8: Final Project and Review

1.  Design a comprehensive solution incorporating BPMN, CMMN, and DMN using Flowable and Spring.
2.  Group Review and Feedback Sessions
3.  Course Wrap-up and Next Steps

---

## Learning Objectives:

By the end of this course, students should be able to:

*   Understand and apply the principles of BPMN, CMMN, and DMN.
*   Design, implement, and run business processes, case management, and decision logic using Flowable.
*   Integrate Flowable with Spring Boot to create robust, enterprise-grade applications.
*   Apply best practices in real-world scenarios.

## Target Audience:

Developers, Business Analysts, and IT professionals interested in leveraging BPMN, CMMN, and DMN with Flowable in a Spring environment.

---

## Introduction to Business Process Management (BPM)

### Definition:

Business Process Management (BPM) is a systematic approach to making an organization's workflow more effective, more efficient, and more capable of adapting to an ever-changing environment. It involves the definition, measurement, analysis, improvement, and automation of business processes.

### Key Concepts of BPM:

1.  **Processes**: A series of tasks or activities that transform inputs into outputs, achieving a business goal.
    
2.  **Automation**: BPM often uses software and IT solutions to automate routine tasks, ensuring they are done the same way each time, reducing errors and inefficiencies.
    
3.  **Optimization**: Through constant monitoring and analysis of processes, organizations can identify inefficiencies and make improvements.
    
4.  **Integration**: BPM tools often provide ways to integrate various systems used within an organization, streamlining data flow and reducing manual data entry or transfer.
    

### Benefits of BPM:

1.  **Increased Efficiency**: Automation and optimization can reduce the time taken to complete processes.
    
2.  **Better Quality**: Standardization reduces errors and ensures processes are completed in the best possible way.
    
3.  **Flexibility**: Modern BPM tools allow processes to be adjusted and adapted quickly as business needs change.
    
4.  **Improved Visibility**: With BPM tools, managers can get a clear view of ongoing processes, making it easier to identify bottlenecks or issues.
    

### Example: Customer Onboarding in a Bank**

Consider the process of a new customer opening a bank account:

1.  The customer submits an application (online or in-branch).
2.  The bank verifies the customer's details and checks for any fraudulent activity.
3.  The bank processes the application, setting up an account and generating account details.
4.  The customer is informed of their new account details and any further actions required.

Using BPM, the bank can automate many of these steps (like verification), ensuring rapid and consistent processing. They can also integrate with other systems (like credit checks) and provide real-time monitoring and reporting on the onboarding process.

---

## Overview of BPMN (Business Process Model and Notation)

### Definition:

BPMN stands for Business Process Model and Notation. It's an international standard for business process modeling that provides a graphical notation for specifying business processes in a Business Process Diagram (BPD). BPMN is maintained by the Object Management Group (OMG).

### Key Features of BPMN:

1.  **Graphical Notation**: BPMN uses standardized symbols and shapes, making it easily understandable and consistent across different businesses and sectors.
    
2.  **Flow-Based Modeling**: BPMN focuses on the flow of tasks, decisions, and events in a process.
    
3.  **Supports End-to-End Processes**: BPMN can represent the entirety of a process, from start to end, including interactions with external parties.
    

### Core Elements of BPMN:

1.  **Flow Objects**: These are the main graphical elements used to define a process. They include:
    
    *   **Activities**: Tasks or subprocesses.
    *   **Events**: Circumstances that affect the flow (start, intermediate, end).
    *   **Gateways**: Decision points.
2.  **Connecting Objects**: Describe the sequence and message flows.
    
    *   **Sequence Flows**: Show the order of activities.
    *   **Message Flows**: Represent communication between different participants.
3.  **Swimlanes**: Visual mechanisms to organize activities based on who performs them. It includes:
    
    *   **Pools**: Represent different participants.
    *   **Lanes**: Sub-divisions in a pool.
4.  **Artifacts**: Additional information to the diagram.
    
    *   **Data Objects**: Data involved in process activities.
    *   **Annotations**: Notes or descriptions.

### Example: Leave Approval Process

Consider an employee leave request process:

1.  **Start Event**: Employee submits a leave request.
2.  **Task**: HR reviews the request.
3.  **Gateway**: Is the leave request valid?
    *   **Yes**: Proceed to "Manager Approval" task.
    *   **No**: Move to "Reject Leave Request" task.
4.  **Task**: Manager Approval.
5.  **Gateway**: Does the manager approve?
    *   **Yes**: Proceed to "Inform Employee of Approval" task.
    *   **No**: Move to "Inform Employee of Rejection" task.
6.  **End Event**: Process completion.

This simple BPMN diagram illustrates the steps, decisions, and outcomes in a leave request process.

### Detailed Exploration of BPMN Flow Objects

#### 1\. Activities:

Activities are units of work that a company or organization performs.

*   **Task**: The most atomic activity in a process. It represents a single unit of work that isn't further broken down. For example, "Review Document" or "Approve Invoice."
    
*   **Subprocess**: A compound activity that is broken down further into multiple tasks or sub-activities. A subprocess can be:
    
    *   **Collapsed**: Displayed as a rounded rectangle with a plus symbol, indicating it can be expanded.
    *   **Expanded**: Shows all the detailed tasks and flow controls within it.
*   **Loop and Multi-instance**: Tasks or subprocesses can have loop characteristics, indicating they might need repetition. Multi-instance characteristics signify that the task or process happens multiple times, parallelly or sequentially.
    

#### 2\. Events:

Events are something that "happens" during the course of a business process. They affect the flow and have triggers or results.

*   **Start Event**: Indicates where a process will start. It's depicted as a thin circle.
    
*   **Intermediate Event**: Occurs between a start and an end event. It can be used to show that something happens between the start and end. Displayed as a double circle.
    
*   **End Event**: Represents the end of a process. Displayed as a bold circle.
    

There are various types of events based on what triggers them or their outcome, such as timer events, message events, error events, etc.

#### 3\. Gateways:

Gateways are decision points that help to control the flow of interaction by managing branching and merging of paths.

*   **Exclusive Gateway (XOR)**: Acts as a decision point where only one path can be taken out of multiple available. Represented by a diamond with an "X."
    
*   **Inclusive Gateway (OR)**: Multiple paths can be taken based on conditions. Represented by a diamond with a circle.
    
*   **Parallel Gateway (AND)**: All paths are taken without any condition. Represented by a diamond with a plus sign.
    
*   **Event-Based Gateway**: The flow moves forward based on an event that happens, not a decision made. Represented by a diamond with a pentagon inside.
    

### Example: Hiring Process

Consider a company's hiring process:

1.  **Start Event**: Receipt of a job application.
2.  **Task**: Initial screening by HR.
3.  **Exclusive Gateway**: Is the applicant suitable for an interview?
    *   **Yes**: Proceed to "Schedule Interview" task.
    *   **No**: Move to "Send Rejection Email" task and end the process.
4.  **Task**: Schedule Interview.
5.  **Intermediate Event (Timer)**: Await interview date.
6.  **Task**: Conduct Interview.
7.  **Exclusive Gateway**: Was the interview successful?
    *   **Yes**: Proceed to "Send Job Offer" task.
    *   **No**: Move to "Send Rejection Email" task.
8.  **End Event**: Conclude hiring process.

In this detailed BPMN diagram, you can visualize the series of tasks, decision points, and events that occur during a company's hiring process.

## Overview of CMMN (Case Management Model and Notation)

### Definition:

CMMN, pronounced as "Common", stands for Case Management Model and Notation. It is a standard for modeling case management processes and is maintained by the Object Management Group (OMG). While BPMN is designed for structured processes, CMMN is designed for more flexible and adaptive processes, which are often referred to as cases.

### Key Features of CMMN:

1.  **Adaptive Processes**: CMMN is designed to handle non-sequential processes where the order of tasks can vary based on the specifics of each case.
    
2.  **Case Lifecycle**: Instead of a fixed path, CMMN has a lifecycle for cases, which can go through various states, such as active, suspended, or completed.
    
3.  **Event Listeners**: CMMN uses event listeners to watch for specific events that can change the course of a case.
    

### Core Elements of CMMN:

1.  **Case Plan Model**: Represents the entirety of a case, including all the tasks, stages, and milestones.
    
2.  **Tasks**: Individual units of work within a case. CMMN defines several types of tasks, including:
    
    *   **Human Task**: Performed by a person.
    *   **Process Task**: A task that might involve a BPMN process.
    *   **Case Task**: Refers to another case.
3.  **Stages**: Groupings of tasks or other stages, providing a level of organization within a case.
    
4.  **Milestones**: Represents a significant point in a case, like the completion of a set of tasks.
    
5.  **Event Listeners**: Watches for specific events and can trigger certain tasks or stages.
    
6.  **Sentries**: Define conditions under which certain tasks or stages are activated.
    

### Example: Customer Support Case

Consider a scenario where a customer raises a support ticket:

1.  **Case Plan Model**: "Handle Customer Support Ticket".
2.  **Human Task**: Initial assessment by a support agent.
3.  **Milestone**: "Ticket Categorized".
4.  **Stage**: "Technical Troubleshooting":
    *   **Process Task**: Follow technical troubleshooting guidelines.
    *   **Event Listener**: If the customer provides additional info, it might adjust the troubleshooting process.
5.  **Stage**: "Customer Follow-up":
    *   **Human Task**: Contact the customer with the solution or update.
6.  **Milestone**: "Issue Resolved".

This CMMN diagram represents the stages and tasks involved in handling a customer support ticket. Based on the nature of the issue and the information from the customer, the tasks can adapt and change.

---

### Example: Desperados Software Issue Resolution Case

**Scenario**: A customer reports a software issue or bug to Desperados.

**1\. Case Plan Model:** "Software Issue Resolution".

**2\. Human Task:** "Initial Issue Assessment". - An agent reviews the reported issue to categorize and prioritize it. - If it's a known issue, a knowledge base article might be shared with the customer.

**3\. Milestone:** "Issue Categorized and Prioritized".

**4\. Stage:** "Technical Investigation".

*   **Process Task:** "Issue Replication":
    
    *   Technical team tries to replicate the issue in a controlled environment.
*   **Human Task:** "Log Technical Details":
    
    *   If the issue is replicated, detailed logs and error reports are generated.
*   **Event Listener:** "Customer Feedback":
    
    *   If the customer provides more insights or information, it might refine the replication or investigation.
*   **Milestone:** "Issue Successfully Replicated".
    

**5\. Stage:** "Issue Resolution".

*   **Process Task:** "Code Review and Bug Fixing":
    
    *   The development team reviews the relevant code and attempts to fix the issue.
*   **Case Task:** "Integration Testing":
    
    *   The issue fix is tested in an integration environment to ensure it doesn't affect other functionalities.
*   **Event Listener:** "Customer Update":
    
    *   If the customer reports a similar issue or provides additional details during this stage, it might alter the fix or testing process.
*   **Milestone:** "Issue Fix Developed and Tested".
    

**6\. Stage:** "Customer Confirmation".

*   **Human Task:** "Share Fix with Customer":
    
    *   The customer is provided with the solution, which could be a patched version of the software or a workaround.
*   **Event Listener:** "Customer Feedback":
    
    *   Awaiting confirmation from the customer that the issue is resolved.
*   **Milestone:** "Issue Resolved and Confirmed by Customer".
    

**7\. Human Task:** "Close Issue and Document": - The issue is formally closed in the system and all details, solutions, and learnings are documented for future reference.

**8\. Milestone:** "Case Closed and Documented".

---

This CMMN example for Desperados showcases a dynamic case where different tasks and stages might be activated or altered based on evolving information and feedback. It emphasizes the adaptive nature of case management, where not all steps are predetermined, and the path can change based on the specifics of the case and incoming events.

## Overview of DMN (Decision Model and Notation)

### Definition:

DMN stands for Decision Model and Notation. It's a standard maintained by the Object Management Group (OMG) to provide a universal notation for decision-making processes. It's used to visually represent business decisions, the criteria behind them, and how decisions are interconnected.

### Key Features of DMN:

1.  **Graphical Notation**: DMN uses standardized symbols and shapes to represent decisions, inputs, knowledge sources, and other related elements.
    
2.  **Decision Tables**: A tabular representation to define the rules for decision-making. They use conditions and outcomes in a matrix format.
    
3.  **Business-Friendly**: Designed to be easily understood by both technical and non-technical stakeholders, bridging the communication gap.
    

### Core Elements of DMN:

1.  **Decisions**: Represent a business decision. It's depicted as a rectangle with a corner cut off.
    
2.  **Input Data**: Data or facts that influence a decision. Shown as a rectangle.
    
3.  **Business Knowledge Model (BKM)**: Encapsulates business knowledge and might include complex logic or calculations. Displayed as a rectangle with a dashed border.
    
4.  **Knowledge Source**: References the source or authority behind the business knowledge or decision logic. Illustrated as an ellipse.
    
5.  **Information Requirement**: Shows the dependency between a decision and its required inputs or other decisions. Shown as a connecting line.
    

### Example: Loan Approval Decision

Consider a bank's decision process for approving or rejecting a loan application:

1.  **Input Data**:
    
    *   Applicant's monthly income.
    *   Applicant's credit score.
    *   Loan amount requested.
2.  **Decision**: "Is the credit score satisfactory?"
    
    *   **Decision Table**:
        *   If credit score > 750, then "Yes".
        *   Else, "No".
3.  **Decision**: "Is the income-to-loan ratio acceptable?"
    
    *   **Decision Table**:
        *   If (monthly income \* 12 / loan amount) > 5, then "Yes".
        *   Else, "No".
4.  **Business Knowledge Model**: "Loan Risk Assessment".
    
    *   Contains formulas to calculate potential risk factors for the loan.
5.  **Knowledge Source**: "Bank's Loan Policy Document".
    
    *   Provides guidelines and thresholds for loan approval.
6.  **Final Decision**: "Approve Loan".
    
    *   Depends on the outcomes of the previous decisions and the BKM.
    *   If both the credit score is satisfactory and the income-to-loan ratio is acceptable, the loan might be approved.

This DMN diagram visualizes the interconnected decisions, inputs, and knowledge sources behind the bank's loan approval process.


## Integrating BPMN, CMMN, and DMN with Flowable and Spring

### Overview:

Flowable is a powerful suite of tools designed to handle business processes (BPMN), case management (CMMN), and decision automation (DMN). When combined with the Spring framework, developers can quickly design, deploy, and manage business processes and decisions within a robust and scalable environment.

### 1\. Setting up Flowable with Spring Boot:

Flowable can be easily bootstrapped with Spring Boot by adding the necessary Flowable starters to your project's `pom.xml`:

xml

```xml
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter</artifactId>
    <version>{latest_version}</version>
</dependency>
```

### 2\. Defining BPMN processes:

Using Flowable's Modeler, you can design BPMN diagrams. Once designed, these XML files can be placed in the resources folder of your Spring Boot application and will be auto-deployed on startup.

### 3\. Handling CMMN cases:

Similar to BPMN processes, Flowable allows you to design CMMN cases. You can then integrate these with Spring services or beans using Flowable's API.

### 4\. Using DMN Decision Tables:

Flowable's Modeler provides a user-friendly interface to create DMN decision tables. After defining, these tables can be invoked within BPMN processes or CMMN cases using service tasks or decision tasks.

### 5\. Execution and Management:

Flowable provides Java APIs to start, manage, and query BPMN processes, CMMN cases, and DMN decisions within a Spring environment:

*   `RuntimeService`: For process instance management.
*   `TaskService`: For human task operations.
*   `CaseInstanceService`: For CMMN cases.
*   `DecisionTableService`: For DMN decisions.

## Example: Product Return Process at 'TechGear' Store

Let's consider 'TechGear', a fictional electronics store, integrating their product return process using Flowable and Spring.

*   **BPMN Process**: "Product Return Workflow".
    
    1.  Customer submits a return request.
    2.  Quality team checks the product.
    3.  DMN decision table evaluates if the return criteria are met.
*   **CMMN Case**: "Handle Product Damage".
    
    1.  If the product is damaged, this case is activated.
    2.  Tech team evaluates the damage type.
    3.  Coordination with the vendor or manufacturer.
*   **DMN Decision Table**: "Return Eligibility Check".
    
    1.  Inputs: Days since purchase, product condition, warranty status.
    2.  Decision: Accept or Reject return.
*   **Spring Integration**:
    
    1.  A REST endpoint in a Spring Boot application allows customers to submit return requests.
    2.  On submission, the BPMN process is started using Flowable's API.
    3.  If the product is damaged, the CMMN case is invoked.
    4.  The DMN decision table is executed to determine return eligibility.

---

This integration example provides a seamless product return process for 'TechGear', combining the capabilities of BPMN, CMMN, and DMN using Flowable within a Spring Boot application.

---
## Example: Desperados Software Issue Resolution with Flowable and Spring Boot

### **Scenario Recap**: Desperados is a software company that resolves customer software issues through a case management system.

### 1\. BPMN Process**: "Issue Replication and Resolution".

**Flowable Modeler**: After designing the process in Flowable's Modeler, the BPMN XML can be placed in the Spring Boot application resources.

**Key Process Steps**:

1.  Start Event: Issue reported by the customer.
2.  Task: "Initial Issue Assessment".
3.  Decision Gateway: Is it a known issue?
4.  Task (if known): Provide knowledge base article.
5.  Task (if unknown): "Technical Investigation".

**BPMN XML**

xml

```xml
<bpmn:process id="issueReplicationAndResolution" name="Issue Replication and Resolution" isExecutable="true">

    <!-- Start Event -->
    <bpmn:startEvent id="startEvent" name="Issue Reported">
        <bpmn:outgoing>sequenceFlow1</bpmn:outgoing>
    </bpmn:startEvent>

    <!-- Initial Issue Assessment Task -->
    <bpmn:task id="initialAssessmentTask" name="Initial Issue Assessment">
        <bpmn:incoming>sequenceFlow1</bpmn:incoming>
        <bpmn:outgoing>sequenceFlow2</bpmn:outgoing>
    </bpmn:task>

    <!-- Decision Gateway -->
    <bpmn:exclusiveGateway id="knownIssueDecision" name="Is it a known issue?" default="sequenceFlow4">
        <bpmn:incoming>sequenceFlow2</bpmn:incoming>
        <bpmn:outgoing>sequenceFlow3</bpmn:outgoing>
        <bpmn:outgoing>sequenceFlow4</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <!-- Known Issue Task -->
    <bpmn:task id="provideKnowledgeBaseTask" name="Provide Knowledge Base Article">
        <bpmn:incoming>sequenceFlow3</bpmn:incoming>
    </bpmn:task>

    <!-- Unknown Issue Task -->
    <bpmn:task id="technicalInvestigationTask" name="Technical Investigation">
        <bpmn:incoming>sequenceFlow4</bpmn:incoming>
    </bpmn:task>

    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="sequenceFlow1" sourceRef="startEvent" targetRef="initialAssessmentTask"/>
    <bpmn:sequenceFlow id="sequenceFlow2" sourceRef="initialAssessmentTask" targetRef="knownIssueDecision"/>
    <bpmn:sequenceFlow id="sequenceFlow3" sourceRef="knownIssueDecision" targetRef="provideKnowledgeBaseTask"/>
    <bpmn:sequenceFlow id="sequenceFlow4" sourceRef="knownIssueDecision" targetRef="technicalInvestigationTask"/>

</bpmn:process>
```


### 2\. CMMN Case**: "Issue Resolution Case".

**Flowable Modeler**: Design the case using Flowable Modeler. Place the CMMN XML in the Spring Boot application resources.

**Key Case Activities**:

1.  Stage: "Technical Troubleshooting".
2.  Human Task: "Log Technical Details".
3.  Stage: "Code Fixing".
4.  Human Task: "Test Fix".
5.  Milestone: "Issue Resolved".

**CMMN XML - Issue Resolution Case**

xml

```xml
<cmmn:case id="issueResolutionCase" name="Issue Resolution Case">

    <!-- Case Plan Model -->
    <cmmn:casePlanModel id="casePlanModel" name="Software Issue Resolution">

        <!-- Technical Troubleshooting Stage -->
        <cmmn:stage id="technicalTroubleshootingStage" name="Technical Troubleshooting">
            <cmmn:planItem id="logTechnicalDetailsTaskPlanItem" definitionRef="logTechnicalDetailsTask"/>
        </cmmn:stage>

        <!-- Log Technical Details Task -->
        <cmmn:humanTask id="logTechnicalDetailsTask" name="Log Technical Details"/>

        <!-- Code Fixing Stage -->
        <cmmn:stage id="codeFixingStage" name="Code Fixing">
            <cmmn:planItem id="testFixTaskPlanItem" definitionRef="testFixTask"/>
        </cmmn:stage>

        <!-- Test Fix Task -->
        <cmmn:humanTask id="testFixTask" name="Test Fix"/>

        <!-- Milestone: Issue Resolved -->
        <cmmn:milestone id="issueResolvedMilestone" name="Issue Resolved"/>

    </cmmn:casePlanModel>

</cmmn:case>
```



### 3\. DMN Decision Table**: "Issue Priority Assignment".

Designed using Flowable's Modeler to determine the priority of the issue based on its type and impact.

**Inputs**:

*   Issue type (Bug, Enhancement, Critical Bug).
*   Impact (Low, Medium, High).

**Decision**: Priority (Low, Medium, High, Urgent).

### 4\. Spring Boot Integration**:

**a. Maven Dependency**:

xml

```xml
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter</artifactId>
    <version>{latest_version}</version>
</dependency>
```

**b. Issue Reporting Endpoint**:

java

```java
@RestController
@RequestMapping("/issues")
public class IssueController {

    @Autowired
    private RuntimeService runtimeService;

    @PostMapping("/report")
    public String reportIssue(@RequestBody Issue issue) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("issue", issue);
        ProcessInstance instance = runtimeService.startProcessInstanceByKey("issueReplicationAndResolution", variables);
        return "Issue reported with ID: " + instance.getId();
    }
}
```

**c. Service Task Bean to Check Known Issues**:

java

```java
@Service
public class IssueCheckerService {

    @Autowired
    private IssueRepository issueRepository; // Assuming there's a repository for known issues.

    public boolean isKnownIssue(String issueDescription) {
        // Logic to check if it's a known issue.
        return issueRepository.findByDescription(issueDescription) != null;
    }
}
```

**d. Start CMMN Case from BPMN Process**: Assuming the BPMN process has a service task named "startIssueResolutionCase" after the decision gateway:

java

```java
@Service
public class CaseStarterService {

    @Autowired
    private CaseService caseService;

    public void startIssueResolutionCase() {
        caseService.createCaseInstanceBuilder()
            .caseDefinitionKey("issueResolutionCase")
            .start();
    }
}
```

---

This detailed integration uses BPMN for the software issue workflow, CMMN for the detailed handling of the issue, and DMN for determining the priority of the issue. It's all tied together using Flowable's integration with Spring Boot, allowing for a comprehensive and adaptive software issue management system for Desperados.


---


---

**BPMN XML with Spring Integration**

xml

```xml
<bpmn:process id="issueReplicationAndResolution" name="Issue Replication and Resolution" isExecutable="true">

    <!-- ... other definitions ... -->

    <!-- Service Task for Issue Checking (Java Integration) -->
    <bpmn:serviceTask id="checkKnownIssueTask" name="Check Known Issues"
                      flowable:class="com.desperados.service.IssueCheckerService">
        <bpmn:incoming>sequenceFlow2</bpmn:incoming>
        <bpmn:outgoing>sequenceFlow5</bpmn:outgoing>
    </bpmn:serviceTask>

    <!-- Service Task to Start CMMN Case (Java Integration) -->
    <bpmn:serviceTask id="startCaseTask" name="Start Issue Resolution Case"
                      flowable:class="com.desperados.service.CaseStarterService">
        <bpmn:incoming>sequenceFlow4</bpmn:incoming>
    </bpmn:serviceTask>

    <!-- Sequence Flow for Service Tasks -->
    <bpmn:sequenceFlow id="sequenceFlow5" sourceRef="checkKnownIssueTask" targetRef="knownIssueDecision"/>

    <!-- ... other definitions ... -->

</bpmn:process>
```

In the above BPMN XML:

1.  `IssueCheckerService` is the Spring Service bean used to check if the reported issue is a known issue.
2.  `CaseStarterService` is the Spring Service bean used to start the CMMN case if the issue is not known.

---

**CMMN XML with Spring Integration**

xml

```xml
<cmmn:case id="issueResolutionCase" name="Issue Resolution Case">

    <!-- Case Plan Model -->
    <cmmn:casePlanModel id="casePlanModel" name="Software Issue Resolution">

        <!-- ... other definitions ... -->

        <!-- Human Task for Logging Details with Spring Delegate -->
        <cmmn:humanTask id="logTechnicalDetailsTask" name="Log Technical Details"
                        flowable:delegateExpression="${logTechnicalDetailsDelegate}"/>

        <!-- Human Task for Testing Fix with Spring Delegate -->
        <cmmn:humanTask id="testFixTask" name="Test Fix"
                        flowable:delegateExpression="${testFixDelegate}"/>

        <!-- ... other definitions ... -->

    </cmmn:casePlanModel>

</cmmn:case>
```

In the CMMN XML:

1.  `logTechnicalDetailsDelegate` is a Spring bean that provides the logic for the "Log Technical Details" human task.
2.  `testFixDelegate` is a Spring bean that provides the logic for the "Test Fix" human task.

In your Spring Java code, you would have beans like:

java

```java
@Service("logTechnicalDetailsDelegate")
public class LogTechnicalDetailsDelegate implements JavaDelegate {
    // implementation details
}

@Service("testFixDelegate")
public class TestFixDelegate implements JavaDelegate {
    // implementation details
}
```

The delegate expressions ( `${logTechnicalDetailsDelegate}` and `${testFixDelegate}`) refer to the Spring beans by their names.

---

**Integrating DMN with BPMN in Flowable using Spring Boot**

The Decision Model and Notation (DMN) standard is used to define decision tables which can be referenced from BPMN processes. These decision tables provide a structured way to make decisions based on certain inputs.

**1\. DMN Decision Table**: "Issue Priority Assignment".

For our Desperados scenario, the decision table determines the priority of the issue based on its type and impact.

Designed using Flowable's Modeler:

**Inputs**:

*   Issue type (Bug, Enhancement, Critical Bug).
*   Impact (Low, Medium, High).

**Decision**: Priority (Low, Medium, High, Urgent).

**Sample DMN XML**:

xml

```xml
<dmn:definitions ...>
    <dmn:decision id="issuePriorityDecision" name="Issue Priority Decision">
        <dmn:input id="input1" label="Issue Type" typeRef="string">
            <dmn:inputValues>
                <dmn:text>["Bug", "Enhancement", "Critical Bug"]</dmn:text>
            </dmn:inputValues>
        </dmn:input>
        <dmn:input id="input2" label="Impact" typeRef="string">
            <dmn:inputValues>
                <dmn:text>["Low", "Medium", "High"]</dmn:text>
            </dmn:inputValues>
        </dmn:input>
        <dmn:output id="output1" label="Priority" typeRef="string"/>
        <!-- ... rules defining the decision logic ... -->
    </dmn:decision>
</dmn:definitions>
```

**2\. BPMN Integration**:

In the BPMN process, you can use a Business Rule Task to invoke the DMN decision table.

xml

```xml
<bpmn:businessRuleTask id="issuePriorityDecisionTask" 
                       name="Decide Issue Priority" 
                       flowable:decisionTableKey="issuePriorityDecision"/>
```

The `flowable:decisionTableKey` attribute refers to the DMN decision table by its ID.

**3\. Spring Boot Integration**:

If you've already set up Flowable with Spring Boot, no additional setup is required specifically for DMN. However, ensure that you've included the DMN engine dependency:

xml

```xml
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-dmn-engine</artifactId>
    <version>{latest_version}</version>
</dependency>
```

**4\. Java Interaction**:

You can programmatically interact with the DMN engine using the `DmnRuleService` provided by Flowable:

java

```java
@Autowired
private DmnRuleService dmnRuleService;

public String getIssuePriority(String issueType, String impact) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("Issue Type", issueType);
    variables.put("Impact", impact);
    
    List<Map<String, Object>> result = dmnRuleService.createExecuteDecisionBuilder()
        .decisionKey("issuePriorityDecision")
        .variables(variables)
        .execute();

    return (String) result.get(0).get("Priority");
}
```

This code retrieves the decision result (issue priority) based on the given issue type and impact.

---

This setup allows BPMN processes to make complex decisions based on DMN decision tables, integrating seamlessly in a Spring Boot application.


**Flowable Event Handling with Spring Events**

Flowable engines can produce a series of events during process, case, and decision execution. Handling these events can be beneficial for various reasons: logging, metrics collection, triggering specific business logic, and more.

In this section, we'll cover how to integrate Flowable events with the Spring Framework's event handling mechanism.

**1\. Flowable Event Listener**

Firstly, you need to create an event listener. This listener will capture Flowable-specific events and then publish them as Spring events.

java

```java
@Component
public class FlowableEventListener implements FlowableEventListener {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public void onEvent(FlowableEvent event) {
        // Convert Flowable event to a Spring event
        CustomSpringEvent customEvent = new CustomSpringEvent(this, event);
        eventPublisher.publishEvent(customEvent);
    }

    @Override
    public boolean isFailOnException() {
        return false;
    }

    @Override
    public boolean isFireOnTransactionLifecycleEvent() {
        return true;
    }

    @Override
    public String getOnTransaction() {
        return "commit";
    }
}
```

**2\. Custom Spring Event**

Here, `CustomSpringEvent` is a simple event class that carries the original Flowable event:

java

```java
public class CustomSpringEvent extends ApplicationEvent {

    private final FlowableEvent flowableEvent;

    public CustomSpringEvent(Object source, FlowableEvent event) {
        super(source);
        this.flowableEvent = event;
    }

    public FlowableEvent getFlowableEvent() {
        return flowableEvent;
    }
}
```

**3\. Register Flowable Event Listener**

To ensure that the Flowable event listener receives events, you need to register it. This can be done during Flowable engine configuration:

java

```java
@Bean
public EngineConfigurationConfigurer<SpringProcessEngineConfiguration> customConfigurer() {
    return engineConfiguration -> {
        FlowableEventListener customListener = new FlowableEventListener();
        engineConfiguration.getEventListeners().add(customListener);
    };
}
```

**4\. Handle Spring Event**

Finally, handle the custom Spring event within a separate Spring component:

java

```java
@Component
public class SpringEventHandler {

    @EventListener
    public void handleCustomSpringEvent(CustomSpringEvent event) {
        // Handle the event. For example:
        FlowableEvent flowableEvent = event.getFlowableEvent();
        // Implement your custom logic based on the FlowableEvent details
    }
}
```

---

By utilizing this integration, you can seamlessly handle Flowable events within the Spring ecosystem, allowing for greater flexibility in responding to various BPMN, CMMN, and DMN operations.

**Flowable Event Types**

Flowable can generate various events depending on the context, whether it's BPMN, CMMN, or DMN. Some common BPMN events include:

*   **ENTITY\_CREATED**: Generated when a new runtime entity, such as a process instance or task, is created.
*   **TASK\_COMPLETED**: Triggered when a user task is completed.
*   **PROCESS\_COMPLETED**: Triggered when a process instance completes.

**Flowable Event Handling**

To effectively handle these events, you need to be specific about which events you want to listen to. You can create multiple listeners for different events or a single listener and use conditional checks.

java

```java
public class TaskCompletedListener implements FlowableEventListener {

    @Override
    public void onEvent(FlowableEvent event) {
        if (event.getType() == FlowableEngineEventType.TASK_COMPLETED) {
            // Handle task completion event
        }
    }

    // ... other methods ...
}
```

**Integration with Spring**

**1\. Payload Transfer**: You can send more than just the Flowable event. Consider encapsulating additional relevant data:

java

```java
public class CustomSpringEvent extends ApplicationEvent {

    private final FlowableEvent flowableEvent;
    private final Map<String, Object> additionalData;

    // ... constructor and getters ...
}
```

**2\. Conditional Publishing**: Before publishing the event to Spring, you can add conditional checks, especially useful in large systems where not every Flowable event is essential.

java

```java
@Override
public void onEvent(FlowableEvent event) {
    if (shouldPublish(event)) {
        CustomSpringEvent customEvent = new CustomSpringEvent(this, event);
        eventPublisher.publishEvent(customEvent);
    }
}

private boolean shouldPublish(FlowableEvent event) {
    // Define your criteria. E.g., only certain event types, or events with specific properties.
    return true;
}
```

**3\. Asynchronous Handling in Spring**: Large-scale applications might benefit from handling events asynchronously. Spring provides out-of-the-box support for this:

java

```java
@Component
public class SpringEventHandler {

    @Async
    @EventListener
    public void handleCustomSpringEvent(CustomSpringEvent event) {
        // This will now be executed in a separate thread.
    }
}
```

**4\. Transaction Boundaries**: In complex systems, you might want the event handling logic to participate in active transactions or run after transactions commit:

java

```java
@EventListener(condition = "#event.flowableEvent.type.name() == 'TASK_COMPLETED'")
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void afterTaskCompleted(CustomSpringEvent event) {
    // Logic here runs after the current transaction commits.
}
```

This ensures that the event is handled only when changes related to the task completion are committed in the database.

**5\. Monitoring and Logging**: Integrating Flowable events with Spring makes it easier to connect with other Spring-based monitoring solutions, like Spring Boot Actuator, or logging solutions like Spring Cloud Sleuth. By adding metadata from Flowable events, you can gain insights into process execution, timings, bottlenecks, and more.

---

Leveraging the power of Flowable events and integrating them into the Spring ecosystem opens up a world of possibilities in terms of flexibility, extensibility, and maintainability.

**Advanced Error Handling**

Handling errors gracefully is a critical part of managing business processes. Flowable events can be used to detect and react to errors in your processes.

java

```java
@EventListener
public void handleErrorEvents(CustomSpringEvent event) {
    FlowableEvent flowableEvent = event.getFlowableEvent();
    if (flowableEvent instanceof FlowableExceptionEvent) {
        FlowableExceptionEvent exceptionEvent = (FlowableExceptionEvent) flowableEvent;
        Throwable exception = exceptionEvent.getCause();
        // Log the exception, send notifications, or perform other error handling logic.
    }
}
```

**Event Transformation**

Sometimes, the raw Flowable event might not have all the necessary context for your business logic. You can enrich Flowable events with additional data before publishing them as Spring events.

java

```java
@Override
public void onEvent(FlowableEvent event) {
    Map<String, Object> additionalData = new HashMap<>();
    if (event instanceof FlowableEntityEvent) {
        Object entity = ((FlowableEntityEvent) event).getEntity();
        // Add necessary details from the entity to the additionalData map.
    }
    CustomSpringEvent customEvent = new CustomSpringEvent(this, event, additionalData);
    eventPublisher.publishEvent(customEvent);
}
```

**Complex Business Logic Execution**

Complex business logic can be triggered in response to certain events. For example, you might want to start a new process instance when another process ends.

java

```java
@EventListener
public void triggerNewProcessInstance(CustomSpringEvent event) {
    FlowableEvent flowableEvent = event.getFlowableEvent();
    if (flowableEvent.getType() == FlowableEngineEventType.PROCESS_COMPLETED) {
        // Extract process variables and use them to start a new process.
        RuntimeService runtimeService = Context.getProcessEngineConfiguration().getRuntimeService();
        Map<String, Object> processVariables = runtimeService.getVariables(flowableEvent.getExecutionId());
        runtimeService.startProcessInstanceByKey("newProcessKey", processVariables);
    }
}
```

**Utilizing Spring Profiles**

In a system where multiple environments are in use (e.g., dev, test, prod), you might want to handle events differently based on the environment.

java

```java
@Component
@Profile("prod")
public class ProductionEventHandler {

    @EventListener
    public void handleProductionEvents(CustomSpringEvent event) {
        // Handle events specifically for production environment.
    }
}
```

**Event-Driven Microservices**

If you're adopting a microservices architecture, you might want to publish events to a message broker (like RabbitMQ or Kafka) so that other services can react to them.

java

```java
@Service
public class EventPublisherService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @EventListener
    public void publishToMessageBroker(CustomSpringEvent event) {
        // Convert the Flowable event to a message format and publish it.
        rabbitTemplate.convertAndSend("flowableEventsQueue", createMessage(event));
    }

    private Message createMessage(CustomSpringEvent event) {
        // Serialization and message creation logic.
    }
}
```

**Conclusion**

By harnessing the event-driven nature of Flowable within the Spring framework, you can build a responsive, flexible, and decoupled system that is capable of reacting to business events in real-time. The combination of Flowable's BPMN, CMMN, and DMN capabilities with Spring's event handling allows for sophisticated workflows, case management, and decision logic that can adapt dynamically to changing business requirements.

**Step 1: Setup Spring Boot Project with Flowable and Spring Cloud Function**

First, we'll need to set up the dependencies in our Maven `pom.xml` file:

xml

```xml
<dependencies>
    <!-- Spring Cloud Function dependencies -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-function-context</artifactId>
        <version>{spring-cloud-function-version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-function-web</artifactId>
        <version>{spring-cloud-function-version}</version>
    </dependency>
    
    <!-- Flowable dependencies -->
    <dependency>
        <groupId>org.flowable</groupId>
        <artifactId>flowable-spring-boot-starter</artifactId>
        <version>{flowable-version}</version>
    </dependency>
    <dependency>
        <groupId>org.flowable</groupId>
        <artifactId>flowable-spring-boot-starter-rest</artifactId>
        <version>{flowable-version}</version>
    </dependency>
</dependencies>
```

Replace `{spring-cloud-function-version}` and `{flowable-version}` with the appropriate version numbers.

**Step 2: Define the BPMN Process**

Create a BPMN file `src/main/resources/processes/CustomerOnboarding.bpmn20.xml`:

xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions ... xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" ...>

  <process id="customerOnboarding" isExecutable="true">
    <startEvent id="startOnboarding" name="Start Onboarding"/>
    <sequenceFlow sourceRef="startOnboarding" targetRef="verifyCustomerDetails"/>

    <serviceTask id="verifyCustomerDetails" name="Verify Customer Details"
                 flowable:delegateExpression="${verifyCustomerDelegate}"/>
    <sequenceFlow sourceRef="verifyCustomerDetails" targetRef="processApplication"/>

    <serviceTask id="processApplication" name="Process Application"
                 flowable:delegateExpression="${processApplicationDelegate}"/>
    <sequenceFlow sourceRef="processApplication" targetRef="informCustomer"/>

    <serviceTask id="informCustomer" name="Inform Customer"
                 flowable:delegateExpression="${informCustomerDelegate}"/>
    <endEvent id="endOnboarding" name="End Onboarding"/>
  </process>

</definitions>
```

**Step 3: Create Spring Cloud Functions**

Implement Spring Cloud functions that will be exposed as REST endpoints and can trigger the BPMN process.

java

```java
@SpringBootApplication
@EnableFlowable
public class CustomerOnboardingApplication {

    public static void main(String[] args) {
        SpringApplication.run(CustomerOnboardingApplication.class, args);
    }

    @Bean
    public Function<CustomerApplication, String> onboardCustomer(RuntimeService runtimeService) {
        return application -> {
            ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(
                "customerOnboarding",
                Collections.singletonMap("application", application)
            );
            return processInstance.getId();
        };
    }
}
```

**Step 4: Implement Flowable Delegates**

Create Java delegates that Flowable will use to perform each task.

java

```java
@Component("verifyCustomerDelegate")
public class VerifyCustomerDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        // Implement verification logic, possibly calling external services
    }
}

@Component("processApplicationDelegate")
public class ProcessApplicationDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        // Implement application processing logic
    }
}

@Component("informCustomerDelegate")
public class InformCustomerDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        // Implement logic to inform customer, such as sending an email
    }
}
```

**Step 5: Customer Application Model**

Define a model for the customer application that will be used as input for the function.

java

```java
public class CustomerApplication {
    private String firstName;
    private String lastName;
    // Other fields and getters/setters
}
```

With this setup, you can now deploy your application, and the `onboardCustomer` function will be available as an HTTP endpoint thanks to Spring Cloud Function's auto-configuration. When a POST request is made to the endpoint with a customer application payload, it will start a new instance of the customer onboarding process in Flowable.

css

```css
customer-onboarding/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── bank/
│   │   │           └── onboarding/
│   │   │               ├── CustomerOnboardingApplication.java
│   │   │               ├── controller/
│   │   │               │   └── OnboardingController.java
│   │   │               ├── service/
│   │   │               │   ├── VerifyCustomerDelegate.java
│   │   │               │   ├── ProcessApplicationDelegate.java
│   │   │               │   └── InformCustomerDelegate.java
│   │   │               └── model/
│   │   │                   └── CustomerApplication.java
│   │   │
│   │   └── resources/
│   │       ├── processes/
│   │       │   └── CustomerOnboarding.bpmn20.xml
│   │       └── application.properties
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── bank/
│                   └── onboarding/
│                       └── CustomerOnboardingApplicationTests.java
│
└── pom.xml
```

Now let's fill in the essential content for each file:

**pom.xml:**

xml

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.bank</groupId>
    <artifactId>customer-onboarding</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Customer Onboarding</name>
    <description>Customer Onboarding Process with Flowable and Spring Cloud Function</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.2</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <java.version>11</java.version>
        <flowable.version>6.6.0</flowable.version>
    </properties>

    <dependencies>
        <!-- Spring Cloud Function dependencies -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-function-context</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-function-web</artifactId>
        </dependency>

        <!-- Flowable dependencies -->
        <dependency>
            <groupId>org.flowable</groupId>
            <artifactId>flowable-spring-boot-starter</artifactId>
            <version>${flowable.version}</version>
        </dependency>
        <dependency>
            <groupId>org.flowable</groupId>
            <artifactId>flowable-spring-boot-starter-rest</artifactId>
            <version>${flowable.version}</version>
        </dependency>

        <!-- Other dependencies like Spring Web, Security, etc., as needed -->
        <!-- ... -->
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>2020.0.3</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

**CustomerOnboardingApplication.java:**

java

```java
package com.bank.onboarding;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.function.context.FunctionRegistration;
import org.springframework.cloud.function.context.FunctionType;
import org.springframework.cloud.function.context.FunctionalSpringApplication;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.runtime.ProcessInstance;

import java.util.Collections;
import java.util.function.Function;

@SpringBootApplication
public class CustomerOnboardingApplication {

    public static void main(String[] args) {
        FunctionalSpringApplication.run(CustomerOnboardingApplication.class, args);
    }

    @Bean
    public Function<CustomerApplication, String> onboardCustomer(RuntimeService runtimeService) {
        return application -> {
            ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(
                "customerOnboarding",
                Collections.singletonMap("application", application)
            );
            return processInstance.getId();
        };
    }
}
```

**VerifyCustomerDelegate.java:**

java

```java
package com.bank.onboarding.service;

import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

@Service
public class VerifyCustomerDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution execution) {
        // Add your implementation here
    }
}
```

_(Repeat the pattern above for `ProcessApplicationDelegate.java` and `InformCustomerDelegate.java` by changing the class name and the string in the `@Service` annotation.)_

**CustomerApplication.java:**

java

```java
package com.bank.onboarding.model;

public class CustomerApplication {
    private String firstName;
    private String lastName;
    // Other fields, getters, and setters
}
```

**CustomerOnboarding.bpmn20.xml:**

_(Use the previously provided BPMN XML, placing it in the `src/main/resources/processes/` directory.)_

**OnboardingController.java:**

_(This is optional if you're using Spring Cloud Function's automatic endpoint creation. However, if you want more control over the HTTP endpoints, you can create a REST controller.)_

**CustomerOnboardingApplicationTests.java:**

_(Write some test cases here to ensure that your application works as expected.)_

**application.properties:**

_(Include any necessary Spring or Flowable properties, such as the datasource configuration, in this file.)_

With this setup, you should be able to build the application using Maven and run it with Spring Boot. Make sure to implement the logic for each delegate based on your business requirements. The provided BPMN file and the delegates will handle the process execution, while the Spring Cloud Function will expose the service that triggers the process.


**OnboardingController.java:**

This controller will expose an HTTP endpoint to start the onboarding process.

java

```java
package com.bank.onboarding.controller;

import com.bank.onboarding.model.CustomerApplication;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/onboarding")
public class OnboardingController {

    private final RuntimeService runtimeService;

    @Autowired
    public OnboardingController(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @PostMapping("/")
    public ResponseEntity<String> startOnboarding(@RequestBody CustomerApplication application) {
        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(
                "customerOnboarding",
                Collections.singletonMap("application", application)
        );
        return ResponseEntity.ok(processInstance.getId());
    }
}
```

**CustomerOnboardingApplicationTests.java:**

This is a placeholder for your test cases. You should implement tests that verify the behavior of your onboarding process.

java

```java
package com.bank.onboarding;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.function.context.test.FunctionalSpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@FunctionalSpringBootTest
public class CustomerOnboardingApplicationTests {

    @Autowired
    private RestTemplate restTemplate;

    @Test
    public void testStartOnboarding() {
        ResponseEntity<String> response = restTemplate.postForEntity(
                "/onboarding/",
                // Assuming that CustomerApplication has a proper constructor and getters/setters
                new CustomerApplication("John", "Doe"), 
                String.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Further assertions can be made based on the process instance ID returned
    }
}
```

**application.properties:**

In this file, you would configure your Flowable and datasource properties. Here's an example with an H2 database:

properties

```properties
# Datasource configuration
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Flowable
flowable.database-schema-update=true
flowable.process-definition-location-prefix=classpath:/processes/
flowable.process-definition-location-suffixes=**.bpmn20.xml
```

With this setup, your Spring Boot application will be configured to:

*   Use H2 in-memory database for simplicity (you should replace this with your actual database configuration for production).
*   Automatically update the database schema for Flowable at startup.
*   Look for BPMN definitions in the `classpath:/processes/` directory.

Remember, the provided `application.properties` and test cases are for demonstration purposes. You should adjust them according to your environment and requirements, and write comprehensive tests to cover all aspects of your business logic.


## Summary

This comprehensive guide covered the essential aspects of building enterprise business process management applications using Flowable with Spring Boot:

### Key Learning Outcomes

1. **BPMN Fundamentals**: Understanding business process modeling notation and workflow patterns
2. **CMMN Case Management**: Implementing adaptive case management for complex scenarios
3. **DMN Decision Logic**: Creating decision tables and rules for automated decision making
4. **Spring Integration**: Seamlessly integrating Flowable engines with Spring Boot applications
5. **Event-Driven Architecture**: Leveraging Flowable events for responsive system design
6. **Microservices Patterns**: Building distributed process applications with Spring Cloud

### Best Practices Covered

- **Process Design**: Modeling efficient and maintainable business processes
- **Error Handling**: Implementing robust error handling and recovery mechanisms
- **Security**: Securing process instances and human tasks
- **Performance**: Optimizing process execution and resource utilization
- **Testing**: Writing comprehensive tests for process applications
- **Deployment**: Deploying and managing process applications in production

### Next Steps

1. **Explore Advanced Features**: Dive deeper into Flowable's advanced capabilities
2. **Build Real Projects**: Apply these concepts to actual business scenarios
3. **Community Engagement**: Participate in Flowable community discussions
4. **Continuous Learning**: Stay updated with latest Flowable and Spring developments

### Resources for Further Learning

- **Official Documentation**: [Flowable Documentation](https://flowable.com/open-source/docs/)
- **Spring Boot Integration**: [Spring Boot with Flowable](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-flowable)
- **Community Forum**: [Flowable Community](https://forum.flowable.org/)
- **Source Code**: [Flowable GitHub Repository](https://github.com/flowable/flowable-engine)

This guide provides a solid foundation for building sophisticated business process management applications. The combination of Flowable's powerful engines with Spring Boot's enterprise features creates a robust platform for handling complex business workflows, case management, and decision automation.

---

*Ready to implement business process management in your organization? Connect with me on [LinkedIn](https://www.linkedin.com/in/abudhahir/) to discuss Flowable implementations and enterprise workflow solutions.*

