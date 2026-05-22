import { motion } from 'framer-motion';
import { socialPlatforms } from '../../data/social';
import { GitFork, Tv, Play, ExternalLink, MessageSquare, Pencil, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  github: GitFork,
  bilibili: Tv,
  youtube: Play,
  video: Play,
  twitter: MessageSquare,
  edit: Pencil,
};

export default function SocialMediaCards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          自媒体平台
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group relative bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-border-dark hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background: `radial-gradient(300px circle at center, ${platform.color}15, transparent)` }} />

                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                       style={{ backgroundColor: `${platform.color}20` }}>
                    <span style={{ color: platform.color }}>
                      <Icon size={24} />
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 dark:text-white">{platform.name}</h3>
                  <p className="text-xs text-gray-400">{platform.followerCount.toLocaleString()} 粉丝</p>
                </div>

                {/* Preview thumbnails on hover */}
                {platform.videoThumbnails.length > 0 && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 p-3 overflow-hidden">
                    <p className="text-xs font-medium text-center text-gray-500 dark:text-gray-400">精选视频</p>
                    {platform.videoThumbnails.slice(0, 3).map((thumb, j) => (
                      <img key={j} src={thumb} alt="" className="w-full h-12 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
