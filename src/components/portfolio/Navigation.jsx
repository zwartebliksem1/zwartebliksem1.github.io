import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NAV_LINKS = [
  { key: 'origin', href: '#hero' },
  { key: 'archive', href: '#repos' },
  { key: 'identity', href: '#bio' },
  { key: 'stack', href: '#stack' },
  { key: 'commit', href: '#contact' },
];

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme === 'light' ? 'light' : 'dark';

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'nl' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-6 right-6 z-40 w-12 h-12 rounded-full border border-primary/40 bg-background/80 backdrop-blur-md flex items-center justify-center animate-pulse-glow"
      >
        <Menu className="w-5 h-5 text-primary" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-primary/40 flex items-center justify-center hover:bg-primary/10 transition-colors"
            >
              <X className="w-5 h-5 text-primary" />
            </button>

            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="font-mono text-3xl md:text-5xl font-light text-foreground/60 hover:text-accent transition-colors duration-300 py-2 group"
                >
                  <span className="text-primary/40 text-lg md:text-xl mr-4 group-hover:text-accent/60 transition-colors">//</span>
                  {t(`nav.${link.key}`)}
                </motion.a>
              ))}
            </nav>

            <div className="absolute bottom-8 left-8 font-mono text-xs text-muted-foreground">
              <span className="text-primary">SYS</span> // {t('menu.systemModule')}
            </div>

            <motion.button
              onClick={toggleTheme}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="absolute bottom-8 right-40 px-4 py-2 rounded-lg border border-primary/40 text-sm font-mono text-primary hover:bg-primary/10 transition-colors inline-flex items-center gap-2"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {theme === 'dark' ? t('theme.light') : t('theme.dark')}
            </motion.button>

            <motion.button
              onClick={toggleLanguage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-8 right-8 px-4 py-2 rounded-lg border border-primary/40 text-sm font-mono text-primary hover:bg-primary/10 transition-colors"
            >
              {i18n.language === 'en' ? t('language.dutch') : t('language.english')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}