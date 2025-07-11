# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a GitHub Pages personal blog/documentation site (abudhahir.github.io) focused on Java enterprise development, particularly Spring Framework and business process management technologies.

## Common Development Tasks

### Adding New Content
- Create markdown files in the root directory
- Use descriptive filenames (e.g., `TechnologyName.md` or date-based for notes)
- GitHub Pages automatically renders markdown to HTML

### Updating Existing Content
- Edit markdown files directly
- Ensure code examples are properly formatted with syntax highlighting
- Update mermaid diagrams where relevant

### Git Workflow
```bash
# Check current status
git status

# Add changes
git add <filename>

# Commit with descriptive message
git commit -m "Added/Updated [description]"

# Push to GitHub (publishes automatically)
git push origin master
```

## Architecture and Structure

### Content Types
1. **Technical Tutorials** - Comprehensive guides with code examples
   - Spring Framework patterns and implementations
   - Flowable BPM/CMMN/DMN integration guides
   - Enterprise Java best practices

2. **Utility Classes** - Standalone Java utilities
   - `GitlabOperations.java` - Bitbucket repository management
   - `CallHierarchyToMermaid.md` - Code visualization tool
   - `FindDiff.md` - Object difference detection

3. **Code Analysis Tools** - Python-based parsers for Java code refactoring

### Key Technologies Covered
- **Spring Framework**: Boot, Data JPA, Security, Validation
- **Flowable**: BPMN, CMMN, DMN engines
- **Enterprise Patterns**: Strategy, Repository, Service layer
- **Visualization**: Mermaid diagrams for architecture documentation

### Documentation Standards
- Use mermaid diagrams for complex architectures and flows
- Include complete, runnable code examples
- Provide context and use cases for technical implementations
- Structure tutorials with clear sections: Overview, Implementation, Testing, Best Practices

## Important Notes
- No build process required - GitHub Pages handles markdown rendering
- No automated tests - code examples are for educational purposes
- The site uses GitHub's default markdown rendering (no Jekyll configuration)
- Content is primarily Java/Spring focused with enterprise development patterns