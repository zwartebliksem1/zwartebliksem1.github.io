import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Generate fake contribution data
function generateContributions() {
  const data = [];
  for (let week = 0; week < 52; week++) {
    for (let day = 0; day < 7; day++) {
      const value = Math.random();
      let level = 0;
      if (value > 0.3) level = 1;
      if (value > 0.5) level = 2;
      if (value > 0.7) level = 3;
      if (value > 0.85) level = 4;
      data.push({ week, day, level });
    }
  }
  return data;
}

const LEVEL_COLORS = [
  'bg-border/20',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/70',
  'bg-primary',
];

export default function ContributionHeatmap() {
  const { t } = useTranslation();
  const contributions = useMemo(() => generateContributions(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-16"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-xs text-primary tracking-[0.2em]">{t('contributions.title')}</span>
        <div className="flex-1 h-px bg-border/20" />
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-muted-foreground">{t('contributions.less')}</span>
          {LEVEL_COLORS.map((color, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-sm ${color}`} />
          ))}
          <span className="font-mono text-[10px] text-muted-foreground">{t('contributions.more')}</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-[3px]" style={{ minWidth: '720px' }}>
          {Array.from({ length: 52 }, (_, week) => (
            <div key={week} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }, (_, day) => {
                const cell = contributions.find(c => c.week === week && c.day === day);
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (week * 7 + day) * 0.0005, duration: 0.2 }}
                    className={`w-2.5 h-2.5 rounded-sm ${LEVEL_COLORS[cell?.level || 0]} hover:ring-1 hover:ring-accent/50 transition-all cursor-pointer`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}