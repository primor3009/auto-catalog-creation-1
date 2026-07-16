import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Car } from '@/data/cars';
import { CARS_ADMIN_URL, UPLOAD_FILE_URL, authHeaders } from '@/lib/adminApi';
import { toast } from 'sonner';

interface Props {
  car: Car | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const emptyForm = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  bodyType: 'Седан',
  fuel: 'Бензин',
  power: 0,
  acceleration: 0,
  drive: 'Полный',
  cover: '',
  gallery: [] as string[],
  video: '',
  tag: '',
  comment: '',
};

const CarFormDialog = ({ car, open, onClose, onSaved }: Props) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (car) {
      setForm({
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        bodyType: car.bodyType,
        fuel: car.fuel,
        power: car.power,
        acceleration: car.acceleration,
        drive: car.drive,
        cover: car.cover,
        gallery: car.gallery,
        video: car.video || '',
        tag: car.tag || '',
        comment: car.comment || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [car, open]);

  const uploadFile = async (file: File): Promise<string> => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const res = await fetch(UPLOAD_FILE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ file: base64, fileName: file.name, contentType: file.type }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.url;
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      setForm((f) => ({
        ...f,
        gallery: [...f.gallery, ...urls],
        cover: f.cover || urls[0],
      }));
      toast.success('Фото загружены');
    } catch {
      toast.error('Не удалось загрузить фото');
    } finally {
      setUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, video: url }));
      toast.success('Видео загружено');
    } catch {
      toast.error('Не удалось загрузить видео');
    } finally {
      setUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const removeGalleryImage = (url: string) => {
    setForm((f) => ({
      ...f,
      gallery: f.gallery.filter((g) => g !== url),
      cover: f.cover === url ? f.gallery.find((g) => g !== url) || '' : f.cover,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.cover || form.gallery.length === 0) {
      toast.error('Заполните марку, модель и загрузите минимум одно фото');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(CARS_ADMIN_URL, {
        method: car ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(car ? { ...form, id: car.id } : form),
      });
      if (!res.ok) throw new Error();
      toast.success(car ? 'Автомобиль обновлён' : 'Автомобиль добавлен');
      onSaved();
      onClose();
    } catch {
      toast.error('Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  const input = 'w-full h-11 px-3 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm';
  const label = 'text-xs text-muted-foreground uppercase tracking-wide mb-1.5 block';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <form onSubmit={submit} className="space-y-6 pt-2">
          <h3 className="font-display text-2xl font-700 uppercase">
            {car ? 'Редактировать авто' : 'Новый автомобиль'}
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label}>Марка</label>
              <input className={input} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
            </div>
            <div>
              <label className={label}>Модель</label>
              <input className={input} value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
            </div>
            <div>
              <label className={label}>Год</label>
              <input type="number" className={input} value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
            </div>
            <div>
              <label className={label}>Цена, ₽</label>
              <input type="number" className={input} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            </div>
            <div>
              <label className={label}>Кузов</label>
              <select className={input} value={form.bodyType} onChange={(e) => setForm({ ...form, bodyType: e.target.value })}>
                {['Седан', 'Купе', 'Кроссовер', 'Внедорожник'].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Топливо</label>
              <select className={input} value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })}>
                {['Бензин', 'Дизель', 'Электро', 'Гибрид'].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Мощность, л.с.</label>
              <input type="number" className={input} value={form.power} onChange={(e) => setForm({ ...form, power: Number(e.target.value) })} required />
            </div>
            <div>
              <label className={label}>Разгон 0-100, с</label>
              <input type="number" step="0.1" className={input} value={form.acceleration} onChange={(e) => setForm({ ...form, acceleration: Number(e.target.value) })} required />
            </div>
            <div>
              <label className={label}>Привод</label>
              <select className={input} value={form.drive} onChange={(e) => setForm({ ...form, drive: e.target.value })}>
                {['Передний', 'Задний', 'Полный'].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Метка (необязательно)</label>
              <input className={input} placeholder="Хит, Новинка…" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} />
            </div>
          </div>

          <div>
            <label className={label}>Фотографии</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.gallery.map((img) => (
                <div key={img} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Icon name="Trash2" size={18} className="text-white" />
                  </button>
                  {form.cover === img && (
                    <span className="absolute bottom-0 inset-x-0 bg-primary text-primary-foreground text-[10px] text-center font-600">
                      Обложка
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploading}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-colors"
              >
                <Icon name={uploading ? 'Loader2' : 'Plus'} size={22} className={uploading ? 'animate-spin text-primary' : 'text-muted-foreground'} />
              </button>
            </div>
            <input ref={galleryInputRef} type="file" accept="image/*" multiple hidden onChange={handleGalleryUpload} />
          </div>

          <div>
            <label className={label}>Видео (необязательно)</label>
            {form.video ? (
              <div className="flex items-center gap-3">
                <video src={form.video} className="w-32 h-20 rounded-lg object-cover border border-border" muted />
                <button type="button" onClick={() => setForm({ ...form, video: '' })} className="text-sm text-destructive flex items-center gap-1">
                  <Icon name="Trash2" size={14} /> Удалить
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
                className="h-11 px-4 rounded-lg border border-dashed border-border hover:border-primary flex items-center gap-2 text-sm transition-colors"
              >
                <Icon name={uploading ? 'Loader2' : 'Upload'} size={16} className={uploading ? 'animate-spin' : ''} />
                Загрузить видео
              </button>
            )}
            <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={handleVideoUpload} />
          </div>

          <div>
            <label className={label}>Комментарий / доп. информация (необязательно)</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Особенности комплектации, состояние, история авто…"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-700 uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <Icon name="Loader2" size={20} className="animate-spin" /> : car ? 'Сохранить изменения' : 'Добавить автомобиль'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CarFormDialog;