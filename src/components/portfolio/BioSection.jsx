import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Heart, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PORTRAIT_IMG = "https://media.base44.com/images/public/69e72742f079a5923be33b6b/ec73291ae_generated_9c760ecf.png";

const MODULES = [
  { icon: Briefcase, titleKey: 'bio.experience', itemsKey: 'bio.modules.experience' },
  { icon: GraduationCap, titleKey: 'bio.education', itemsKey: 'bio.modules.education' },
  { icon: Heart, titleKey: 'bio.philosophy', itemsKey: 'bio.modules.philosophy' },
];

function LifeModule({ module, index }) {
  const Icon = module.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 border border-primary/40 rounded-sm flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-mono text-sm font-semibold tracking-[0.2em] text-primary">{module.title}</h3>
      </div>

      <div className="space-y-6 pl-4 border-l border-border/30">
        {module.items.map((item, i) => (
          <div key={i} className="relative pl-6">
            <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-primary/40" />
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 mb-1">
              <h4 className="font-sans text-base font-semibold text-foreground">{item.role}</h4>
              {item.org && (
                <span className="font-mono text-xs text-accent">{item.org}</span>
              )}
            </div>
            {item.period && (
              <span className="font-mono text-[11px] text-muted-foreground block mb-2">{item.period}</span>
            )}
            {item.detail && (
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function BioSection() {
  const { t } = useTranslation();
  const getModuleItems = (itemsKey) => {
    const items = t(itemsKey, { returnObjects: true });
    return Array.isArray(items) ? items : [];
  };

  return (
    <section id="bio" className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 block">
            // 003
          </span>
          <h2 className="font-mono text-4xl md:text-6xl font-bold text-foreground">
            {t('bio.sectionTitleTop')}<br />
            <span className="text-muted-foreground">{t('bio.sectionTitleBottom')}</span>
          </h2>
        </motion.div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left - Sticky portrait */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-sm border border-border/30">
                  <img
                    src={PORTRAIT_IMG}
                    alt="Portrait"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                {/* Info overlay */}
                <div className="mt-6 space-y-3">
                  <h3 className="font-mono text-xl font-bold text-foreground">{t('bio.headline')}</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-xs text-muted-foreground">{t('bio.location')}</span>
                  </div>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {t('bio.summary')}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right - Life modules */}
          <div className="lg:col-span-8">
            {MODULES.map((moduleConfig, index) => (
              <LifeModule
                key={moduleConfig.titleKey}
                module={{
                  icon: moduleConfig.icon,
                  title: t(moduleConfig.titleKey),
                  items: getModuleItems(moduleConfig.itemsKey),
                }}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Source line decoration */}
      <div className="absolute right-12 top-0 bottom-0 w-px bg-border/10 hidden md:block" />
    </section>
  );
}