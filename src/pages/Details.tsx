import { Link, useParams } from 'react-router-dom';
import { content, roomDetails, serviceDetails } from '../data/editorial';
import { Arrow, Eyebrow, HeroPhoto, Photo } from '../components/Primitives';
import { FAQ, Gallery, StayInvitation } from '../components/Content';
import { useUI } from '../components/UIContext';

function Breadcrumb({ current, parent }: { current: string; parent?: { href: string; label: string } }) {
  return <nav className="breadcrumb" aria-label="Percorso"><Link to="/">MEMENTO</Link><span aria-hidden="true">/</span>{parent && <><Link to={parent.href}>{parent.label}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{current}</span></nav>;
}

function DestinationHero({ image, kicker, title, subtitle }: { image: string; kicker: string; title: string; subtitle: string }) {
  return <section className="destination-hero"><Photo id={image} priority decorative /><div className="destination-shade" /><div className="destination-copy"><Eyebrow>{kicker}</Eyebrow><h1>{title}</h1><p>{subtitle}</p><span className="ed-concept-caption">Spazi del concept · Immagini generate</span></div><a href="#racconto" className="destination-scroll" aria-label="Scopri il racconto"><Arrow direction="down" /></a></section>;
}

export function ServicePage({ id }: { id: string }) {
  const service = content.services.find(item => item.id === id);
  const details = serviceDetails[id];
  const { openBooking } = useUI();
  if (!service || !details) return <NotFound />;
  const related = content.services.filter(item => item.id !== id).slice(0, 2);
  return <div className="destination-page">
    <DestinationHero image={service.imageId} kicker={service.label} title={service.title} subtitle={service.description} />
    <div className="page-container" id="racconto"><Breadcrumb current={service.label} />
      <section className="destination-intro"><div><Eyebrow>Le ore del mare</Eyebrow><h2>{details.title}</h2></div><div><p className="large-copy">{details.intro}</p><p>{details.detail}</p><button className="text-link" onClick={() => openBooking({ interest: id })}>Conserva questa preferenza <Arrow direction="diagonal" /></button></div></section>
      <section className="service-editorial"><div className="service-editorial-photo"><Photo id={details.secondImage} /></div><div className="service-chapters"><Eyebrow>Tre dettagli da guardare</Eyebrow>{details.moments.map((moment, index) => <article className="service-chapter" key={moment.title}><div><span>0{index + 1}</span><Eyebrow>{moment.meta}</Eyebrow></div><h3>{moment.title}</h3><p>{moment.text}</p></article>)}</div></section>
      <section className="detail-includes"><div><Eyebrow>La materia del luogo</Eyebrow><h2>Piccoli dettagli,<br /><em>un altro ritmo.</em></h2></div><div><ul className="includes-list">{details.includes.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul><p className="availability-note">Gli ambienti appartengono al concept. Servizi disponibili, accessi e condizioni richiedono i dati della struttura reale.</p></div></section>
      <p className="editorial-quote">{details.closing}</p>
      <section className="related-section"><Eyebrow>Il giorno continua</Eyebrow><div className="related-links rich-related">{related.map(item => <Link key={item.id} to={`/${item.id}`}><Photo id={item.imageId} /><div><span>{item.label}</span><h3>{item.title}</h3><Arrow direction="diagonal" /></div></Link>)}</div></section>
    </div><StayInvitation />
  </div>;
}

export function SuiteListPage() {
  const { openBooking } = useUI();
  return <div className="destination-page"><DestinationHero image="suite-baia" kicker="Le camere / Tre atmosfere" title="Il paesaggio, anche dentro." subtitle="Luce, legno e un posto in cui fermarsi." />
    <div className="page-container" id="racconto"><Breadcrumb current="Le camere" />
      <div className="suite-list rich-suite-list">{content.rooms.map((room, index) => {
        const story = roomDetails[room.id];
        return <article className="suite-list-item" key={room.id}><Link to={`/suite/${room.id}`} className="room-image-link" aria-label={`Esplora ${room.name}`}><Photo id={room.id} /></Link><div><Eyebrow>0{index + 1} / {story.tag}</Eyebrow><h2>{room.name}</h2><p>{story.story}</p><ul className="amenities" aria-label="Carattere della camera">{story.materialNotes.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul><div className="suite-list-actions"><Link className="text-link" to={`/suite/${room.id}`}>Esplora la camera <Arrow direction="diagonal" /></Link><button className="small-link" onClick={() => openBooking({ roomId: room.id })}>Scegli questa atmosfera <Arrow /></button></div></div></article>;
      })}</div>
    </div><StayInvitation />
  </div>;
}

export function SuitePage() {
  const { id } = useParams();
  const room = content.rooms.find(item => item.id === id);
  const { openBooking } = useUI();
  if (!room) return <NotFound />;
  const story = roomDetails[room.id];
  return <div className="destination-page"><DestinationHero image={room.id} kicker={story.tag} title={room.name} subtitle={story.lead} />
    <div className="page-container" id="racconto"><Breadcrumb current={room.name} parent={{ href: '/suite', label: 'Camere' }} />
      <section className="destination-intro"><div><Eyebrow>Il tuo spazio / {room.name}</Eyebrow><h2>{story.title}</h2></div><div><p className="large-copy">{story.story}</p><p>{story.detail}</p><button className="text-link" onClick={() => openBooking({ roomId: room.id })}>Conserva questa scelta <Arrow direction="diagonal" /></button></div></section>
      <div className="room-atmosphere"><div><Photo id={room.id} /></div><figure><Photo id="food" /><figcaption>Il primo caffè, con calma.</figcaption></figure></div>
      <section className="detail-includes"><div><Eyebrow>Il carattere della camera</Eyebrow><h2>Luce e materia.<br /><em>Il riposo prende forma.</em></h2></div><div><ul className="includes-list">{story.materialNotes.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul><p className="availability-note">La camera è una proposta di concept. Dimensioni, capienza, dotazioni e tariffe non sono disponibili per una struttura reale.</p></div></section>
      <section className="related-section"><Eyebrow>Un’altra atmosfera</Eyebrow><div className="related-links rich-related">{content.rooms.filter(item => item.id !== room.id).map(item => <Link to={`/suite/${item.id}`} key={item.id}><Photo id={item.id} /><div><span>{roomDetails[item.id].tag}</span><h3>{item.name}</h3><Arrow direction="diagonal" /></div></Link>)}</div></section>
    </div><StayInvitation />
  </div>;
}

const dayMoments = [
  { id: 'colazione', label: 'Il mattino', title: 'Il primo caffè.', text: 'La luce sulla tavola e una pausa prima di scegliere la direzione del giorno.', image: 'food', href: '/ristorante', interest: 'ristorante' },
  { id: 'mare', label: 'Fuori', title: 'La strada verso il mare.', text: 'Dalla pineta alla battigia, il paesaggio cambia mentre il ritmo resta leggero.', image: 'fitness', href: '/fitness', interest: 'fitness' },
  { id: 'piscina', label: 'Il pomeriggio', title: 'Un tuffo, una parentesi.', text: 'L’acqua riflette la facciata e l’ombra disegna un posto in cui fermarsi.', image: 'spa', href: '/spa', interest: 'spa' },
  { id: 'aperitivo', label: 'Verso sera', title: 'Restiamo ancora.', text: 'Un brindisi sposta l’attenzione dal paesaggio alle persone, mentre cambia la luce.', image: 'dining', href: '/ristorante', interest: 'ristorante' },
];

export function ExperiencesPage() {
  const { openBooking } = useUI();
  return <div className="destination-page"><DestinationHero image="private-beach" kicker="Le ore del mare" title="Un giorno, al tuo ritmo." subtitle="Quattro momenti. Tutto il tempo in mezzo." />
    <div className="page-container" id="racconto"><Breadcrumb current="La giornata" />
      <div className="experience-stories rich-experiences">{dayMoments.map((item, index) => <article className="experience-story" key={item.id} id={item.id}><div><Photo id={item.image} /></div><div><Eyebrow>0{index + 1} / {item.label}</Eyebrow><h2>{item.title}</h2><p>{item.text}</p><div className="suite-list-actions"><Link className="text-link" to={item.href}>Esplora questo momento <Arrow direction="diagonal" /></Link><button className="small-link" onClick={() => openBooking({ interest: item.interest })}>Conserva la preferenza <Arrow /></button></div></div></article>)}</div>
    </div><StayInvitation />
  </div>;
}

export function GalleryPage() {
  return <div className="detail-page"><div className="page-container"><Breadcrumb current="Fotografie" /><div className="page-title"><Eyebrow>Un giorno, nove sguardi</Eyebrow><h1>La luce.<br /><em>Le ore del mare.</em></h1><p>Nove immagini generate per il concept: ambienti, paesaggio e piccoli gesti di una giornata sulla costa.</p></div><Gallery full /></div><StayInvitation /></div>;
}

export function ContactPage() {
  const { openBooking } = useUI();
  return <div className="detail-page"><div className="page-container"><Breadcrumb current="Informazioni e contatti" />
    <section className="contact-intro"><div><Eyebrow>Prima di partire</Eyebrow><h1>Da un’idea,<br /><em>al tuo soggiorno.</em></h1><p>Scegli le date e raccogli le preferenze. Puoi rivedere il riepilogo, copiarlo o salvarlo per riprenderlo più avanti.</p><button className="button primary" onClick={() => openBooking()}>Prepara il soggiorno <Arrow direction="diagonal" /></button>
      <div className="concierge-note"><h2>Il punto di partenza.</h2><p>Questa anteprima non ha una reception, un numero di telefono o un indirizzo email dell’hotel. L’invio di richieste e le informazioni di arrivo richiedono i recapiti ufficiali della struttura.</p><Link className="text-link" to="/#informazioni">Il contesto del progetto <Arrow direction="diagonal" /></Link></div>
    </div><div className="contact-note"><Photo id="food" /><div><Eyebrow>Memento Design Studio</Eyebrow><p>MEMENTO Hotel &amp; Beach è un hotel immaginario ispirato all’Alto Adriatico. Le fotografie sono generate e raccontano una proposta di design: camere, attività e ambienti dovranno essere confermati con materiali reali.</p></div></div></section><FAQ compact />
  </div></div>;
}

export function NotFound() {
  return <section className="not-found page-container"><Eyebrow>MEMENTO / 404</Eyebrow><h1>Torniamo<br /><em>al mare.</em></h1><p>Questa pagina non è disponibile. Puoi ripartire dalla visita o esplorare le camere.</p><Link to="/" className="button primary">Ritorna alla home <Arrow /></Link><Link to="/suite" className="text-link">Esplora le camere <Arrow direction="diagonal" /></Link><HeroPhoto decorative /></section>;
}
