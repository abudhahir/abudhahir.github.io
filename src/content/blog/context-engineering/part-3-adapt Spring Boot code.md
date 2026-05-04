---
title: "Adapting the Protocol for Source Code"
subtitle: "Java Spring Boot MVP Implementation"
excerpt: "Learn how the llms.txt protocol extends beyond documentation sites into source code repositories, with a practical Java Spring Boot MVP example and specialized codebase ingestion tooling."
date: 2025-01-12
author: "Abu Dhahir"
tags: ["context engineering", "llms.txt", "Java", "Spring Boot", "AI", "LLM", "source code"]
series: "Context Engineering Mastery"
draft: false
---

The `llms.txt` specification was originally conceived for external documentation sites - a clean Markdown index guiding AI agents through API references and tutorials. But the developer ecosystem has extended the protocol into a more demanding environment: **internal source code repositories**.

When applied to codebases, the standard shifts in purpose:

- **`llms.txt`** becomes an **architectural roadmap** - describing the application's structure, module boundaries, and key entry points
- **`llms-full.txt`** becomes a **compressed, concatenated text digest** of the repository's underlying logic - instantly ingestible by tools like Claude, ChatGPT, or Cursor without requiring active web browsing

This distinction is important. A documentation site might have a few hundred pages of prose. A production codebase might have thousands of files, millions of lines, and deeply nested dependency graphs. Naively applying `llms-full.txt` - just concatenating everything - would produce a multi-million token file that overwhelms any existing context window.

The solution is **intelligent filtering and structural curation**.

---

## Why Naive Concatenation Fails

Simply combining all source files into a single text file introduces several critical problems:

| Problem                      | Cause                                                       | Impact                                       |
| ---------------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| **Context window overflow**  | Raw code is verbose; 10,000 files → millions of tokens      | Model truncates or refuses to process        |
| **Signal-to-noise collapse** | `.class` files, lock files, build artefacts, `.git` history | Model attention diluted across useless bytes |
| **Semantic boundary loss**   | No clear delimiters between files                           | Model hallucinations about variable scope    |
| **Stale context**            | Manual files go out of date silently                        | Model generates code for deleted APIs        |

The answer is a combination of **intelligent tooling** and **structural conventions** to produce a distilled, semantically rich snapshot of the codebase.

---

## Specialised Codebase Ingestion Tooling

A mature ecosystem of specialised tools exists to solve the filtering problem. Each takes a different approach to the compression problem.

### Repomix - The Industry Standard

Repomix packages an entire repository into a single AI-friendly file. Its key differentiator is the `--compress` flag, which uses **Tree-sitter** to parse language syntax trees and extract only the structural skeleton of each file:

```bash
# Full repository digest with intelligent compression
repomix --compress --output llms-full.txt

# Include only the src directory, exclude test files
repomix ./src \
  --ignore "**/*.test.*,**/test/**,**/__tests__/**" \
  --compress \
  --output llms-full.txt

# Output in XML format with file boundary markers
repomix --compress --style xml --output llms-full.txt
```

Compression extracts essential code signatures while stripping:
- Heavy implementation details inside method bodies
- Redundant inline comments
- Empty lines and whitespace padding

Repomix also runs **Secretlint** on the output - scanning for accidentally exposed API keys, database passwords, or private tokens before the file is committed or shared.

### CntxtJV - Java Knowledge Graph Generator

CntxtJV is purpose-built for Java/Kotlin codebases. Rather than simply stripping lines, it analyses the **relationships** between classes to generate a structured knowledge graph:

```json
{
  "classDiagram": {
    "InvoiceController": {
      "extends": null,
      "implements": ["Controller"],
      "dependencies": ["InvoiceService", "CustomerRepository"],
      "annotations": ["@RestController", "@RequestMapping(\"/api/v1/invoices\")"],
      "methods": [
        "POST /  → createInvoice(CreateInvoiceRequest) → ResponseEntity<InvoiceDTO>",
        "GET /{id} → getInvoice(UUID) → ResponseEntity<InvoiceDTO>",
        "DELETE /{id} → cancelInvoice(UUID) → ResponseEntity<Void>"
      ]
    }
  },
  "mavenDependencies": {
    "spring-boot-starter-web": "3.2.0",
    "spring-boot-starter-data-jpa": "3.2.0",
    "spring-ai-openai-spring-boot-starter": "0.8.0"
  }
}
```

This architectural mapping reduces token payload by up to **75%** compared to raw source - handing the LLM the "cliff notes" of the application rather than the entire novel.

### Gitingest - Repository Text Digestion

Gitingest converts any Git repository into a clean, prompt-friendly text digest - filtering out noise like `.git` folders, lock files, binary assets, and build artefacts:

```bash
# Ingest from GitHub URL
pip install gitingest
gitingest https://github.com/your-org/spring-boot-app --output llms-full.txt

# Or from a local repository
gitingest ./my-spring-app --output llms-full.txt
```

Gitingest is available as a web service, CLI tool, and Python package - making it accessible to both engineers and non-technical team members who need to share codebase context with AI tools.

### llmstxt (ngmisl) - XML Semantic Markers

The `llmstxt` utility by ngmisl recursively scans a repository, strips redundant whitespace, preserves vital docstrings, and organises the output using **XML-style semantic markers** to explicitly define file boundaries for the AI:

```xml
<file path="src/main/java/com/example/billing/InvoiceService.java">
  <content>
    @Service
    public class InvoiceService {
        public InvoiceDTO createInvoice(CreateInvoiceRequest request) { ... }
        public InvoiceDTO getInvoice(UUID id) { ... }
    }
  </content>
</file>

<file path="src/main/java/com/example/billing/Invoice.java">
  <content>
    @Entity
    @Table(name = "invoices")
    public class Invoice {
        @Id @GeneratedValue private UUID id;
        @Column(nullable = false) private BigDecimal amount;
        @ManyToOne private Customer customer;
    }
  </content>
</file>
```

This explicit boundary marking prevents the LLM from conflating variable scope across files - a common source of hallucination in raw concatenated context.

---

## Java Spring Boot MVP: A Complete Implementation

Here is a complete, production-ready `llms.txt` for a Java Spring Boot application - structured to provide maximum architectural signal to an AI coding assistant.

### Project Structure

```
demo-spring-boot/
├── llms.txt                                    ← AI architectural index
├── llms-full.txt                               ← Compressed full context digest
├── pom.xml
├── src/
│   └── main/
│       ├── java/com/example/demo/
│       │   ├── DemoApplication.java            ← Spring Boot entry point
│       │   ├── controller/
│       │   │   └── InvoiceController.java
│       │   ├── service/
│       │   │   └── InvoiceService.java
│       │   ├── repository/
│       │   │   └── InvoiceRepository.java
│       │   ├── model/
│       │   │   └── Invoice.java               ← JPA entity
│       │   └── dto/
│       │       ├── CreateInvoiceRequest.java
│       │       └── InvoiceDTO.java
│       └── resources/
│           ├── application.properties
│           └── db/migration/
│               └── V1__create_invoice_table.sql
└── src/test/java/com/example/demo/
    └── InvoiceControllerTest.java
```

### The `llms.txt` Index File

```markdown
# Demo Spring Boot Application

> A RESTful AI-integrated MVP built with Java 21, Spring Boot 3.2, and Spring AI.
> Provides a billing API with invoice creation, retrieval, and cancellation.
> Uses PostgreSQL via Spring Data JPA. Async AI enrichment via Spring AI + OpenAI.

This application follows a standard layered architecture: Controller → Service → Repository.
Spring Boot auto-configuration is used throughout; manual bean definitions are avoided.
All DTOs use Java records. All entities use UUID primary keys.

## Architecture and Core Logic

- [DemoApplication.java](src/main/java/com/example/demo/DemoApplication.java): Spring Boot
  main class. Entry point. Enables JPA repositories and async execution.
- [InvoiceController.java](src/main/java/com/example/demo/controller/InvoiceController.java):
  REST endpoints for invoice CRUD. Maps to /api/v1/invoices. Validates request bodies.
- [InvoiceService.java](src/main/java/com/example/demo/service/InvoiceService.java):
  Core business logic. Invoice creation, status transitions, AI enrichment orchestration.
- [Invoice.java](src/main/java/com/example/demo/model/Invoice.java): JPA entity.
  Fields: id (UUID), amount (BigDecimal), currency, status (enum), customerId, createdAt.
- [InvoiceDTO.java](src/main/java/com/example/demo/dto/InvoiceDTO.java): Response DTO (Java record).
- [CreateInvoiceRequest.java](src/main/java/com/example/demo/dto/CreateInvoiceRequest.java):
  Request DTO (Java record) with Jakarta Bean Validation annotations.

## Configuration and Dependencies

- [pom.xml](pom.xml): Maven project descriptor. Spring Boot 3.2, Spring AI 0.8, Flyway,
  PostgreSQL JDBC driver, Lombok.
- [application.properties](src/main/resources/application.properties): Database URL,
  JPA DDL mode (validate), OpenAI API key (from env), logging levels.

## Optional

- [V1__create_invoice_table.sql](src/main/resources/db/migration/V1__create_invoice_table.sql):
  Flyway migration. Creates invoices table with correct column types and indexes.
- [InvoiceControllerTest.java](src/test/java/com/example/demo/InvoiceControllerTest.java):
  MockMvc integration tests. Demonstrates expected request/response shapes.
```

### The `llms-full.txt` Structure

The corresponding `llms-full.txt` contains the actual compressed source code, wrapped in XML semantic markers for clarity:

```xml
<project name="demo-spring-boot" version="1.0.0"
         description="Spring Boot 3.2 billing API with AI enrichment">
  <dependencies>
    spring-boot-starter-web:3.2.0, spring-boot-starter-data-jpa:3.2.0,
    spring-ai-openai-spring-boot-starter:0.8.0, flyway-core:9.22,
    postgresql:42.6, lombok:1.18, spring-boot-starter-validation:3.2.0
  </dependencies>

  <file path="src/main/java/com/example/demo/controller/InvoiceController.java">
    @RestController @RequestMapping("/api/v1/invoices")
    public class InvoiceController {
      @Autowired InvoiceService invoiceService;
      @PostMapping ResponseEntity<InvoiceDTO> create(@Valid @RequestBody CreateInvoiceRequest r) { ... }
      @GetMapping("/{id}") ResponseEntity<InvoiceDTO> get(@PathVariable UUID id) { ... }
      @DeleteMapping("/{id}") ResponseEntity<Void> cancel(@PathVariable UUID id) { ... }
    }
  </file>

  <file path="src/main/java/com/example/demo/model/Invoice.java">
    @Entity @Table(name="invoices")
    public class Invoice {
      @Id @GeneratedValue UUID id;
      @Column(nullable=false) BigDecimal amount;
      @Column(nullable=false,length=3) String currency;
      @Enumerated(EnumType.STRING) InvoiceStatus status;
      UUID customerId;
      LocalDateTime createdAt;
    }
  </file>
</project>
```

Note how implementation details inside method bodies are replaced with `{ ... }` - preserving the structural signature the LLM needs while eliminating implementation noise.

---

## CI/CD Integration: Keeping Context Current

An `llms-full.txt` file that goes out of sync with the actual source code is worse than having no file at all - the LLM will confidently generate code against deleted APIs and removed classes.

The solution is a **GitHub Actions workflow** that regenerates context files on every push to `main`:

```yaml
# .github/workflows/update-llm-context.yml
name: Update LLM Context

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'pom.xml'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Repomix
        run: npm install -g repomix

      - name: Generate compressed context
        run: |
          repomix ./src/main \
            --compress \
            --style xml \
            --ignore "**/*Test.java,**/*.class" \
            --output llms-full.txt

      - name: Commit updated context
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add llms-full.txt
          git diff --staged --quiet || git commit -m "chore: regenerate llm context"
          git push
```

With this pipeline in place, every code change automatically updates the AI context - ensuring that developers loading the repository context into Claude or Cursor always receive an accurate, up-to-date architectural snapshot.

---

## Loading Context into Your AI Assistant

Once the files are in place, loading the complete application context into an AI coding assistant is a single command:

```bash
# Claude Code - load via MCP
uvx --from mcpdoc mcpdoc \
  --urls "DemoApp:https://raw.githubusercontent.com/your-org/demo-app/main/llms.txt" \
  --transport stdio

# Or simply paste the raw URL into Claude's interface:
# https://raw.githubusercontent.com/your-org/demo-app/main/llms-full.txt
```

The AI assistant now has complete, structured knowledge of your application's architecture, dependencies, API contracts, and data model - ready to generate accurate code, review pull requests against real patterns, or answer questions about the system's design without hallucinating.

---

## Key Takeaways

- **`llms.txt` in a codebase is an architectural index**, not a documentation page - use it to describe module boundaries, layered structure, and key entry points
- **`llms-full.txt` must be filtered**, not raw-concatenated - use Repomix, CntxtJV, or Gitingest to produce compressed, signal-dense digests
- **Wrap content in XML semantic markers** to give the LLM explicit file boundary signals - reduces cross-file hallucinations
- **Automate regeneration** via CI/CD - a stale context file is actively harmful
- **Include the `## Optional` section** for tests, migrations, and changelogs - content the AI can deprioritise when approaching context limits

---

*Previous in this series: [Standardizing Machine-Readable Web Context →](#)*  
*Next in this series: [The Fundamentals of Codebase Context Engineering →](#)*