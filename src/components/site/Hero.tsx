import Icon from '@/components/ui/icon';
import { cars } from '@/data/cars';

const stats = [
  { value: '250+', label: 'Автомобилей' },
  { value: '18', label: 'Премиум-марок' },
  { value: '12', label: 'Лет на рынке' },
];

const Hero = () => {
  const go = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden grid-bg pt-20">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[140px]" />

      <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-600 uppercase tracking-widest text-primary">Новая коллекция 2025</span>
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-700 leading-[0.95] uppercase animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Твой новый
            <br />
            <span className="text-gradient">автомобиль</span>
            <br />
            начинается тут
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-md animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Каталог премиальных авто с детальными галереями фото и видео каждой модели. Выбирай, сравнивай, забирай.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => go('#catalog')}
              className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-primary text-primary-foreground font-700 uppercase tracking-wide hover:opacity-90 transition-opacity glow-cyan"
            >
              Смотреть каталог
              <Icon name="ArrowRight" size={20} />
            </button>
            <button
              onClick={() => go('#filters')}
              className="inline-flex items-center gap-2 h-14 px-8 rounded-xl border border-border bg-secondary/50 font-700 uppercase tracking-wide hover:border-primary/50 transition-colors"
            >
              <Icon name="SlidersHorizontal" size={20} />
              Подбор
            </button>
          </div>

          <div className="flex gap-8 pt-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-700 text-gradient">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: '0.25s' }}>
          <div className="relative rounded-3xl overflow-hidden border border-border animate-float-slow">
            <img src={cars[0].cover} alt={cars[0].model} className="w-full aspect-[4/3] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-primary font-600">{cars[0].brand}</div>
                <div className="font-display text-2xl font-700">{cars[0].model}</div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-background/70 backdrop-blur border border-border">
                <div className="text-xs text-muted-foreground">0–100 км/ч</div>
                <div className="font-display font-700 text-primary">{cars[0].acceleration} с</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
