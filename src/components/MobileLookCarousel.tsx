import { useRef, useState } from 'react';
import { assetUrl } from '../data/looks';
import type { LookCollection } from '../types/look';
import mobileImages from '../data/mobile-images.json';
import { EmptyImageState } from './EmptyImageState';
import { LikeButton } from './LookPreferences';
function Photo({ src, alt, available, eager, width, height }: { src: string; alt: string; available: boolean; eager: boolean; width: number; height: number }) {
  const [failed, setFailed] = useState(false);
  return failed || !available ? <EmptyImageState /> : <img src={assetUrl(src)} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />;
}
export function MobileLookCarousel({ collection }: { collection: LookCollection }) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const groups = [collection.looks.slice(0, 3), collection.looks.slice(3, 6)];
  const image = mobileImages.find(item => item.id === collection.id);
  const go = (next: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: Math.max(0, Math.min(1, next)) * el.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <section className="mobile-lookbook" aria-label={`Looks con ${collection.categoria === 'blazer' ? 'bléizer' : 'pantalón'} ${collection.nombre}`}>
    <div className="carousel" ref={track} tabIndex={0} aria-label="Carrusel de seis looks, tres por pantalla. Usa las flechas para navegar."
      onKeyDown={e => { if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) { e.preventDefault(); go(e.key === 'Home' ? 0 : e.key === 'End' ? 1 : page + (e.key === 'ArrowRight' ? 1 : -1)); } }}
      onScroll={() => { const el = track.current; if (el) setPage(Math.max(0, Math.min(1, Math.round(el.scrollLeft / el.clientWidth)))); }}>
      {groups.map((group, groupIndex) => <div className="look-page" key={groupIndex} role="group" aria-label={`Looks ${groupIndex * 3 + 1} a ${groupIndex * 3 + 3} de 6`}>
        <figure className="group-photo" style={{ '--group-ratio': `${image?.width ?? 836} / ${image?.height ?? 941}` } as import('react').CSSProperties}>
          <Photo src={`looks/${collection.id}/mobile-group-0${groupIndex + 1}.webp`} alt={group.map(look => look.descripcion).join(' ')} available={image?.available ?? false} width={image?.width ?? 836} height={image?.height ?? 941} eager={groupIndex === 0} />
        </figure>
      </div>)}
    </div>
    <div className="carousel-controls">
      <button aria-label="Tres looks anteriores" disabled={page === 0} onClick={() => go(page - 1)}>←</button>
      <div className="position"><span aria-live="polite">{page * 3 + 1}–{page * 3 + 3} de 6</span>
        <button className="carousel-more" aria-label={page === 0 ? 'Hay más imágenes a la derecha. Ver looks 4 a 6' : 'Volver a las imágenes de la izquierda. Ver looks 1 a 3'} onClick={() => go(page === 0 ? 1 : 0)}>
          <span className={`continuation-dots ${page === 1 ? 'is-last' : ''}`} aria-hidden="true"><span /><span /><span /></span>
          <span className="continuation-label">{page === 0 ? 'Más looks a la derecha →' : '← Volver a los primeros looks'}</span>
        </button>
      </div>
      <button aria-label="Tres looks siguientes" disabled={page === 1} onClick={() => go(page + 1)}>→</button>
    </div>
    <div className="look-descriptions" aria-label="Combinaciones de la imagen visible">
      {groups[page].map(look => <div key={look.id}><p>{look.descripcion}</p><LikeButton look={look} /></div>)}
    </div>
    <p className="swipe-hint">Desliza para descubrir más combinaciones</p>
  </section>;
}
