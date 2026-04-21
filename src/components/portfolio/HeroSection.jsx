import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HERO_BG = "https://media.base44.com/images/public/69e72742f079a5923be33b6b/f7ee9b85f_generated_4a69f156.png";

// Placeholder data - replace with your own
const CONFIG = {
  name: "LUUK LOEF",
  tagline: "Full-Stack Developer // CEO of Lucone",
  github: "https://github.com/zwartebliksem1",
  linkedin: "https://www.linkedin.com/in/luuk-loef-40313025a/",
  email: "mailto:luukloef@hotmail.com",
};

// Simulated commit log
const COMMITS = [
  "feat: implement neural rendering pipeline",
  "fix: resolve async state race condition",
  "refactor: optimize graph traversal algorithm",
  "docs: update API reference for v3.0",
  "feat: add real-time collaboration engine",
  "chore: upgrade dependencies to latest",
  "feat: deploy distributed cache layer",
  "fix: memory leak in event listener pool",
  "refactor: modularize authentication flow",
  "feat: integrate WebSocket streaming API",
];

function TypingText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  return <>{displayed}<span className="inline-block animate-[pulse_1s_cubic-bezier(0.4,0,0.2,1)_infinite]">_</span></>;
}

function CommitStream() {
  const containerRef = useRef(null);
  const [commits, setCommits] = useState(COMMITS);

  useEffect(() => {
    const interval = setInterval(() => {
      setCommits(prev => {
        const newCommits = [...prev];
        newCommits.push(newCommits.shift());
        return [...newCommits];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden opacity-[0.04] font-mono text-sm pointer-events-none">
      {commits.map((commit, i) => (
        <div
          key={`${commit}-${i}`}
          className="whitespace-nowrap py-1"
          style={{ transform: `translateY(${i * 28}px)` }}
        >
          <span className="text-primary">$</span> git commit -m "{commit}"
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="./HERO_BG.png" alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <CommitStream />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="font-mono text-xs md:text-sm text-primary mb-6 tracking-[0.3em] uppercase">
            // PORTFOLIO_DEPLOY v1.0.0
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-mono font-bold text-foreground leading-none mb-8"
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
        >
          {CONFIG.name.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="inline-block transition-colors duration-200"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-mono text-sm md:text-base text-muted-foreground mb-12"
        >
          <TypingText text={t('hero.tagline')} delay={1500} />
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex items-center justify-center gap-6"
        >
          <a
            href={CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 border border-border/50 rounded-sm hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
          >
            <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
          </a>
          <a
            href={CONFIG.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 border border-border/50 rounded-sm hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
          >
            <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">LinkedIn</span>
          </a>
          <a
            href={CONFIG.email}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 border border-border/50 rounded-sm hover:border-primary/60 hover:bg-primary/5 transition-all duration-300"
          >
            <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">Email</span>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest">SCROLL</span>
        <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
      </motion.div>
    </section>
  );
}