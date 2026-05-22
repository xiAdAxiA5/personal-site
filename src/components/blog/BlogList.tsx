import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts, categories, allTags } from '../../data/blog';
import { Calendar, Clock, Tag } from 'lucide-react';

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (selectedTags.length > 0 && !selectedTags.some((t) => post.tags.includes(t))) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">博客</h1>
      <p className="text-gray-400 dark:text-gray-500 mb-8">技术思考与实践记录</p>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-border-dark focus:border-primary outline-none transition-all dark:text-white"
        >
          <option value="">全部分类</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedTags.includes(tag)
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {tag}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <button
            onClick={() => setSelectedTags([])}
            className="px-3 py-1.5 rounded-full text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* Posts Grid */}
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
            >
              <Link to={`/blog/${post.slug}`}>
                <div className="h-full bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3 inline-block">
                    {post.category}
                  </span>
                  <h2 className="text-lg font-bold dark:text-white mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={12} />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{post.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((t) => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                        <Tag size={10} />{t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          没有找到匹配的文章
        </div>
      )}
    </div>
  );
}
