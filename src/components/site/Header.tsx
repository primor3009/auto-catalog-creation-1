import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const links = [
  { label: 'Главная', href: '#home' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Фильтры', href: '#filters' },
  { label: 'Контакты', href: '#contacts' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/85 backdrop-blur-xl border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <button onClick={() => go('#home')} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center glow-cyan">
            <Icon name="Zap" className="text-primary-foreground" size={20} />
          </div>
          <span className="font-display text-xl font-700 tracking-widest">AUTOHAUS</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-sm font-500 text-muted-foreground hover:text-primary transition-colors uppercase tracking-wide"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+79146887113"
            className="flex items-center gap-2 text-sm font-600 text-foreground hover:text-primary transition-colors"
          >
            <Icon name="Phone" size={16} className="text-primary" />
            +7 (914) 688-71-13
          </a>
          <button
            onClick={() => go('#contacts')}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary text-primary-foreground font-600 text-sm hover:opacity-90 transition-opacity"
          >
            Заказать звонок
            <Icon name="Phone" size={16} />
          </button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'X' : 'Menu'} size={26} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border animate-fade-up">
          <nav className="container flex flex-col py-4">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="py-3 text-left text-base font-500 border-b border-border/50 uppercase tracking-wide"
              >
                {l.label}
              </button>
            ))}
            <a
              href="tel:+79146887113"
              className="mt-4 flex items-center justify-center gap-2 text-base font-600 text-foreground"
            >
              <Icon name="Phone" size={18} className="text-primary" />
              +7 (914) 688-71-13
            </a>
            <button
              onClick={() => go('#contacts')}
              className="mt-4 h-12 rounded-lg bg-primary text-primary-foreground font-600"
            >
              Заказать звонок
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;