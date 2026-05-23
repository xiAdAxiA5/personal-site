import { motion } from 'framer-motion';
import { skills } from '../../data/skills';

const categories = [
  { key: 'frontend', label: '前端' },
  { key: 'backend', label: '后端' },
  { key: 'devops', label: 'DevOps' },
  { key: 'tools', label: '工具' },
] as const;

const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };

export default function TechStack() {
  return (
    <section className="py-20 px-4 bg-gray-50/50 dark:bg-gray-900/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          技术栈
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, ci) => {
            const catSkills = skills.filter((s) => s.category === cat.key);
            if (catSkills.length === 0) return null;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springGentle, delay: ci * 0.08 }}
                whileHover={{ y: -2 }}
                className="bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-border-dark"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">{cat.label}</h3>
                <div className="space-y-4">
                  {catSkills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium dark:text-white">{skill.name}</span>
                        <span className="text-xs text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ ...springGentle, delay: 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
