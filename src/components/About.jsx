import { motion } from 'framer-motion';

const About = () => {
  const skills = {
    'Backend': ['Java', 'Spring Boot', 'Spring Cloud', 'Python', 'Node.js'],
    'Frontend': ['TypeScript', 'JavaScript', 'React', 'HTML5', 'CSS3'],
    'AI/ML': ['OpenAI API', 'LangGraph', 'AI Agents', 'Azure OpenAI', 'Machine Learning'],
    'Cloud & DevOps': ['Docker', 'Azure', 'Containerization', 'CI/CD', 'Git'],
    'Mobile': ['Flutter', 'Dart', 'Mobile Development', 'Cross-platform'],
    'Tools': ['VS Code', 'IntelliJ', 'Mermaid', 'AST Analysis', 'Code Generation'],
  };

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

  return (
    <section id="about" className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">&lt;</span>
            About Me
            <span className="text-primary"> /&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-primary mb-12"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* About text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted mb-6">
                I'm a passionate developer who bridges traditional enterprise development 
                with cutting-edge AI capabilities. With deep expertise in Java/Spring 
                ecosystem and modern AI integration, I create tools and applications that 
                enhance developer productivity while maintaining enterprise-grade quality.
              </p>
              <p className="text-lg text-muted mb-6">
                My work spans from building robust Spring Boot applications and cloud-native 
                solutions to creating AI-powered developer tools like diagram generators and 
                code analysis utilities. I'm particularly interested in how AI can transform 
                traditional development workflows and make complex tasks more accessible.
              </p>
              <p className="text-lg text-muted">
                Whether it's integrating Azure OpenAI for intelligent diagram generation, 
                building AST parsers for code analysis, or exploring AI agents with LangGraph, 
                I enjoy pushing the boundaries of what's possible when enterprise reliability 
                meets AI innovation.
              </p>
            </div>

            {/* Quick info */}
            <motion.div
              className="mt-8 grid grid-cols-2 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants} className="glass p-4 rounded-lg">
                <p className="text-primary font-mono text-sm">focus:</p>
                <p className="text-foreground font-medium">Enterprise + AI</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass p-4 rounded-lg">
                <p className="text-primary font-mono text-sm">specialization:</p>
                <p className="text-foreground font-medium">Developer Tools</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass p-4 rounded-lg">
                <p className="text-primary font-mono text-sm">languages:</p>
                <p className="text-foreground font-medium">Java, Python, TypeScript</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass p-4 rounded-lg">
                <p className="text-primary font-mono text-sm">interests:</p>
                <p className="text-foreground font-medium">AI Agents, Code Analysis</p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 font-mono">
              <span className="text-primary">$</span> skills --list
            </h3>
            
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {Object.entries(skills).map(([category, items]) => (
                <motion.div key={category} variants={itemVariants}>
                  <h4 className="text-lg font-semibold mb-3 text-primary font-mono">
                    ./{category.toLowerCase()}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, index) => (
                      <motion.span
                        key={skill}
                        className="px-3 py-1 glass border border-border rounded-md text-sm font-mono
                                 hover:border-primary hover:text-primary transition-all cursor-default"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;