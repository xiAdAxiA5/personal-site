import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { albums, type Album, type Track } from '../../data/music';
import { useMusic } from '../../context/MusicContext';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, ListMusic } from 'lucide-react';

const springSnappy = { type: 'spring' as const, stiffness: 250, damping: 30, mass: 1 };
const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface LyricLine { time: number; text: string }

export default function MusicSection() {
  const ctx = useMusic();

  const slideUp = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: springGentle },
    exit: { y: 20, opacity: 0, transition: { duration: 0.18 } },
  };

  useEffect(() => {
    const aquarium = albums.find((a) => a.id === 'jude-aquarium');
    if (!aquarium || !aquarium.tracks[0].src) return;
    if (ctx.selected) return;
    ctx.setSelected(aquarium);
    ctx.setCurrentTrack(0);
    setTimeout(() => ctx.playTrack(aquarium.tracks[0]), 500);
  }, []);

  return (
    <section className="pt-[76px] pb-[76px] w-full relative">
      <AnimatePresence>
        {ctx.view === 'playing' && (
          <motion.div {...slideUp} className="absolute top-[116px] left-[44px] z-30">
            <motion.button onClick={ctx.handleBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm">
              <ArrowLeft size={16} /> 返回
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.h2
        ref={ctx.headingRef as any}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={springGentle}
        className="text-3xl md:text-4xl font-bold text-center mb-[73px]"
      >
        Music
      </motion.h2>

      <div className="max-w-6xl mx-auto px-6">
        <div
          className="relative flex items-start"
          style={{
            gap: 'var(--gap)',
            ['--tt' as string]: '288px',
            ['--gap' as string]: '48px',
            ['--dth' as string]: '560px',
            ['--ofs' as string]: '33px',
          } as React.CSSProperties}
        >
          {/* Backdrop overlay when detail/playing is shown */}
          <AnimatePresence>
            {ctx.view !== 'browsing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 backdrop-blur-md rounded-3xl z-10"
              />
            )}
          </AnimatePresence>

          {/* Left column: Turntable + back + playing controls */}
          <div className="shrink-0 relative z-20 flex flex-col items-center" style={{ width: 'var(--tt)', paddingTop: 'var(--ofs)' } as React.CSSProperties}>
            <div style={{ width: 'var(--tt)', height: 'var(--tt)' } as React.CSSProperties}>
              <Turntable view={ctx.view} selected={ctx.selected} isPlaying={ctx.isPlaying} />
            </div>
            <AnimatePresence>
              {ctx.view === 'playing' && ctx.selected && (
                <motion.div key="playing-ctrls" {...slideUp} className="w-full mt-10">
                  <PlayerControls
                    album={ctx.selected}
                    currentTrack={ctx.currentTrack}
                    currentTime={ctx.currentTime}
                    duration={ctx.duration}
                    volume={ctx.volume}
                    isMuted={ctx.isMuted}
                    isPlaying={ctx.isPlaying}
                    seekBarProps={ctx.seekBarProps}
                    volumeBarProps={ctx.volumeBarProps}
                    onToggleMute={ctx.handleToggleMute}
                    onPrev={ctx.handlePrevTrack}
                    onNext={ctx.handleNextTrack}
                    onTogglePlay={ctx.handleTogglePlay}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel: grid / detail / lyrics */}
          <div className="flex-1 min-w-0 relative z-20">
            <motion.div
              animate={{ opacity: ctx.view === 'browsing' ? 1 : 0, pointerEvents: ctx.view === 'browsing' ? 'auto' : 'none' as any }}
              transition={{ duration: 0.2 }}
            >
              <RecordGrid albums={albums} onSelect={ctx.handleSelect} />
            </motion.div>

            <AnimatePresence>
              {ctx.view === 'detail' && ctx.selected && (
                <motion.div key="detail" {...slideUp} className="absolute inset-0">
                  <AlbumDetail
                    album={ctx.selected}
                    currentTrack={ctx.currentTrack}
                    onTrackClick={ctx.handleTrackClick}
                    onBack={ctx.handleBack}
                    onTogglePlay={ctx.handleTogglePlay}
                  />
                </motion.div>
              )}
              {ctx.view === 'playing' && ctx.selected && (
                <motion.div key="playing-lyrics" {...slideUp} className="absolute inset-0">
                  <LyricsPanel
                    album={ctx.selected}
                    currentTrack={ctx.currentTrack}
                    currentTime={ctx.currentTime}
                    lyrics={ctx.lyrics}
                    onTrackClick={ctx.handleTrackClick}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Turntable ----
function Turntable({ view, selected, isPlaying }: { view: string; selected: Album | null; isPlaying: boolean }) {
  const showCover = (view === 'detail' || view === 'playing' || isPlaying) && selected;

  return (
    <div className="relative select-none" style={{ width: 'var(--tt)', height: 'var(--tt)' } as React.CSSProperties}>
      {/* Record — dark disc */}
      <div className="absolute inset-[12px] rounded-full bg-[#1a1a1e] dark:bg-[#111] shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full border border-white/[0.03] dark:border-white/[0.04]" style={{ inset: `${8 + i * 20}px` }} />
        ))}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
      </div>

      {/* Center label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full bg-white/10 dark:bg-white/5 z-[5] shadow-[0_1px_4px_rgba(0,0,0,0.10)] flex items-center justify-center backdrop-blur-sm">
        <div className="w-[66px] h-[66px] rounded-full border border-primary/15 flex items-center justify-center">
          <span className="text-[11px] font-semibold text-primary/50 tracking-[0.15em] uppercase">Vinyl</span>
        </div>
      </div>

      {/* Spindle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-black/20 dark:bg-white/20 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />

      {/* Album cover */}
      <AnimatePresence>
        {showCover && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: isPlaying ? 360 : 0 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ scale: springSnappy, rotate: isPlaying ? { duration: 12, repeat: Infinity, ease: 'linear' } : { duration: 0.3, ease: [0.32, 0.72, 0, 1] } }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[224px] h-[224px] rounded-full shadow-lg z-[6] overflow-hidden ring-1 ring-black/5 dark:ring-white/5"
          >
            <img loading="lazy" decoding="async" src={selected.cover} alt={selected.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.08] via-transparent to-black/[0.1]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Album Grid ----
function RecordGrid({ albums: list, onSelect }: { albums: Album[]; onSelect: (a: Album) => void }) {
  if (list.length === 0) return <div className="flex items-center justify-center min-h-[320px]"><p className="text-base text-gray-300 dark:text-gray-600 italic">coming soon</p></div>;
  const sorted = [...list].sort((a, b) => {
    if (a.id === 'jude-aquarium') return -1;
    if (b.id === 'jude-aquarium') return 1;
    if (a.type === 'single' && b.type !== 'single') return 1;
    if (a.type !== 'single' && b.type === 'single') return -1;
    return 0;
  });
  return (
    <div className="overflow-y-auto scrollbar-hide rounded-xl" style={{ maxHeight: 'var(--dth)' } as React.CSSProperties}>
      <div className="grid grid-cols-2 gap-3 pr-1">
        {sorted.map((album, i) => {
          const hasAudio = album.tracks.some((t: Track) => t.src || t.neteaseId);
          const isSingle = album.type === 'single';
          const isPlaylist = album.type === 'playlist';
          const isHero = i === 0 && hasAudio && !isPlaylist && !isSingle;

          if (isSingle) {
            return (
              <motion.button key={album.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...springGentle, delay: i * 0.04 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(album)}
                className="col-span-2 flex items-center gap-2.5 p-2 rounded-lg bg-surface-light/40 dark:bg-surface-dark/40 border border-gray-100/50 dark:border-gray-700/50 hover:bg-surface-light/60 dark:hover:bg-surface-dark/60 transition-all text-left cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"><span className="text-[10px] text-gray-400">&#9835;</span></div>
                <div className="min-w-0 flex-1"><h3 className="text-sm font-medium dark:text-white truncate">{album.title}</h3>{album.artist && <p className="text-sm text-gray-400 truncate">{album.artist}</p>}</div>
                <span className="text-[11px] text-gray-300 dark:text-gray-600 shrink-0">&#9835;</span>
              </motion.button>
            );
          }
          if (isPlaylist) {
            return (
              <motion.button key={album.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...springGentle, delay: i * 0.04 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(album)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-light/40 dark:bg-surface-dark/40 border border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-surface-light/60 dark:hover:bg-surface-dark/60 transition-all text-left cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0"><ListMusic size={16} className="text-gray-400" /></div>
                <div className="min-w-0"><h3 className="text-base font-medium dark:text-white truncate">{album.title}</h3><p className="text-sm text-gray-400 truncate mt-0.5">{album.artist} · {album.tracks.length} 首</p></div>
              </motion.button>
            );
          }
          if (isHero) {
            return (
              <motion.button key={album.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...springGentle, delay: i * 0.04 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(album)}
                className="col-span-2 flex items-center gap-4 p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all text-left cursor-pointer">
                {album.cover ? <img loading="lazy" decoding="async" src={album.cover} alt={album.title} className="w-20 h-20 rounded-xl object-cover shadow-md shrink-0" /> : <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md shrink-0 flex items-center justify-center"><span className="text-sm text-gray-400">{album.title.slice(0, 2)}</span></div>}
                <div className="min-w-0"><h3 className="text-lg font-bold dark:text-white truncate">{album.title}</h3><p className="text-base text-gray-400 truncate mt-0.5">{album.artist}</p><p className="text-sm text-gray-400 mt-1">{album.tracks.length} 首</p></div>
              </motion.button>
            );
          }
          return (
            <motion.button key={album.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...springGentle, delay: i * 0.04 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(album)}
              className="flex items-center gap-3 p-2.5 rounded-xl border transition-shadow text-left cursor-pointer bg-surface-light dark:bg-surface-dark border-gray-100 dark:border-border-dark hover:shadow-md">
              {album.cover ? <img loading="lazy" decoding="async" src={album.cover} alt={album.title} className="w-14 h-14 rounded-lg object-cover shadow-sm shrink-0" /> : <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm shrink-0 flex items-center justify-center"><span className="text-sm text-gray-400">{album.title.slice(0, 3)}</span></div>}
              <div className="min-w-0"><h3 className="text-base font-semibold dark:text-white truncate">{album.title}</h3><p className="text-sm text-gray-400 truncate mt-0.5">{album.artist}</p>
                <p className="text-sm mt-0.5 text-gray-400">{album.tracks.length} 首</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Album Detail ----
function AlbumDetail({ album, currentTrack, onTrackClick, onBack, onTogglePlay }: { album: Album; currentTrack: number; onTrackClick: (i: number) => void; onBack: () => void; onTogglePlay: () => void }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 flex flex-col" style={{ minHeight: 'var(--dth)' } as React.CSSProperties}>
      <div className="flex items-center gap-3 mb-5">
        <motion.button onClick={onBack} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"><ArrowLeft size={18} className="text-gray-400" /></motion.button>
        <img src={album.cover} alt={album.title} className="w-12 h-12 rounded-lg object-cover shadow-sm shrink-0" />
        <div className="min-w-0"><h3 className="text-lg font-bold dark:text-white truncate">{album.title}</h3><p className="text-sm text-gray-400">{album.artist}</p></div>
        <motion.button onClick={onTogglePlay} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors ml-auto shrink-0"><Play size={15} /> Play</motion.button>
      </div>
      <div className="flex-1 space-y-0.5">
        {album.tracks.map((track, i) => {
          const canPlay = !!(track.src || track.neteaseId);
          return (
            <motion.button key={i} onClick={canPlay ? () => onTrackClick(i) : undefined} whileHover={canPlay ? { x: 3 } : undefined} whileTap={canPlay ? { scale: 0.98 } : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${!canPlay ? 'cursor-default' : currentTrack === i ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
              <span className="text-sm w-5 text-right shrink-0" style={{ color: currentTrack === i ? 'inherit' : '#94a3b8' }}>{currentTrack === i ? <Volume2 size={13} className="inline" /> : i + 1}</span>
              <span className={`text-base flex-1 truncate ${currentTrack === i ? 'font-semibold' : 'dark:text-white'}`}>{track.title}</span>
              <span className="text-sm text-gray-400 shrink-0">{track.duration || '—'}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Player Controls (left column, below turntable) ----
function PlayerControls({ album, currentTrack, currentTime, duration, volume, isMuted, isPlaying, seekBarProps, volumeBarProps, onToggleMute, onPrev, onNext, onTogglePlay }: any) {
  const track = album.tracks[currentTrack];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full">
      {/* Track info */}
      <div className="min-w-0 mb-3 text-center">
        <p className="text-sm font-semibold dark:text-white truncate">{track.title}</p>
        <p className="text-sm text-gray-400 truncate">{album.artist}</p>
      </div>

      {/* Seek bar */}
      <div className="mb-3">
        <div className="group relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer touch-none" {...seekBarProps}>
          <div className="absolute inset-y-0 left-0 bg-primary rounded-full pointer-events-none" style={{ width: `${progress}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none" style={{ left: `calc(${progress}% - 5px)` }} />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[11px] text-gray-400 tabular-nums">{formatTime(currentTime)}</span>
          <span className="text-[11px] text-gray-400 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <motion.button onClick={onPrev} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} className="p-1 text-gray-400 hover:text-primary transition-colors">
          <SkipBack size={18} />
        </motion.button>
        <motion.button onClick={onTogglePlay} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} className="p-2.5 rounded-full bg-primary text-white shadow-md">
          {isPlaying ? <Pause size={17} fill="white" /> : <Play size={17} fill="white" className="ml-0.5" />}
        </motion.button>
        <motion.button onClick={onNext} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.88 }} className="p-1 text-gray-400 hover:text-primary transition-colors">
          <SkipForward size={18} />
        </motion.button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2">
        <motion.button onClick={onToggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} className="text-gray-400 hover:text-primary transition-colors shrink-0">
          {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </motion.button>
        <div className="group relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer flex-1 touch-none" {...volumeBarProps}>
          <div className="absolute inset-y-0 left-0 bg-gray-400 dark:bg-gray-500 rounded-full pointer-events-none" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

// ---- Lyrics Panel (right column, playing view) ----
function LyricsPanel({ album, currentTrack, currentTime, lyrics, onTrackClick }: any) {
  const [listOpen, setListOpen] = useState(false);
  const lyricsRef = useRef<HTMLDivElement>(null);
  const prevLyricsRef = useRef<LyricLine[] | null>(null);
  const stableRef = useRef(-1);
  const hasLyrics = lyrics.length > 0;

  if (prevLyricsRef.current !== lyrics) { prevLyricsRef.current = lyrics; stableRef.current = -1; }
  const DEAD_FORWARD = 0.08, DEAD_BACK = 0.12;
  if (hasLyrics) {
    const raw = lyrics.reduce((acc: number, line: { time: number }, i: number) => currentTime >= line.time ? i : acc, -1);
    const prev = stableRef.current;
    if (Math.abs(raw - prev) > 1) { stableRef.current = raw; }
    else if (raw > prev) { const nextLine = lyrics[prev + 1]; if (nextLine && currentTime >= nextLine.time + DEAD_FORWARD) stableRef.current = prev + 1; }
    else if (raw < prev) { const curLine = lyrics[prev]; if (curLine && currentTime < curLine.time - DEAD_BACK) stableRef.current = Math.max(-1, prev - 1); }
  }
  const currentLyricIdx = stableRef.current;

  useLayoutEffect(() => {
    if (!lyricsRef.current || !hasLyrics || currentLyricIdx < 0) return;
    const container = lyricsRef.current;
    const activeEl = container.querySelector(`[data-index="${currentLyricIdx}"]`) as HTMLElement | null;
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const relativeTop = elRect.top - containerRect.top + container.scrollTop;
      container.scrollTop = relativeTop - container.clientHeight / 2 + elRect.height / 2;
    }
  }, [currentLyricIdx, hasLyrics]);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-4 flex flex-col" style={{ height: 'var(--dth)' } as React.CSSProperties}>
      {/* Lyrics area */}
      {hasLyrics ? (
        <div ref={lyricsRef} className="flex-1 overflow-y-auto scrollbar-hide rounded-xl bg-gray-50/50 dark:bg-gray-800/30 py-3">
          {lyrics.map((line: LyricLine, i: number) => {
            const isActive = i === currentLyricIdx;
            const dist = Math.abs(i - currentLyricIdx);
            const opacity = isActive ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.25 : 0.12;
            const blur = isActive ? 0 : dist * 0.6;
            return (
              <div key={i} data-index={i}
                className={`px-6 py-4 text-center transition-all duration-500 ${isActive ? 'text-primary font-semibold text-3xl' : 'text-gray-400 dark:text-gray-500 text-2xl'}`}
                style={{ opacity, filter: blur > 0 ? `blur(${blur}px)` : undefined }}>
                {line.text}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-base text-gray-300 dark:text-gray-600 italic">纯音乐，敬请欣赏</p>
        </div>
      )}

      {/* Toggle track list */}
      <button
        onClick={() => setListOpen(!listOpen)}
        className="flex items-center gap-1.5 border-t border-gray-100 dark:border-gray-700 mt-3 pt-2 text-[13px] text-gray-400 hover:text-primary transition-colors w-full"
      >
        <ListMusic size={12} />
        <span>播放列表</span>
        <span className="text-sm opacity-50">({album.tracks.length})</span>
        <span className="ml-auto text-sm opacity-40">{listOpen ? '收起' : '展开'}</span>
      </button>
      <AnimatePresence>
        {listOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-1 max-h-[200px] overflow-y-auto scrollbar-hide">
              {album.tracks.map((t: Track, i: number) => {
                const canPlay = !!(t.src || t.neteaseId);
                return (
                  <motion.button key={i} onClick={canPlay ? () => onTrackClick(i) : undefined} whileHover={canPlay ? { x: 3 } : undefined} whileTap={canPlay ? { scale: 0.98 } : undefined}
                    className={`w-full flex items-center gap-3 px-2 py-1 rounded-lg text-left transition-colors ${!canPlay ? 'cursor-default' : i === currentTrack ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400'}`}>
                    <span className="text-sm w-5 text-right shrink-0">{i === currentTrack ? <Volume2 size={12} className="inline" /> : i + 1}</span>
                    <span className={`text-sm flex-1 truncate ${i === currentTrack ? 'font-semibold text-primary' : ''}`}>{t.title}</span>
                    <span className="text-sm opacity-60 shrink-0">{t.duration || '—'}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
