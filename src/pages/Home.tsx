import HeroSection from '../components/home/HeroSection';
import SocialMediaCards from '../components/home/SocialMediaCards';
import ExperienceTimeline from '../components/home/ExperienceTimeline';

import Books3D from '../components/home/Books3D';
import WatchSection from '../components/home/OperaRow';
import GameSection from '../components/home/GameRow';
import Music3D from '../components/home/Music3D';
import Contact from '../components/home/Contact';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SocialMediaCards />
      <div id="section-experience"><ExperienceTimeline /></div>

      <div id="section-books"><Books3D /></div>
      <div id="section-music"><Music3D /></div>
      <div id="section-watch"><WatchSection /></div>
      <div id="section-game"><GameSection /></div>
      <div id="section-contact"><Contact /></div>
    </>
  );
}
