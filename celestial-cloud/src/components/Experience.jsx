import { motion } from 'framer-motion';

const experiences = [
  {
    id: 1,
    title: '[Your Current Position]',
    company: '[Current Company Name]',
    location: 'Olten, Switzerland',
    period: '[Start Year] - Present',
    description: '[Describe your current role, responsibilities, and the impact you are making. Focus on enterprise Java development, AI integration, and any leadership responsibilities.]',
    achievements: [
      '[Key achievement 1 - quantify impact where possible]',
      '[Key achievement 2 - highlight technical accomplishments]',
      '[Key achievement 3 - mention team or business impact]',
    ],
    tech: ['Java', 'Spring Boot', 'Spring Cloud', 'Microservices', 'Azure', 'Docker', 'Kubernetes'],
  },
  {
    id: 2,
    title: '[Previous Position Title]',
    company: '[Previous Company Name]',
    location: '[Location]',
    period: '[Start Year] - [End Year]',
    description: '[Describe your role, focusing on enterprise development, system architecture, and any AI/ML integration work you did.]',
    achievements: [
      '[Major project delivered or system improved]',
      '[Technical innovation or process improvement]',
      '[Team collaboration or mentorship impact]',
    ],
    tech: ['Java', 'Spring Framework', 'Python', 'REST APIs', 'SQL', 'Git', 'CI/CD'],
  },
  {
    id: 3,
    title: '[Earlier Position Title]',
    company: '[Earlier Company Name]',
    location: '[Location]',
    period: '[Start Year] - [End Year]',
    description: '[Describe early career role, focusing on foundational skills and growth into enterprise development.]',
    achievements: [
      '[Technical skill development or certification]',
      '[Key project contribution]',
      '[Process improvement or innovation]',
    ],
    tech: ['Java', 'JavaScript', 'HTML/CSS', 'SQL', 'Version Control'],
  },
  // Add more experiences as needed
  // {
  //   id: 4,
  //   title: '[Position Title]',
  //   company: '[Company Name]',
  //   location: '[Location]',
  //   period: '[Start Year] - [End Year]',
  //   description: '[Role description]',
  //   achievements: [
  //     '[Achievement 1]',
  //     '[Achievement 2]',
  //   ],
  //   tech: ['[Tech 1]', '[Tech 2]', '[Tech 3]'],
  // },
];

const Experience = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="experience" className="py-20 min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">&lt;</span>
            Experience
            <span className="text-primary"> /&gt;</span>
          </h2>
          <div className="w-20 h-1 bg-primary mb-12"></div>
        </motion.div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Timeline line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border"></div>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              variants={itemVariants}
              className="relative flex items-start mb-12 last:mb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-4 w-8 h-8 bg-primary rounded-full border-4 border-background flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-background rounded-full"></div>
              </div>

              {/* Content */}
              <div className="ml-12 md:ml-20 w-full">
                <motion.div
                  className="glass rounded-lg p-6 border border-border hover:border-primary transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-lg font-medium text-foreground">
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-sm text-muted mb-2">
                          <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {exp.location}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-mono text-muted px-3 py-1 glass rounded-full">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-muted mb-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-primary mb-2 font-mono">
                      key_achievements:
                    </h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm text-muted flex items-start">
                          <span className="text-primary mr-2 font-mono">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack */}
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-2 font-mono">
                      technologies:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;