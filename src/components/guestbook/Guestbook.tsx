import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageCircle } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  content: string;
  date: string;
}

const sampleMessages: Message[] = [
  { id: 1, name: '访客小明', content: '很棒的网站！设计和交互都很喜欢。', date: '2025-06-15' },
  { id: 2, name: '开发者小红', content: '关注你的博客很久了，学到了很多。', date: '2025-06-10' },
  { id: 3, name: '设计师小李', content: 'UI 设计很有品味，简约但不简单。', date: '2025-05-28' },
];

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      name: name.trim(),
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
    };
    setMessages([newMessage, ...messages]);
    setName('');
    setContent('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">留言板</h1>
        <p className="text-gray-400 dark:text-gray-500 mb-12">留下你的足迹，分享你的想法</p>

        {/* Form */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 mb-8">
          <h2 className="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
            <MessageCircle size={20} className="text-primary" /> 写留言
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">昵称</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的昵称"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">留言内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="想说点什么..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={16} /> 发布留言
            </button>
          </form>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={14} className="text-primary" />
                    </div>
                    <span className="font-medium text-sm dark:text-white">{msg.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{msg.date}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{msg.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
