import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RepoCard from './RepoCard';

/**
 * @typedef {Object} ProjectItem
 * @property {string} name
 * @property {string} descriptionKey
 * @property {string} language
 * @property {string[]} techStack
 * @property {string[]} images
 * @property {number} stars
 * @property {number} forks
 * @property {string} lastCommit
 * @property {string} url
 * @property {string | null} liveUrl
 */

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'zwartebliksem1';
const REPO_LIMIT = 24;

/** @type {ProjectItem[]} */
const PROJECTS_DATA = [
  {
    name: 'Lucone Platform',
    descriptionKey: 'luconePlatform',
    language: 'TypeScript',
    techStack: ['TypeScript', 'React', 'Node.js'],
    images: [],
    stars: 0,
    forks: 0,
    lastCommit: '2d ago',
    url: '#',
    liveUrl: null,
  },
  {
    name: 'Kas tel app',
    descriptionKey: 'kasTelApp',
    language: 'C#',
    techStack: ['C#', 'FastAPI', 'React'],
    images: [],
    stars: 0,
    forks: 0,
    lastCommit: '3w ago',
    url: '#',
    liveUrl: null,
  },
  {
    name: 'Storage Tracker',
    descriptionKey: 'storageTracker',
    language: 'JavaScript',
    techStack: ['JavaScript', 'Vite'],
    images: [],
    stars: 0,
    forks: 0,
    lastCommit: '1w ago',
    url: '#',
    liveUrl: null,
  },
  {
    name: 'Minecraft Plugins',
    descriptionKey: 'minecraftPlugins',
    language: 'Java',
    techStack: ['Java', 'Spigot API'],
    images: [],
    stars: 0,
    forks: 0,
    lastCommit: '1m ago',
    url: '#',
    liveUrl: null,    
  },
  {
    name: 'Matchfinderrz',
    descriptionKey: 'matchfinderrz',
    language: 'C#',
    techStack: ['C#'],
    images: [],
    stars: 0,
    forks: 0,
    lastCommit: '2m ago',
    url: '#',
    liveUrl: null,    
  },
  {
    name: 'Social Media Calendar',
    descriptionKey: 'socialMediaCalendar',
    language: 'JavaScript',
    techStack: ['JavaScript', 'Next.js'],
    images: [],
    stars: 0,
    forks: 0,
    lastCommit: '2m ago',
    url: '#',
    liveUrl: null,    
  }
];

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
  const scrollRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const projectsScrollRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(/** @type {ProjectItem | null} */ (null));

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

  /** @param {number} dir */
  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 440, behavior: 'smooth' });
    }
  };

  /** @param {number} dir */
  const scrollProjects = (dir) => {
    if (projectsScrollRef.current) {
      projectsScrollRef.current.scrollBy({ left: dir * 440, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!selectedProject) return;

    /** @param {KeyboardEvent} e */
    const onEscape = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [selectedProject]);

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
        className="flex gap-6 overflow-x-auto px-6 md:px-20 pb-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {(isLoading ? [] : displayRepos).map((repo, i) => (
          <RepoCard key={repo.name} repo={repo} index={i} />
        ))}
      </div>

      {/* Projects sub-section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 block">
            // PROJECTS
          </span>
          <h2 className="font-mono text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('projects.title')}<br />
            <span className="text-muted-foreground">VAULT_</span>
          </h2>
          <p className="font-sans text-base text-muted-foreground max-w-xl leading-relaxed">
            {t('projects.scrollHint')}
          </p>
        </motion.div>
      </div>

      {/* Projects scroll controls */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex gap-3 mb-6">
        <button
          onClick={() => scrollProjects(-1)}
          className="w-10 h-10 border border-border/50 rounded-sm flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => scrollProjects(1)}
          className="w-10 h-10 border border-border/50 rounded-sm flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Projects horizontal scrolling cards */}
      <div
        ref={projectsScrollRef}
        className="flex gap-6 overflow-x-auto px-6 md:px-20 pb-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PROJECTS_DATA.map((project, i) => (
          <RepoCard
            key={project.name}
            repo={{
              ...project,
              description: t(`projects.items.${project.descriptionKey}`),
              readMoreLabel: t('projects.readMore'),
              onReadMore: () => setSelectedProject(project),
            }}
            index={i}
            hover={false}
            redirect={false}
          />
        ))}
      </div>

      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl max-h-[88vh] overflow-y-auto border border-border/50 bg-card rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-border/40 bg-card/95 backdrop-blur-sm">
              <h3 className="font-mono text-lg text-foreground">{selectedProject.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-3 py-1.5 font-mono text-xs border border-border/60 text-muted-foreground rounded-sm hover:text-primary hover:border-primary/40 transition-colors"
              >
                {t('projects.close')}
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-5">
              <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
                {t(`projects.items.${selectedProject.descriptionKey}`)}
              </p>

              <p className="font-sans text-sm md:text-base text-foreground leading-relaxed whitespace-pre-line">
                {t(`projects.details.${selectedProject.descriptionKey}`)}
              </p>

              {Array.isArray(selectedProject.images) && selectedProject.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.images.map((src) => (
                    <img
                      key={`${selectedProject.name}-${src}`}
                      src={src}
                      alt={`${selectedProject.name} visual`}
                      className="w-full h-48 object-cover border border-border/40 rounded-sm"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Source line decoration */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-border/10 hidden md:block" />
    </section>
  );
}