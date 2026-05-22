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
        <p className="text-gray-400 dark:text-gray-500 mb-12">了解更多关于我的故事</p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 text-center sticky top-24">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Code2 size={48} className="text-white" />
                </div>
              )}
              <h2 className="text-2xl font-bold dark:text-white">{profile.name}</h2>
              <p className="text-primary font-medium">{profile.title}</p>
              <p className="text-sm text-gray-400 mt-2">{profile.tagline}</p>

              <div className="mt-6 space-y-3 text-left text-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MapPin size={14} /> 上海，中国
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Briefcase size={14} /> 全栈开发者
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Heart size={14} /> 开源 · 摄影 · 旅行
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-8">
              <h2 className="text-xl font-bold dark:text-white mb-4">个人简介</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                我热衷于构建优秀的软件产品，关注用户体验和代码质量。
                在工作之余，我喜欢参与开源项目、撰写技术博客、以及探索新的技术趋势。
                我相信技术的力量可以让世界变得更美好，也一直在朝着这个方向努力。
              </p>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-8">
              <h2 className="text-xl font-bold dark:text-white mb-4">工作理念</h2>
              <div className="grid gap-4">
                {[
                  { title: '代码即文档', desc: '好的代码应该是自解释的，减少对注释的依赖。' },
                  { title: '持续学习', desc: '技术日新月异，保持好奇心和学习热情是工程师的核心竞争力。' },
                  { title: '用户至上', desc: '一切技术决策都应服务于最终用户的体验。' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <h3 className="font-semibold dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
