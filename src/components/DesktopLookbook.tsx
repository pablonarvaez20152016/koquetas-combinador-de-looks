import { useState } from 'react';
import { assetUrl } from '../data/looks';
import type { LookCollection } from '../types/look';
import { EmptyImageState } from './EmptyImageState';
export function DesktopLookbook({ collection }: { collection: LookCollection }) {
 const [failed,setFailed] = useState(false);
 return <section className="desktop-lookbook" aria-label={`Seis looks con ${collection.categoria === 'blazer' ? 'bléizer' : 'pantalón'} ${collection.nombre}`}>
 {failed ? <EmptyImageState/> : <img className="panorama" src={assetUrl(collection.imagenDesktop)} alt={collection.looks.map(look => look.descripcion).join(' ')} onError={() => setFailed(true)} fetchPriority="high"/>}
 </section>;
}
