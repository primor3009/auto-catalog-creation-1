import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Car, formatPrice } from '@/data/cars';

interface Props {
  car: Car | null;
  open: boolean;
  onClose: () => void;
}

const CarGalleryModal = ({ car, open, onClose }: Props) => {
  const [tab, setTab] = useState<'photo' | 'video'>('photo');
  const [active, setActive] = useState(0);

  if (!car) return null;

  const specs = [
    { icon: 'Calendar', label: 'Год', value: car.year },
    { icon: 'Gauge', label: 'Мощность', value: `${car.power} л.с.` },
    { icon: 'Timer', label: '0–100', value: `${car.acceleration} с` },
    { icon: 'Fuel', label: 'Топливо', value: car.fuel },
    { icon: 'Cog', label: 'Привод', value: car.drive },
    { icon: 'Car', label: 'Кузов', value: car.bodyType },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-border bg-card gap-0 max-h-[92vh] overflow-y-auto">
        <div className="relative bg-black">
          {tab === 'photo' ? (
            <img
              src={car.gallery[active]}
              alt={car.model}
              className="w-full aspect-video object-cover animate-fade-up"
            />
          ) : (
            <video
              src={car.video}
              controls
              autoPlay
              muted
              loop
              className="w-full aspect-video object-cover bg-black"
            />
          )}

          <div className="absolute top-4 left-4 flex gap-2 bg-background/70 backdrop-blur rounded-lg p-1 border border-border">
            <button
              onClick={() => setTab('photo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-600 transition-colors ${
                tab === 'photo' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Image" size={16} /> Фото
            </button>
            <button
              onClick={() => setTab('video')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-600 transition-colors ${
                tab === 'video' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Play" size={16} /> Видео
            </button>
          </div>

          {car.tag && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-700 uppercase tracking-wide">
              {car.tag}
            </div>
          )}
        </div>

        {tab === 'photo' && (
          <div className="flex gap-2 p-4 overflow-x-auto bg-card">
            {car.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  active === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-widest text-primary font-600">{car.brand}</div>
              <h3 className="font-display text-3xl font-700">{car.model}</h3>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Цена</div>
              <div className="font-display text-2xl font-700 text-gradient">{formatPrice(car.price)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
                <Icon name={s.icon} size={20} className="text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="font-600 text-sm">{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-700 uppercase tracking-wide hover:opacity-90 transition-opacity glow-cyan">
            Записаться на тест-драйв
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarGalleryModal;
