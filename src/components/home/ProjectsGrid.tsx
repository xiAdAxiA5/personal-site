import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import { ExternalLink, GitFork } from 'lucide-react';
import HoverPreview from '../ui/HoverPreview';

const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };

export default function ProjectsGrid() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          项目作品
        </motion.h2>
        <p className="text-center text-gray-400 dark:text-gray-500 mb-12">我参与和构建的一些项目</p>

        {projects.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">暂无项目</p>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: i * 0.08 }}
            >
              <HoverPreview
                preview={
                  <div className="p-4">
                    <img src={project.image} alt={project.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">{project.longDescription}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                }
              >
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                    {project.featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-white">
                        精选
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold dark:text-white mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <GitFork size={18} />
                        </motion.a>
                        <motion.a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <ExternalLink size={18} />
                        </motion.a>
                      </div>
                    </div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="mt-3 inline-block text-sm text-primary hover:text-primary-dark transition-colors"
                    >
                      查看详情 →
                    </Link>
                  </div>
                </motion.div>
              </HoverPreview>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
