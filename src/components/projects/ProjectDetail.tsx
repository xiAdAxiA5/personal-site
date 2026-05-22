import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import { ArrowLeft, GitFork, ExternalLink } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold dark:text-white mb-4">项目未找到</h1>
        <Link to="/projects" className="text-primary hover:underline">← 返回项目列表</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <Link to="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8">
        <ArrowLeft size={18} /> 返回项目
      </Link>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-64 object-cover" />

        <div className="p-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h1 className="text-3xl font-bold dark:text-white">{project.title}</h1>
            <div className="flex items-center gap-3">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-sm hover:bg-gray-800 transition-colors">
                <GitFork size={16} /> 源码
              </a>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary-dark transition-colors">
                <ExternalLink size={16} /> 演示
              </a>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">{project.longDescription}</p>

          <h2 className="text-lg font-semibold dark:text-white mb-3">技术栈</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
