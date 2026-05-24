import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { books, type Book } from '../../data/books';
import { X, BookOpen, Quote, Sparkles, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

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

const statusDot: Record<Book['status'], string> = {
  finished: 'bg-emerald-400 border-emerald-400/50',
  reading: 'bg-amber-400 border-amber-400/50 animate-pulse',
  paused: 'bg-slate-400 border-slate-400/50',
  'want-to-read': 'bg-violet-400 border-violet-400/50',
};

const currentlyReading = books.filter((b) => b.status === 'reading');
const literature = books.filter((b) => b.category === 'literature');
const webnovels = books.filter((b) => b.category === 'webnovel');

export default function BookShelf() {
  const [selected, setSelected] = useState<Book | null>(null);

  return (
    <section
      className="relative pt-[76px] pb-[76px] px-4 overflow-hidden
        bg-bg-light dark:bg-bg-dark transition-colors duration-500"
    >
      {/* Ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full
        bg-primary/[0.03] dark:bg-indigo-500/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-[350px] h-[350px] rounded-full
        bg-accent/[0.03] dark:bg-cyan-500/[0.03] blur-[100px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.012] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 0.5px, transparent 0.5px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-medium tracking-[0.3em] uppercase
            text-primary/50 dark:text-primary/40 mb-3">
            Reading Archive
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight
            text-text-light dark:text-text-dark">
            Books
          </h2>
        </motion.div>

        {/* ===== Currently Reading ===== */}
        {currentlyReading.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springGentle, delay: 0.05 }}
            className="mb-16"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-xs font-medium tracking-[0.15em] uppercase
                text-muted-light/60 dark:text-muted-dark/50">
                Currently Reading
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentlyReading.map((book, i) => (
                <ReadingCard key={book.id} book={book} index={i} onClick={() => setSelected(book)} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ===== Scrollable Shelves ===== */}
        <ScrollableShelf
          label="Literature"
          items={literature}
          onClick={setSelected}
        />

        <div className="my-10" />

        <ScrollableShelf
          label="Web Novels"
          items={webnovels}
          onClick={setSelected}
        />
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

                  {selected.quote && (
                    <div className="mt-6 p-4 rounded-xl
                      bg-amber-50 border border-amber-100
                      dark:bg-amber-500/[0.03] dark:border-amber-500/[0.06]">
                      <Quote size={14}
                        className="text-amber-500/60 dark:text-amber-400/40 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-white/60
                        italic leading-relaxed">
                        "{selected.quote}"
                      </p>
                    </div>
                  )}

                  {selected.reflection && (
                    <div className="mt-5">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider
                        mb-2 flex items-center gap-1.5
                        text-gray-400 dark:text-white/20">
                        <BookOpen size={12} /> Reflection
                      </h4>
                      <p className="text-sm leading-relaxed
                        text-gray-600 dark:text-white/50">
                        {selected.reflection}
                      </p>
                    </div>
                  )}

                  {selected.notes && (
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
                  )}

                  {!selected.notes && !selected.reflection && !selected.quote && (
                    <div className="mt-8 text-center py-8">
                      <Clock size={24}
                        className="text-gray-200 dark:text-white/10 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 dark:text-white/20 italic">
                        Reading in progress...
                      </p>
                      <p className="text-xs text-gray-300 dark:text-white/10 mt-1">
                        Notes and reflections will appear here.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ===== Currently Reading Card ===== */
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...springGentle, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex items-center gap-5 p-5 rounded-2xl cursor-pointer text-left
        bg-surface-light dark:bg-surface-dark
        border border-border-light dark:border-border-dark
        hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(99,102,241,0.06)]
        transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative shrink-0">
        <div className="w-[85px] h-[120px] md:w-[95px] md:h-[135px]
          rounded-xl overflow-hidden shadow-md
          ring-1 ring-black/5 dark:ring-white/5
          group-hover:shadow-xl transition-shadow duration-300">
          <img src={book.cover} alt={book.title}
            className="w-full h-full object-cover
              group-hover:scale-105 transition-transform duration-500" />
        </div>
        {/* Progress ring at bottom of cover */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2
          bg-surface-light dark:bg-surface-dark rounded-full px-3 py-0.5
          border border-border-light dark:border-border-dark shadow-sm">
          <span className="text-[10px] font-medium text-primary tabular-nums">
            {book.progress ?? 0}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-[10px] font-medium text-amber-600/70 dark:text-amber-400/60">
            在读
          </span>
        </div>
        <h3 className="text-sm md:text-base font-bold tracking-tight
          text-text-light dark:text-white/90
          group-hover:text-primary dark:group-hover:text-white
          transition-colors duration-300">
          {book.title}
        </h3>
        <p className="text-[11px] md:text-xs text-muted-light dark:text-white/35 mt-1">
          {book.author}
        </p>

        {book.tags && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {book.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 rounded text-[9px]
                text-muted-light/60 dark:text-white/20
                bg-gray-100 dark:bg-white/[0.02]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1 rounded-full bg-gray-200 dark:bg-white/[0.04] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${book.progress ?? 0}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ===== Scrollable Shelf Row ===== */
function ScrollableShelf({
  label,
  items,
  onClick,
}: {
  label: string;
  items: Book[];
  onClick: (book: Book) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...springGentle, delay: 0.12 }}
    >
      {/* Header with arrows */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-medium tracking-[0.15em] uppercase
          text-muted-light/60 dark:text-muted-dark/50">
          {label}
          <span className="ml-2 text-[10px] opacity-50">{items.length} books</span>
        </p>

        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className={`p-1.5 rounded-lg border transition-all duration-300
              ${canScrollLeft
                ? 'border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer opacity-100'
                : 'border-transparent cursor-default opacity-20'
              }`}
          >
            <ChevronLeft size={15} className="text-muted-light dark:text-white/40" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className={`p-1.5 rounded-lg border transition-all duration-300
              ${canScrollRight
                ? 'border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer opacity-100'
                : 'border-transparent cursor-default opacity-20'
              }`}
          >
            <ChevronRight size={15} className="text-muted-light dark:text-white/40" />
          </motion.button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        onScroll={updateScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2
          -mx-4 px-4 snap-x snap-mandatory scroll-smooth"
      >
        {items.map((book, i) => (
          <BookCard key={book.id} book={book} index={i} onClick={() => onClick(book)} />
        ))}
      </div>
    </motion.div>
  );
}

/* ===== Book Card (for scrollable row) ===== */
function BookCard({
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
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ ...springGentle, delay: index * 0.04 }}
      whileHover={{ y: -6, transition: springSnappy }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="group shrink-0 snap-start flex flex-col rounded-2xl overflow-hidden
        cursor-pointer text-left w-[150px] md:w-[170px]
        bg-surface-light dark:bg-surface-dark
        border border-border-light dark:border-border-dark
        hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.05)]
        transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img src={book.cover} alt={book.title}
          className="w-full h-full object-cover
            group-hover:scale-[1.06] transition-transform duration-500" />

        <div className="absolute inset-x-0 bottom-0 h-1/3
          bg-gradient-to-t from-black/20 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Status dot */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`block w-2 h-2 rounded-full border ${statusDot[book.status]}`} />
        </div>

        {/* Progress bar */}
        {book.progress != null && book.status === 'reading' && (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-200/50 dark:bg-white/[0.06]">
            <div className="h-full bg-primary transition-all duration-500"
              style={{ width: `${book.progress}%` }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 md:p-3.5">
        <h3 className="text-[13px] md:text-sm font-semibold tracking-tight truncate
          text-text-light dark:text-white/80
          group-hover:text-primary dark:group-hover:text-white/95
          transition-colors duration-300">
          {book.title}
        </h3>
        <p className="text-[10px] md:text-[11px] mt-0.5 truncate
          text-muted-light dark:text-white/25">
          {book.author}
        </p>
      </div>
    </motion.button>
  );
}
