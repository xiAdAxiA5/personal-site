import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { Code2 } from 'lucide-react';

export default function HeroSection() {

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
          {profile.name} {profile.nameEn}
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
        </motion.div>

      </div>
    </section>
  );
}
