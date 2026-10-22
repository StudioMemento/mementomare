import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Arrow, CloseIcon, Eyebrow, Modal, Photo } from './Primitives';
import { useUI } from './UIContext';

function Brand() {
  return <span className="ed-brand"><strong>MEMENTO</strong><span>Hotel &amp; Beach</span></span>;
}

export function Header() {
  const { pathname, hash } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { openBooking, setOverlay, overlay } = useUI();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (!frame) frame = requestAnimationFrame(() => { setScrolled(window.scrollY > 28); frame = 0; });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, [pathname]);
  const sectionIsCurrent = (anchor: string) => pathname === '/' && hash === anchor ? 'location' as const : undefined;
  return <header className={`ed-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="ed-header-inner">
      <Link to="/" aria-label="MEMENTO Hotel & Beach — Home"><Brand /></Link>
      <nav className="ed-nav" aria-label="Navigazione principale">
        <Link to="/#camere" aria-current={sectionIsCurrent('#camere')}>Camere</Link>
        <Link to="/#giornata" aria-current={sectionIsCurrent('#giornata')}>La giornata</Link>
        <Link to="/#informazioni" aria-current={sectionIsCurrent('#informazioni')}>Informazioni</Link>
      </nav>
      <div className="ed-header-actions">
        <button className="ed-book-button" onClick={() => openBooking()}>Prenota <Arrow direction="diagonal" /></button>
        <button className="ed-menu-toggle" aria-label="Apri il menu" aria-haspopup="dialog" aria-expanded={overlay?.type === 'menu'} aria-controls={overlay?.type === 'menu' ? 'ed-menu' : undefined} onClick={() => setOverlay({ type: 'menu' })}>
          <span aria-hidden="true"><i /><i /></span><span className="ed-menu-label">Menu</span>
        </button>
      </div>
    </div>
  </header>;
}

export function MenuDialog() {
  const { overlay, setOverlay, openBooking } = useUI();
  const { pathname } = useLocation();
  const close = () => setOverlay(null);
  const chapters = [
    ['Il primo sguardo', '/#arrivo'],
    ['Le camere', '/suite'],
    ['Dal giorno alla sera', '/#giornata'],
    ['Informazioni e contatti', '/contatti'],
  ];
  const places = [
    ['Mare e spiaggia', '/spiaggia'],
    ['Piscina', '/spa'],
    ['Bici e dintorni', '/fitness'],
    ['Colazione e aperitivo', '/ristorante'],
    ['Le esperienze', '/esperienze'],
    ['Galleria', '/galleria'],
  ];
  return <Modal open={overlay?.type === 'menu'} onClose={close} kind="editorial-menu" titleId="ed-menu-title">
    <div className="ed-menu" id="ed-menu">
      <div className="ed-menu-head"><Link to="/" onClick={close} aria-label="MEMENTO — Home"><Brand /></Link><button className="icon-button" aria-label="Chiudi il menu" onClick={close} data-initial-focus><CloseIcon /></button></div>
      <div className="ed-menu-layout">
        <div><Eyebrow>Le ore del mare</Eyebrow><h2 className="sr-only" id="ed-menu-title">Esplora MEMENTO</h2>
          <nav className="ed-menu-primary" aria-label="Capitoli della visita">{chapters.map(([label, href], index) => <Link to={href} key={href} onClick={close} aria-current={pathname === href ? 'page' : undefined}><span className="ed-menu-number">0{index + 1}</span><span>{label}</span><Arrow direction="diagonal" /></Link>)}</nav>
          <nav className="ed-menu-secondary" aria-label="Spazi ed esperienze">{places.map(([label, href]) => <Link to={href} key={href} onClick={close} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}</nav>
        </div>
        <aside className="ed-menu-side"><Photo id="private-beach" decorative /><p>Un giorno sul mare.<br /><em>Al tuo ritmo.</em></p><button className="ed-book-button" onClick={() => openBooking()}>Prepara il soggiorno <Arrow direction="diagonal" /></button></aside>
      </div>
      <p className="ed-menu-note">MEMENTO Hotel &amp; Beach · Un concept di Memento Design Studio.</p>
    </div>
  </Modal>;
}

export function Footer() {
  const { openBooking } = useUI();
  return <footer className="ed-footer">
    <div className="ed-footer-top"><Link to="/" aria-label="MEMENTO Hotel & Beach — Home"><Brand /></Link><p>Il mare, con<br /><em>il tuo tempo.</em></p><button className="ed-book-button" onClick={() => openBooking()}>Prenota <Arrow direction="diagonal" /></button></div>
    <nav className="ed-footer-links" aria-label="Esplora il sito"><Link to="/suite">Camere</Link><Link to="/#giornata">La giornata</Link><Link to="/spiaggia">Mare</Link><Link to="/spa">Piscina</Link><Link to="/galleria">Fotografie</Link><Link to="/#informazioni">Posizione e informazioni</Link><Link to="/contatti">Contatti e domande</Link></nav>
    <div className="ed-footer-bottom"><p>Hotel immaginario · Fotografie generate per il concept</p><p>Direzione e design · Memento Design Studio</p><a href="#main-content" className="ed-back-top">Torna su <Arrow direction="down" /></a></div>
  </footer>;
}
