import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { blogPosts } from '../../data/blog';
import { ArrowLeft, Calendar } from 'lucide-react';

const MotionLink = motion.create(Link);

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold dark:text-white mb-4">文章未找到</h1>
        <MotionLink to="/blog" whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
          bg-primary text-white shadow-md shadow-primary/25
          hover:shadow-lg hover:brightness-110 transition-all duration-300">
          <ArrowLeft size={16} />返回博客</MotionLink>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <MotionLink
        to="/blog"
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
          text-sm font-semibold
          bg-primary text-white
          shadow-md shadow-primary/25
          hover:shadow-lg hover:shadow-primary/30 hover:brightness-110
          transition-all duration-300 mb-8"
      >
        <ArrowLeft size={16} />
        返回博客
      </MotionLink>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-10">
        <span className="flex items-center gap-1"><Calendar size={14} />{post.date}</span>
      </div>

      {post.content ? (
        <div className="prose prose-gray dark:prose-invert max-w-none bg-surface-light dark:bg-surface-dark rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-border-dark">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-300 dark:text-gray-600 italic">暂无正文</div>
      )}
    </motion.article>
  );
}
