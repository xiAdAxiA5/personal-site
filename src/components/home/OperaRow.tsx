import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { operas } from '../../data/operas';
import { X } from 'lucide-react';

const springBouncy = { type: 'spring' as const, stiffness: 350, damping: 30, mass: 1 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 35, mass: 1 };

const categories = [
  { key: 'opera' },
  { key: 'musical' },
  { key: 'ballet' },
] as const;

export default function OperaRow() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const enterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = (id: string) => {
    if (leaveRef.current !== null) clearTimeout(leaveRef.current);
    enterRef.current = setTimeout(() => setHovered(id), 200);
  };
  const onLeave = () => {
    if (enterRef.current !== null) clearTimeout(enterRef.current);
    leaveRef.current = setTimeout(() => setHovered(null), 80);
  };

  const selectedOpera = operas.find((o) => o.id === selected);

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
          Opera
        </motion.h2>

        <div className="space-y-8">
          {categories.map((cat) => {
            const items = operas.filter((o) => o.category === cat.key);
            return (
              <div key={cat.key}>
                <ScrollRow
                  items={items}
                  hovered={hovered}
                  onEnter={onEnter}
                  onLeave={onLeave}
                  onClick={setSelected}
                />
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedOpera && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 20 }}
                transition={springBouncy}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-light dark:bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
              >
                <div className="flex items-center gap-4 p-5 border-b border-gray-100 dark:border-gray-700">
                  <img
                    src={selectedOpera.cover}
                    alt={selectedOpera.title}
                    className="w-16 h-22 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold dark:text-white">{selectedOpera.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOpera.composer}</p>
                  </div>
                  <motion.button
                    onClick={() => setSelected(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
                  >
                    <X size={18} className="text-gray-400" />
                  </motion.button>
                </div>
                <div className="p-5">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    观剧笔记
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedOpera.notes}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ScrollRow({
  items,
  hovered,
  onEnter,
  onLeave,
  onClick,
}: {
  items: (typeof operas)[number][];
  hovered: string | null;
  onEnter: (id: string) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      ref={scrollRef}
      onWheel={handleWheel}
      className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {items.length === 0 && (
        <div className="w-full flex items-center justify-center min-h-[160px]">
          <p className="text-xs text-gray-300 dark:text-gray-600 italic">coming soon</p>
        </div>
      )}
      {items.map((opera, i) => (
        <motion.button
          key={opera.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...springGentle, delay: i * 0.05 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onClick(opera.id)}
          onMouseEnter={() => onEnter(opera.id)}
          onMouseLeave={onLeave}
          className="group relative shrink-0 w-36 bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="aspect-[2/3] overflow-hidden">
            <img
              src={opera.cover}
              alt={opera.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-3 text-left">
            <h3 className="text-sm font-semibold dark:text-white truncate">{opera.title}</h3>
            <p className="text-xs text-gray-400 truncate mt-0.5">{opera.composer}</p>
          </div>

          <AnimatePresence>
            {hovered === opera.id && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={springBouncy}
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 pointer-events-none"
              >
                <div className="bg-surface-light dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden w-64 text-left">
                  <div className="flex items-start gap-4 p-4">
                    <img src={opera.cover} alt={opera.title} className="w-14 h-20 object-cover rounded-lg shadow-md shrink-0" />
                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-sm font-bold dark:text-white leading-snug">{opera.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{opera.composer}</p>
                    </div>
                  </div>
                  {opera.notes && (
                    <div className="px-4 pb-4">
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{opera.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  );
}
