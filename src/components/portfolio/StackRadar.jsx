import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const STACK_BG = "https://media.base44.com/images/public/69e72742f079a5923be33b6b/462781655_generated_252762b3.png";

// Placeholder data - replace with your own
const SKILL_TREE = [
  {
    name: "Frontend",
    level: "core",
    children: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Three.js"],
  },
  {
    name: "Backend",
    level: "core",
    children: ["Node.js", "Go", "Python", "Rust", "GraphQL"],
  },
  {
    name: "Infrastructure",
    level: "core",
    children: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD"],
  },
  {
    name: "Data",
    level: "core",
    children: ["PostgreSQL", "Redis", "MongoDB", "Kafka", "ElasticSearch"],
  },
  {
    name: "Tools",
    level: "core",
    children: ["Git", "Vim", "Linux", "Figma", "Prometheus"],
  },
];

function SkillNode({ skill, index, isActive, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      onClick={() => onClick(skill)}
      className={`
        relative px-3 py-1.5 font-mono text-xs border rounded-sm transition-all duration-300
        ${isActive
          ? 'border-accent text-accent bg-accent/10 shadow-[0_0_12px_rgba(0,245,255,0.15)]'
          : 'border-border/40 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5'
        }
      `}
    >
      {skill}
    </motion.button>
  );
}

function DependencyGroup({ group, index, activeSkill, onSkillClick }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {/* Package header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-primary/60 border border-primary" />
        <span className="font-mono text-sm font-semibold text-foreground tracking-wide">{t(`stack.${group.name.toLowerCase()}`)}</span>
        <div className="flex-1 h-px bg-border/20" />
        <span className="font-mono text-[10px] text-muted-foreground">{group.children.length} {t('stack.deps')}</span>
      </div>

      {/* Sub-dependencies */}
      <div className="flex flex-wrap gap-2 pl-6 border-l border-border/20">
        {group.children.map((skill, i) => (
          <SkillNode
            key={skill}
            skill={skill}
            index={i + index * 5}
            isActive={activeSkill === skill}
            onClick={onSkillClick}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function StackRadar() {
  const { t } = useTranslation();
  const [activeSkill, setActiveSkill] = useState(null);

  return (
    <section id="stack" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={STACK_BG} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 block">
            // 004
          </span>
          <h2 className="font-mono text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('stack.title')}<br />
            <span className="text-muted-foreground">RADAR_</span>
          </h2>
          <p className="font-sans text-base text-muted-foreground max-w-xl leading-relaxed">
            A dependency tree of tools, languages, and frameworks. Core packages at the root, 
            sub-dependencies branching out.
          </p>

          {activeSkill && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 border border-accent/30 bg-accent/5 rounded-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-mono text-xs text-accent">FILTER: {activeSkill}</span>
              <button
                onClick={() => setActiveSkill(null)}
                className="ml-2 font-mono text-[10px] text-muted-foreground hover:text-foreground"
              >
                [CLEAR]
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Dependency tree */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SKILL_TREE.map((group, i) => (
            <DependencyGroup
              key={group.name}
              group={group}
              index={i}
              activeSkill={activeSkill}
              onSkillClick={setActiveSkill}
            />
          ))}
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "LANGUAGES", value: "8+" },
            { label: "FRAMEWORKS", value: "12+" },
            { label: "YEARS EXP", value: "5+" },
            { label: "OPEN SOURCE", value: "30+" },
          ].map(stat => (
            <div key={stat.label} className="border border-border/30 rounded-sm p-5 text-center bg-card/40">
              <div className="font-mono text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}