# Celestial Cloud - Modern Developer Portfolio

A modern, responsive portfolio website built with Astro and React, featuring a terminal-inspired design with multiple theme options and configurable sections.

## 🚀 Features

- **Modern Design**: Terminal-inspired UI with glass morphism effects
- **Multiple Themes**: Light, Dark, and Emerald Dark themes with dropdown selector
- **Responsive**: Fully responsive design that works on all devices
- **Configurable**: Easy to enable/disable sections via environment variables
- **Blog Support**: Markdown-based blog system with frontmatter support
- **Project Showcase**: GitHub integration with fork attribution
- **Smooth Animations**: Framer Motion animations throughout
- **Performance**: Optimized with Astro's islands architecture

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.11.0
- **Frontend**: [React](https://reactjs.org/) v19.1.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v3.4.17
- **Animations**: [Framer Motion](https://www.framer.com/motion/) v12.23.3
- **Language**: TypeScript
- **Deployment**: Vercel/Netlify ready

## 🎨 Themes

### Light Theme
Clean, minimal design with high contrast for excellent readability.

### Dark Theme
Elegant dark mode with carefully chosen colors for reduced eye strain.

### Emerald Dark Theme ⭐ (Default)
Unique emerald-inspired dark theme with rich blue-green tones and cyan accents.

## 📝 Blog System

The blog system supports markdown files with frontmatter metadata. All blog posts are stored in the `src/content/blog/` directory and automatically appear in the blog section.

### 📁 Blog Directory Structure

```
src/
└── content/
    └── blog/
        ├── astro-react-modern-web-apps.md
        ├── enterprise-java-spring-boot.md
        ├── your-new-article.md
        └── another-article.md
```

### ✍️ Creating a New Blog Post

#### 1. Create the Markdown File

```bash
# Navigate to your project root directory

# Create a new blog post
touch src/content/blog/my-new-post.md
```

#### 2. Add Frontmatter and Content

```markdown
---
title: "Getting Started with Docker"
date: "2024-07-11"
excerpt: "A beginner's guide to containerization with Docker, covering basics to advanced concepts."
tags: ["Docker", "DevOps", "Containerization", "Tutorial"]
author: "Abudhahir"
featured: false
readTime: "10 min read"
---

# Getting Started with Docker

Docker has revolutionized how we develop and deploy applications...

## What is Docker?

Docker is a platform that uses containerization...

## Installing Docker

To get started with Docker:

1. Visit [docker.com](https://docker.com)
2. Download Docker Desktop
3. Follow installation instructions

## Your First Container

```bash
docker run hello-world
```

This command will download and run a test container...

## Conclusion

Docker provides a consistent environment for your applications...

---

*Want to learn more about DevOps? Check out my other articles on Kubernetes and CI/CD.*
```

#### 3. Frontmatter Format Requirements

**Required Format (YAML):**
```yaml
---
title: "Your Post Title"              # String with quotes
date: "2024-07-11"                    # Date in YYYY-MM-DD format
excerpt: "Brief description..."        # String with quotes
tags: ["Tag1", "Tag2", "Tag3"]        # Array with quoted strings
author: "Your Name"                   # String with quotes
featured: true                        # Boolean (true/false)
readTime: "10 min read"               # String with quotes
---
```

**✅ Correct Examples:**
```yaml
# All values properly quoted
title: "TypeScript Best Practices"
tags: ["TypeScript", "JavaScript", "Web Development"]
featured: true
date: "2024-01-15"

# Array format variations (both work)
tags: ["Docker", "Kubernetes", "DevOps"]
# OR
tags: 
  - "Docker"
  - "Kubernetes" 
  - "DevOps"
```

**❌ Common Mistakes:**
```yaml
# Missing quotes around strings
title: TypeScript Best Practices        # Should be "TypeScript Best Practices"

# Incorrect date format
date: January 15, 2024                  # Should be "2024-01-15"

# Missing quotes in array
tags: [Docker, Kubernetes]              # Should be ["Docker", "Kubernetes"]

# Incorrect boolean
featured: "true"                        # Should be true (no quotes)
```

### 📋 Frontmatter Fields Reference

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `title` | String | ✅ | Post title | `"Getting Started with Docker"` |
| `date` | String | ✅ | Publication date | `"2024-07-11"` |
| `excerpt` | String | ✅ | Short description for preview | `"A beginner's guide to..."` |
| `tags` | Array | ✅ | Technology/topic tags | `["Docker", "DevOps"]` |
| `author` | String | ✅ | Author name | `"Abudhahir"` |
| `featured` | Boolean | ❌ | Show in featured section | `true` or `false` |
| `readTime` | String | ❌ | Estimated reading time | `"10 min read"` |

### 🏷️ Tag Colors

The blog system automatically assigns colors to common tags:

- **Languages**: `JavaScript`, `TypeScript`, `Python`, `Java`, `Go`
- **Frameworks**: `React`, `Vue`, `Angular`, `Spring Boot`, `Django`
- **Tools**: `Docker`, `Kubernetes`, `Git`, `VS Code`
- **Concepts**: `DevOps`, `Architecture`, `Performance`, `Security`
- **Platforms**: `AWS`, `Azure`, `Google Cloud`, `Vercel`

### 📝 File Naming Convention

Use kebab-case for filenames:
- ✅ `my-awesome-tutorial.md`
- ✅ `docker-kubernetes-guide.md`
- ✅ `2024-react-best-practices.md`
- ❌ `My Awesome Tutorial.md`
- ❌ `docker_kubernetes_guide.md`

### 🎯 Blog Post Best Practices

#### Structure Your Posts
```markdown
# Main Title

Brief introduction paragraph...

## Section 1: Overview
Content here...

## Section 2: Implementation
```bash
# Code examples
npm install example
```

## Section 3: Best Practices
- Point 1
- Point 2
- Point 3

## Conclusion
Summary and next steps...

---

*Links to related articles or your social profiles*
```

#### Writing Tips
- **Start with a hook**: Grab attention in the first paragraph
- **Use headings**: Break content into digestible sections
- **Include code examples**: Provide practical, runnable code
- **Add visuals**: Use code blocks, lists, and formatting
- **End with a call-to-action**: Encourage engagement

#### SEO and Discoverability
- **Descriptive titles**: Make titles searchable and clear
- **Rich excerpts**: Write compelling descriptions
- **Relevant tags**: Use 3-5 specific, relevant tags
- **Internal links**: Reference your other posts
- **External links**: Link to authoritative sources

### 🔧 Managing Blog Content

#### Enable/Disable Blog
```bash
# In your .env file
PUBLIC_SHOW_BLOG=true   # Show blog section
PUBLIC_SHOW_BLOG=false  # Hide blog section
```

#### Sample Posts Included
- **`astro-react-modern-web-apps.md`** - Comprehensive guide on Astro + React
- **`enterprise-java-spring-boot.md`** - Enterprise Java development guide

#### Automatic Features
- **Dynamic content loading**: Reads markdown files from `src/content/blog/` at build time
- **Chronological sorting**: Posts sorted by date (newest first)
- **Real-time search**: Search by title, content, and tags (client-side filtering)
- **Featured posts filter**: Highlight important articles with dynamic counting
- **Responsive design**: Works on all devices
- **Reading time estimation**: Automatically calculated from content

### 🚀 Publishing Workflow

1. **Write your post** in `src/content/blog/filename.md`
2. **Test locally** with `npm run dev`
3. **Review in browser** at `http://localhost:4321`
4. **Commit and push** to your repository
5. **Deploy automatically** (if using Vercel/Netlify)

Your blog posts will be automatically discovered and displayed in the blog section!

## 🔧 Configuration

Copy `.env.example` to `.env` and customize:

```bash
# Feature Toggles
PUBLIC_SHOW_EXPERIENCE=false  # Set to true to show Experience section
PUBLIC_SHOW_BLOG=true         # Set to true to show Blog section
PUBLIC_SHOW_CONTACT_FORM=false # Set to false to hide contact form

# Optional: External Links
PUBLIC_RESUME_URL=           # Link to your resume/CV
PUBLIC_CALENDAR_URL=         # Link to calendar booking
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/abudhahir/abudhahir.github.io.git
   cd abudhahir.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

*Built with ❤️ using Astro and React*