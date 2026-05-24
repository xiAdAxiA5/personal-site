import HeroSection from '../components/home/HeroSection';
import SocialMediaCards from '../components/home/SocialMediaCards';
import ExperienceTimeline from '../components/home/ExperienceTimeline';
import Books3D from '../components/home/Books3D';
import Music3D from '../components/home/Music3D';
import WatchSection from '../components/home/OperaRow';
import GameSection from '../components/home/GameRow';
import Contact from '../components/home/Contact';
import SectionSwitcher from '../components/ui/SectionSwitcher';
import { BookOpen, Music, Film, Gamepad2 } from 'lucide-react';
import type { SectionConfig } from '../components/ui/SectionSwitcher';

const sectionDefs: Omit<SectionConfig, 'content'>[] = [
  {
    id: 'books',
    label: 'Books',
    icon: BookOpen,
    btnBg: 'bg-amber-500',
    btnRing: 'ring-amber-400/40',
    bladeLight: '#d97706',
    bladeDark: '#f59e0b',
  },
  {
    id: 'music',
    label: 'Music',
    icon: Music,
    btnBg: 'bg-indigo-500',
    btnRing: 'ring-indigo-400/40',
    bladeLight: '#4f46e5',
    bladeDark: '#6366f1',
  },
  {
    id: 'watch',
    label: 'Watch',
    icon: Film,
    btnBg: 'bg-emerald-500',
    btnRing: 'ring-emerald-400/40',
    bladeLight: '#059669',
    bladeDark: '#10b981',
  },
  {
    id: 'games',
    label: 'Games',
    icon: Gamepad2,
    btnBg: 'bg-rose-500',
    btnRing: 'ring-rose-400/40',
    bladeLight: '#e11d48',
    bladeDark: '#f43f5e',
  },
];

export default function Home() {
  const sections: SectionConfig[] = [
    { ...sectionDefs[0], content: <Books3D /> },
    { ...sectionDefs[1], content: <Music3D /> },
    { ...sectionDefs[2], content: <WatchSection /> },
    { ...sectionDefs[3], content: <GameSection /> },
  ];

  return (
    <>
      <HeroSection />
      <SocialMediaCards />
      <div id="section-experience"><ExperienceTimeline /></div>
      <SectionSwitcher sections={sections} />
      <div id="section-contact"><Contact /></div>
    </>
  );
}
