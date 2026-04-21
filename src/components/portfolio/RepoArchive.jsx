import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RepoCard from './RepoCard';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'zwartebliksem1';
const REPO_LIMIT = 24;

// Only repos listed here will appear in the archive. Keep this in sync with your GitHub repos.
const ALLOWED_REPOS = [
  'zwartebliksem1.github.io',
  'Bussen',
  'Vingeren',
  'Buddies',
  'SoundSnap',
];

// Placeholder repos - replace with your own
const REPOS = [
  {
    name: "neural-render-engine",
    description: "A high-performance neural rendering engine built for real-time 3D scene reconstruction using WebGPU and custom shaders.",
    language: "TypeScript",
    techStack: ["TypeScript", "React", "Rust"],
    stars: 234,
    forks: 45,
    lastCommit: "2d ago",
    url: "https://github.com/yourusername/neural-render-engine",
    liveUrl: "https://neural-render.demo.dev",
  },
  {
    name: "distributed-cache",
    description: "A distributed in-memory cache with automatic sharding, replication, and consistency guarantees for microservice architectures.",
    language: "Go",
    techStack: ["Go", "Python"],
    stars: 891,
    forks: 123,
    lastCommit: "5d ago",
    url: "https://github.com/yourusername/distributed-cache",
    liveUrl: null,
  },
  {
    name: "quantum-css",
    description: "A utility-first CSS framework with quantum-inspired naming conventions and built-in design token management.",
    language: "JavaScript",
    techStack: ["JavaScript", "React"],
    stars: 1420,
    forks: 287,
    lastCommit: "1d ago",
    url: "https://github.com/yourusername/quantum-css",
    liveUrl: "https://quantum-css.dev",
  },
  {
    name: "realtime-collab",
    description: "Real-time collaborative document editing engine with conflict-free replicated data types (CRDTs) and WebSocket streaming.",
    language: "TypeScript",
    techStack: ["TypeScript", "React", "Python"],
    stars: 567,
    forks: 89,
    lastCommit: "3d ago",
    url: "https://github.com/yourusername/realtime-collab",
    liveUrl: "https://collab.demo.dev",
  },
  {
    name: "ml-pipeline",
    description: "End-to-end machine learning pipeline with automated feature engineering, model selection, and deployment orchestration.",
    language: "Python",
    techStack: ["Python", "Go"],
    stars: 345,
    forks: 56,
    lastCommit: "1w ago",
    url: "https://github.com/yourusername/ml-pipeline",
    liveUrl: null,
  },
  {
    name: "micro-runtime",
    description: "Ultra-lightweight container runtime optimized for serverless workloads with sub-millisecond cold start times.",
    language: "Rust",
    techStack: ["Rust", "Go"],
    stars: 2100,
    forks: 340,
    lastCommit: "12h ago",
    url: "https://github.com/yourusername/micro-runtime",
    liveUrl: null,
  },
];

function formatRelativeTime(isoDate) {
  const deltaMs = Date.now() - new Date(isoDate).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;

  if (deltaMs < dayMs) {
    const hours = Math.max(1, Math.floor(deltaMs / hourMs));
    return `${hours}h ago`;
  }

  const days = Math.floor(deltaMs / dayMs);
  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export default function RepoArchive() {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=${REPO_LIMIT}&type=owner`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/vnd.github+json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API request failed: ${response.status}`);
        }

        const data = await response.json();
        const mapped = data
          .filter((repo) => !repo.fork && ALLOWED_REPOS.includes(repo.name))
          .map((repo) => {
            const primaryLanguage = repo.language || 'Code';
            return {
              name: repo.name,
              description: repo.description || 'No description provided.',
              language: primaryLanguage,
              techStack: [primaryLanguage],
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              lastCommit: formatRelativeTime(repo.pushed_at),
              url: repo.html_url,
              liveUrl: `https://zwartebliksem1.github.io/${repo.name}`,
            };
          });

        setRepos(mapped.length ? mapped : REPOS);
      } catch {
        setRepos(REPOS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();

    return () => {
      controller.abort();
    };
  }, []);

  const displayRepos = useMemo(() => (repos.length ? repos : REPOS), [repos]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 440, behavior: 'smooth' });
    }
  };

  return (
    <section id="repos" className="relative py-32 overflow-hidden">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 block">
            // 002
          </span>
          <h2 className="font-mono text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('repos.title')}<br />
            <span className="text-muted-foreground">ARCHIVE_</span>
          </h2>
          <p className="font-sans text-base text-muted-foreground max-w-xl leading-relaxed">
            {t('repos.scrollHint')}
          </p>
        </motion.div>
      </div>

      {/* Scroll controls */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex gap-3 mb-6">
        <button
          onClick={() => scroll(-1)}
          className="w-10 h-10 border border-border/50 rounded-sm flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => scroll(1)}
          className="w-10 h-10 border border-border/50 rounded-sm flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Horizontal scrolling cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {(isLoading ? REPOS : displayRepos).map((repo, i) => (
          <RepoCard key={repo.name} repo={repo} index={i} />
        ))}
      </div>

      {/* Source line decoration */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-border/10 hidden md:block" />
    </section>
  );
}