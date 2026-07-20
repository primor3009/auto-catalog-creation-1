import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Car, formatPrice } from '@/data/cars';
import { ADMIN_AUTH_URL, CARS_ADMIN_URL, getToken, clearToken, authHeaders } from '@/lib/adminApi';
import CarFormDialog from '@/components/admin/CarFormDialog';
import { toast } from 'sonner';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [editing, setEditing] = useState<Car | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Car | null>(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(CARS_ADMIN_URL);
      setCars(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetch(`${ADMIN_AUTH_URL}?action=check`, { headers: authHeaders() })
      .then(async (r) => {
        if (!r.ok) {
          navigate('/admin/login');
          return;
        }
        const data = await r.json();
        setUsername(data.username);
        fetchCars();
      });
  }, [navigate, fetchCars]);

  const logout = async () => {
    await fetch(`${ADMIN_AUTH_URL}?action=logout`, { method: 'POST', headers: authHeaders() });
    clearToken();
    navigate('/admin/login');
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${CARS_ADMIN_URL}?id=${confirmDelete.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      toast.success('Автомобиль удалён');
      setConfirmDelete(null);
      fetchCars();
    } catch {
      toast.error('Не удалось удалить');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Zap" className="text-primary-foreground" size={20} />
            </div>
            <span className="font-display text-lg font-700 tracking-widest">АДМИН-ПАНЕЛЬ</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{username}</span>
            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
              <Icon name="ExternalLink" size={14} /> Сайт
            </a>
            <button onClick={logout} className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1">
              <Icon name="LogOut" size={14} /> Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-700 uppercase">Каталог автомобилей</h1>
            <p className="text-muted-foreground text-sm mt-1">{cars.length} автомобилей в базе</p>
          </div>
          <button
            onClick={() => { setEditing(null); setFormOpen(true); }}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-primary text-primary-foreground font-700 text-sm uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            <Icon name="Plus" size={18} /> Добавить авто
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            <Icon name="Loader2" size={36} className="mx-auto mb-3 animate-spin text-primary" />
            Загружаем…
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars.map((car) => (
              <div key={car.id} className="rounded-2xl border border-border bg-card overflow-hidden group">
                <div className="relative">
                  <img src={car.cover} alt={car.model} className="w-full aspect-[4/3] object-cover" />
                  {car.tag && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-700 uppercase">
                      {car.tag}
                    </span>
                  )}
                  {car.isFeatured && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-700 uppercase flex items-center gap-1">
                      <Icon name="Star" size={12} /> На главной
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => { setEditing(car); setFormOpen(true); }}
                      className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90"
                    >
                      <Icon name="Pencil" size={18} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(car)}
                      className="w-11 h-11 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90"
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-widest text-primary font-600">{car.brand}</div>
                  <div className="font-display text-lg font-700">{car.model}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">{car.year} · {car.bodyType}</span>
                    <span className="font-600 text-sm">{formatPrice(car.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CarFormDialog
        car={editing}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={fetchCars}
      />

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl font-700">Удалить автомобиль?</h3>
            <p className="text-sm text-muted-foreground">
              «{confirmDelete.brand} {confirmDelete.model}» будет удалён без возможности восстановления.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 h-11 rounded-lg border border-border text-sm font-600">
                Отмена
              </button>
              <button onClick={handleDelete} className="flex-1 h-11 rounded-lg bg-destructive text-destructive-foreground text-sm font-600">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;