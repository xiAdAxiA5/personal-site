import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send } from 'lucide-react';

const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };

export default function Contact() {
  return (
    <section className="pt-[76px] pb-[76px] px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold mb-[95px]"
        >
          联系我
        </motion.h2>
        <p className="text-gray-400 dark:text-gray-500 mb-[95px]">欢迎交流与合作</p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="grid md:grid-cols-3 gap-6 mb-[95px]"
        >
          {[
            { icon: Mail, label: '邮箱', value: 'hello@example.com', href: 'mailto:hello@example.com' },
            { icon: MessageCircle, label: '微信', value: 'your_wechat_id', href: '#' },
            { icon: Send, label: 'Telegram', value: '@yourname', href: 'https://t.me/yourname' },
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: i * 0.1 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-border-dark hover:border-primary/30 transition-colors duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <item.icon size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-sm text-gray-400">{item.label}</div>
                <div className="font-medium dark:text-white mt-0.5">{item.value}</div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
