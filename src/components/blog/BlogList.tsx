import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blog';
import { Calendar } from 'lucide-react';

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">博客</h1>
      <p className="text-gray-400 dark:text-gray-500 mb-8">其实是各种胡思乱想</p>

      <input
        type="text"
        placeholder="搜索文章..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-3 mb-8 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
      />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          还没有文章，敬请期待
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="h-full"
              >
                <Link to={`/blog/${post.slug}`} className="h-full block">
                  <div className="h-full flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <h2 className="text-lg font-bold dark:text-white mb-2 line-clamp-2">{post.title || post.excerpt}</h2>
                    {post.title && post.content && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>}
                    <div className="mt-auto pt-4">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
