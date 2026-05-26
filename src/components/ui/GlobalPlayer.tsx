import { useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useMusic } from '../../context/MusicContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';

function LyricLine({ text, duration, active, dim }: { text: string; duration: number; active?: boolean; dim?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(false);

  useLayoutEffect(() => {
    const c = containerRef.current;
    const t = textRef.current;
    if (!c || !t) return;
    setOverflow(t.offsetWidth > c.offsetWidth);
  }, [text]);

  if (!text) return null;

  const scrollPx = overflow ? (textRef.current?.offsetWidth ?? 0) - (containerRef.current?.offsetWidth ?? 0) + 16 : 0;
  const scrollDuration = overflow && active && duration > 0 ? duration : 0;

  return (
    <div ref={containerRef} className={`overflow-hidden w-full ${overflow ? 'text-left' : 'text-center'}`}>
      <motion.span
        key={text}
        initial={{ opacity: 0, x: 0 }}
        animate={overflow ? { opacity: 1, x: [0, 0, -scrollPx] } : { opacity: 1, x: 0 }}
        transition={
          overflow
            ? { x: { duration: scrollDuration, ease: 'linear', times: [0, 0.15, 1] }, opacity: { duration: 0.15 } }
            : { duration: 0.15 }
        }
        className={`inline-block whitespace-nowrap text-lg ${dim ? 'text-black/25 dark:text-white/15' : active ? 'text-black/60 dark:text-white/50 font-medium' : 'text-black/35 dark:text-white/25'}`}
      >
        <span ref={textRef}>{text}</span>
      </motion.span>
    </div>
  );
}

export default function GlobalPlayer() {
  const ctx = useMusic();
  const { selected, currentTrack, playingAlbum, playingTrackIdx, currentTime, duration, volume, isMuted, isPlaying, lyricText, view, headingVisible } = ctx;
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [hovered, setHovered] = useState(false);

  const displayAlbum = playingAlbum || selected;
  const displayTrackIdx = playingAlbum ? playingTrackIdx : currentTrack;
  const track = displayAlbum?.tracks?.[displayTrackIdx];
  const showTopBar = !!(track && (view !== 'playing' || !headingVisible));

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const expanded = isHome || hovered;

  const activeLyricIdx = ctx.lyrics.reduce((acc: number, line: { time: number }, i: number) => currentTime >= line.time ? i : acc, -1);
  const nextLyricText = activeLyricIdx >= 0 && activeLyricIdx < ctx.lyrics.length - 1 ? ctx.lyrics[activeLyricIdx + 1].text : '';
  const lyricDur = activeLyricIdx >= 0 && activeLyricIdx < ctx.lyrics.length - 1
    ? ctx.lyrics[activeLyricIdx + 1].time - ctx.lyrics[activeLyricIdx].time
    : duration - (ctx.lyrics[activeLyricIdx]?.time ?? 0);
  const twoLine = lyricDur > 0 && lyricDur < 3.5 && nextLyricText;

  return (
    <AnimatePresence>
      {showTopBar && track && (
        <motion.div
          key="global-player"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 1.5 }}
          className="fixed top-[72px] left-4 right-4 z-40 flex justify-center pointer-events-none"
        >
          <div
            className="pointer-events-auto rounded-2xl overflow-hidden w-full max-w-4xl
              bg-white/40 dark:bg-gray-900/40
              backdrop-blur-[40px] backdrop-saturate-150
              shadow-[0_8px_32px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.04)]
              dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_1px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.2)]
              border border-white/30 dark:border-white/[0.06]
              transition-all duration-300 ease-out"
            style={expanded ? undefined : { height: 8 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Collapsed: only progress bar (non-home) */}
            {!expanded && (
              <div className="h-full cursor-pointer touch-none bg-black/[0.04] dark:bg-white/[0.04]" {...ctx.seekBarProps}>
                <div className="h-full bg-gray-600 dark:bg-white/70 transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
              </div>
            )}

            {/* Expanded: full player */}
            {expanded && (
              <>
                <div className={`flex items-center gap-5 px-6 ${twoLine ? 'h-[5.5rem]' : 'h-20'}`}>
                  {/* Left: cover + track info */}
                  <div className="flex items-center gap-3 shrink-0 w-[200px] cursor-pointer" onClick={() => ctx.setView('playing')}>
                    <img src={displayAlbum.cover} alt={displayAlbum.title} className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0" />
                    <div className="min-w-0">
                      <p className="text-base font-semibold dark:text-white truncate leading-tight">{track.title}</p>
                      <p className="text-base text-black/40 dark:text-white/30 truncate leading-tight">{displayAlbum.artist}</p>
                    </div>
                  </div>

                  {/* Center: lyrics — single or double line */}
                  <div className="flex-1 min-w-0 hidden sm:flex items-center justify-center">
                    {twoLine ? (
                      <div className="flex flex-col items-center gap-0.5 w-full">
                        <LyricLine text={lyricText} duration={lyricDur} active />
                        <LyricLine text={nextLyricText} duration={0} dim />
                      </div>
                    ) : (
                      <LyricLine text={lyricText} duration={lyricDur} active />
                    )}
                  </div>

                  {/* Right: controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <motion.button onClick={ctx.handlePrevTrack} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
                      <SkipBack size={19} />
                    </motion.button>
                    <motion.button onClick={ctx.handleMiniTogglePlay} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} className="p-2.5 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-900">
                      {isPlaying ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" className="ml-0.5" />}
                    </motion.button>
                    <motion.button onClick={ctx.handleNextTrack} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
                      <SkipForward size={19} />
                    </motion.button>

                    <div className="hidden sm:flex items-center gap-1.5 ml-1" onClick={(e) => e.stopPropagation()}>
                      <motion.button onClick={ctx.handleToggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </motion.button>
                      <div className="relative h-[3px] bg-black/8 dark:bg-white/8 rounded-full cursor-pointer w-16 touch-none" {...ctx.volumeBarProps}>
                        <div className="absolute inset-y-0 left-0 bg-gray-500 dark:bg-white/50 rounded-full pointer-events-none" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
                      </div>
                    </div>

                    <motion.button onClick={(e) => { e.stopPropagation(); ctx.handleClose(); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors shrink-0 ml-1">
                      <X size={17} />
                    </motion.button>
                  </div>
                </div>

                <div className="h-[2px] cursor-pointer touch-none bg-black/[0.04] dark:bg-white/[0.04]" {...ctx.seekBarProps}>
                  <div className="h-full bg-gray-600 dark:bg-white/70 transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
