import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  preview: React.ReactNode;
}

export default function HoverPreview({ children, preview }: Props) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchedRef = useRef(false);

  const clearTimers = () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
  };

  const onEnter = () => {
    if (touchedRef.current) return;
    clearTimers();
    timeoutRef.current = setTimeout(() => setShow(true), 300);
  };
  const onLeave = () => {
    if (touchedRef.current) return;
    clearTimers();
    timeoutRef.current = setTimeout(() => setShow(false), 150);
  };

  const onClick = useCallback(() => {
    clearTimers();
    touchedRef.current = true;
    setShow((prev) => !prev);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 pointer-events-none max-w-[280px] min-w-[200px]"
          >
            <div className="bg-surface-light dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              {preview}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
