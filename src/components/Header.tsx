import { assetUrl } from '../data/looks';

export function Header() {
  return <header className="header">
    <a className="brand" href={import.meta.env.BASE_URL} aria-label="Koquetas Boutique, inicio">
      <img className="brand-logo" src={assetUrl('logo-oficial.png')} alt="Koquetas Boutique" width="1448" height="1086" />
    </a>
    <div className="header-copy">
      <h1>Una prenda. <em>Muchas posibilidades.</em></h1>
      <p>Descubre cómo combinar tus prendas.</p>
    </div>
  </header>;
}
