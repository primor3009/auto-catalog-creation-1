import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { ADMIN_AUTH_URL, getToken, setToken, authHeaders } from '@/lib/adminApi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    fetch(`${ADMIN_AUTH_URL}?action=check`, { headers: authHeaders() })
      .then((r) => (r.ok ? navigate('/admin') : setChecking(false)))
      .catch(() => setChecking(false));
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${ADMIN_AUTH_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Ошибка входа');
        return;
      }
      setToken(data.token);
      navigate('/admin');
    } catch {
      setError('Не удалось подключиться. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background grid-bg px-4">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[140px]" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-8 space-y-6 animate-fade-up"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-cyan">
            <Icon name="Lock" className="text-primary-foreground" size={22} />
          </div>
          <h1 className="font-display text-2xl font-700 uppercase">Вход в панель</h1>
          <p className="text-sm text-muted-foreground text-center">Управление каталогом МашинаТут</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-500">Логин</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-colors"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-500">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-colors"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-700 uppercase tracking-wide hover:opacity-90 transition-opacity glow-cyan disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <Icon name="Loader2" size={20} className="animate-spin" /> : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;