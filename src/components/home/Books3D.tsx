import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { books } from '../../data/books';
import { X } from 'lucide-react';

export default function BookShelf() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Books
        </motion.h2>
        <p className="text-center text-gray-400 dark:text-gray-500 mb-12">
          最近在读的一些书
        </p>

        {/* Book grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {books.map((book, i) => (
            <motion.button
              key={book.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.08, y: -4 }}
              onClick={() => setSelected(i)}
              className="group relative bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Cover */}
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Info */}
              <div className="p-3 text-left">
                <h3 className="text-sm font-semibold dark:text-white truncate">{book.title}</h3>
                <p className="text-xs text-gray-400 truncate mt-0.5">{book.author}</p>
                <div className="text-yellow-400 text-xs mt-1">{'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}</div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/40">
                  读书笔记
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Notes modal */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-light dark:bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
              >
                {/* Header with cover */}
                <div className="flex items-center gap-4 p-5 border-b border-gray-100 dark:border-gray-700">
                  <img
                    src={books[selected].cover}
                    alt={books[selected].title}
                    className="w-16 h-22 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold dark:text-white">{books[selected].title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{books[selected].author}</p>
                    <div className="text-yellow-400 text-sm mt-0.5">
                      {'★'.repeat(books[selected].rating)}{'☆'.repeat(5 - books[selected].rating)}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
                  >
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>

                {/* Notes content */}
                <div className="p-5">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    读书笔记
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {books[selected].notes}
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
