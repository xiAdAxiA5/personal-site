import { useState } from 'react';
import { type ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Copy, Check, Headphones } from 'lucide-react';

function WechatIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.69 3.46C4.84 3.46 1.72 6.2 1.72 9.58c0 1.87 1.02 3.55 2.6 4.66l-.67 2.02 2.35-1.16c.8.22 1.65.34 2.53.34.34 0 .66-.02.98-.06-.12-.4-.2-.82-.2-1.24 0-3.4 3.2-6.16 7.14-6.16.3 0 .6.02.9.05A5.8 5.8 0 0 0 8.69 3.46zm-3.02 3.6c.4 0 .72.32.72.72a.72.72 0 1 1-1.44 0c0-.4.32-.72.72-.72zm4.5 0c.4 0 .72.32.72.72a.72.72 0 1 1-1.44 0c0-.4.32-.72.72-.72z" />
      <path d="M16.86 9.88c-3.37 0-6.1 2.34-6.1 5.22s2.73 5.22 6.1 5.22c.67 0 1.32-.1 1.94-.3l1.88.93-.53-1.62A4.6 4.6 0 0 0 22 15.1c0-2.88-2.73-5.22-6.1-5.22zm-2.95 2.9c.32 0 .58.26.58.58a.58.58 0 1 1-1.16 0c0-.32.26-.58.58-.58zm4.5 0c.32 0 .57.26.57.58a.58.58 0 1 1-1.15 0c0-.32.25-.58.58-.58z" />
    </svg>
  );
}

function DiscordIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 19" fill="currentColor" className={className}>
      <path d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82" />
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
          className="flex flex-wrap justify-center gap-5 mb-[95px]"
        >
          <MiniContact icon={Mail} label="邮箱" displayValue="xiadaxia5@outlook.com" copied={copied} onCopy={copyText} />
          <MiniContact icon={WechatIcon} label="微信" displayValue="curemywanderlust" copied={copied} onCopy={copyText} />
          <MiniContact icon={Send} label="Telegram" displayValue="@xiAdAxiA5" copied={copied} onCopy={copyText} />
          <MiniContact icon={DiscordIcon} label="Discord" displayValue="xiadaxia5" copied={copied} onCopy={copyText} />
          <MiniContact icon={Headphones} label="OOPZ" displayValue="388508971" copied={copied} onCopy={copyText} />
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
  label,
  displayValue,
  copied,
  onCopy,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  displayValue: string;
  copied: string | null;
  onCopy: (text: string) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <button
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => {
        setShowTooltip((prev) => !prev);
        onCopy(displayValue);
      }}
      className="relative w-12 h-12 rounded-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-primary/30 hover:text-primary transition-colors cursor-pointer"
    >
      <Icon size={20} className="text-gray-400 hover:text-primary transition-colors" />
      {copied === displayValue && (
        <Check size={14} className="absolute -top-1 -right-1 text-green-500 bg-white dark:bg-gray-800 rounded-full p-0.5" />
      )}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-xs rounded-lg px-3 py-1.5 shadow-lg shadow-primary/20 whitespace-nowrap flex items-center gap-1.5"
          >
            <span className="opacity-60">{label}</span>
            <span>{displayValue}</span>
            <Copy size={11} className="opacity-60" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
