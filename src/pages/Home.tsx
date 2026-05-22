import HeroSection from '../components/home/HeroSection';
import SocialMediaCards from '../components/home/SocialMediaCards';
import ExperienceTimeline from '../components/home/ExperienceTimeline';
import ProjectsGrid from '../components/home/ProjectsGrid';
import TechStack from '../components/home/TechStack';
import LifeTimeChart from '../components/home/LifeTimeChart';
import Books3D from '../components/home/Books3D';
import OperaRow from '../components/home/OperaRow';
import Music3D from '../components/home/Music3D';
import TravelMap from '../components/home/TravelMap';
import Contact from '../components/home/Contact';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SocialMediaCards />
      <ExperienceTimeline />
      <ProjectsGrid />
      <TechStack />
      <LifeTimeChart />
      <Books3D />
      <OperaRow />
      <Music3D />
      <TravelMap />
      <Contact />
    </>
  );
}
