import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

// Consolidated project data
const allProjects = [
  // AI & Agent Tools
  {
    id: 'superpowers', name: 'superpowers',
    description: 'Claude Code superpowers: core skills library. Active Workflow Engine implementing shared state sync.',
    tech: ['JavaScript', 'AI Tools', 'VS Code'], language: 'JavaScript', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/superpowers', isPrivate: false, isFork: false, stars: 19,
    updatedAt: '2026-05-19', featured: true
  },
  {
    id: 'ghost', name: 'GHOST (get-ghost)',
    description: 'Fetch and install AI agent resources (agents, skills, prompts, instructions, rules) from any git repository via CLI.',
    tech: ['TypeScript', 'CLI', 'AI Agents'], language: 'TypeScript', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/GHOST', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-04-25', featured: true
  },
  {
    id: 'merdit', name: 'Merdit',
    description: 'Mermaid Diagram Generator with Azure OpenAI integration and Entra ID authentication. Generates diagrams from natural language.',
    tech: ['TypeScript', 'React', 'Azure OpenAI', 'Entra ID', 'Mermaid'], language: 'TypeScript', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/merdit', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-25', featured: true
  },
  {
    id: 'spark', name: 'SPARK (skill-finder)',
    description: 'MCP server that discovers and installs skills, agents, commands, and prompts from remote Git repositories without cloning.',
    tech: ['TypeScript', 'MCP', 'AI Agents'], language: 'TypeScript', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/skill-finder', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-04-02', featured: true
  },
  {
    id: 'langgraph-tryout', name: 'CodeInsight Agent',
    description: 'LangGraph-based agentic solution to checkout repositories, understand codebases, and suggest refactoring/improvements.',
    tech: ['Python', 'LangGraph', 'OpenAI API'], language: 'Python', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/langgraph-tryout', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-01', featured: true
  },
  {
    id: 'projects-pkm', name: 'Projects PKM',
    description: 'Personal knowledge base for AI-agent workflows, reusable skills, prompts, research notes, and the ecc-universal package workspace.',
    tech: ['JavaScript', 'PKM', 'AI Workflow'], language: 'JavaScript', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/projects-pkm', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-21', featured: false
  },
  {
    id: 'research4ideas', name: 'research4ideas',
    description: 'When ideas need more. [Placeholder - Update description later]',
    tech: [], language: 'None', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/research4ideas', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-31', featured: false
  },
  {
    id: 'DeepResearchAgent', name: 'DeepResearchAgent',
    description: 'Hierarchical multi-agent system for deep research tasks and general-purpose task solving.',
    tech: ['JavaScript', 'Multi-Agent', 'Research'], language: 'JavaScript', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/DeepResearchAgent', isPrivate: false, isFork: true, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'beeai-tryut', name: 'beeai-tryut',
    description: '[Placeholder - Update description later]',
    tech: ['TypeScript'], language: 'TypeScript', category: 'AI & Agent Tools',
    githubUrl: 'https://github.com/abudhahir/beeai-tryut', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },

  // Developer Tools & Plugins
  {
    id: 'noteme', name: 'NoteMe IDEA Plugin',
    description: 'IntelliJ IDEA plugin for note management. Organize and search Markdown notes directly in the IDE with ChromaDB semantic search.',
    tech: ['Kotlin', 'IntelliJ', 'ChromaDB', 'LangChain4j'], language: 'Kotlin', category: 'Developer Tools',
    githubUrl: 'https://github.com/abudhahir/NoteMe-idea-plugin', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-03', featured: true
  },
  {
    id: 'java-ast', name: 'Java AST Generator',
    description: 'Python script that parses a Java codebase and generates an Abstract Syntax Tree (AST) using Tree-sitter.',
    tech: ['Python', 'Tree-sitter', 'AST', 'Java'], language: 'Python', category: 'Developer Tools',
    githubUrl: 'https://github.com/abudhahir/java-ast', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-01', featured: false
  },
  {
    id: 'dex', name: 'dex (Diagram Exporter)',
    description: 'CLI tool and library to convert Gliffy diagrams to Draw.io XML, Mermaid, or PlantUML.',
    tech: ['TypeScript', 'CLI', 'Diagrams'], language: 'TypeScript', category: 'Developer Tools',
    githubUrl: 'https://github.com/abudhahir/diagram-exporter', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-01', featured: false
  },
  {
    id: 'projects-cache-clean', name: 'projects-cache-clean',
    description: 'Clean cache across multiple projects. [Placeholder - Update description later]',
    tech: ['Go'], language: 'Go', category: 'Developer Tools',
    githubUrl: 'https://github.com/abudhahir/projects-cache-clean', isPrivate: false, isFork: false, stars: 1,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'simple-repo-downloader', name: 'simple-repo-downloader',
    description: '[Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'Developer Tools',
    githubUrl: 'https://github.com/abudhahir/simple-repo-downloader', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'reposynctory', name: 'reposynctory',
    description: 'Get all repos - sync with local. [Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'Developer Tools',
    githubUrl: 'https://github.com/abudhahir/reposynctory', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'bitbucket-stats', name: 'bitbucket-stats',
    description: 'Bitbucket repo actions. [Placeholder - Update description later]',
    tech: [], language: 'None', category: 'Developer Tools',
    githubUrl: 'https://github.com/abudhahir/bitbucket-stats', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },

  // Enterprise Java & Cloud
  {
    id: 'apidesign', name: 'API Design',
    description: 'Spring Boot RESTful API design demonstrating Strategy pattern and Process Pipelines for payment processing.',
    tech: ['Java', 'Spring Boot', 'Design Patterns'], language: 'Java', category: 'Enterprise Java & Cloud',
    githubUrl: 'https://github.com/abudhahir/apidesign', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-01', featured: false
  },
  {
    id: 'springboot-docker', name: 'Spring Boot Docker',
    description: 'A simple dockerized Spring Boot application showcasing containerization best practices.',
    tech: ['Java', 'Spring Boot', 'Docker'], language: 'Java', category: 'Enterprise Java & Cloud',
    githubUrl: 'https://github.com/abudhahir/springboot-docker', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2021-08-26', featured: false
  },
  {
    id: 'sample-cloud-functions', name: 'Sample Cloud Functions',
    description: 'Repository containing base examples of Spring Cloud Functions for serverless patterns.',
    tech: ['Java', 'Spring Cloud'], language: 'Java', category: 'Enterprise Java & Cloud',
    githubUrl: 'https://github.com/abudhahir/sample-cloud-functions', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2023-11-30', featured: false
  },
  {
    id: 'spring-samples', name: 'spring-samples',
    description: '[Placeholder - Update description later]',
    tech: ['Java', 'Spring'], language: 'Java', category: 'Enterprise Java & Cloud',
    githubUrl: 'https://github.com/abudhahir/spring-samples', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2023-09-19', featured: false
  },
  {
    id: 'cuj-cosmos', name: 'cuj-cosmos',
    description: '[Placeholder - Update description later]',
    tech: ['Java'], language: 'Java', category: 'Enterprise Java & Cloud',
    githubUrl: 'https://github.com/abudhahir/cuj-cosmos', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'configurable-api-spring', name: 'Configurable API Spring',
    description: '[Placeholder - Update description later]',
    tech: ['Java'], language: 'Java', category: 'Enterprise Java & Cloud',
    githubUrl: 'https://github.com/abudhahir/configurable-api-spring', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-03-18', featured: false
  },

  // AI Video & Content
  {
    id: 'vifai', name: 'vifai',
    description: 'AI video factory. [Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'AI Video & Content',
    githubUrl: 'https://github.com/abudhahir/vifai', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'vifai2', name: 'vifai2',
    description: 'Social media video generation. [Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'AI Video & Content',
    githubUrl: 'https://github.com/abudhahir/vifai2', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'just-video', name: 'just-video',
    description: '[Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'AI Video & Content',
    githubUrl: 'https://github.com/abudhahir/just-video', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },

  // Home & Productivity
  {
    id: 'c4u-home-document-sorter', name: 'c4u-home-document-sorter',
    description: 'Latest document sorter. [Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'Home & Productivity',
    githubUrl: 'https://github.com/abudhahir/c4u-home-document-sorter', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'scrum-assistant', name: 'scrum-assistant',
    description: 'Scrum with AI. [Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'Home & Productivity',
    githubUrl: 'https://github.com/abudhahir/scrum-assistant', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'easyclips', name: 'easyclips',
    description: '[Placeholder - Update description later]',
    tech: ['PHP'], language: 'PHP', category: 'Home & Productivity',
    githubUrl: 'https://github.com/abudhahir/easyclips', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'tour-mananagment-wp', name: 'tour-mananagment-wp',
    description: '[Placeholder - Update description later]',
    tech: ['PHP'], language: 'PHP', category: 'Home & Productivity',
    githubUrl: 'https://github.com/abudhahir/tour-mananagment-wp', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },

  // Data Science
  {
    id: 'ds', name: 'ds',
    description: '[Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'Data Science',
    githubUrl: 'https://github.com/abudhahir/ds', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2020-11-25', featured: false
  },
  {
    id: 'datascience', name: 'datascience',
    description: '[Placeholder - Update description later]',
    tech: ['Jupyter Notebook'], language: 'Jupyter Notebook', category: 'Data Science',
    githubUrl: 'https://github.com/abudhahir/datascience', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2020-11-26', featured: false
  },

  // Web & UI
  {
    id: 'chat-ui', name: 'chat-ui',
    description: '[Placeholder - Update description later]',
    tech: ['JavaScript'], language: 'JavaScript', category: 'Web & UI',
    githubUrl: 'https://github.com/abudhahir/chat-ui', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'water-ui', name: 'water-ui',
    description: '[Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'Web & UI',
    githubUrl: 'https://github.com/abudhahir/water-ui', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'dyf', name: 'dyf',
    description: '[Placeholder - Update description later]',
    tech: ['TypeScript'], language: 'TypeScript', category: 'Web & UI',
    githubUrl: 'https://github.com/abudhahir/dyf', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'vson', name: 'vson',
    description: '[Placeholder - Update description later]',
    tech: ['TypeScript'], language: 'TypeScript', category: 'Web & UI',
    githubUrl: 'https://github.com/abudhahir/vson', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'collector', name: 'collector',
    description: '[Placeholder - Update description later]',
    tech: ['TypeScript'], language: 'TypeScript', category: 'Web & UI',
    githubUrl: 'https://github.com/abudhahir/collector', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'cdang', name: 'cdang',
    description: '[Placeholder - Update description later]',
    tech: ['TypeScript'], language: 'TypeScript', category: 'Web & UI',
    githubUrl: 'https://github.com/abudhahir/cdang', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'cleveloper-component-repository', name: 'cleveloper-component-repository',
    description: '[Placeholder - Update description later]',
    tech: ['TypeScript'], language: 'TypeScript', category: 'Web & UI',
    githubUrl: 'https://github.com/abudhahir/cleveloper-component-repository', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'code-analyser', name: 'code-analyser',
    description: '[Placeholder - Update description later]',
    tech: ['HTML'], language: 'HTML', category: 'Web & UI',
    githubUrl: 'https://github.com/abudhahir/code-analyser', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },

  // Others & Portfolio
  {
    id: 'cleveloper-utilites-4h-doc-handler', name: 'cleveloper-utilites-4h-doc-handler',
    description: '[Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'Others',
    githubUrl: 'https://github.com/abudhahir/cleveloper-utilites-4h-doc-handler', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'project-u', name: 'project-u',
    description: '[Placeholder - Update description later]',
    tech: ['Python'], language: 'Python', category: 'Others',
    githubUrl: 'https://github.com/abudhahir/project-u', isPrivate: true, isFork: false, stars: 0,
    updatedAt: '2026-01-01', featured: false
  },
  {
    id: 'gitjournal', name: 'GitJournal',
    description: 'Mobile first Note Taking application integrated with Git for version control and synchronization.',
    tech: ['Dart'], language: 'Dart', category: 'Others',
    githubUrl: 'https://github.com/abudhahir/GitJournal', isPrivate: false, isFork: true, stars: 0,
    updatedAt: '2024-08-13', featured: false
  },
  {
    id: 'notea', name: 'Notea',
    description: 'Self-hosted note taking app with S3 storage backend.',
    tech: ['TypeScript'], language: 'TypeScript', category: 'Others',
    githubUrl: 'https://github.com/abudhahir/notea', isPrivate: false, isFork: true, stars: 0,
    updatedAt: '2021-05-31', featured: false
  },
  {
    id: 'cleveloper.github.io', name: 'cleveloper.github.io',
    description: 'Portfolio or GitHub Pages site.',
    tech: ['Ruby'], language: 'Ruby', category: 'Portfolio',
    githubUrl: 'https://github.com/abudhahir/cleveloper.github.io', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2023-06-09', featured: false
  },
  {
    id: 'abudhahir.github.io', name: 'abudhahir.github.io',
    description: 'This current portfolio website.',
    tech: ['HTML', 'JavaScript', 'React', 'Astro'], language: 'HTML', category: 'Portfolio',
    githubUrl: 'https://github.com/abudhahir/abudhahir.github.io', isPrivate: false, isFork: false, stars: 0,
    updatedAt: '2026-05-22', featured: false
  }
];

export default function Projects({ showProjects = true }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const categories = ['All', ...new Set(allProjects.map(p => p.category))];

  // Hide projects section if flag is false
  if (!showProjects) {
    return null;
  }

  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const getLanguageColor = (language) => {
    const colors = {
      'TypeScript': '#3178C6',
      'Python': '#3776AB',
      'Java': '#ED8B00',
      'Dart': '#0175C2',
      'JavaScript': '#F7DF1E',
      'HTML': '#E34F26',
      'Ruby': '#CC342D',
      'Kotlin': '#A97BFF',
      'PHP': '#4F5D95',
      'Go': '#00ADD8',
      'Jupyter Notebook': '#DA5B0B'
    };
    return colors[language] || '#6B7280';
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === '2026-01-01') return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <section id="projects" className="py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">&lt;</span>
            Projects & Repositories
            <span className="text-primary"> /&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          
          <p className="text-muted mb-8 max-w-2xl">
            A curated showcase of my {allProjects.length} projects, including AI agent tools, enterprise Java applications, internal productivity scripts, and open-source contributions. Use the filters below to explore.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10">
             {/* Category filter tabs */}
            <div className="flex flex-wrap gap-2 md:gap-3 flex-1">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium text-xs md:text-sm transition-all duration-300 ${
                    activeCategory === category 
                      ? 'bg-primary text-black shadow-[0_0_15px_rgba(var(--color-primary),0.5)]' 
                      : 'bg-secondary/40 text-muted hover:text-foreground hover:bg-secondary border border-border/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Box & View Toggle */}
            <div className="flex flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-56 lg:w-64">
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary/30 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm text-foreground transition-all duration-300"
                />
                <svg className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* View Toggles */}
              <div className="flex items-center gap-1 bg-secondary/30 p-1 rounded-full border border-border/50 hidden md:flex shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-primary text-black shadow-sm' : 'text-muted hover:text-foreground hover:bg-secondary/50'}`}
                  aria-label="Grid View"
                  title="Grid View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-primary text-black shadow-sm' : 'text-muted hover:text-foreground hover:bg-secondary/50'}`}
                  aria-label="List View"
                  title="List View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="text-center py-20 text-muted"
             >
               No projects found matching your criteria. Try adjusting your filters or search query.
             </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery + viewMode}
              className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="group relative h-full"
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block glass rounded-xl md:rounded-2xl overflow-hidden border border-border/50 
                            hover:border-primary/70 transition-all duration-300 relative z-10 
                            group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                            group-hover:-translate-y-0.5 bg-gradient-to-br from-background to-secondary/20
                            ${viewMode === 'grid' ? 'h-full flex flex-col' : 'w-full'}
                            `}
                  >
                    <div className={`flex relative p-4 md:p-5 ${viewMode === 'grid' ? 'flex-col h-full flex-1' : 'flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center w-full'}`}>
                      
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl md:rounded-2xl pointer-events-none"></div>

                      <div className={viewMode === 'list' ? 'flex-1 min-w-0 flex flex-col justify-center' : 'w-full flex-1 flex flex-col'}>
                        {/* Header with metadata */}
                        <div className={`flex items-center justify-between mb-2 md:mb-3 relative z-10 ${viewMode === 'list' ? 'md:hidden' : ''}`}>
                          <div className="flex items-center gap-1.5">
                            <div 
                              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                              style={{ backgroundColor: getLanguageColor(project.language), color: getLanguageColor(project.language) }}
                            ></div>
                            <span className="text-[11px] font-mono font-medium tracking-wide text-foreground/80">{project.language}</span>
                          </div>
                          <div className="flex gap-2">
                            {project.isPrivate && (
                              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">
                                Private
                              </span>
                            )}
                            {!project.isPrivate && (
                               <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 rounded-md">
                                Public
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className={`flex items-start justify-between gap-3 relative z-10 ${viewMode === 'grid' ? 'mb-2' : 'mb-1'}`}>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                            {project.name}
                          </h3>
                          {project.stars > 0 && viewMode === 'grid' && (
                            <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded text-[10px] font-medium border border-yellow-500/20 whitespace-nowrap">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {project.stars}
                            </div>
                          )}
                        </div>
                        
                        <p className={`text-muted text-sm relative z-10 leading-relaxed ${viewMode === 'grid' ? 'line-clamp-2 mb-4 flex-1' : 'line-clamp-1'}`}>
                          {project.description}
                        </p>

                        {/* Tech stack for Grid view */}
                        {viewMode === 'grid' && (
                          <div className="flex flex-wrap gap-1.5 mt-auto relative z-10">
                            {project.tech.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/50 text-foreground/80 font-mono border border-border/50"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.tech.length > 3 && (
                               <span className="text-[10px] px-2 py-0.5 rounded-md text-muted font-mono border border-transparent">
                                 +{project.tech.length - 3}
                               </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className={`relative z-10 ${viewMode === 'list' ? 'flex flex-row items-center gap-4 w-full md:w-auto shrink-0 md:justify-end' : 'mt-4 pt-3 border-t border-border/50 w-full'}`}>
                        
                        {/* List-only metadata */}
                        {viewMode === 'list' && (
                          <div className="hidden md:flex items-center gap-4 w-44 shrink-0 justify-end">
                            {project.isPrivate && (
                              <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">
                                Private
                              </span>
                            )}
                            {project.stars > 0 && (
                              <div className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {project.stars}
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 ml-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getLanguageColor(project.language) }}></div>
                              <span className="text-xs font-mono w-16 truncate">{project.language}</span>
                            </div>
                          </div>
                        )}

                        {viewMode === 'grid' && (
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] text-muted font-mono uppercase tracking-wider">
                               {project.isFork ? 'Forked' : formatDate(project.updatedAt)}
                             </span>
                             <span className="text-primary text-xs font-medium group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                               View <span className="text-sm leading-none">&rarr;</span>
                             </span>
                          </div>
                        )}
                        
                        {viewMode === 'list' && (
                          <span className="hidden md:flex text-primary text-lg font-medium group-hover:translate-x-1 transition-transform duration-300 items-center ml-2">
                            &rarr;
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
           <a 
             href="https://github.com/abudhahir" 
             target="_blank" 
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary hover:bg-primary hover:text-black text-foreground font-medium transition-all duration-300 border border-border hover:border-transparent group text-sm md:text-base"
           >
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
             </svg>
             View all {allProjects.length}+ repositories on GitHub
             <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
           </a>
        </motion.div>
      </div>
    </section>
  );
}