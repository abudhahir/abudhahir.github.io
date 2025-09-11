---
title: "4. Building a GitLab MCP Server: A Beginner's Guide to AI Agent Integration"
subtitle: "Learn how to build a Model Context Protocol (MCP) server from scratch and integrate it with AI chatbots"
excerpt: "Step-by-step guide to building an MCP server that connects AI chatbots to GitLab repositories. Learn project structure, CLI integration, server architecture, and AI assistant connectivity with practical examples and real-world implementation."
date: 2025-09-08
author: "Abu Dhahir"
tags: ["MCP", "Model Context Protocol", "GitLab", "AI agents", "Python", "CLI", "server architecture", "AI integration", "tutorial", "beginner"]
series: "Agentic AI Foundations"
draft: false
---

# Building a GitLab MCP Server: A Beginner's Guide to AI Agent Integration

**Learn how to build a Model Context Protocol (MCP) server from scratch and integrate it with AI chatbots**

---

## 🎯 What We're Building

In this beginner-friendly guide, we'll explore how to build the `cu-glab-mcp` server that allows AI chatbots to interact with GitLab repositories. By the end, you'll understand:

- What MCP (Model Context Protocol) is and why it's useful
- How to structure a Python MCP server
- How to integrate external APIs (GitLab) with AI agents
- How to make your server work with popular AI chatbots

> **📚 Looking for a complete setup tutorial?** Check out our [GitLab MCP Integration: A Complete Tutorial](./tutorial-blog.md) for step-by-step installation, configuration, and advanced usage.

---

## 🤔 What is MCP (Model Context Protocol)?

Think of MCP as a **translator** between AI chatbots and external tools. Just like you might use a translator to communicate with someone who speaks a different language, MCP helps AI chatbots communicate with tools like GitLab, databases, or file systems.

**Without MCP**: AI chatbot can only use its built-in knowledge
**With MCP**: AI chatbot can read your GitLab issues, create merge requests, and manage your projects!

---

## 🏗️ Project Structure

Let's start by understanding how our project is organized:

```
cu-glab-mcp/
├── src/
│   └── cu_glab_mcp/
│       ├── __init__.py          # Package initialization
│       ├── cli.py               # Command-line interface
│       └── server.py            # MCP server implementation
├── pyproject.toml               # Project configuration
└── README.md                    # Documentation
```

---

## 📦 Step 1: Project Configuration

First, let's look at how we configure our project in `pyproject.toml`:

```toml
[project]
name = "cu-glab-mcp"
version = "0.0.1"
requires-python = ">=3.11"
description = "Cleveloper Utilities - GitLab MCP wrapper for Model Context Protocol integration"
dependencies = [
    "fastmcp>=2.12.2",
]

[project.scripts]
cu-glab-mcp = "cu_glab_mcp.cli:main"

[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.build_meta"

[tool.setuptools]
packages = ["cu_glab_mcp"]
package-dir = {"" = "src"}
```

**What this does:**
- Defines our package name and version
- Specifies Python version requirements
- Lists dependencies (we need `fastmcp` for MCP functionality)
- Creates a command-line tool called `cu-glab-mcp`
- Tells Python where to find our code

---

## 🚀 Step 2: Package Initialization

Let's look at `src/cu_glab_mcp/__init__.py`:

```python
"""cu-glab-mcp: Cleveloper Utilities GitLab MCP wrapper.

Provides Model Context Protocol integration for GitLab operations including
merge requests, issues, and project management via glab CLI.
"""
```

**What this does:**
- This is the "entry point" of our package
- When someone imports our package, this code runs first
- It provides a description of what our package does
- It's like the "welcome message" for our code

---

## 🖥️ Step 3: Command Line Interface

Now let's examine the CLI in `src/cu_glab_mcp/cli.py`. This is how users interact with our tool:

### Basic Structure

```python
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from .server import run_server, build_mcp, run_glab_command

def _ok(data):
    print(json.dumps(data))
    return 0

def _err(msg: str):
    sys.stderr.write(msg + "\n")
    return 1
```

**What this does:**
- Imports necessary modules for command-line processing
- Creates helper functions for success/error responses
- `_ok()` prints JSON data and returns success code
- `_err()` prints error messages and returns error code

### Argument Parsing

```python
def main() -> None:
    parser = argparse.ArgumentParser(prog="cu-glab-mcp")
    parser.add_argument("domain", nargs="?")
    parser.add_argument("action", nargs="?")
    parser.add_argument("--project", dest="project")
    parser.add_argument("--iid", dest="iid")
    parser.add_argument("--body", dest="body")
    parser.add_argument("--title", dest="title")
    parser.add_argument("--description", dest="description")
    parser.add_argument("--state", dest="state", default="opened")
    parser.add_argument("--health", action="store_true")
    parser.add_argument("--transport", choices=["stdio", "sse", "streamable_http"], default="stdio")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
```

**What this does:**
- Creates a command-line argument parser
- Defines all the options users can use with our tool
- `domain` and `action` are the main commands (like "issue list")
- `--project`, `--iid`, etc. are parameters for those commands
- `--health` checks if our server is working
- `--transport` lets users choose how to communicate (stdio, web, etc.)

### Health Check

```python
if args.health:
    code = _ok({"ok": True, "server": "cu-glab-mcp"})
    raise SystemExit(code)
```

**What this does:**
- If someone runs `cu-glab-mcp --health`, we respond with a success message
- This is useful for checking if our tool is installed correctly

### Issue Management Commands

```python
if args.domain == "issue" and args.action == "list":
    if not args.project:
        raise SystemExit(_err("missing --project"))
    
    # Use real glab command
    glab_args = ["issue", "list", "--repo", args.project, "--output", "json"]
    if args.state == "closed":
        glab_args.append("--closed")
    
    result = run_glab_command(glab_args)
    code = _ok(result)
    raise SystemExit(code)
```

**What this does:**
- Handles the command `cu-glab-mcp issue list --project my-repo`
- Checks if the user provided a project name
- Builds a command to run the `glab` tool (GitLab's command-line tool)
- Runs the command and returns the results as JSON

### Creating Issues

```python
if args.domain == "issue" and args.action == "create":
    if not (args.project and args.title):
        raise SystemExit(_err("missing --project or --title"))
    
    # Use real glab command
    glab_args = ["issue", "create", "--repo", args.project, "--title", args.title, "--yes"]
    if args.description:
        glab_args.extend(["--description", args.description])
    
    result = run_glab_command(glab_args)
    code = _ok(result)
    raise SystemExit(code)
```

**What this does:**
- Handles creating new issues with `cu-glab-mcp issue create --project my-repo --title "Bug fix"`
- Validates that required parameters are provided
- Builds a `glab` command to create the issue
- Returns the result

---

## 🔧 Step 4: The MCP Server

The real magic happens in `src/cu_glab_mcp/server.py`. This is where we create the MCP server that AI chatbots can use.

### Running GitLab Commands

```python
def run_glab_command(args: list[str]) -> dict[str, Any]:
    """Run a glab command and return the result."""
    try:
        result = subprocess.run(
            ["glab"] + args,
            capture_output=True,
            text=True,
            check=True,
            timeout=30
        )
        
        # Try to parse JSON output if available
        if result.stdout.strip():
            try:
                return json.loads(result.stdout)
            except json.JSONDecodeError:
                # If not JSON, return the raw output
                return {"output": result.stdout.strip()}
        else:
            return {"ok": True, "message": "Command executed successfully"}
            
    except subprocess.CalledProcessError as e:
        return {
            "error": True,
            "message": f"glab command failed: {e.stderr}",
            "return_code": e.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            "error": True,
            "message": "glab command timed out"
        }
    except FileNotFoundError:
        return {
            "error": True,
            "message": "glab command not found. Please install glab CLI tool."
        }
```

**What this does:**
- This function runs GitLab commands using the `glab` tool
- It captures the output and converts it to JSON
- It handles errors gracefully (timeouts, missing tools, etc.)
- It's like a "wrapper" around the `glab` command

### Building the MCP Server

```python
def build_mcp():
    try:
        from fastmcp import FastMCP  # type: ignore
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(
            "FastMCP not installed. Install with: uv add fastmcp (or pip install fastmcp)"
        ) from exc

    mcp = FastMCP("cu-glab-mcp")
```

**What this does:**
- Imports the `FastMCP` library (this handles the MCP protocol)
- Creates an MCP server instance
- If FastMCP isn't installed, it gives a helpful error message

### Defining MCP Tools

Now we define the tools that AI chatbots can use:

```python
@mcp.tool()
def mr_get(project: str, iid: int) -> dict[str, Any]:  # noqa: ANN001
    """Get merge request details using glab CLI."""
    args = ["mr", "view", str(iid), "--repo", project, "--output", "json"]
    return run_glab_command(args)
```

**What this does:**
- `@mcp.tool()` tells FastMCP this is a tool AI chatbots can use
- The function name `mr_get` becomes the tool name
- AI chatbots can call this tool to get merge request details
- It uses our `run_glab_command` function to do the actual work

```python
@mcp.tool()
def issue_list(project: str, state: str = "opened") -> list[dict[str, Any]]:  # noqa: ANN001
    """List issues for a project using glab CLI."""
    args = ["issue", "list", "--repo", project, "--output", "json"]
    if state == "closed":
        args.append("--closed")
    return run_glab_command(args)
```

**What this does:**
- Creates a tool for listing issues
- AI chatbots can call this to see all issues in a project
- The `state` parameter lets them choose open or closed issues

```python
@mcp.tool()
def issue_create(project: str, title: str, description: str | None = None) -> dict[str, Any]:  # noqa: ANN001
    """Create a new issue using glab CLI."""
    args = ["issue", "create", "--repo", project, "--title", title, "--yes"]
    
    if description:
        args.extend(["--description", description])
    
    return run_glab_command(args)
```

**What this does:**
- Creates a tool for creating new issues
- AI chatbots can use this to create issues in GitLab
- It handles both required (title) and optional (description) parameters

### Starting the Server

```python
def run_server() -> None:
    mcp = build_mcp()
    mcp.run()
```

**What this does:**
- Builds the MCP server with all our tools
- Starts the server so AI chatbots can connect to it

---

## 🤖 Step 5: How AI Chatbots Use Our Server

Now let's understand how AI chatbots interact with our MCP server:

### 1. The AI Chatbot Connects

When you configure an AI chatbot (like Claude Desktop) to use our server, it connects using the MCP protocol. The chatbot discovers what tools are available.

### 2. The AI Chatbot Sees Our Tools

Our server tells the chatbot: "I have these tools available:"
- `mr_get(project, iid)` - Get merge request details
- `issue_list(project, state)` - List issues
- `issue_create(project, title, description)` - Create issues
- And more...

### 3. The AI Chatbot Uses the Tools

When you ask the chatbot: "Show me the issues in my project", it:
1. Calls our `issue_list` tool
2. Our tool runs `glab issue list --repo your-project --output json`
3. GitLab returns the issues
4. Our tool formats the response
5. The chatbot shows you the results

### Example Conversation

```
You: "What issues are open in the cleveloper-utilities project?"

AI Chatbot: I'll check the open issues for you.

[AI calls issue_list("abudhahir/cleveloper-utilities", "opened")]

[Our server runs: glab issue list --repo abudhahir/cleveloper-utilities --output json]

[GitLab returns: [{"iid": 1, "title": "Add documentation", "state": "opened"}]]

AI Chatbot: Here are the open issues:
1. Issue #1: "Add documentation" (opened)
```

---

## 🔌 Step 6: Integration with AI Chatbots

### Claude Desktop Integration

To use our server with Claude Desktop, you add it to your MCP configuration:

```json
{
  "mcpServers": {
    "cu-glab-mcp": {
      "command": "cu-glab-mcp",
      "args": [],
      "env": {
        "GITLAB_TOKEN": "your-gitlab-token"
      }
    }
  }
}
```

**What this does:**
- Tells Claude Desktop to start our `cu-glab-mcp` server
- Provides environment variables (like your GitLab token)
- Claude Desktop can now use all our GitLab tools

### Other AI Chatbots

Our server works with any MCP-compatible chatbot:
- **Claude Desktop** - Direct integration
- **Custom AI applications** - Using MCP client libraries
- **Web-based chatbots** - Via HTTP transport

---

## 🧪 Step 7: Testing Our Server

### Test the CLI

```bash
# Test health check
cu-glab-mcp --health

# List issues
cu-glab-mcp issue list --project abudhahir/cleveloper-utilities

# Create an issue
cu-glab-mcp issue create --project abudhahir/cleveloper-utilities --title "Test issue"
```

### Test the MCP Server

```bash
# Start the server
cu-glab-mcp

# In another terminal, test with HTTP
curl -X POST http://localhost:8765/tools/issue_list \
  -H "Content-Type: application/json" \
  -d '{"project": "abudhahir/cleveloper-utilities", "state": "opened"}'
```

---

## 🎯 Step 8: Why This Architecture Works

### Separation of Concerns

1. **CLI (`cli.py`)**: Handles command-line usage
2. **Server (`server.py`)**: Handles MCP protocol and AI integration
3. **GitLab Integration**: Uses `glab` tool for actual GitLab operations

### Benefits

- **Modular**: Each part has a specific job
- **Testable**: We can test each component separately
- **Extensible**: Easy to add new tools or features
- **Reusable**: The MCP server works with any AI chatbot

### Error Handling

Our code handles errors at multiple levels:
- **Missing parameters**: Checked in CLI
- **GitLab errors**: Handled in `run_glab_command`
- **Network issues**: Timeout and retry logic
- **Missing tools**: Clear error messages

---

## 🚀 Step 9: Extending the Server

Want to add more GitLab features? It's easy!

### Add a New Tool

```python
@mcp.tool()
def mr_create(project: str, title: str, description: str, source_branch: str, target_branch: str) -> dict[str, Any]:
    """Create a new merge request using glab CLI."""
    args = [
        "mr", "create",
        "--repo", project,
        "--title", title,
        "--description", description,
        "--source-branch", source_branch,
        "--target-branch", target_branch,
        "--yes"
    ]
    return run_glab_command(args)
```

**What this does:**
- Adds a new tool for creating merge requests
- AI chatbots can now create MRs through our server
- Follows the same pattern as existing tools

### Add CLI Support

```python
if args.domain == "mr" and args.action == "create":
    if not (args.project and args.title and args.source_branch and args.target_branch):
        raise SystemExit(_err("missing required parameters"))
    
    result = run_glab_command([
        "mr", "create",
        "--repo", args.project,
        "--title", args.title,
        "--source-branch", args.source_branch,
        "--target-branch", args.target_branch,
        "--yes"
    ])
    code = _ok(result)
    raise SystemExit(code)
```

---

## 🎉 Conclusion

Congratulations! You now understand how to build an MCP server that connects AI chatbots to external tools like GitLab.

### What We Learned

1. **MCP Protocol**: How AI chatbots communicate with external tools
2. **Project Structure**: How to organize a Python MCP server
3. **CLI Integration**: How to make tools usable from the command line
4. **Server Architecture**: How to create tools that AI chatbots can use
5. **Error Handling**: How to make robust, user-friendly tools
6. **Integration**: How to connect everything together

### Key Concepts

- **MCP Tools**: Functions that AI chatbots can call
- **Command Wrapping**: Using external tools (like `glab`) from Python
- **Error Handling**: Graceful failure with helpful messages
- **Modular Design**: Separate concerns for maintainability

### Next Steps

1. **Experiment**: Try modifying the existing tools
2. **Add Features**: Create new GitLab tools
3. **Integrate**: Connect with your favorite AI chatbot
4. **Share**: Contribute improvements to the project

> **🚀 Ready to dive deeper?** Follow our [GitLab MCP Integration: A Complete Tutorial](./tutorial-blog.md) to learn about installation, authentication, troubleshooting, and advanced features like monitoring and automation.

### Resources

- **Full Code**: [cu-glab-mcp on GitHub](https://github.com/abudhahir/cleveloper-utilities/tree/main/cu-glab-mcp)
- **MCP Documentation**: [Model Context Protocol](https://modelcontextprotocol.io/)
- **GitLab CLI**: [glab documentation](https://gitlab.com/gitlab-org/cli)
- **FastMCP**: [FastMCP library](https://github.com/jlowin/fastmcp)

---

**Happy coding! 🚀**

*This guide is part of the [Cleveloper Utilities](https://github.com/abudhahir/cleveloper-utilities) collection - empowering developers with AI-powered tools and seamless integrations.*
