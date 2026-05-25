import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WindmillNavigator, { type SectionDef } from './WindmillNavigator';

export interface SectionConfig extends SectionDef {
  content: ReactNode;
}

interface SectionSwitcherProps {
  sections: SectionConfig[];
}

const fadeIn = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.18, ease: [0.55, 0.06, 0.68, 0.19] } },
};

export default function SectionSwitcher({ sections }: SectionSwitcherProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setActiveIndex(((i % sections.length) + sections.length) % sections.length);
  }, [sections.length]);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Refs for windmill containers — native wheel to block page scroll
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // Native wheel listeners (passive: false so preventDefault works)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.deltaY > 0 ? goNext() : goPrev();
    };
    const sidebar = sidebarRef.current;
    const mobile = mobileRef.current;
    sidebar?.addEventListener('wheel', onWheel, { passive: false });
    mobile?.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      sidebar?.removeEventListener('wheel', onWheel);
      mobile?.removeEventListener('wheel', onWheel);
    };
  }, [goNext, goPrev]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  return (
    <div className="relative w-full
      flex flex-col md:flex-row items-start
      bg-bg-light dark:bg-bg-dark transition-colors duration-500">

      {/* ===== LEFT SIDEBAR: Windmill ===== */}
      <div
        ref={sidebarRef}
        className="hidden md:flex shrink-0 items-center justify-center
        w-[260px] lg:w-[300px] h-[calc(100vh-4.5rem)] sticky top-16
        border-r border-slate-200 dark:border-white/[0.04]">
        <WindmillNavigator
          sections={sections}
          activeIndex={activeIndex}
          onSelect={goTo}
        />
      </div>

      {/* ===== CONTENT AREA ===== */}
      <div className="flex-1 w-full relative">
        {/* Fade edges */}
        <div className="absolute inset-x-0 top-0 h-10 z-10
          bg-gradient-to-b from-bg-light dark:from-bg-dark to-transparent
          pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-10 z-10
          bg-gradient-to-t from-bg-light dark:from-bg-dark to-transparent
          pointer-events-none" />

        {/* === Left / Right arrow buttons === */}
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20
            p-2 rounded-xl
            bg-white/70 dark:bg-white/[0.04]
            border border-slate-200 dark:border-white/[0.06]
            text-slate-500 dark:text-white/40
            hover:text-slate-700 dark:hover:text-white/70
            hover:bg-white dark:hover:bg-white/[0.08]
            hover:shadow-md transition-all duration-300
            backdrop-blur-sm"
          aria-label="Previous section"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20
            p-2 rounded-xl
            bg-white/70 dark:bg-white/[0.04]
            border border-slate-200 dark:border-white/[0.06]
            text-slate-500 dark:text-white/40
            hover:text-slate-700 dark:hover:text-white/70
            hover:bg-white dark:hover:bg-white/[0.08]
            hover:shadow-md transition-all duration-300
            backdrop-blur-sm"
          aria-label="Next section"
        >
          <ChevronRight size={20} />
        </button>

        {/* Scrollable content */}
        <div className="px-10 md:px-14 lg:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={sections[activeIndex].id}
              {...fadeIn}
              className="flex items-center justify-center py-6"
            >
              {sections[activeIndex].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ===== MOBILE: Bottom nav ===== */}
      <div
        ref={mobileRef}
        className="md:hidden shrink-0 w-full
        flex items-center justify-center gap-4
        py-2 border-t border-slate-200 dark:border-white/[0.04]
        bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-md">
        {/* Mobile left/right arrows */}
        <button
          onClick={goPrev}
          className="p-2 rounded-xl
            bg-slate-100 dark:bg-white/[0.04]
            text-slate-400 dark:text-white/35
            active:scale-90 transition-all"
        >
          <ChevronLeft size={18} />
        </button>

        <WindmillNavigator
          sections={sections}
          activeIndex={activeIndex}
          onSelect={goTo}
        />

        <button
          onClick={goNext}
          className="p-2 rounded-xl
            bg-slate-100 dark:bg-white/[0.04]
            text-slate-400 dark:text-white/35
            active:scale-90 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ===== Dot indicators (both modes, at bottom of content) ===== */}
      <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2
        flex gap-2 z-20">
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-400
              ${i === activeIndex
                ? `w-5 h-1.5 ${sections[activeIndex].btnBg}`
                : 'w-1.5 h-1.5 bg-slate-300 dark:bg-white/15 hover:bg-slate-400 dark:hover:bg-white/30'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
