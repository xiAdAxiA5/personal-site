import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { albums, type Album, type Track } from '../../data/music';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

type View = 'browsing' | 'detail' | 'playing';

const springSnappy = { type: 'spring' as const, stiffness: 500, damping: 40, mass: 1 };
const springGentle = { type: 'spring' as const, stiffness: 300, damping: 35, mass: 1 };
const springSlide = { type: 'spring' as const, stiffness: 350, damping: 38, mass: 1 };

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface LyricLine {
  time: number;
  text: string;
}

function parseLRC(raw: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const line of raw.split('\n')) {
    // Support both [mm:ss.xx] and [mmss.xx] formats
    const match = line.match(/^\[(\d+)[:.]?(\d{2})[.](\d{2,3})\]/);
    if (match) {
      const mins = parseInt(match[1], 10);
      const secs = parseInt(match[2], 10);
      const frac = parseInt(match[3], 10);
      const hundredths = frac >= 100 ? frac / 10 : frac; // normalize 3-digit ms
      const time = mins * 60 + secs + hundredths / 100;
      const text = line.slice(match[0].length).trim();
      if (text) {
        lines.push({ time, text });
      }
    }
  }
  return lines;
}

export default function MusicSection() {
  const [view, setView] = useState<View>('browsing');
  const [selected, setSelected] = useState<Album | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [sectionVisible, setSectionVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const dragRef = useRef<{ type: 'seek' | 'volume'; rect: DOMRect } | null>(null);

  // Track section visibility for top bar player
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.4;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMeta = () => setDuration(audio.duration);
    const onVolChange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.muted);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('volumechange', onVolChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('volumechange', onVolChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  // Global pointer events for drag
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const ratio = Math.max(0, Math.min(1, (e.clientX - drag.rect.left) / drag.rect.width));
      if (drag.type === 'seek') {
        audioRef.current.currentTime = ratio * (audioRef.current.duration || 0);
      } else {
        audioRef.current.volume = ratio;
        audioRef.current.muted = ratio === 0;
      }
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const barPointerDown = (type: 'seek' | 'volume', e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = { type, rect };
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (type === 'seek') {
      audioRef.current.currentTime = ratio * (audioRef.current.duration || 0);
    } else {
      audioRef.current.volume = ratio;
      audioRef.current.muted = ratio === 0;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Lyrics loading
  useEffect(() => {
    if (!selected) return;
    const track = selected.tracks[currentTrack];
    if (!track.lrc) {
      setLyrics([]);
      return;
    }
    fetch(track.lrc)
      .then((r) => r.text())
      .then((raw) => setLyrics(parseLRC(raw)))
      .catch(() => setLyrics([]));
  }, [selected, currentTrack]);

  const handleSelect = (album: Album) => {
    setSelected(album);
    setView('detail');
    setHoveredTrack(null);
    setCurrentTrack(0);
  };

  const handleBack = () => {
    setView('browsing');
    setHoveredTrack(null);
  };

  const playTrack = useCallback((track: Track) => {
    if (!track.src) return;
    const audio = audioRef.current;
    if (audio.src !== window.location.origin + track.src) {
      audio.src = track.src;
    }
    audio.play().catch(() => {});
  }, []);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!selected) return;
    if (isPlaying) {
      audio.pause();
    } else {
      if (!audio.src || audio.paused) {
        playTrack(selected.tracks[currentTrack]);
      }
      if (view !== 'playing') setView('playing');
    }
    setHoveredTrack(null);
  };

  const handleMiniTogglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  const handleTrackClick = (index: number) => {
    if (!selected) return;
    setCurrentTrack(index);
    playTrack(selected.tracks[index]);
    setView('playing');
  };

  const handlePrevTrack = () => {
    if (!selected) return;
    const prev = currentTrack > 0 ? currentTrack - 1 : selected.tracks.length - 1;
    setCurrentTrack(prev);
    playTrack(selected.tracks[prev]);
  };

  const handleNextTrack = () => {
    if (!selected) return;
    const next = currentTrack + 1 < selected.tracks.length ? currentTrack + 1 : 0;
    setCurrentTrack(next);
    playTrack(selected.tracks[next]);
  };

  const handleToggleMute = () => {
    audioRef.current.muted = !audioRef.current.muted;
  };

  // Auto-advance tracks
  useEffect(() => {
    const audio = audioRef.current;
    const onEnded = () => {
      if (!selected) return;
      const next = currentTrack + 1;
      if (next < selected.tracks.length) {
        setCurrentTrack(next);
        playTrack(selected.tracks[next]);
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [selected, currentTrack, playTrack]);

  useEffect(() => {
    return () => { audioRef.current.pause(); };
  }, []);

  const slideFromRight = {
    initial: { x: 80, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: springSlide },
    exit: { x: -60, opacity: 0, transition: { duration: 0.2 } },
  };
  const slideUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: springGentle },
    exit: { y: 30, opacity: 0, transition: { duration: 0.2 } },
  };

  const hasAudio = !!audioRef.current.src;
  const showMiniPlayer = view === 'browsing' && selected && hasAudio;

  // Shared bar props
  const seekBarProps = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => barPointerDown('seek', e),
  };
  const volumeBarProps = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => barPointerDown('volume', e),
  };

  const activeLyricIndex = lyrics.reduce((acc, line, i) => {
    if (currentTime >= line.time) return i;
    return acc;
  }, -1);
  const currentLyricText = lyrics[activeLyricIndex]?.text ?? '';

  const showTopBar = hasAudio && selected && !sectionVisible;

  return (
    <>
      <AnimatePresence>
        {showTopBar && (
          <TopBarPlayer
            album={selected!}
            currentTrack={currentTrack}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            isPlaying={isPlaying}
            lyricText={currentLyricText}
            seekBarProps={seekBarProps}
            volumeBarProps={volumeBarProps}
            onToggleMute={handleToggleMute}
            onTogglePlay={handleMiniTogglePlay}
            onPrev={handlePrevTrack}
            onNext={handleNextTrack}
            onClick={() => { setView('playing'); }}
          />
        )}
      </AnimatePresence>
      <section ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Music
        </motion.h2>

        <div className="relative flex gap-8">
          <AnimatePresence>
            {view !== 'browsing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl z-10"
              />
            )}
          </AnimatePresence>

          <div className="shrink-0 w-72 flex flex-col items-center relative z-20">
            <div className="flex items-start justify-center pt-8">
              <Turntable view={view} selected={selected} isPlaying={isPlaying} />
            </div>
            <AnimatePresence>
              {showMiniPlayer && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 20, height: 0 }}
                  transition={springGentle}
                  className="w-full mt-4 overflow-hidden"
                >
                  <MiniPlayer
                    album={selected!}
                    currentTrack={currentTrack}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    isMuted={isMuted}
                    isPlaying={isPlaying}
                    seekBarProps={seekBarProps}
                    volumeBarProps={volumeBarProps}
                    onToggleMute={handleToggleMute}
                    onTogglePlay={handleMiniTogglePlay}
                    onPrev={handlePrevTrack}
                    onNext={handleNextTrack}
                    onClick={() => { setView('playing'); }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0 relative z-20">
            <AnimatePresence mode="wait">
              {view === 'browsing' && (
                <motion.div key="browsing" {...slideFromRight}>
                  <RecordGrid albums={albums} onSelect={handleSelect} />
                </motion.div>
              )}
              {view === 'detail' && selected && (
                <motion.div key="detail" {...slideUp}>
                  <AlbumDetail
                    album={selected}
                    currentTrack={currentTrack}
                    hoveredTrack={hoveredTrack}
                    onHoverTrack={setHoveredTrack}
                    onTrackClick={handleTrackClick}
                    onBack={handleBack}
                    onTogglePlay={handleTogglePlay}
                  />
                </motion.div>
              )}
              {view === 'playing' && selected && (
                <motion.div key="playing" {...slideUp}>
                  <PlayerView
                    album={selected}
                    currentTrack={currentTrack}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    isMuted={isMuted}
                    isPlaying={isPlaying}
                    lyrics={lyrics}
                    seekBarProps={seekBarProps}
                    volumeBarProps={volumeBarProps}
                    onToggleMute={handleToggleMute}
                    onPrev={handlePrevTrack}
                    onNext={handleNextTrack}
                    onTogglePlay={handleTogglePlay}
                    onBack={handleBack}
                    onTrackClick={handleTrackClick}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

function TopBarPlayer({
  album,
  currentTrack,
  currentTime,
  duration,
  volume,
  isMuted,
  isPlaying,
  lyricText,
  seekBarProps,
  volumeBarProps,
  onToggleMute,
  onTogglePlay,
  onPrev,
  onNext,
  onClick,
}: {
  album: Album;
  currentTrack: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  lyricText: string;
  seekBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  volumeBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  onToggleMute: () => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClick: () => void;
}) {
  const track = album.tracks[currentTrack];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 1 }}
      className="fixed top-0 left-0 right-0 z-[100]"
    >
      <div className="bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl backdrop-saturate-[180%] border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 h-11 flex items-center">
          {/* Left: album art + info */}
          <div
            className="flex items-center gap-3 min-w-0 cursor-pointer select-none"
            onClick={onClick}
          >
            <img
              src={album.cover}
              alt={album.title}
              className="w-9 h-9 rounded-md object-cover shadow-sm shrink-0"
            />
            <div className="min-w-0 hidden sm:block">
              <p className="text-sm font-medium dark:text-white truncate leading-snug">
                {track.title}
              </p>
              <p className="text-xs text-black/50 dark:text-white/40 truncate leading-snug">
                {album.artist}
              </p>
            </div>
          </div>

          {/* Center: lyric */}
          <div className="flex-1 min-w-0 text-center hidden sm:block px-4">
            {lyricText && (
              <motion.p
                key={lyricText}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="text-sm text-black/40 dark:text-white/40 truncate"
              >
                {lyricText}
              </motion.p>
            )}
          </div>

          {/* Right: controls + volume */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <motion.button
              onClick={onPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              className="p-1.5 text-black/35 dark:text-white/35 hover:text-black/70 dark:hover:text-white/70 transition-colors"
            >
              <SkipBack size={16} />
            </motion.button>
            <motion.button
              onClick={onTogglePlay}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="p-1.5 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-900"
            >
              {isPlaying ? (
                <Pause size={15} fill="currentColor" />
              ) : (
                <Play size={15} fill="currentColor" className="ml-0.5" />
              )}
            </motion.button>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              className="p-1.5 text-black/35 dark:text-white/35 hover:text-black/70 dark:hover:text-white/70 transition-colors"
            >
              <SkipForward size={16} />
            </motion.button>

            <div
              className="hidden sm:flex items-center gap-2 w-28 justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={onToggleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                className="text-black/35 dark:text-white/35 hover:text-black/70 dark:hover:text-white/70 transition-colors shrink-0"
              >
                {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </motion.button>
              <div
                className="group relative h-1 bg-black/10 dark:bg-white/10 rounded-full cursor-pointer w-20 touch-none"
                {...volumeBarProps}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gray-500 dark:bg-white/60 rounded-full pointer-events-none"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar — thin bottom edge */}
      <div
        className="h-[3px] cursor-pointer touch-none bg-black/[0.05] dark:bg-white/[0.05]"
        {...seekBarProps}
      >
        <div
          className="h-full bg-gray-700 dark:bg-white/90 transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}

function Turntable({ view, selected, isPlaying }: { view: View; selected: Album | null; isPlaying: boolean }) {
  const showCover = (view === 'detail' || view === 'playing' || isPlaying) && selected;

  return (
    <div className="relative w-64 h-64">
      <div className="absolute inset-0 rounded-full bg-[#1a1a1a] shadow-2xl"
           style={{
             background: 'radial-gradient(circle at 30% 30%, #2a2a2a, #1a1a1a 40%, #111 70%, #0a0a0a 100%)',
           }} />
      {[...Array(6)].map((_, i) => (
        <div key={i}
             className="absolute rounded-full border border-white/[0.03]"
             style={{ inset: `${16 + i * 20}px` }} />
      ))}
      {[...Array(80)].map((_, i) => (
        <div key={i}
             className="absolute w-[2px] h-[2px] rounded-full bg-white/[0.08]"
             style={{
               top: '50%', left: '50%',
               transform: `rotate(${i * 4.5}deg) translateY(-118px)`,
               transformOrigin: 'center center',
             }} />
      ))}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-400 shadow-inner z-10" />
      <div className="absolute top-[-12px] left-[-8px] z-20">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="10" cy="10" r="8" fill="#2a2a2a" stroke="#444" strokeWidth="0.5" />
          <line x1="10" y1="18" x2="40" y2="40" stroke="#c0c0c0" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="2" fill="#888" />
        </svg>
      </div>
      <AnimatePresence>
        {showCover && (
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: isPlaying ? 360 : 0 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{
              scale: springSnappy,
              rotate: isPlaying ? { duration: 12, repeat: Infinity, ease: 'linear' } : { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full shadow-2xl z-10 overflow-hidden"
          >
            <img src={selected.cover} alt={selected.title} className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniPlayer({
  album,
  currentTrack,
  currentTime,
  duration,
  volume,
  isMuted,
  isPlaying,
  seekBarProps,
  volumeBarProps,
  onToggleMute,
  onTogglePlay,
  onPrev,
  onNext,
  onClick,
}: {
  album: Album;
  currentTrack: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  seekBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  volumeBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  onToggleMute: () => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClick: () => void;
}) {
  const track = album.tracks[currentTrack];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="w-full bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark p-3 shadow-lg cursor-pointer"
    >
      <div onClick={onClick} className="flex items-center gap-3 mb-2">
        <img src={album.cover} alt={album.title} className="w-10 h-10 rounded-md object-cover shadow-sm shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold dark:text-white truncate">{track.title}</p>
          <p className="text-[10px] text-gray-400 truncate">{album.artist}</p>
        </div>
        <motion.button
          onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1.5 rounded-full bg-primary text-white shrink-0"
        >
          {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
        </motion.button>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <motion.div
          className="group relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer touch-none"
          {...seekBarProps}
        >
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full pointer-events-none"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none"
            style={{ left: `calc(${progress}% - 5px)` }}
          />
        </motion.div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400 tabular-nums">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-gray-400 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <motion.button onClick={onPrev} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-gray-400 hover:text-primary transition-colors">
            <SkipBack size={14} />
          </motion.button>
          <motion.button onClick={onNext} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-gray-400 hover:text-primary transition-colors">
            <SkipForward size={14} />
          </motion.button>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-[120px]">
          <motion.button onClick={onToggleMute} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-gray-400 hover:text-primary transition-colors shrink-0">
            {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </motion.button>
          <div className="group relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer flex-1 touch-none" {...volumeBarProps}>
            <div
              className="absolute inset-y-0 left-0 bg-gray-500 dark:bg-gray-400 rounded-full pointer-events-none"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RecordGrid({ albums: list, onSelect }: { albums: Album[]; onSelect: (a: Album) => void }) {
  if (list.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <p className="text-sm text-gray-300 dark:text-gray-600 italic">coming soon</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[620px] scrollbar-hide rounded-xl">
      <div className="grid grid-cols-2 gap-4 pr-1">
        {list.map((album, i) => (
          <motion.button
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springGentle, delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(album)}
            className="flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-border-dark hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <img src={album.cover} alt={album.title} className="w-16 h-16 rounded-lg object-cover shadow-sm shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold dark:text-white truncate">{album.title}</h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">{album.artist}</p>
              <p className="text-xs text-gray-400 mt-0.5">{album.tracks.length} 首</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function AlbumDetail({
  album,
  currentTrack,
  hoveredTrack,
  onHoverTrack,
  onTrackClick,
  onBack,
  onTogglePlay,
}: {
  album: Album;
  currentTrack: number;
  hoveredTrack: number | null;
  onHoverTrack: (i: number | null) => void;
  onTrackClick: (i: number) => void;
  onBack: () => void;
  onTogglePlay: () => void;
}) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-400" />
        </motion.button>
        <div className="flex-1">
          <h3 className="text-lg font-bold dark:text-white">{album.title}</h3>
          <p className="text-sm text-gray-400">{album.artist}</p>
        </div>
        <motion.button
          onClick={onTogglePlay}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Play size={16} /> Play
        </motion.button>
      </div>
      <div className="space-y-1">
        {album.tracks.map((track, i) => (
          <TrackRow
            key={i}
            index={i}
            track={track}
            isActive={currentTrack === i}
            isHovered={hoveredTrack === i}
            onHover={() => onHoverTrack(i)}
            onLeave={() => onHoverTrack(null)}
            onClick={() => onTrackClick(i)}
          />
        ))}
      </div>
    </div>
  );
}

function PlayerView({
  album,
  currentTrack,
  currentTime,
  duration,
  volume,
  isMuted,
  isPlaying,
  lyrics,
  seekBarProps,
  volumeBarProps,
  onToggleMute,
  onPrev,
  onNext,
  onTogglePlay,
  onBack,
  onTrackClick,
}: {
  album: Album;
  currentTrack: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  lyrics: LyricLine[];
  seekBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  volumeBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  onToggleMute: () => void;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onBack: () => void;
  onTrackClick: (i: number) => void;
}) {
  const track = album.tracks[currentTrack];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const lyricsRef = useRef<HTMLDivElement>(null);
  const prevLyricsRef = useRef<LyricLine[] | null>(null);
  const stableRef = useRef(-1);
  const hasLyrics = lyrics.length > 0;

  // Reset stable index when lyrics change (track switch)
  if (prevLyricsRef.current !== lyrics) {
    prevLyricsRef.current = lyrics;
    stableRef.current = -1;
  }

  const DEAD_FORWARD = 0.08;
  const DEAD_BACK = 0.12;

  if (hasLyrics) {
    const raw = lyrics.reduce((acc, line, i) => {
      if (currentTime >= line.time) return i;
      return acc;
    }, -1);
    const prev = stableRef.current;
    if (Math.abs(raw - prev) > 1) {
      // Seek/jump: snap directly
      stableRef.current = raw;
    } else if (raw > prev) {
      const nextLine = lyrics[prev + 1];
      if (nextLine && currentTime >= nextLine.time + DEAD_FORWARD) {
        stableRef.current = prev + 1;
      }
    } else if (raw < prev) {
      const curLine = lyrics[prev];
      if (curLine && currentTime < curLine.time - DEAD_BACK) {
        stableRef.current = Math.max(-1, prev - 1);
      }
    }
  }
  const currentLyricIndex = stableRef.current;

  useEffect(() => {
    if (!lyricsRef.current || !hasLyrics) return;
    const container = lyricsRef.current;
    const activeEl = container.querySelector(`[data-index="${currentLyricIndex}"]`) as HTMLElement | null;
    if (activeEl) {
      container.scrollTo({
        top: activeEl.offsetTop - container.clientHeight / 2 + activeEl.offsetHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [currentLyricIndex, hasLyrics]);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark p-6 min-h-[400px] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-400" />
        </motion.button>
        <div className="flex-1">
          <h3 className="text-lg font-bold dark:text-white">{album.title}</h3>
          <p className="text-sm text-gray-400">{album.artist}</p>
        </div>
      </div>

      <motion.div
        key={currentTrack}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springSnappy}
        className="flex items-center gap-3 mb-4 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50"
      >
        <img src={album.cover} alt={album.title} className="w-10 h-10 rounded-md object-cover shadow-sm shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold dark:text-white truncate">{track.title}</p>
          <p className="text-xs text-gray-400">{album.artist}</p>
        </div>
        <span className="text-xs text-gray-400 shrink-0 ml-auto">{track.duration}</span>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-3">
        <motion.div
          className="group relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer touch-none"
          {...seekBarProps}
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full pointer-events-none"
            style={{ width: `${progress}%` }}
            layout
            transition={springSnappy}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </motion.div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400 tabular-nums">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-gray-400 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Lyrics */}
      {hasLyrics && (
        <div
          ref={lyricsRef}
          className="flex-1 overflow-y-auto scrollbar-hide mb-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 py-2"
          style={{ maxHeight: '240px' }}
        >
          {lyrics.map((line, i) => {
            const isActive = i === currentLyricIndex;
            const isPast = i < currentLyricIndex;
            return (
              <motion.div
                key={i}
                data-index={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`px-6 py-1.5 text-center transition-all duration-300 ${
                  isActive
                    ? 'text-primary font-semibold text-base scale-105'
                    : isPast
                    ? 'text-gray-400 dark:text-gray-500 text-sm'
                    : 'text-gray-300 dark:text-gray-600 text-sm'
                }`}
              >
                {line.text}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mb-3">
        <motion.button onClick={onPrev} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="p-1.5 text-gray-400 hover:text-primary transition-colors">
          <SkipBack size={22} />
        </motion.button>
        <motion.button
          onClick={onTogglePlay}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          className="p-3.5 rounded-full bg-primary text-white shadow-lg"
        >
          {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" className="ml-0.5" />}
        </motion.button>
        <motion.button onClick={onNext} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="p-1.5 text-gray-400 hover:text-primary transition-colors">
          <SkipForward size={22} />
        </motion.button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-2 mb-3">
        <motion.button onClick={onToggleMute} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-gray-400 hover:text-primary transition-colors shrink-0">
          {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </motion.button>
        <div className="group relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer flex-1 touch-none" {...volumeBarProps}>
          <div
            className="absolute inset-y-0 left-0 bg-gray-500 dark:bg-gray-400 rounded-full pointer-events-none"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-500 dark:bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none"
            style={{ left: `calc(${isMuted ? 0 : volume * 100}% - 6px)` }}
          />
        </div>
      </div>

      {/* Tracklist */}
      <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-0.5 overflow-y-auto scrollbar-hide" style={{ maxHeight: hasLyrics ? '100px' : 'auto' }}>
        {album.tracks.map((t, i) => (
          <motion.button
            key={i}
            onClick={() => onTrackClick(i)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-2 py-1 rounded-lg text-left transition-colors ${
              i === currentTrack
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="text-xs w-5 text-right shrink-0">
              {i === currentTrack ? <Volume2 size={12} className="inline" /> : i + 1}
            </span>
            <span className={`text-xs flex-1 truncate ${i === currentTrack ? 'font-semibold text-primary' : ''}`}>
              {t.title}
            </span>
            <span className="text-[10px] opacity-60 shrink-0">{t.duration}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function TrackRow({
  index,
  track,
  isActive,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  index: number;
  track: Track;
  isActive: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave} className="relative">
      <motion.button
        onClick={onClick}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors text-left ${
          isActive
            ? 'bg-primary/10 text-primary'
            : isHovered
            ? 'bg-primary/5'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}
      >
        <span className="text-xs w-6 text-right shrink-0" style={{ color: isActive ? 'inherit' : '#94a3b8' }}>
          {isActive ? <Volume2 size={14} className="inline" /> : index + 1}
        </span>
        <span className={`text-sm flex-1 truncate ${isActive ? 'font-semibold' : 'font-medium dark:text-white'}`}>
          {track.title}
        </span>
        <span className="text-xs text-gray-400 shrink-0">{track.duration}</span>
      </motion.button>
      <AnimatePresence>
        {isHovered && track.description && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pl-12 pb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{track.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
