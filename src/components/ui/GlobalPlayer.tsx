import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';

function LyricLine({ text }: { text: string; duration: number }) {
  if (!text) return <div className="flex-1 min-w-0 hidden sm:block" />;

  return (
    <div className="flex-1 min-w-0 hidden sm:block overflow-hidden">
      <motion.span
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="truncate block text-center text-xs text-black/40 dark:text-white/40"
      >
        {text}
      </motion.span>
    </div>
  );
}

export default function GlobalPlayer() {
  const ctx = useMusic();
  const { selected, currentTrack, currentTime, duration, volume, isMuted, isPlaying, lyricText, view, headingVisible } = ctx;

  const track = selected?.tracks?.[currentTrack];
  const showTopBar = !!(track && (view !== 'playing' || !headingVisible));

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const activeLyricIdx = ctx.lyrics.reduce((acc: number, line: { time: number }, i: number) => currentTime >= line.time ? i : acc, -1);
  const lyricDur = activeLyricIdx >= 0 && activeLyricIdx < ctx.lyrics.length - 1
    ? ctx.lyrics[activeLyricIdx + 1].time - ctx.lyrics[activeLyricIdx].time
    : duration - (ctx.lyrics[activeLyricIdx]?.time ?? 0);

  return (
    <AnimatePresence>
      {showTopBar && track && (
        <motion.div
          key="global-player"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 1.5 }}
          className="fixed top-[72px] left-4 right-4 z-40 flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl backdrop-saturate-[180%] rounded-xl shadow-lg border border-black/[0.06] dark:border-white/[0.08] overflow-hidden w-full max-w-xl">
            <div className="flex items-center gap-3 px-3 h-12">
              <img src={selected.cover} alt={selected.title} className="w-8 h-8 rounded-md object-cover shadow-sm shrink-0 cursor-pointer" onClick={() => ctx.setView('playing')} />
              <div className="min-w-0 cursor-pointer" onClick={() => ctx.setView('playing')}>
                <p className="text-sm font-medium dark:text-white truncate leading-tight">{track.title}</p>
                <p className="text-[11px] text-black/40 dark:text-white/30 truncate leading-tight">{selected.artist}</p>
              </div>

              <LyricLine text={lyricText} duration={lyricDur} />

              <div className="flex items-center gap-1 shrink-0">
                <motion.button onClick={ctx.handlePrevTrack} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
                  <SkipBack size={15} />
                </motion.button>
                <motion.button onClick={ctx.handleMiniTogglePlay} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} className="p-1.5 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-900">
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </motion.button>
                <motion.button onClick={ctx.handleNextTrack} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
                  <SkipForward size={15} />
                </motion.button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <motion.button onClick={ctx.handleToggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </motion.button>
                <div className="relative h-[3px] bg-black/8 dark:bg-white/8 rounded-full cursor-pointer w-14 touch-none" {...ctx.volumeBarProps}>
                  <div className="absolute inset-y-0 left-0 bg-gray-500 dark:bg-white/50 rounded-full pointer-events-none" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
                </div>
              </div>

              <motion.button onClick={(e) => { e.stopPropagation(); ctx.handleClose(); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors shrink-0">
                <X size={14} />
              </motion.button>
            </div>

            <div className="h-[2px] cursor-pointer touch-none bg-black/[0.04] dark:bg-white/[0.04]" {...ctx.seekBarProps}>
              <div className="h-full bg-gray-600 dark:bg-white/70 transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
