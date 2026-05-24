import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, Send, Copy, Check } from 'lucide-react';

const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="grid md:grid-cols-3 gap-6 mb-[95px]"
        >
          <ContactCard
            icon={Mail}
            label="邮箱"
            displayValue="xiadaxia5@outlook.com"
            copied={copied}
            onCopy={copyText}
          />

          <ContactCard
            icon={MessageCircle}
            label="微信"
            displayValue="curemywanderlust"
            copied={copied}
            onCopy={copyText}
          />

          {/* Telegram - hover to reveal */}
          <ContactCard
            icon={Send}
            label="Telegram"
            displayValue="@xiAdAxiA5"
            copied={copied}
            onCopy={copyText}
          />
        </motion.div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  displayValue,
  copied,
  onCopy,
}: {
  icon: typeof Mail;
  label: string;
  displayValue: string;
  copied: string | null;
  onCopy: (text: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
      onClick={() => onCopy(displayValue)}
      className="relative flex flex-col items-center gap-3 p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-border-dark hover:border-primary/30 transition-colors duration-300 cursor-pointer"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Icon size={24} className="text-primary" />
      </div>
      <div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
      {copied === displayValue && (
        <Check size={16} className="absolute top-4 right-4 text-green-500" />
      )}

      {/* Hover popover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 bg-primary text-white text-sm rounded-lg px-4 py-2 shadow-lg shadow-primary/20 whitespace-nowrap flex items-center gap-2"
          >
            <span>{displayValue}</span>
            <Copy size={13} className="opacity-60" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
