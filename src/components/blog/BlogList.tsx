import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../data/blog';

const accents = [
  'border-l-amber-400/60',
  'border-l-indigo-400/60',
  'border-l-emerald-400/60',
  'border-l-rose-400/60',
  'border-l-sky-400/60',
];

export default function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-14">
        <h1 className="text-3xl font-bold dark:text-white mb-2">博客</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">其实是各种胡思乱想</p>
      </div>

      <input
        type="text"
        placeholder="搜索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2.5 mb-12 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm dark:text-white placeholder:text-gray-400 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-colors"
      />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 text-sm text-gray-300 dark:text-gray-600">
          还没有文章，敬请期待
        </div>
      ) : (
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
              >
                <Link to={`/blog/${post.slug}`} className="block group">
                  <div className={`border-l-2 ${post.content ? 'border-solid' : 'border-dashed'} ${accents[i % accents.length]} pl-5 py-4 hover:pl-6 hover:border-l-[3px] transition-all duration-300 rounded-r-lg hover:bg-gray-50/50 dark:hover:bg-white/[0.02]`}>
                    <h2 className="text-[15px] leading-relaxed dark:text-white/90 group-hover:text-primary transition-colors duration-300">
                      {post.title || post.excerpt}
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 tabular-nums">{post.date}</p>
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
