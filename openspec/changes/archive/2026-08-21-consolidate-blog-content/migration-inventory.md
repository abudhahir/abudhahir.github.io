# Blog Content Migration Inventory

Baseline captured from `src/content/blog/` before implementation on 2026-08-20.
The baseline contained 82 files: 42 Astro collection entries (`41 .md`, `1
.mdx`) and 40 supporting files. Routes below are the slugs emitted by the
baseline production build, not assumptions based only on filenames.

## Collection entries

| # | Baseline path | Baseline route | State / type / series | Decision | Canonical destination | URL policy |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `06-lgtm-stack/lgtm-stack-starter/FILE-SUMMARY.md` | `/blog/http-logging-file-summary/` | draft / article / none | relocate | `examples/lgtm-spring-boot-starter/FILE-SUMMARY.md` | redirect-free draft retirement |
| 2 | `06-lgtm-stack/lgtm-stack-starter/QUICK-START.md` | `/blog/06-lgtm-stack/lgtm-stack-starter/quick-start/` | draft / article / none | relocate | `examples/lgtm-spring-boot-starter/QUICK-START.md` | redirect-free draft retirement |
| 3 | `06-lgtm-stack/lgtm-stack-starter/README.md` | `/blog/06-lgtm-stack/lgtm-stack-starter/readme/` | draft / article / none | relocate | `examples/lgtm-spring-boot-starter/README.md` | redirect-free draft retirement |
| 4 | `06-lgtm-stack/lgtm-tutorial/Part-0-Fundamentals-and-Setup.md` | `/blog/06-lgtm-stack/lgtm-tutorial/part-0-fundamentals-and-setup/` | published / article / LGTM | keep + rename | `lgtm/part-0-fundamentals-and-setup.md` | compatibility redirect |
| 5 | `06-lgtm-stack/lgtm-tutorial/Part-1-Loki-Integration.md` | `/blog/06-lgtm-stack/lgtm-tutorial/part-1-loki-integration/` | published / article / LGTM | keep + rename | `lgtm/part-1-loki-integration.md` | compatibility redirect |
| 6 | `06-lgtm-stack/lgtm-tutorial/Part-2-Tempo-Integration.md` | `/blog/06-lgtm-stack/lgtm-tutorial/part-2-tempo-integration/` | published / article / LGTM | keep + rename | `lgtm/part-2-tempo-integration.md` | compatibility redirect |
| 7 | `06-lgtm-stack/lgtm-tutorial/Part-3-Metrics-Integration.md` | `/blog/06-lgtm-stack/lgtm-tutorial/part-3-metrics-integration/` | published / article / LGTM | keep + rename | `lgtm/part-3-metrics-integration.md` | compatibility redirect |
| 8 | `06-lgtm-stack/lgtm-tutorial/Part-4-Advanced-Features.md` | `/blog/06-lgtm-stack/lgtm-tutorial/part-4-advanced-features/` | published / article / LGTM | keep + rename | `lgtm/part-4-advanced-features.md` | compatibility redirect |
| 9 | `06-lgtm-stack/lgtm-tutorial/Part-5-Testing-and-Deployment.md` | `/blog/06-lgtm-stack/lgtm-tutorial/part-5-testing-and-deployment/` | published / article / LGTM | keep + rename | `lgtm/part-5-testing-and-deployment.md` | compatibility redirect |
| 10 | `06-lgtm-stack/lgtm-tutorial/README.md` | `/blog/06-lgtm-stack/lgtm-tutorial/readme/` | published / duplicate series index / LGTM | retire | generated LGTM series page | compatibility redirect |
| 11 | `10-openapi.generators/create_a_tutorial_to_genralise_the_genra.md` | `/blog/10-openapigenerators/create_a_tutorial_to_genralise_the_genra/` | published / article / OpenAPI | keep + rename | `openapi/scaling-openapi-generation-multiple-specs.md` | compatibility redirect |
| 12 | `10-openapi.generators/i_want_to_learn_how_openapi_source_code.md` | `/blog/10-openapigenerators/i_want_to_learn_how_openapi_source_code/` | published / article / OpenAPI | keep + rename | `openapi/openapi-code-generation-spring-boot-4.md` | compatibility redirect |
| 13 | `10-openapi.generators/implementing_the_delegate_pattern_in_spring_boot_4.md` | `/blog/10-openapigenerators/implementing_the_delegate_pattern_in_spring_boot_4/` | published / article / OpenAPI | keep + rename | `openapi/openapi-delegate-pattern-spring-boot-4.md` | compatibility redirect |
| 14 | `11-spec-driven-development/11.md` | `/blog/11-spec-driven-development/11/` | published / article / none | keep + rename | `spec-driven-development/spec-driven-development-with-openspec-and-copilot.md` | compatibility redirect |
| 15 | `2025-05-05-14-43-39.md` | `/blog/2025-05-05-14-43-39/` | published / article / none | keep + rename | `java-code-analysis-tree-sitter.md` | compatibility redirect |
| 16 | `2025-05-05-14-48-05.md` | `/blog/2025-05-05-14-48-05/` | published / article / none | keep + rename | `ai-code-smell-analysis.md` | compatibility redirect |
| 17 | `CallHierarchyToMermaid.md` | `/blog/callhierarchytomermaid/` | published / article / none | keep + rename | `java-call-hierarchy-mermaid.md` | compatibility redirect |
| 18 | `FindDiff.md` | `/blog/finddiff/` | published / article / none | keep + rename | `java-object-difference-reflection.md` | compatibility redirect |
| 19 | `FlowablewithSpring.md` | `/blog/flowablewithspring/` | published / article / none | keep + rename | `flowable-spring-bpmn-cmmn-dmn.md` | compatibility redirect |
| 20 | `ai-powered-development-tools.md` | `/blog/ai-powered-development-tools/` | published / article / none | keep after review | unchanged | route retained |
| 21 | `astro-react-modern-web-apps.md` | `/blog/astro-react-modern-web-apps/` | published / article / none | keep after review | unchanged | route retained |
| 22 | `docker-kubernetes-guide.md` | `/blog/docker-kubernetes-guide/` | published / article / none | keep after review + correct obsolete PSP guidance | unchanged | route retained |
| 23 | `enterprise-java-spring-boot.md` | `/blog/enterprise-java-spring-boot/` | published / article / none | keep after review | unchanged | route retained |
| 24 | `typescript-best-practices.md` | `/blog/typescript-best-practices/` | published / article / none | keep after review | unchanged | route retained |
| 25 | `json-test.md` | `/blog/json-test/` | published / slide test / none | retire | none | redirect-free test retirement |
| 26 | `link-collection.md` | `/blog/link-collection/` | implicit published / link stub / none | retire | none | redirect-free temporary-link retirement |
| 27 | `context-engineering/part-1-Standardizing_Machine_Readable_Web_Context.md` | `/blog/context-engineering/part-1-standardizing_machine_readable_web_context/` | published / article / Context Engineering | keep + rename | `context-engineering/part-1-standardising-machine-readable-web-context.md` | compatibility redirect |
| 28 | `context-engineering/part-2-fundamentals-of-codebase-ctx-engg.md` | `/blog/context-engineering/part-2-fundamentals-of-codebase-ctx-engg/` | published / article / Context Engineering | keep + rename | `context-engineering/part-2-codebase-context-engineering-fundamentals.md` | compatibility redirect |
| 29 | `context-engineering/part-3-adapt Spring Boot code.md` | `/blog/context-engineering/part-3-adapt-spring-boot-code/` | published / article / Context Engineering | keep + rename | `context-engineering/part-3-adapting-context-engineering-for-spring-boot.md` | compatibility redirect |
| 30 | `part-1-Agentic-AI-foundations/part-1-foundations.md` | `/blog/part-1-agentic-ai-foundations/part-1-foundations/` | published / article / Agentic AI | keep + rename | `agentic-ai/part-1-agent-foundations.md` | compatibility redirect |
| 31 | `part-1-Agentic-AI-foundations/Agentic_AI_and_Agentic_RAG_Tutorial.md` | `/blog/part-1-agentic-ai-foundations/agentic_ai_and_agentic_rag_tutorial/` | published / article / Agentic AI | keep + rename | `agentic-ai/part-2-agentic-ai-and-rag.md` | compatibility redirect |
| 32 | `part-1-Agentic-AI-foundations/MCP - Agentic_AI_and_Agentic_RAG_Tutorial.md` | `/blog/part-1-agentic-ai-foundations/mcp---agentic_ai_and_agentic_rag_tutorial/` | published / overlapping article / Agentic AI | merge + trim | `agentic-ai/part-3-production-mcp-patterns.md` | compatibility redirect |
| 33 | `part-1-Agentic-AI-foundations/beginner-blog.md` | `/blog/part-1-agentic-ai-foundations/beginner-blog/` | published / article / Agentic AI | merge | `agentic-ai/part-4-gitlab-mcp-server.md` | compatibility redirect |
| 34 | `part-1-Agentic-AI-foundations/tutorial-blog.md` | `/blog/part-1-agentic-ai-foundations/tutorial-blog/` | published / overlapping article / Agentic AI | merge | `agentic-ai/part-4-gitlab-mcp-server.md` | compatibility redirect |
| 35 | `prompt-engineering/prompt-engineering-concepts.md` | `/blog/prompt-engineering/prompt-engineering-concepts/` | published / article / Prompt Engineering | keep + rename | `prompt-engineering/prompt-engineering-guide.md` | compatibility redirect |
| 36 | `prompt-engineering/RAG_and_Agentic_RAG_Tutorial.md` | `/blog/prompt-engineering/rag_and_agentic_rag_tutorial/` | published / article / Prompt Engineering | keep + rename | `prompt-engineering/rag-and-agentic-rag-tutorial.md` | compatibility redirect |
| 37 | `prompt-engineering/slide-deck.md` | `/blog/prompt-engineering/slide-deck/` | published / duplicate prose slide source / Prompt Engineering | merge into JSON-backed slide entry | `prompt-engineering/prompt-engineering-slides.md` + `src/content/slides/prompt-engineering-slides.json` | compatibility redirect |
| 38 | `prompt-engineering/slide-deck-slides.mdx` | `/blog/prompt-engineering/slide-deck-slides/` | published / duplicate slide wrapper / Prompt Engineering | retire | none | redirect-free duplicate-wrapper retirement |
| 39 | `token-preservation/copilot-cost-optimization-playbook.md` | `/blog/token-preservation/copilot-cost-optimization-playbook/` | implicit published / article / Token Preservation | keep | unchanged | route retained |
| 40 | `token-preservation/copilot-cost-playbook-slides.md` | `/blog/token-preservation/copilot-cost-playbook-slides/` | implicit published / JSON-backed slides / Token Preservation | keep | unchanged | route retained |
| 41 | `token-preservation/github-copilot-cost-optimization.md` | `/blog/token-preservation/github-copilot-cost-optimization/` | implicit published / abridged duplicate / Token Preservation | retire | detailed cost playbook | compatibility redirect |
| 42 | `token-preservation/additional-reference-copilot-cost-research-report.md` | `/blog/token-preservation/additional-reference-copilot-cost-research-report/` | implicit published / research source / Token Preservation | archive | `archive/research/copilot-cost/copilot-cost-research-report.md` | compatibility redirect to detailed playbook |

## Supporting files

Every non-entry file under the baseline collection is covered below. A recursive
directory row includes every listed descendant; exceptions are listed
separately.

| Baseline material | Files | Decision | Destination |
| --- | ---: | --- | --- |
| `06-lgtm-stack/lgtm-stack-starter/pom.xml` | 1 | relocate with coherent Maven project | `examples/lgtm-spring-boot-starter/pom.xml` |
| `06-lgtm-stack/lgtm-stack-starter/lgtm-sample-app/**` | 4 | relocate with coherent Maven project | `examples/lgtm-spring-boot-starter/lgtm-sample-app/**` |
| `06-lgtm-stack/lgtm-stack-starter/lgtm-spring-boot-autoconfigure/**` | 21 | relocate with coherent Maven project, including existing zero-byte implementation placeholders | `examples/lgtm-spring-boot-starter/lgtm-spring-boot-autoconfigure/**` |
| `06-lgtm-stack/lgtm-stack-starter/lgtm-spring-boot-starter/pom.xml` | 1 | relocate with coherent Maven project | `examples/lgtm-spring-boot-starter/lgtm-spring-boot-starter/pom.xml` |
| `part-1-Agentic-AI-foundations/code/01-automation-vs-agentic.py` | 1 | relocate | `examples/agentic-ai-foundations/01-automation-vs-agentic.py` |
| `part-1-Agentic-AI-foundations/code/02-basic-agent-structure.py` | 1 | relocate | `examples/agentic-ai-foundations/02-basic-agent-structure.py` |
| `part-1-Agentic-AI-foundations/code/03-simple-travel-agent.py` | 1 | relocate | `examples/agentic-ai-foundations/03-simple-travel-agent.py` |
| `part-1-Agentic-AI-foundations/code/04-specialized-agents.py` | 1 | relocate | `examples/agentic-ai-foundations/04-specialized-agents.py` |
| `part-1-Agentic-AI-foundations/code/05-production-patterns.py` | 1 | relocate | `examples/agentic-ai-foundations/05-production-patterns.py` |
| `part-1-Agentic-AI-foundations/code/budget_planner_agent.py` | 1 | relocate | `examples/agentic-ai-foundations/budget_planner_agent.py` |
| `part-1-Agentic-AI-foundations/code/trip_research_agent.py` | 1 | relocate | `examples/agentic-ai-foundations/trip_research_agent.py` |
| `part-1-Agentic-AI-foundations/code/examples/weather_assistant.py` | 1 | relocate | `examples/agentic-ai-foundations/examples/weather_assistant.py` |
| `part-1-Agentic-AI-foundations/code/requirements.txt` | 1 | relocate | `examples/agentic-ai-foundations/requirements.txt` |
| `token-preservation/Copilot-Cost-LunchAndLearn.pptx` | 1 | retire identical duplicate (SHA-256 matched) | canonical copy remains at `public/downloads/Copilot-Cost-LunchAndLearn.pptx` |
| `prompt-engineering/prompt-engineering` | 1 | archive useful editorial source | `archive/research/prompt-engineering/from-zero-to-agent-draft.md` |
| `prompt-engineering/Screenshot 2025-08-28 at 21.22.12.png` | 1 | retire unreferenced screenshot | none |
| `GitlabOperations.java` | 1 | retire unreferenced, misleadingly named Bitbucket prototype | none |

Supporting-file total: 40 (`27` Maven project files, `9` Agentic AI
example files, and `4` individually classified orphan/download files).

## Editorial review decisions for older standalone posts

| Entry | Specificity | Uniqueness / internal value | Currency decision | Outcome |
| --- | --- | --- | --- | --- |
| Java Tree-sitter parser | concrete parser implementation | linked from call-hierarchy article | implementation remains useful | keep |
| AI code-smell analysis | concrete analyser and refactoring workflow | linked from call-hierarchy article | techniques remain useful | keep |
| Java call hierarchy to Mermaid | focused code visualisation utility | links the two code-analysis posts | implementation remains useful | keep |
| Java object difference detection | focused reflection implementation | unique audit/change-tracking value | Java reflection approach remains valid | keep |
| Flowable with Spring | detailed BPMN/CMMN/DMN tutorial | unique workflow-engine coverage | retain as broad reference; replace stale Spring link | keep |
| AI-powered development tools | concise adoption and measurement guidance | distinct historical/practical overview | avoid version-specific claims; retain | keep |
| Astro and React | directly relevant to this site's architecture | unique site-stack value | islands/client-directive guidance remains valid | keep |
| Docker and Kubernetes | concrete manifests and deployment workflow | unique cloud-native coverage | replace removed PodSecurityPolicy guidance with Pod Security Admission | keep |
| Enterprise Java and Spring Boot | concrete layered architecture examples | distinct enterprise baseline | version-neutral patterns remain valid | keep |
| TypeScript best practices | concrete type/API/error/testing patterns | distinct language coverage | version-neutral patterns remain valid | keep |

## Section-level merge checklist

### Agentic AI Part 3

- Remove the repeated foundations, multi-agent, Agentic RAG, LangGraph setup,
  and first implementation walkthrough already canonical in Part 2.
- Retain MCP server/client implementation, tool/resource exposure, gatekeeper
  controls, document processing, hybrid search, verification, self-correction,
  configuration, production deployment, monitoring, security, resilience, and
  MCP-specific troubleshooting.
- Link back to Part 2 and to the relocated runnable examples instead of
  repeating its introductory structure.

### Agentic AI Part 4

- Retain the beginner article's project structure, package configuration, CLI,
  server implementation, error handling, tool registration, and extension
  example.
- Merge the usage article's installation, `glab` authentication, CLI commands,
  MCP transports, assistant configuration, verification, troubleshooting,
  security, retry, and automation examples.
- Remove reciprocal “read the other article” prompts and repeated conclusions.

### Prompt Engineering slides

- Preserve the canonical Markdown deck's 36-slide sequence in JSON data.
- Keep one lightweight `pageLayout: slides` collection entry.
- Retire the MDX wrapper and the bespoke nested Reveal route without redirects.

## Compatibility manifest plan

The implementation manifest maps these legacy slugs to canonical paths:

| Legacy slug | Canonical path |
| --- | --- |
| `06-lgtm-stack/lgtm-tutorial/part-0-fundamentals-and-setup` | `/blog/lgtm/part-0-fundamentals-and-setup/` |
| `06-lgtm-stack/lgtm-tutorial/part-1-loki-integration` | `/blog/lgtm/part-1-loki-integration/` |
| `06-lgtm-stack/lgtm-tutorial/part-2-tempo-integration` | `/blog/lgtm/part-2-tempo-integration/` |
| `06-lgtm-stack/lgtm-tutorial/part-3-metrics-integration` | `/blog/lgtm/part-3-metrics-integration/` |
| `06-lgtm-stack/lgtm-tutorial/part-4-advanced-features` | `/blog/lgtm/part-4-advanced-features/` |
| `06-lgtm-stack/lgtm-tutorial/part-5-testing-and-deployment` | `/blog/lgtm/part-5-testing-and-deployment/` |
| `06-lgtm-stack/lgtm-tutorial/readme` | `/blog/series/Building%20a%20Spring%20Boot%20Starter%20for%20LGTM/` |
| `part-1-agentic-ai-foundations/part-1-foundations` | `/blog/agentic-ai/part-1-agent-foundations/` |
| `part-1-agentic-ai-foundations/agentic_ai_and_agentic_rag_tutorial` | `/blog/agentic-ai/part-2-agentic-ai-and-rag/` |
| `part-1-agentic-ai-foundations/mcp---agentic_ai_and_agentic_rag_tutorial` | `/blog/agentic-ai/part-3-production-mcp-patterns/` |
| `part-1-agentic-ai-foundations/beginner-blog` | `/blog/agentic-ai/part-4-gitlab-mcp-server/` |
| `part-1-agentic-ai-foundations/tutorial-blog` | `/blog/agentic-ai/part-4-gitlab-mcp-server/` |
| `prompt-engineering/prompt-engineering-concepts` | `/blog/prompt-engineering/prompt-engineering-guide/` |
| `prompt-engineering/rag_and_agentic_rag_tutorial` | `/blog/prompt-engineering/rag-and-agentic-rag-tutorial/` |
| `prompt-engineering/slide-deck` | `/blog/prompt-engineering/prompt-engineering-slides/` |
| `token-preservation/github-copilot-cost-optimization` | `/blog/token-preservation/copilot-cost-optimization-playbook/` |
| `token-preservation/additional-reference-copilot-cost-research-report` | `/blog/token-preservation/copilot-cost-optimization-playbook/` |
| `context-engineering/part-1-standardizing_machine_readable_web_context` | `/blog/context-engineering/part-1-standardising-machine-readable-web-context/` |
| `context-engineering/part-2-fundamentals-of-codebase-ctx-engg` | `/blog/context-engineering/part-2-codebase-context-engineering-fundamentals/` |
| `context-engineering/part-3-adapt-spring-boot-code` | `/blog/context-engineering/part-3-adapting-context-engineering-for-spring-boot/` |
| `10-openapigenerators/i_want_to_learn_how_openapi_source_code` | `/blog/openapi/openapi-code-generation-spring-boot-4/` |
| `10-openapigenerators/create_a_tutorial_to_genralise_the_genra` | `/blog/openapi/scaling-openapi-generation-multiple-specs/` |
| `10-openapigenerators/implementing_the_delegate_pattern_in_spring_boot_4` | `/blog/openapi/openapi-delegate-pattern-spring-boot-4/` |
| `11-spec-driven-development/11` | `/blog/spec-driven-development/spec-driven-development-with-openspec-and-copilot/` |
| `2025-05-05-14-43-39` | `/blog/java-code-analysis-tree-sitter/` |
| `2025-05-05-14-48-05` | `/blog/ai-code-smell-analysis/` |
| `callhierarchytomermaid` | `/blog/java-call-hierarchy-mermaid/` |
| `finddiff` | `/blog/java-object-difference-reflection/` |
| `flowablewithspring` | `/blog/flowable-spring-bpmn-cmmn-dmn/` |

Explicit redirect-free removals: the three draft starter-document routes,
`json-test`, `link-collection`, `prompt-engineering/slide-deck-slides`, the
bespoke `prompt-engineering/slide-deck/slides` wrapper, the unreferenced
screenshot, the extensionless editorial draft, `GitlabOperations.java`, and the
duplicate content-tree PPTX.
