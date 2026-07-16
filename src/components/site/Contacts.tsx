import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const info = [
  { icon: 'MapPin', label: 'Адрес', value: 'Москва, Ленинградский пр-т, 39' },
  { icon: 'Phone', label: 'Телефон', value: '+7 (495) 000-00-00' },
  { icon: 'Mail', label: 'Почта', value: 'sales@autohaus.ru' },
  { icon: 'Clock', label: 'Часы работы', value: 'Ежедневно 9:00 – 21:00' },
];

const SEND_LEAD_URL = 'https://functions.poehali.dev/3033b472-4a76-42f7-9488-9f2210f7baa9';

const Contacts = () => {
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 2) err.name = 'Укажите имя';
    if (!/^[\d\s()+-]{6,}$/.test(form.phone)) err.phone = 'Некорректный телефон';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(SEND_LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success('Заявка отправлена! Мы перезвоним вам в ближайшее время.');
      setForm({ name: '', phone: '', comment: '' });
    } catch {
      toast.error('Не удалось отправить заявку. Попробуйте позже или позвоните нам.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacts" className="py-24 relative grid-bg">
      <div className="container grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <div className="text-sm uppercase tracking-widest text-primary font-600 mb-2">Контакты</div>
            <h2 className="font-display text-4xl md:text-5xl font-700 uppercase">Приезжайте <br />в шоурум</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {info.map((i) => (
              <div key={i.label} className="flex gap-4 p-5 rounded-2xl border border-border bg-card/60">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Icon name={i.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{i.label}</div>
                  <div className="font-600">{i.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8 space-y-5">
          <h3 className="font-display text-2xl font-700 uppercase">Оставить заявку</h3>
          <p className="text-sm text-muted-foreground">Заполните форму — менеджер свяжется с вами.</p>

          <div className="space-y-2">
            <label className="text-sm font-500">Имя</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Как вас зовут?"
              className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-colors"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-500">Телефон</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+7 (___) ___-__-__"
              className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-colors"
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-500">Комментарий</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Какая модель интересует?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-700 uppercase tracking-wide hover:opacity-90 transition-opacity glow-cyan disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={20} className="animate-spin" />
                Отправляем…
              </>
            ) : (
              'Отправить заявку'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contacts;