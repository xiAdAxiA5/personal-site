import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

const springSnappy = { type: 'spring' as const, stiffness: 160, damping: 24, mass: 1 };

export interface SectionDef {
  id: string;
  label: string;
  icon: LucideIcon;
  btnBg: string;
  btnRing: string;
  bladeLight: string;
  bladeDark: string;
}

interface WindmillNavigatorProps {
  sections: SectionDef[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

// Icon positions at blade centers (as % of the 300px container)
// Blades point N/E/S/W; icon sits ~55% from center to tip
const iconSlots = [
  { x: '50%', y: '25%' },  // top
  { x: '75%', y: '50%' },  // right
  { x: '50%', y: '75%' },  // bottom
  { x: '25%', y: '50%' },  // left
];

export default function WindmillNavigator({
  sections,
  activeIndex,
  onSelect,
}: WindmillNavigatorProps) {
  const targetAngle = -activeIndex * 90;

  return (
    <div className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px]
      flex items-center justify-center">

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-6 rounded-full blur-3xl opacity-25"
        animate={{ backgroundColor: sections[activeIndex].bladeDark }}
        transition={{ duration: 0.6 }}
      />

      {/* Rotating layer: blades (SVG) + icons + hit areas */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: targetAngle }}
        transition={springSnappy}
        style={{ transformOrigin: 'center center' }}
      >
        {/* SVG blades */}
        <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <filter id="wm-glass4">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" />
            </filter>
          </defs>
          {sections.map((s, i) => {
            const isActive = i === activeIndex;
            const baseAngle = i * 90;
            return (
              <g key={s.id} transform={`rotate(${baseAngle} 150 150)`}>
                <path
                  d="M 150 150
                     C 126 80, 120 28, 150 6
                     C 180 28, 174 80, 150 150 Z"
                  fill={isActive ? s.bladeDark : undefined}
                  className={!isActive ? 'fill-slate-300/30 dark:fill-white/[0.03]' : ''}
                  fillOpacity={isActive ? 0.78 : undefined}
                  stroke={isActive ? 'rgba(255,255,255,0.14)' : undefined}
                  strokeWidth="1.2"
                  filter={isActive ? 'url(#wm-glass4)' : undefined}
                />
                {isActive && (
                  <path
                    d="M 150 150
                       C 136 94, 132 50, 150 22
                       C 168 50, 164 94, 150 150 Z"
                    fill="white" fillOpacity="0.05" pointerEvents="none"
                  />
                )}
              </g>
            );
          })}
          <circle cx="150" cy="150" r="34"
            className="fill-white dark:fill-[#121218]"
            stroke="rgba(148,163,184,0.16)" strokeWidth="1.5"
          />
          <circle cx="150" cy="150" r="6"
            className="fill-slate-400 dark:fill-white/20"
          />
        </svg>

        {/* Clickable icon buttons inside blades — no circle, just icon + hit area */}
        {sections.map((s, i) => {
          const isActive = i === activeIndex;
          const pos = iconSlots[i];
          const Icon = s.icon;

          return (
            <button
              key={s.id}
              onClick={() => onSelect(i)}
              className="absolute flex items-center justify-center
                -translate-x-1/2 -translate-y-1/2"
              style={{
                left: pos.x,
                top: pos.y,
                width: 64,
                height: 64,
              }}
            >
              <Icon
                size={28}
                strokeWidth={1.6}
                className={`md:size-[30px] transition-all duration-500 ${
                  isActive
                    ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                    : 'text-slate-500/60 dark:text-white/20'
                }`}
              />
            </button>
          );
        })}
      </motion.div>

      {/* Label */}
      <motion.p
        key={sections[activeIndex].id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute -bottom-1 left-1/2 -translate-x-1/2
          text-[11px] font-semibold tracking-widest uppercase
          text-slate-400 dark:text-white/40 whitespace-nowrap select-none"
      >
        {sections[activeIndex].label}
      </motion.p>
    </div>
  );
}
