import { motion } from 'framer-motion';
import { experiences } from '../../data/experience';
import { Briefcase, GraduationCap } from 'lucide-react';

const springGentle = { type: 'spring' as const, stiffness: 300, damping: 35, mass: 1 };

export default function ExperienceTimeline() {
  return (
    <section className="py-20 px-4 bg-gray-50/50 dark:bg-gray-900/30 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          求学与工作经历
        </motion.h2>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 md:-translate-x-px" />

          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: i * 0.08 }}
              className={`relative flex items-start mb-12 md:mb-16 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Icon */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                  exp.type === 'work' ? 'bg-primary' : 'bg-accent'
                }`}>
                  {exp.type === 'work' ? <Briefcase size={18} className="text-white" /> : <GraduationCap size={18} className="text-white" />}
                </div>
              </div>

              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-gray-100 dark:border-border-dark shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {exp.startDate} — {exp.endDate}
                  </span>
                  <h3 className="text-lg font-bold mt-1 dark:text-white">{exp.organization}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {exp.title}{exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{exp.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.highlights.map((h, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {h}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
