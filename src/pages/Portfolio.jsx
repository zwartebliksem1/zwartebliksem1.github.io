import ParticleSystem from '../components/portfolio/ParticleSystem';
import Navigation from '../components/portfolio/Navigation';
import GridLines from '../components/portfolio/GridLines';
import HeroSection from '../components/portfolio/HeroSection';
import ContributionHeatmap from '../components/portfolio/ContributionHeatmap';
import RepoArchive from '../components/portfolio/RepoArchive';
import BioSection from '../components/portfolio/BioSection';
import StackRadar from '../components/portfolio/StackRadar';
import ContactTerminal from '../components/portfolio/ContactTerminal';

export default function Portfolio() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleSystem />
      <Navigation />
      <GridLines />
      <main className="relative z-10">
        <HeroSection />
        {/* <ContributionHeatmap /> */}
        <RepoArchive />
        <BioSection />
        <StackRadar />
        <ContactTerminal />
      </main>
    </div>
  );
}
