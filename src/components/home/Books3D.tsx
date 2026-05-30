import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { books, type Book } from '../../data/books';
import { X, BookOpen, Clock } from 'lucide-react';

const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };
const springBouncy = { type: 'spring' as const, stiffness: 200, damping: 26, mass: 1 };
const springSnappy = { type: 'spring' as const, stiffness: 300, damping: 30, mass: 1 };

const statusLabels: Record<Book['status'], string> = {
  finished: '已读完', reading: '在读', paused: '暂停', 'want-to-read': '想读',
};

const statusStyles: Record<Book['status'], string> = {
  finished: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25',
  reading: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/25',
  paused: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/25',
  'want-to-read': 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/25',
};

const currentlyReading = books.filter((b) => b.status === 'reading');
const literature = books.filter((b) => b.category === 'literature');
const webnovels = books.filter((b) => b.category === 'webnovel');

export default function BookShelf() {
  const [selected, setSelected] = useState<Book | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto pt-4 pb-[36px]">
      {/* ===== Currently Reading ===== */}
      {currentlyReading.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-xs font-medium tracking-[0.12em] uppercase
              text-muted-light/60 dark:text-muted-dark/50">
              Currently Reading
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentlyReading.map((book, i) => (
              <ReadingCard key={book.id} book={book} index={i} onClick={() => setSelected(book)} />
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== Literature | Web Novels ===== */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-0">
        {/* Literature (top on mobile / left on desktop) */}
        <div className="flex-1 min-w-0 md:pr-4 lg:pr-6">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase mb-4
            text-muted-light/60 dark:text-muted-dark/50">
            Literature
          </p>
          <BookGrid items={literature} onClick={setSelected} />
        </div>

        {/* Divider — horizontal on mobile, vertical on desktop */}
        <div className="shrink-0 flex items-center justify-center md:flex-col">
          <div className="h-px w-full md:w-px md:h-full md:flex-1 bg-gradient-to-r md:bg-gradient-to-b from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
        </div>

        {/* Web Novels (bottom on mobile / right on desktop) */}
        <div className="flex-1 min-w-0 md:pl-4 lg:pl-6">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase mb-4
            text-muted-light/60 dark:text-muted-dark/50">
            Web Novels
          </p>
          <BookGrid items={webnovels} onClick={setSelected} />
        </div>
      </div>

      {/* ===== Detail Modal ===== */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4
              bg-black/30 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={springBouncy}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto
                rounded-2xl shadow-2xl
                bg-surface-light dark:bg-[#111318]
                border border-border-light dark:border-white/[0.06]"
            >
              <motion.button
                onClick={() => setSelected(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl
                  hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X size={16} className="text-gray-400 dark:text-white/50" />
              </motion.button>

              <div className="flex flex-col sm:flex-row gap-6 p-6 md:p-8">
                <div className="shrink-0 flex flex-col items-center sm:items-start">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springSnappy, delay: 0.05 }}
                    className="w-[130px] h-[185px] md:w-[150px] md:h-[215px]
                      rounded-xl overflow-hidden shadow-xl
                      ring-1 ring-black/5 dark:ring-white/10"
                  >
                    <img src={selected.cover} alt={selected.title}
                      className="w-full h-full object-cover" />
                  </motion.div>

                  <span className={`inline-block mt-3 px-2.5 py-0.5 rounded-full
                    text-[10px] font-medium border ${statusStyles[selected.status]}`}>
                    {statusLabels[selected.status]}
                  </span>

                  {selected.progress != null && selected.status === 'reading' && (
                    <div className="w-full mt-2">
                      <div className="flex justify-between text-[10px]
                        text-muted-light dark:text-white/30 mb-1">
                        <span>Progress</span><span>{selected.progress}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${selected.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springSnappy, delay: 0.08 }}
                  className="flex-1 min-w-0"
                >
                  <h3 className="text-xl md:text-2xl font-bold
                    text-text-light dark:text-white tracking-tight">
                    {selected.title}
                  </h3>
                  <p className="text-sm text-muted-light dark:text-white/40 mt-1">
                    {selected.author}
                  </p>

                  {selected.tags && selected.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md text-[10px]
                          bg-gray-100 text-gray-500 border border-gray-200
                          dark:bg-white/[0.03] dark:text-white/30 dark:border-white/[0.04]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {selected.notes ? (
                    <div className="mt-5">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider
                        mb-2 flex items-center gap-1.5
                        text-gray-400 dark:text-white/20">
                        <BookOpen size={12} /> Notes
                      </h4>
                      <p className="text-sm leading-relaxed
                        text-gray-600 dark:text-white/50">
                        {selected.notes}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-8 text-center py-8">
                      <Clock size={24}
                        className="text-gray-200 dark:text-white/10 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 dark:text-white/20 italic">
                        Reading in progress...
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== Reading Card ===== */
function ReadingCard({
  book,
  index,
  onClick,
}: {
  book: Book;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...springGentle, delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex items-center gap-4 p-4 rounded-xl cursor-pointer text-left
        bg-surface-light dark:bg-surface-dark
        border border-border-light dark:border-border-dark
        hover:shadow-md transition-all duration-300"
    >
      <div className="relative shrink-0">
        <div className="w-[65px] h-[92px] rounded-lg overflow-hidden shadow-sm
          ring-1 ring-black/5 dark:ring-white/5">
          <img src={book.cover} alt={book.title}
            className="w-full h-full object-cover
              group-hover:scale-105 transition-transform duration-400" />
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2
          bg-surface-light dark:bg-surface-dark rounded-full px-2 py-0.5
          border border-border-light dark:border-border-dark shadow-sm">
          <span className="text-[9px] font-semibold text-primary tabular-nums">
            {book.progress ?? 0}%
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-[10px] font-medium text-amber-600/70 dark:text-amber-400/60">
            在读
          </span>
        </div>
        <h3 className="text-sm font-bold tracking-tight truncate
          text-text-light dark:text-white/90
          group-hover:text-primary transition-colors duration-300">
          {book.title}
        </h3>
        <p className="text-[11px] text-muted-light dark:text-white/35 mt-0.5 truncate">
          {book.author}
        </p>
        <div className="mt-2 h-1 rounded-full bg-gray-200 dark:bg-white/[0.04] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${book.progress ?? 0}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>
    </motion.button>
  );
}

/* ===== Book Grid (vertical scroll, like movies) ===== */
function BookGrid({
  items,
  onClick,
}: {
  items: Book[];
  onClick: (book: Book) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-xs text-gray-300 dark:text-gray-600 italic">coming soon</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto scrollbar-hide max-h-[430px] md:max-h-[530px] rounded-xl pb-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
        {items.map((book, i) => (
          <motion.button
            key={book.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springGentle, delay: i * 0.04 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onClick(book)}
            className="group relative rounded-xl overflow-hidden cursor-pointer text-left
              bg-surface-light dark:bg-surface-dark
              border border-border-light dark:border-border-dark
              shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover
                  group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-1.5">
              <h3 className="text-[10px] font-semibold truncate leading-tight
                text-text-light dark:text-white/80">
                {book.title}
              </h3>
              <p className="text-[9px] text-muted-light dark:text-white/25 truncate mt-0.5">
                {book.author}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
