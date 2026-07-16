import Icon from '@/components/ui/icon';

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Icon name="Zap" className="text-primary-foreground" size={20} />
        </div>
        <span className="font-display text-xl font-700 tracking-widest">AUTOHAUS</span>
      </div>

      <div className="flex gap-3">
        {['Instagram', 'Send', 'Youtube'].map((s) => (
          <a
            key={s}
            href="#"
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
          >
            <Icon name={s} size={18} />
          </a>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">© 2025 AUTOHAUS. Все права защищены.</p>
    </div>
  </footer>
);

export default Footer;
