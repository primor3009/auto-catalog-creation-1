import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { bodyTypes, fuels, formatPrice, Car } from '@/data/cars';
import { useCars } from '@/hooks/useCars';
import CarGalleryModal from './CarGalleryModal';

const Catalog = () => {
  const { cars, loading } = useCars();
  const [brand, setBrand] = useState('Все марки');
  const [body, setBody] = useState('Все типы');
  const [fuel, setFuel] = useState('Все');
  const [maxPrice, setMaxPrice] = useState(13000000);
  const [selected, setSelected] = useState<Car | null>(null);

  const brands = useMemo(
    () => ['Все марки', ...Array.from(new Set(cars.map((c) => c.brand)))],
    [cars]
  );

  const filtered = useMemo(
    () =>
      cars
        .filter(
          (c) =>
            (brand === 'Все марки' || c.brand === brand) &&
            (body === 'Все типы' || c.bodyType === body) &&
            (fuel === 'Все' || c.fuel === fuel) &&
            c.price <= maxPrice
        )
        .sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0)),
    [cars, brand, body, fuel, maxPrice]
  );

  const Chip = ({
    items,
    value,
    onChange,
  }: {
    items: string[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`px-4 py-2 rounded-lg text-sm font-500 border transition-all ${
            value === i
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary/40 border-border text-muted-foreground hover:border-primary/50'
          }`}
        >
          {i}
        </button>
      ))}
    </div>
  );

  return (
    <section id="catalog" className="py-24 relative">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-sm uppercase tracking-widest text-primary font-600 mb-2">Каталог</div>
            <h2 className="font-display text-4xl md:text-5xl font-700 uppercase">Модельный ряд</h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            {filtered.length} автомобилей в наличии. Нажми на карточку — откроется галерея фото и видео.
          </p>
        </div>

        <div
          id="filters"
          className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 mb-10 space-y-5 scroll-mt-24"
        >
          <div className="flex items-center gap-2 text-sm font-600 uppercase tracking-wide text-primary">
            <Icon name="SlidersHorizontal" size={18} /> Фильтры подбора
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Марка</div>
              <Chip items={brands} value={brand} onChange={setBrand} />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Кузов</div>
              <Chip items={bodyTypes} value={body} onChange={setBody} />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Топливо</div>
              <Chip items={fuels} value={fuel} onChange={setFuel} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-wide">
              <span className="text-muted-foreground">Цена до</span>
              <span className="text-primary font-600">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={13000000}
              step={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[hsl(186_100%_50%)]"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="Loader2" size={40} className="mx-auto mb-4 animate-spin text-primary" />
            Загружаем каталог…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-50" />
            Ничего не найдено. Измени фильтры.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car, idx) => (
              <button
                key={car.id}
                onClick={() => setSelected(car)}
                style={{ animationDelay: `${idx * 0.06}s` }}
                className="group text-left rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/60 transition-all duration-300 animate-fade-up"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={car.cover}
                    alt={car.model}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  {car.tag && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-700 uppercase">
                      {car.tag}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/70 backdrop-blur text-xs font-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="Images" size={14} className="text-primary" />
                    Галерея
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-primary font-600">{car.brand}</div>
                      <div className="font-display text-xl font-700">{car.model}</div>
                    </div>
                    <div className="font-display text-lg font-700 text-gradient whitespace-nowrap">
                      {formatPrice(car.price)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Icon name="Gauge" size={14} />{car.power} л.с.</span>
                    <span className="flex items-center gap-1"><Icon name="Timer" size={14} />{car.acceleration}с</span>
                    <span className="flex items-center gap-1"><Icon name="Fuel" size={14} />{car.fuel}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <CarGalleryModal car={selected} open={!!selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default Catalog;