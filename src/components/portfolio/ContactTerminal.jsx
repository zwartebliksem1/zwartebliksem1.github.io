import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ContactTerminal() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t('contact.allFieldsRequired'));
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success(t('contact.sendSuccess'));
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="relative py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3 block">
            // 005
          </span>
          <h2 className="font-mono text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('contact.title')}<br />
            <span className="text-muted-foreground">TO CONTACT_</span>
          </h2>
        </motion.div>

        {/* Terminal form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-border/40 rounded-sm bg-card/60 backdrop-blur-sm overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30 bg-card/80">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">~/contact — push</span>
            </div>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="font-mono text-xs text-muted-foreground mb-2 block">
                <span className="text-primary">$</span> {t('contact.nameLabel')}
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('contact.namePlaceholder')}
                className="bg-background/50 border-border/40 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-muted-foreground mb-2 block">
                <span className="text-primary">$</span> {t('contact.emailLabel')}
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t('contact.emailPlaceholder')}
                className="bg-background/50 border-border/40 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-muted-foreground mb-2 block">
                <span className="text-primary">$</span> {t('contact.messageLabel')}
              </label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t('contact.messagePlaceholder')}
                rows={4}
                className="bg-background/50 border-border/40 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[10px] text-muted-foreground">
                {sent ? (
                  <span className="text-green-500">✓ PUSH SUCCESSFUL — message delivered</span>
                ) : (
                  '// all fields required'
                )}
              </span>
              <Button
                type="submit"
                disabled={sending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs px-6"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    {t('contact.sendLabel')}...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5" />
                    {t('contact.sendLabel')}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center space-y-3"
        >
          <div className="w-12 h-px bg-border/40 mx-auto" />
          <p className="font-mono text-xs text-muted-foreground">
            Designed & built with <span className="text-primary">precision</span>
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/60">
            © {new Date().getFullYear()} // LUUK LOEF
          </p>
        </motion.div>
      </div>
    </section>
  );
}