import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { Code2, Heart, MapPin, Briefcase } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">关于我</h1>
        <p className="text-gray-400 dark:text-gray-500 mb-12">了解更多关于我的故事（计划把我的所有人生经历、情绪、感悟等事无巨细地放上来）</p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 text-center sticky top-24">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Code2 size={48} className="text-white" />
                </div>
              )}
              <h2 className="text-2xl font-bold dark:text-white">{profile.name}</h2>
              <p className="text-sm text-gray-400 mb-1">{profile.nameEn}</p>

              <div className="mt-6 space-y-3 text-left text-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MapPin size={14} /> 河北，中国
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Briefcase size={14} /> 医学学士
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Heart size={14} /> 阅读 · 对话 · 思考
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
          </div>
        </div>
      </motion.div>
    </div>
  );
}
