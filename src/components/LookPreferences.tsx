import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { allLooks as looks } from '../data/looks';
import type { Look } from '../types/look';

const storageKey = 'koquetas-look-votes-v1';
const entries = looks.flatMap(collection => collection.looks.map((look, index) => ({
  ...look, pantalon: `${collection.categoria === 'blazer' ? 'Bléizer' : 'Pantalón'} ${collection.nombre.toLowerCase()}`, numero: index + 1,
})));
type Votes = Record<string, number>;
const PreferencesContext = createContext<{
  votes: Votes; vote: (id: string) => void; saved: boolean;
} | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [votes, setVotes] = useState<Votes>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
      return Object.fromEntries(entries.map(({ id }) => {
        const count = (stored as Record<string, unknown>)[id];
        return [id, typeof count === 'number' && Number.isSafeInteger(count) && count >= 0 ? count : 0];
      }));
    } catch { return {}; }
  });
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(votes)); setSaved(true); }
    catch { setSaved(false); }
  }, [votes]);
  const vote = (id: string) => {
    if (entries.some(entry => entry.id === id)) {
      setVotes(current => ({ ...current, [id]: Math.min(Number.MAX_SAFE_INTEGER, (current[id] || 0) + 1) }));
    }
  };
  return <PreferencesContext.Provider value={{ votes, vote, saved }}>{children}</PreferencesContext.Provider>;
}

function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('Se requiere PreferencesProvider');
  return value;
}

export function LikeButton({ look }: { look: Look }) {
  const { vote } = usePreferences();
  const [thanked, setThanked] = useState(false);
  return <button className="like-button" onClick={() => { vote(look.id); setThanked(true); }} aria-label={`Me gusta: ${look.descripcion} Sumar un voto.`}>
    <span aria-hidden="true">♡</span> <span aria-live="polite">{thanked ? '¡Gracias!' : 'Me gusta'}</span>
  </button>;
}

export function PreferenceStats() {
  const { votes, saved } = usePreferences();
  const ranked = entries.map(entry => ({ ...entry, count: votes[entry.id] || 0 })).sort((a, b) => b.count - a.count);
  const total = ranked.reduce((sum, entry) => sum + entry.count, 0);
  const leaders = total ? ranked.filter(entry => entry.count === ranked[0].count) : [];
  return <section className="preference-stats" aria-label="Estadísticas de combinaciones">
    <details>
      <summary>Ver estadísticas <span>{total} {total === 1 ? 'voto' : 'votos'}</span></summary>
      <p>{total === 0 ? 'Todavía no hay votos. Pulsa Me gusta debajo de tu combinación favorita.' : `${leaders.length === 1 ? 'La más votada' : 'Empate en el primer lugar'}: ${leaders.map(entry => `${entry.pantalon}, look ${entry.numero}`).join(' · ')}.`}</p>
      <div className="stats-table-wrapper"><table>
        <caption>Preferencias registradas en este navegador</caption>
        <thead><tr><th scope="col">Combinación</th><th scope="col">Votos</th><th scope="col">Porcentaje</th></tr></thead>
        <tbody>{ranked.map(entry => <tr key={entry.id}><th scope="row">{entry.pantalon} · Look {entry.numero}<small>Blusa {entry.blusaColor.toLowerCase()} · Bléizer {entry.blazerColor.toLowerCase()}</small></th><td>{entry.count}</td><td>{total ? Math.round(entry.count / total * 100) : 0} %</td></tr>)}</tbody>
      </table></div>
    </details>
    <p className="stats-note">Cada pulsación suma un voto. Los resultados se guardan en este navegador y no se comparten entre dispositivos.</p>
    {!saved && <p role="status" className="stats-storage-error">El navegador no permite guardar los votos. Los resultados actuales se perderán al cerrar o recargar la página.</p>}
  </section>;
}
