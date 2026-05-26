import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { watchList } from '../../data/operas';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const springBouncy = { type: 'spring' as const, stiffness: 200, damping: 26, mass: 1 };
const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };

const categories = [
  { key: 'movie', label: '电影' },
  { key: 'tv', label: '电视剧' },
  { key: 'anime', label: '动画' },
] as const;

export default function WatchSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string>('movie');

  const selectedItem = watchList.find((o) => o.id === selected);
  const activeItems = watchList.filter((o) => o.category === activeCat);

  return (
    <section className="pt-[76px] pb-[76px] px-4">
      <div className="max-w-6xl mx-auto">
        {/* Category nav as header */}
        <div className="flex items-center justify-center gap-4 mb-[95px]">
          <motion.button
            onClick={() => {
              const idx = categories.findIndex((c) => c.key === activeCat);
              setActiveCat(categories[idx > 0 ? idx - 1 : categories.length - 1].key);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
          >
            <ChevronLeft size={20} />
          </motion.button>

          <motion.h2
            key={activeCat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-center min-w-[120px]"
          >
            {categories.find((c) => c.key === activeCat)?.label}
          </motion.h2>

          <motion.button
            onClick={() => {
              const idx = categories.findIndex((c) => c.key === activeCat);
              setActiveCat(categories[(idx + 1) % categories.length].key);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Content - 2-col grid */}
        <div className="mt-[76px]">
        <AnimatePresence mode="wait">
            <motion.div
              key={activeCat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MediaGrid
                items={activeItems}
                onClick={setSelected}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedItem && (
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
                    src={selectedItem.cover}
                    alt={selectedItem.title}
                    className="w-16 h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold dark:text-white">{selectedItem.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedItem.creator}</p>
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
                    笔记
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedItem.notes}
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

function MediaGrid({
  items,
  onClick,
}: {
  items: (typeof watchList)[number][];
  onClick: (id: string) => void;
}) {
  return (
    <div className="overflow-y-auto max-h-[550px] scrollbar-hide rounded-xl">
      {items.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-xs text-gray-300 dark:text-gray-600 italic">coming soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2.5 pr-1">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: i * 0.05 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onClick(item.id)}
              className="group relative bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <div className="aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                {item.cover ? (
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                    <span className="text-[10px] px-1 text-center leading-tight">{item.title}</span>
                  </div>
                )}
              </div>
              <div className="p-1.5 text-left">
                <h3 className="text-[10px] font-semibold dark:text-white truncate leading-tight">{item.title}</h3>
                <p className="text-[9px] text-gray-400 truncate">{item.creator}</p>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

