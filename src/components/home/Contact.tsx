import { motion } from 'framer-motion';
import { Mail, MessageCircle, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          联系我
        </motion.h2>
        <p className="text-gray-400 dark:text-gray-500 mb-12">欢迎交流与合作</p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-12"
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
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-border-dark hover:border-primary/30 transition-all duration-300"
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
