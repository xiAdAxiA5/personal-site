import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { books } from '../../data/books';
import { X } from 'lucide-react';

const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };
const springBouncy = { type: 'spring' as const, stiffness: 200, damping: 26, mass: 1 };

export default function BookShelf() {
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

  const literature = books.filter((b) => b.category === 'literature');
  const webnovels = books.filter((b) => b.category === 'webnovel');
  const selectedBook = books.find((b) => b.id === selected);

  return (
    <section className="pt-[76px] pb-[76px] px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-[95px]"
        >
          Books
        </motion.h2>

        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <BookScrollBox
              items={literature}
              hovered={hovered}
              onEnter={onEnter}
              onLeave={onLeave}
              onClick={setSelected}
            />
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
          </div>

          <div className="flex-1 min-w-0">
            <BookScrollBox
              items={webnovels}
              hovered={hovered}
              onEnter={onEnter}
              onLeave={onLeave}
              onClick={setSelected}
            />
          </div>
        </div>

        <AnimatePresence>
          {selectedBook && (
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
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    className="w-16 h-22 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold dark:text-white">{selectedBook.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedBook.author}</p>
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
                    读书笔记
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedBook.notes}
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

function BookScrollBox({
  items,
  hovered,
  onEnter,
  onLeave,
  onClick,
}: {
  items: (typeof books)[number][];
  hovered: string | null;
  onEnter: (id: string) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}) {
  return (
    <div className="overflow-y-auto max-h-[620px] scrollbar-hide rounded-xl">
      {items.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-xs text-gray-300 dark:text-gray-600 italic">coming soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pr-1">
          {items.map((book, i) => (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springGentle, delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onClick(book.id)}
              onMouseEnter={() => onEnter(book.id)}
              onMouseLeave={onLeave}
              className="group relative bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 text-left">
                <h3 className="text-sm font-semibold dark:text-white truncate">{book.title}</h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">{book.author}</p>
              </div>

              <AnimatePresence>
                {hovered === book.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={springBouncy}
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 z-50 pointer-events-none"
                  >
                    <div className="bg-surface-light dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden w-64 text-left">
                      <div className="flex items-start gap-4 p-4">
                        <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg shadow-md shrink-0" />
                        <div className="min-w-0 pt-0.5">
                          <h3 className="text-sm font-bold dark:text-white leading-snug">{book.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{book.author}</p>
                        </div>
                      </div>
                      {book.notes && (
                        <div className="px-4 pb-4">
                          <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{book.notes}</p>
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
      )}
    </div>
  );
}
