import HeroSection from '../components/home/HeroSection';
import SocialMediaCards from '../components/home/SocialMediaCards';
import ExperienceTimeline from '../components/home/ExperienceTimeline';
import LifeTimeChart from '../components/home/LifeTimeChart';
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
      <ExperienceTimeline />
      <LifeTimeChart />
      <Books3D />
      <Music3D />
      <WatchSection />
      <GameSection />
      <Contact />
    </>
  );
}
