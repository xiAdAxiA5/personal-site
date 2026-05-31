import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { watchList } from '../../data/operas';
import { X, Gamepad2 } from 'lucide-react';

const springBouncy = { type: 'spring' as const, stiffness: 200, damping: 26, mass: 1 };
const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };

interface SteamGame {
  appid: number;
  name: string;
  playtime_hours: number;
  icon_url: string;
}

function formatHours(h: number): string {
  if (h >= 1000) return `${Math.round(h / 10) / 100}k h`;
  if (h >= 1) return `${Math.round(h * 10) / 10}h`;
  return `${Math.round(h * 60)}m`;
}

export default function GameSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [steamGames, setSteamGames] = useState<SteamGame[]>([]);
  const [steamLoading, setSteamLoading] = useState(true);
  const [steamError, setSteamError] = useState(false);
  const selectedItem = watchList.find((o) => o.id === selected);
  const items = watchList.filter((o) => o.category === 'game');

  useEffect(() => {
    fetch('/api/steam-games')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setSteamError(true); return; }
        setSteamGames(data);
        setSteamLoading(false);
      })
      .catch(() => { setSteamError(true); setSteamLoading(false); });
  }, []);

  return (
    <section className="pt-[76px] pb-[76px] px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          游戏
        </motion.h2>

        {/* Steam games */}
        {!steamError && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-5">
              <Gamepad2 size={16} className="text-primary" />
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-muted-light/60 dark:text-muted-dark/50">
                Steam
              </p>
            </div>

            {steamLoading ? (
              <div className="flex gap-3 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="shrink-0 w-[160px] animate-pulse">
                    <div className="aspect-[460/215] rounded-lg bg-gray-100 dark:bg-gray-800" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="mt-1 h-2.5 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            ) : steamGames.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {steamGames.map((game, i) => (
                  <motion.a
                    key={game.appid}
                    href={`https://store.steampowered.com/app/${game.appid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...springGentle, delay: i * 0.04 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="shrink-0 w-[160px] group cursor-pointer"
                  >
                    <div className="aspect-[460/215] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm">
                      <img
                        src={game.icon_url}
                        alt={game.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="text-xs font-semibold dark:text-white/80 truncate mt-2 group-hover:text-primary transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 tabular-nums">
                      {formatHours(game.playtime_hours)}
                    </p>
                  </motion.a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-300 dark:text-gray-600 italic">
                连接 Steam 以同步游戏时长
              </p>
            )}
          </div>
        )}

        {/* Nostalgic game grid */}
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
                  onClick={() => setSelected(item.id)}
                  className="group relative bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <div className="aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {item.cover ? (
                      <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  <img src={selectedItem.cover} alt={selectedItem.title} className="w-16 h-24 object-cover rounded-lg shadow-md" />
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
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">笔记</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedItem.notes}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
