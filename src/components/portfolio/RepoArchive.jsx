import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RepoCard from './RepoCard';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'zwartebliksem1';
const REPO_LIMIT = 24;

const ALLOWED_REPOS = [
  'Bussen',
  'Vingeren',
  'Buddies',
  'SoundSnap',
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

        setRepos(mapped.length ? mapped : []);
      } catch {
        setRepos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepos();

    return () => {
      controller.abort();
    };
  }, []);

  const displayRepos = useMemo(() => (repos.length ? repos : []), [repos]);

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
        {(isLoading ? [] : displayRepos).map((repo, i) => (
          <RepoCard key={repo.name} repo={repo} index={i} />
        ))}
      </div>

      {/* Source line decoration */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-border/10 hidden md:block" />
    </section>
  );
}