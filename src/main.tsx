import React, { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/Header';
import { ColorSelector } from './components/ColorSelector';
import { DesktopLookbook } from './components/DesktopLookbook';
import { MobileLookCarousel } from './components/MobileLookCarousel';
import { looks, blazerLooks } from './data/looks';
import type { LookCollection } from './types/look';
import { LikeButton, PreferencesProvider } from './components/LookPreferences';
import './styles/main.css';
import './styles/desktop.css';
import './styles/preferences.css';
const AdminPanel = lazy(() => import('./components/AdminPanel'));
function App() {
  const [category, setCategory] = useState<'pantalon' | 'blazer'>('pantalon');
  const [selections, setSelections] = useState({ pantalon: looks[2], blazer: blazerLooks[0] });
  const selected = selections[category];
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  if (hash === '#/admin' || hash === '#/admin/') return <><Header /><main><Suspense fallback={<p role="status">Cargando administración…</p>}><AdminPanel /></Suspense></main></>;
  const onSelect = (value: LookCollection) => setSelections(current => ({ ...current, [category]: value }));
  return <><Header /><main>
    <div className="garment-selector" role="group" aria-label="Prenda que quieres combinar">
      <button aria-pressed={category === 'pantalon'} onClick={() => setCategory('pantalon')}>Pantalón</button>
      <button aria-pressed={category === 'blazer'} onClick={() => setCategory('blazer')}>Bléizer</button>
    </div>
    <ColorSelector collections={category === 'blazer' ? blazerLooks : looks} selected={selected.id} onSelect={onSelect} />
    <div className="collection-heading"><h2>{category === 'blazer' ? 'Bléizer' : 'Pantalón'} {selected.nombre.toLowerCase()}</h2><span>6 LOOKS PARA INSPIRARTE</span></div>
    <DesktopLookbook key={`desktop-${selected.id}`} collection={selected} />
    <div className="desktop-voting" aria-label="Votar por una combinación">{selected.looks.map(look => <div key={look.id}><LikeButton look={look} /></div>)}</div>
    <MobileLookCarousel key={`mobile-${selected.id}`} collection={selected} />
  </main><footer><span>Koquetas Boutique</span><span>Inspírate. Combina. Sé tú.</span></footer></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><PreferencesProvider><App /></PreferencesProvider></React.StrictMode>);
