import { motion } from 'framer-motion';

const About = () => {
  const skills = {
    'Backend': ['Java', 'Spring Boot', 'Spring Cloud', 'Python', 'Node.js', 'Microservices', 'PostgreSQL'],
    'Frontend': ['TypeScript', 'JavaScript', 'React', 'Angular', 'Astro', 'HTML5', 'CSS3'],
    'AI/ML': ['OpenAI API', 'LangGraph', 'AI Agents', 'Azure OpenAI', 'Machine Learning'],
    'Cloud & DevOps': ['Docker', 'Azure', 'Kubernetes', 'Containerization', 'CI/CD', 'Git'],
    'Mobile': ['Flutter', 'Dart', 'Mobile Development', 'Cross-platform'],
    'Architecture & Tools': ['System Design', 'DDD', 'Architecture Patterns', 'VS Code', 'IntelliJ', 'Mermaid', 'AST Analysis', 'Code Generation'],
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
              <p className="text-xl text-primary/80 font-medium italic mb-8 border-l-2 border-primary pl-4">
                "Code is craft. Architecture is art. Mentoring is legacy."
              </p>
              <p className="text-lg text-muted mb-6">
                With over three decades in software engineering and nine years as a solutions
                architect, I've witnessed - and shaped - the evolution of enterprise technology
                from monolithic systems to cloud-native microservices, and now into the era of
                AI-augmented development. My career spans Banking, Manufacturing, and SaaS
                domains, giving me a broad perspective on how technology transforms industries.
              </p>
              <p className="text-lg text-muted mb-6">
                Today, I focus on bridging the gap between enterprise reliability and AI innovation.
                I lead architecture transformations, build AI-powered developer tools - from
                diagram generators to code analyzers - and champion the adoption of modern
                practices like Domain-Driven Design, event-driven systems, and cloud-native
                infrastructure. My open-source contributions reflect my belief that great tools
                should be accessible to everyone.
              </p>
              <p className="text-lg text-muted">
                Beyond building systems, I'm deeply invested in building people. Mentoring
                engineers, empowering teams, and cultivating a culture of continuous learning
                is as integral to my work as writing code. I believe the best architectures are
                invisible - they simply enable people to do their best work.
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
                <p className="text-primary font-mono text-sm">experience:</p>
                <p className="text-foreground font-medium">30+ Years in Engineering</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass p-4 rounded-lg">
                <p className="text-primary font-mono text-sm">architecture:</p>
                <p className="text-foreground font-medium">9+ Years as Architect</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass p-4 rounded-lg">
                <p className="text-primary font-mono text-sm">domains:</p>
                <p className="text-foreground font-medium">Banking, Manufacturing, SaaS</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass p-4 rounded-lg">
                <p className="text-primary font-mono text-sm">mission:</p>
                <p className="text-foreground font-medium">AI Enablement & Dev Tooling</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass p-4 rounded-lg col-span-2">
                <p className="text-primary font-mono text-sm">passion:</p>
                <p className="text-foreground font-medium">Engineering Mentor & Team Builder</p>
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