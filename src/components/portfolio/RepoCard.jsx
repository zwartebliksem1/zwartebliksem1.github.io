import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Clock, ExternalLink, Code2 } from 'lucide-react';

/**
 * @typedef {Object} RepoCardModel
 * @property {string} name
 * @property {string} description
 * @property {string} language
 * @property {string[]} techStack
 * @property {string} [url]
 * @property {string | null} [liveUrl]
 * @property {() => void} [onReadMore]
 * @property {string} [readMoreLabel]
 */

/**
 * @typedef {Object} RepoCardProps
 * @property {RepoCardModel} repo
 * @property {number} index
 * @property {boolean} [hover]
 * @property {boolean} [redirect]
 */

const LANG_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Rust: '#DEA584',
  Go: '#00ADD8',
  React: '#61DAFB',
  'C++': '#00599C',
  Java: '#ED8B00',
  Ruby: '#CC342D',
  Swift: '#FA7343',
};

/** @param {RepoCardProps} props */
export default function RepoCard({ repo, index, hover = true, redirect = true }) {
  const [hovered, setHovered] = useState(false);

  const langColor = LANG_COLORS[/** @type {keyof typeof LANG_COLORS} */ (repo.language)] || '#2E7BFF';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      className="group relative min-w-[320px] md:min-w-[400px] border border-border/40 bg-card/60 backdrop-blur-sm rounded-sm overflow-hidden hover:border-primary/50 transition-all duration-500"
    >
      {/* Glitch overlay on hover */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0 pointer-events-none"
        />
      )}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
          <span className="font-mono text-xs text-muted-foreground">{repo.language}</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {String(index + 1).padStart(3, '0')}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-mono text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {repo.name}
          </h3>
          {redirect && (
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-sm hover:bg-primary/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </a>
          )}
        </div>

        {/* Language signature bar */}
        <div className="flex gap-1 mb-5 h-1 rounded-full overflow-hidden bg-border/20">
          {repo.techStack.map((tech, i) => (
            <div
              key={tech}
              className="h-full transition-all duration-500"
              style={{
                backgroundColor: LANG_COLORS[/** @type {keyof typeof LANG_COLORS} */ (tech)] || langColor,
                width: `${100 / repo.techStack.length}%`,
                opacity: hovered ? 1 : 0.5,
              }}
            />
          ))}
        </div>

        <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">
          {repo.description}
        </p>


        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {repo.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 font-mono text-[10px] border border-border/50 text-muted-foreground rounded-sm hover:border-primary/40 hover:text-primary/80 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {repo.onReadMore && (
          <button
            type="button"
            onClick={repo.onReadMore}
            className="w-full px-3 py-2 font-mono text-xs border border-primary/40 text-primary rounded-sm hover:bg-primary/10 transition-colors"
          >
            {repo.readMoreLabel || 'Read more'}
          </button>
        )}

        {/* Stats */}
        {/* <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3 h-3" />
            <span>{repo.forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{repo.lastCommit}</span>
          </div>
        </div> */}
      </div>

      {/* Hover expansion - live link */}
      {hover && (
        <motion.div
          initial={false}
          animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 overflow-hidden border-t border-border/30"
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-accent" />
              <span className="font-mono text-xs text-accent">DEPLOY PREVIEW</span>
          </div>
          {repo.liveUrl && (
            <a
              href={repo.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-primary hover:text-accent transition-colors underline underline-offset-2"
            >
              View Live →
            </a>
          )}
        </div>
      </motion.div>
      )}
    </motion.div>
  );
}