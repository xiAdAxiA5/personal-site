import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { albums, type Album, type Track } from '../../data/music';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, X, ListMusic } from 'lucide-react';

type View = 'browsing' | 'detail' | 'playing';

const springSnappy = { type: 'spring' as const, stiffness: 250, damping: 30, mass: 1 };
const springGentle = { type: 'spring' as const, stiffness: 170, damping: 28, mass: 1 };
const springSlide = { type: 'spring' as const, stiffness: 200, damping: 28, mass: 1 };

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
  const [headingVisible, setHeadingVisible] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const dragRef = useRef<{ type: 'seek' | 'volume'; rect: DOMRect } | null>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeadingVisible(entry.isIntersecting),
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

  const handleClose = () => {
    audioRef.current.pause();
    audioRef.current.src = '';
    setSelected(null);
    setView('browsing');
    setLyrics([]);
    setDuration(0);
    setCurrentTime(0);
    setCurrentTrack(0);
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

  const autoPlayed = useRef(false);

  // Auto-play 最后的水族馆 on first visit
  useEffect(() => {
    if (autoPlayed.current) return;
    autoPlayed.current = true;
    const aquarium = albums.find((a) => a.id === 'jude-aquarium');
    if (!aquarium || !aquarium.tracks[0].src) return;
    setSelected(aquarium);
    setCurrentTrack(0);
    const audio = audioRef.current;
    audio.src = aquarium.tracks[0].src!;
    audio.play().then(() => {
      // success
    }).catch(() => {
      // Browser blocked autoplay — retry on first user click anywhere
      const retry = () => {
        audio.play().catch(() => {});
        document.removeEventListener('click', retry);
      };
      document.addEventListener('click', retry, { once: true });
    });
  }, []);

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
  const currentLyricDuration =
    activeLyricIndex >= 0 && activeLyricIndex < lyrics.length - 1
      ? lyrics[activeLyricIndex + 1].time - lyrics[activeLyricIndex].time
      : duration - (lyrics[activeLyricIndex]?.time ?? 0);

  const showTopBar = hasAudio && selected && (view === 'browsing' || !headingVisible);

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
            lyricDuration={currentLyricDuration}
            seekBarProps={seekBarProps}
            volumeBarProps={volumeBarProps}
            onToggleMute={handleToggleMute}
            onTogglePlay={handleMiniTogglePlay}
            onPrev={handlePrevTrack}
            onNext={handleNextTrack}
            onClick={() => { setView('playing'); }}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
      <section className="pt-[76px] pb-[76px] px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springGentle}
          className="text-3xl md:text-4xl font-bold text-center mb-[95px]"
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
  lyricDuration,
  seekBarProps,
  volumeBarProps,
  onToggleMute,
  onTogglePlay,
  onPrev,
  onNext,
  onClick,
  onClose,
}: {
  album: Album;
  currentTrack: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  lyricText: string;
  lyricDuration: number;
  seekBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  volumeBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  onToggleMute: () => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClick: () => void;
  onClose: () => void;
}) {
  const track = album.tracks[currentTrack];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 1.5 }}
      className="fixed top-[72px] left-4 right-4 z-40 flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl backdrop-saturate-[180%] rounded-xl shadow-lg border border-black/[0.06] dark:border-white/[0.08] overflow-hidden w-full max-w-xl">
        <div className="flex items-center gap-3 px-3 h-12">
          <img
            src={album.cover}
            alt={album.title}
            className="w-8 h-8 rounded-md object-cover shadow-sm shrink-0 cursor-pointer"
            onClick={onClick}
          />
          <div className="min-w-0 cursor-pointer" onClick={onClick}>
            <p className="text-sm font-medium dark:text-white truncate leading-tight">
              {track.title}
            </p>
            <p className="text-[11px] text-black/40 dark:text-white/30 truncate leading-tight">
              {album.artist}
            </p>
          </div>

          {/* Lyric — scrolls at song tempo */}
          <LyricLine text={lyricText} duration={lyricDuration} />

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <motion.button onClick={onPrev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
              className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
              <SkipBack size={15} />
            </motion.button>
            <motion.button onClick={onTogglePlay} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}
              className="p-1.5 rounded-full bg-gray-800 dark:bg-white text-white dark:text-gray-900">
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </motion.button>
            <motion.button onClick={onNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
              className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
              <SkipForward size={15} />
            </motion.button>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <motion.button onClick={onToggleMute} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
              className="text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </motion.button>
            <div className="relative h-[3px] bg-black/8 dark:bg-white/8 rounded-full cursor-pointer w-14 touch-none" {...volumeBarProps}>
              <div className="absolute inset-y-0 left-0 bg-gray-500 dark:bg-white/50 rounded-full pointer-events-none"
                style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
            </div>
          </div>

          {/* Close */}
          <motion.button onClick={(e) => { e.stopPropagation(); onClose(); }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}
            className="p-1 text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors shrink-0">
            <X size={14} />
          </motion.button>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] cursor-pointer touch-none bg-black/[0.04] dark:bg-white/[0.04]" {...seekBarProps}>
          <div className="h-full bg-gray-600 dark:bg-white/70 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }} />
        </div>
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

function LyricLine({ text, duration }: { text: string; duration: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [animStyle, setAnimStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const c = containerRef.current;
    const t = textRef.current;
    if (!c || !t) return;
    const over = t.offsetWidth > c.offsetWidth;
    setOverflow(over);
    if (!over) return;

    const distance = t.offsetWidth - c.offsetWidth + 24;
    const dur = duration > 0 ? duration : text.length * 0.3;
    const name = `ls-${text.length}-${Math.round(distance)}`;

    // Inject keyframes
    const styleId = `style-${name}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes ${name} {
          0% { transform: translateX(0); }
          12% { transform: translateX(0); }
          88% { transform: translateX(-${distance}px); }
          100% { transform: translateX(-${distance}px); }
        }
      `;
      document.head.appendChild(style);
    }

    setAnimStyle({
      display: 'inline-block',
      animation: `${name} ${dur}s linear infinite`,
    });
  }, [text, duration]);

  if (!text) return <div className="flex-1 min-w-0 hidden sm:block" />;

  return (
    <div ref={containerRef} className="flex-1 min-w-0 hidden sm:block overflow-hidden">
      <motion.div
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="whitespace-nowrap text-xs text-black/40 dark:text-white/40"
        style={overflow ? animStyle : { display: 'block', textAlign: 'center' }}
      >
        <span ref={textRef}>{text}</span>
      </motion.div>
    </div>
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
        {list.map((album, i) => {
          const hasAudio = album.tracks.some((t) => t.src);
          const isPlaylist = album.type === 'playlist';
          const isHero = i === 0 && hasAudio && !isPlaylist;

          if (isPlaylist) {
            return (
              <motion.button
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springGentle, delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(album)}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-light/40 dark:bg-surface-dark/40 border border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-surface-light/60 dark:hover:bg-surface-dark/60 transition-all text-left cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <ListMusic size={18} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium dark:text-white truncate">{album.title}</h3>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{album.artist} · {album.tracks.length} 首</p>
                </div>
              </motion.button>
            );
          }

          if (isHero) {
            return (
              <motion.button
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springGentle, delay: i * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(album)}
                className="col-span-2 flex items-center gap-5 p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all text-left cursor-pointer"
              >
                <img src={album.cover} alt={album.title} className="w-24 h-24 rounded-xl object-cover shadow-md shrink-0" />
                <div className="min-w-0">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">可播放</span>
                  <h3 className="text-lg font-bold dark:text-white mt-1 truncate">{album.title}</h3>
                  <p className="text-sm text-gray-400 truncate mt-0.5">{album.artist}</p>
                  <p className="text-xs text-gray-400 mt-1">{album.tracks.length} 首</p>
                </div>
              </motion.button>
            );
          }

          return (
          <motion.button
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springGentle, delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(album)}
            className={`flex items-center gap-4 p-3 rounded-xl border transition-shadow text-left cursor-pointer ${
              hasAudio
                ? 'bg-surface-light dark:bg-surface-dark border-gray-100 dark:border-border-dark hover:shadow-md'
                : 'bg-surface-light dark:bg-surface-dark border-gray-100 dark:border-border-dark hover:shadow-md'
            }`}
          >
            <img src={album.cover} alt={album.title} className="w-16 h-16 rounded-lg object-cover shadow-sm shrink-0" />
            <div className="min-w-0">
              <h3 className={`text-sm font-semibold truncate ${hasAudio ? 'dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{album.title}</h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">{album.artist}</p>
              <p className="text-xs mt-0.5 flex items-center gap-1">
                <span className={hasAudio ? 'text-gray-400' : 'text-gray-400 dark:text-gray-400'}>{album.tracks.length} 首</span>
                {hasAudio && <span className="px-1 py-px rounded text-[9px] font-medium bg-primary/10 text-primary">可播</span>}
                {!hasAudio && <span className="px-1 py-px rounded text-[9px] text-gray-400 dark:text-gray-400 border border-gray-300 dark:border-gray-600">暂无版权</span>}
              </p>
            </div>
          </motion.button>
        )})}
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
      <div className="flex items-center gap-3 mb-[95px]">
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
        className="flex items-center gap-3 mb-[95px] p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50"
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
        {album.tracks.map((t, i) => {
          const canPlay = !!t.src;
          return (
          <motion.button
            key={i}
            onClick={canPlay ? () => onTrackClick(i) : undefined}
            whileHover={canPlay ? { x: 4 } : undefined}
            whileTap={canPlay ? { scale: 0.98 } : undefined}
            className={`w-full flex items-center gap-3 px-2 py-1 rounded-lg text-left transition-colors ${
              !canPlay
                ? 'cursor-default hover:bg-gray-50 dark:hover:bg-gray-800/50'
                : i === currentTrack
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
            {canPlay ? (
              <span className="text-[10px] opacity-60 shrink-0">{t.duration}</span>
            ) : (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">暂无</span>
            )}
          </motion.button>
        )})}
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
  const hasSrc = !!track.src;

  return (
    <div onMouseEnter={hasSrc ? onHover : undefined} onMouseLeave={hasSrc ? onLeave : undefined} className="relative">
      <motion.button
        onClick={hasSrc ? onClick : undefined}
        whileHover={hasSrc ? { x: 4 } : undefined}
        whileTap={hasSrc ? { scale: 0.98 } : undefined}
        className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors text-left ${
          !hasSrc
            ? 'cursor-default hover:bg-gray-50 dark:hover:bg-gray-800/50'
            : isActive
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
        {hasSrc ? (
          <span className="text-xs text-gray-400 shrink-0">{track.duration}</span>
        ) : (
          <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">暂无</span>
        )}
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
