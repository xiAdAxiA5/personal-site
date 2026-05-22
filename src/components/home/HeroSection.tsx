import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { useFollowerCount } from '../../hooks/useFollowerCount';
import { Code2 } from 'lucide-react';

export default function HeroSection() {
  const totalFollowers = useFollowerCount();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name}
                 className="w-32 h-32 rounded-full mx-auto border-4 border-primary/30 shadow-2xl" />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl">
              <Code2 size={48} className="text-white" />
            </div>
          )}
        </motion.div>

        {/* Name & Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4"
        >
          {profile.title}
        </motion.p>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg text-gray-400 dark:text-gray-500 max-w-2xl mx-auto mb-8"
        >
          {profile.tagline}
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {profile.tags.map((tag) => (
            <span key={tag}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              {tag}
            </span>
          ))}
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20">
            全网粉丝 {totalFollowers.toLocaleString()}+
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
