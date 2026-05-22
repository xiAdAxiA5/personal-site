import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { blogPosts } from '../../data/blog';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold dark:text-white mb-4">文章未找到</h1>
        <Link to="/blog" className="text-primary hover:underline">← 返回博客列表</Link>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8">
        <ArrowLeft size={18} /> 返回博客
      </Link>

      <header className="mb-10">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4 inline-block">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={14} />{post.date}</span>
          <span className="flex items-center gap-1"><Clock size={14} />{post.readTime}</span>
        </div>
      </header>

      <div className="prose prose-gray dark:prose-invert max-w-none bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-border-dark">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </motion.article>
  );
}
