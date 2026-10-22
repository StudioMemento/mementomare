import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqs, galleryItems } from '../data/editorial';
import { Arrow, CloseIcon, Eyebrow, HeroPhoto, Modal, Photo } from './Primitives';
import { useUI } from './UIContext';

export function Gallery({ full = false }: { full?: boolean }) {
  const [filter, setFilter] = useState('Tutto');
  const { setOverlay } = useUI();
  const items = galleryItems.filter(item => filter === 'Tutto' || item.category === filter);
  return <section id="galleria" className={`gallery-section ${full ? 'gallery-full' : 'section-pad'}`}>
    {!full && <div className="section-heading reveal"><div><Eyebrow>Scorci da ricordare</Eyebrow><h2>Qui, ogni momento<br /><em>sa d’estate.</em></h2></div><Link to="/galleria" className="text-link">Tutta la galleria <Arrow direction="diagonal" /></Link></div>}
    <div className="gallery-filters" role="group" aria-label="Filtra le fotografie">{['Tutto', 'Camere', 'Relax', 'Sapori', 'Mare'].map(category => <button key={category} aria-pressed={filter === category} className={filter === category ? 'is-active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div>
    <div className="gallery-grid" aria-live="polite" aria-atomic="false">{items.map(item => <button className={`gallery-item ${item.id === 'hero-beach' ? 'gallery-panorama' : ''}`} key={item.id} onClick={() => setOverlay({ type: 'gallery', index: galleryItems.indexOf(item) })} aria-label={`Apri la fotografia: ${item.label}`}><div className="gallery-image">{item.id === 'hero-beach' ? <HeroPhoto /> : <Photo id={item.id} /> }<span className="gallery-open"><Arrow direction="diagonal" /></span></div><span className="gallery-caption"><span>{item.label}</span><span>{item.category}</span></span></button>)}</div>
    {!items.length && <p className="gallery-empty">Nessuna fotografia per questo filtro. Scegli un’altra categoria.</p>}
  </section>;
}

export function GalleryDialog() {
  const { overlay, setOverlay } = useUI();
  const isOpen = overlay?.type === 'gallery';
  const index = isOpen ? overlay.index : 0;
  const item = galleryItems[index];
  function step(delta: number) { setOverlay({ type: 'gallery', index: (index + delta + galleryItems.length) % galleryItems.length }); }
  return <Modal open={isOpen} onClose={() => setOverlay(null)} kind="gallery" titleId="gallery-dialog-title">
    <div className="lightbox-head"><Eyebrow>MEMENTO / Galleria</Eyebrow><button className="icon-button" aria-label="Chiudi la galleria" data-initial-focus onClick={() => setOverlay(null)}><CloseIcon /></button></div>
    <figure key={item.id} className={`lightbox-figure ${item.id === 'hero-beach' ? 'is-panorama' : 'is-compact'}`}><Photo id={item.id} /><figcaption id="gallery-dialog-title">{item.label}</figcaption></figure>
    <div className="lightbox-controls"><button className="icon-button" aria-label="Fotografia precedente" onClick={() => step(-1)}><Arrow direction="left" /></button><span aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}</span><button className="icon-button" aria-label="Fotografia successiva" onClick={() => step(1)}><Arrow /></button></div>
  </Modal>;
}

export function FAQ({ compact = false }: { compact?: boolean }) {
  return <section id="faq" className={`faq-section ${compact ? '' : 'section-pad'}`}>
    <div className="reveal"><Eyebrow>Prima di partire</Eyebrow><h2>Ogni domanda,<br /><em>il suo spazio.</em></h2><p>Qualche dettaglio per immaginare il tuo soggiorno.</p></div>
    <div className="faq-list reveal">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span className="faq-plus" aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div>
  </section>;
}

export function StayInvitation() {
 const {openBooking}=useUI();
 return <section className="summer-page-cta"><Eyebrow>Il tuo prossimo ricordo</Eyebrow><h2>La valigia?<br /><em>Quasi pronta.</em></h2><button className="summer-button" onClick={()=>openBooking()}>Disegna la tua estate<Arrow /></button></section>;
}
