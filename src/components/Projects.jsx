import { motion } from 'framer-motion';
import { useState } from 'react';

const projects = [
  {
    id: 1,
    name: 'Merdit',
    description: 'Mermaid Diagram Generator with Azure OpenAI integration and Entra ID authentication. A powerful tool for creating visual diagrams using AI.',
    tech: ['TypeScript', 'Azure OpenAI', 'Entra ID', 'Mermaid'],
    githubUrl: 'https://github.com/abudhahir/merdit',
    liveUrl: 'https://github.com/abudhahir/merdit',
    featured: true,
    language: 'TypeScript',
    updatedAt: '2025-06-25',
    fork: null,
  },
  {
    id: 2,
    name: 'Java AST',
    description: 'Python-based Abstract Syntax Tree parser for Java code analysis and manipulation. Useful for code refactoring and analysis tools.',
    tech: ['Python', 'AST', 'Java', 'Code Analysis'],
    githubUrl: 'https://github.com/abudhahir/java-ast',
    liveUrl: 'https://github.com/abudhahir/java-ast',
    featured: true,
    language: 'Python',
    updatedAt: '2025-05-14',
    fork: null,
  },
  {
    id: 3,
    name: 'Spring Boot Docker',
    description: 'A simple dockerized Spring Boot application showcasing containerization best practices for Java applications.',
    tech: ['Java', 'Spring Boot', 'Docker', 'Maven'],
    githubUrl: 'https://github.com/abudhahir/springboot-docker',
    liveUrl: 'https://github.com/abudhahir/springboot-docker',
    featured: true,
    language: 'Java',
    updatedAt: '2021-08-26',
    fork: null,
  },
  {
    id: 4,
    name: 'LangGraph Tryout',
    description: 'Experimental project exploring LangGraph for building AI agent workflows and complex language model interactions.',
    tech: ['Python', 'LangGraph', 'AI', 'Agents'],
    githubUrl: 'https://github.com/abudhahir/langgraph-tryout',
    liveUrl: 'https://github.com/abudhahir/langgraph-tryout',
    featured: false,
    language: 'Python',
    updatedAt: '2025-06-05',
    fork: null,
  },
  {
    id: 5,
    name: 'Sample Cloud Functions',
    description: 'Repository containing base examples of Spring Cloud Functions for serverless computing patterns.',
    tech: ['Java', 'Spring Cloud', 'Serverless', 'Functions'],
    githubUrl: 'https://github.com/abudhahir/sample-cloud-functions',
    liveUrl: 'https://github.com/abudhahir/sample-cloud-functions',
    featured: false,
    language: 'Java',
    updatedAt: '2023-11-30',
    fork: null,
  },
  {
    id: 6,
    name: 'GitJournal',
    description: 'Mobile first Note Taking application integrated with Git for version control and synchronization.',
    tech: ['Dart', 'Flutter', 'Git', 'Mobile'],
    githubUrl: 'https://github.com/abudhahir/GitJournal',
    liveUrl: 'https://github.com/abudhahir/GitJournal',
    featured: false,
    language: 'Dart',
    updatedAt: '2024-08-13',
    fork: {
      owner: 'GitJournal',
      name: 'GitJournal',
      url: 'https://github.com/GitJournal/GitJournal'
    },
  },
  {
    id: 7,
    name: 'Notea',
    description: 'Self-hosted note taking app with S3 storage backend for secure and scalable note management.',
    tech: ['TypeScript', 'S3', 'Self-hosted', 'Notes'],
    githubUrl: 'https://github.com/abudhahir/notea',
    liveUrl: 'https://github.com/abudhahir/notea',
    featured: false,
    language: 'TypeScript',
    updatedAt: '2021-05-31',
    fork: {
      owner: 'QingWei-Li',
      name: 'notea',
      url: 'https://github.com/QingWei-Li/notea'
    },
  },
  {
    id: 8,
    name: 'API Design',
    description: 'Java-based project focusing on RESTful API design patterns and best practices for enterprise applications.',
    tech: ['Java', 'REST API', 'Enterprise', 'Design Patterns'],
    githubUrl: 'https://github.com/abudhahir/apidesign',
    liveUrl: 'https://github.com/abudhahir/apidesign',
    featured: false,
    language: 'Java',
    updatedAt: '2025-01-12',
    fork: null,
  },
];

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
    };
    return colors[language] || '#6B7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <section id="projects" className="py-20 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">&lt;</span>
            Projects
            <span className="text-primary"> /&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          
          <p className="text-muted mb-8 max-w-2xl">
            A collection of my open-source projects and experiments, ranging from 
            AI-powered tools to enterprise Java applications. Click on any project 
            card to view the repository on GitHub.
          </p>
          
          {/* Filter buttons */}
          <div className="flex gap-4 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                filter === 'all' 
                  ? 'bg-primary text-black' 
                  : 'glass border border-border hover:border-primary'
              }`}
            >
              all_projects ({projects.length})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                filter === 'featured' 
                  ? 'bg-primary text-black' 
                  : 'glass border border-border hover:border-primary'
              }`}
            >
              featured ({projects.filter(p => p.featured).length})
            </button>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group relative"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block glass rounded-lg overflow-hidden border border-border 
                         hover:border-primary transition-all duration-300 h-full flex flex-col
                         cursor-pointer"
              >
                {/* Project info */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Header with metadata */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLanguageColor(project.language) }}
                      ></div>
                      <span className="text-xs font-mono text-muted">{project.language}</span>
                    </div>
                    <span className="text-xs font-mono text-muted">
                      {formatDate(project.updatedAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {project.fork && (
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                          Fork
                        </span>
                      )}
                      {project.featured && (
                        <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                          featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-muted text-sm mb-4 flex-1 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {project.fork && (
                    <div className="mb-4 p-3 bg-secondary/50 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="text-xs text-muted font-medium">Forked from:</span>
                      </div>
                      <a 
                        href={project.fork.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {project.fork.owner}/{project.fork.name}
                      </a>
                    </div>
                  )}
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}