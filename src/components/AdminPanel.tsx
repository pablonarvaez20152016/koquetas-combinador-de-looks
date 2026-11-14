import { useEffect, useState, type FormEvent } from 'react';
import config from '../data/admin-access.json';
import { PreferenceStats } from './LookPreferences';

export default function AdminPanel() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authorized) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => { clearTimeout(timer); timer = setTimeout(() => setAuthorized(false), 15 * 60 * 1000); };
    reset();
    window.addEventListener('pointerdown', reset);
    window.addEventListener('keydown', reset);
    return () => { clearTimeout(timer); window.removeEventListener('pointerdown', reset); window.removeEventListener('keydown', reset); };
  }, [authorized]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (!/^\d{10}$/.test(password)) { setError('Ingresa exactamente 10 dígitos.'); return; }
    setBusy(true); setError('');
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
      const result = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(config.salt), iterations: config.iterations, hash: 'SHA-256' }, key, 256);
      const hash = Array.from(new Uint8Array(result), value => value.toString(16).padStart(2, '0')).join('');
      if (hash === config.hash) { setAuthorized(true); setPassword(''); }
      else { setError('Contraseña incorrecta.'); setPassword(''); }
    } catch { setError('No se pudo verificar el acceso. Abre la aplicación mediante HTTPS o localhost.'); }
    finally { setBusy(false); }
  };

  return <section className="admin-panel">
    <div className="admin-heading"><h2>Administración</h2><a href="#/">Volver al combinador</a></div>
    {authorized ? <>
      <button className="admin-button" onClick={() => setAuthorized(false)}>Cerrar sesión</button>
      <PreferenceStats />
    </> : <form className="admin-login" onSubmit={login}>
      <p>Ingresa tu contraseña para consultar las estadísticas.</p>
      <label htmlFor="admin-password">Contraseña de 10 dígitos</label>
      <input id="admin-password" type="password" inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} aria-describedby={error ? 'admin-error' : undefined} aria-invalid={!!error} />
      {error && <p id="admin-error" role="alert">{error}</p>}
      <button className="admin-button" type="submit" disabled={busy}>{busy ? 'Verificando…' : 'Ingresar'}</button>
    </form>}
  </section>;
}
