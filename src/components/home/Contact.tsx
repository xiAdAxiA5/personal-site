import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Copy, Check } from 'lucide-react';

function WechatIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor" />
      <path d="M15.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor" />
      <path d="M21 13.5c0 3.038-2.462 5.5-5.5 5.5-.276 0-.544-.02-.806-.06A5.995 5.995 0 0 1 4.5 16c0-.548.074-1.08.212-1.588A4.502 4.502 0 0 1 8.5 5.5C12.09 5.5 15 8.41 15 12c0 .118-.004.235-.01.352A5.49 5.49 0 0 1 21 13.5Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M5.5 14.5c-1.933 0-3.5-1.567-3.5-3.5S3.567 7.5 5.5 7.5c.237 0 .467.024.69.07A3.997 3.997 0 0 1 12.5 6a3.997 3.997 0 0 1 3.955 3.662A2.998 2.998 0 0 1 18.5 11.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

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
    <section className="pt-[76px] pb-32 px-4 bg-gray-100/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
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
          className="flex justify-center gap-5 mb-[95px]"
        >
          <MiniContact icon={Mail} label="邮箱" displayValue="xiadaxia5@outlook.com" copied={copied} onCopy={copyText} />
          <MiniContact icon={WechatIcon} label="微信" displayValue="curemywanderlust" copied={copied} onCopy={copyText} />
          <MiniContact icon={Send} label="Telegram" displayValue="@xiAdAxiA5" copied={copied} onCopy={copyText} />
        </motion.div>

        <p className="text-center text-xs text-gray-300 dark:text-gray-600 mt-16">
          © {new Date().getFullYear()} 侠大虾 KieranXia
        </p>
      </div>
    </section>
  );
}

function MiniContact({
  icon: Icon,
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
      onMouseLeave={() => setHovered(false)}
      onClick={() => onCopy(displayValue)}
      className="relative w-12 h-12 rounded-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-primary/30 hover:text-primary transition-colors cursor-pointer"
    >
      <Icon size={20} className="text-gray-400 hover:text-primary transition-colors" />
      {copied === displayValue && (
        <Check size={14} className="absolute -top-1 -right-1 text-green-500 bg-white dark:bg-gray-800 rounded-full p-0.5" />
      )}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-xs rounded-lg px-3 py-1.5 shadow-lg shadow-primary/20 whitespace-nowrap flex items-center gap-1.5"
          >
            <span>{displayValue}</span>
            <Copy size={11} className="opacity-60" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
