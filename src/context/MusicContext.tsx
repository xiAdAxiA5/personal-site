import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { type Album, type Track } from '../data/music';

interface LyricLine { time: number; text: string }

interface MusicCtx {
  view: 'browsing' | 'detail' | 'playing';
  setView: (v: 'browsing' | 'detail' | 'playing') => void;
  selected: Album | null;
  setSelected: (a: Album | null) => void;
  currentTrack: number;
  setCurrentTrack: (i: number) => void;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  lyrics: LyricLine[];
  lyricText: string;
  headingVisible: boolean;
  setHeadingVisible: (v: boolean) => void;
  headingRef: any;
  playTrack: (track: Track) => void;
  handleTogglePlay: () => void;
  handleMiniTogglePlay: () => void;
  handleTrackClick: (index: number) => void;
  handlePrevTrack: () => void;
  handleNextTrack: () => void;
  handleToggleMute: () => void;
  handleSelect: (album: Album) => void;
  handleBack: () => void;
  handleClose: () => void;
  seekBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
  volumeBarProps: { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void };
}

const MusicContext = createContext<MusicCtx | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}

function parseLRC(raw: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const line of raw.split('\n')) {
    const match = line.match(/^\[(\d+)[:.]?(\d{2})[.](\d{2,3})\]/);
    if (match) {
      const mins = parseInt(match[1], 10);
      const secs = parseInt(match[2], 10);
      const frac = parseInt(match[3], 10);
      const hundredths = frac >= 100 ? frac / 10 : frac;
      const time = mins * 60 + secs + hundredths / 100;
      const text = line.slice(match[0].length).trim();
      if (text) lines.push({ time, text });
    }
  }
  return lines;
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<'browsing' | 'detail' | 'playing'>('browsing');
  const [selected, setSelected] = useState<Album | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [headingVisible, setHeadingVisible] = useState(true);
  const headingRef = useRef<any>(null);

  // Heading visibility — scroll-based check (more reliable than IntersectionObserver for tall sections)
  useEffect(() => {
    const check = () => {
      const el = headingRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight * 0.6;
      setHeadingVisible(visible);
    };
    window.addEventListener('scroll', check, { passive: true });
    check(); // initial check
    return () => window.removeEventListener('scroll', check);
  }, []);

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const dragRef = useRef<{ type: 'seek' | 'volume'; rect: DOMRect } | null>(null);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.3;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onVol = () => { setVolumeState(audio.volume); setIsMuted(audio.muted); };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('volumechange', onVol);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('volumechange', onVol);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  // Drag handlers
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const ratio = Math.max(0, Math.min(1, (e.clientX - drag.rect.left) / drag.rect.width));
      if (drag.type === 'seek') audioRef.current.currentTime = ratio * (audioRef.current.duration || 0);
      else { audioRef.current.volume = ratio; audioRef.current.muted = ratio === 0; }
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
    if (type === 'seek') audioRef.current.currentTime = ratio * (audioRef.current.duration || 0);
    else { audioRef.current.volume = ratio; audioRef.current.muted = ratio === 0; }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Lyrics
  useEffect(() => {
    if (!selected) return;
    const track = selected.tracks[currentTrack];
    if (!track.lrc) { setLyrics([]); return; }
    fetch(track.lrc).then(r => r.text()).then(raw => setLyrics(parseLRC(raw))).catch(() => setLyrics([]));
  }, [selected, currentTrack]);

  // Auto-advance
  useEffect(() => {
    const audio = audioRef.current;
    const onEnded = () => {
      if (!selected) return;
      const next = currentTrack + 1;
      if (next < selected.tracks.length) {
        setCurrentTrack(next);
        const track = selected.tracks[next];
        if (track.src) { audio.src = track.src; audio.play().catch(() => {}); }
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [selected, currentTrack]);

  // Cleanup on unmount
  useEffect(() => { return () => { audioRef.current.pause(); }; }, []);

  const playTrack = useCallback((track: Track) => {
    if (!track.src) return;
    const audio = audioRef.current;
    if (audio.src !== window.location.origin + track.src) audio.src = track.src;
    audio.play().catch(() => {});
  }, []);

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!selected) return;
    if (isPlaying) { audio.pause(); }
    else {
      if (!audio.src || audio.paused) playTrack(selected.tracks[currentTrack]);
      if (view !== 'playing') setView('playing');
    }
  };

  const handleMiniTogglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
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

  const handleToggleMute = () => { audioRef.current.muted = !audioRef.current.muted; };

  const handleSelect = (album: Album) => { setSelected(album); setView('detail'); setCurrentTrack(0); };
  const handleBack = () => { setView('browsing'); };

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

  const activeLyricIndex = lyrics.reduce((acc, line, i) => currentTime >= line.time ? i : acc, -1);
  const lyricText = lyrics[activeLyricIndex]?.text ?? '';

  const seekBarProps = { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => barPointerDown('seek', e) };
  const volumeBarProps = { onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => barPointerDown('volume', e) };

  return (
    <MusicContext.Provider value={{
      view, setView, selected, setSelected, currentTrack, setCurrentTrack,
      currentTime, duration, volume, isMuted, isPlaying,
      lyrics, lyricText, headingVisible, setHeadingVisible, headingRef,
      playTrack, handleTogglePlay, handleMiniTogglePlay, handleTrackClick,
      handlePrevTrack, handleNextTrack, handleToggleMute,
      handleSelect, handleBack, handleClose,
      seekBarProps, volumeBarProps,
    }}>
      {children}
    </MusicContext.Provider>
  );
}
