import { motion } from 'framer-motion';
import { socialPlatforms } from '../../data/social';
import { GitFork, Tv, Play, ExternalLink, Music2, Camera, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  github: GitFork,
  bilibili: Tv,
  youtube: Play,
  video: Play,
  twitter: ExternalLink,
  edit: ExternalLink,
  music: Music2,
  camera: Camera,
};

const springGentle = { type: 'spring' as const, stiffness: 300, damping: 35, mass: 1 };

export default function SocialMediaCards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          自媒体平台
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {socialPlatforms.map((platform, i) => {
            const Icon = iconMap[platform.icon] || ExternalLink;
            return (
              <motion.a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springGentle, delay: i * 0.06 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="group relative bg-surface-light dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-border-dark hover:border-primary/30 transition-colors duration-200 overflow-hidden cursor-pointer"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: `radial-gradient(300px circle at center, ${platform.color}15, transparent)` }} />

                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                       style={{ backgroundColor: `${platform.color}20` }}>
                    <span style={{ color: platform.color }}>
                      {platform.icon === 'twitter' ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      ) : (
                        <Icon size={24} />
                      )}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm dark:text-white">{platform.name}</h3>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
