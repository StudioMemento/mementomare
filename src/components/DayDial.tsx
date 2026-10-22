import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Photo } from './Primitives';

const moments = [
  {
    id: 'mattino', label: 'Il mattino', time: '08:30', photo: 'food',
    title: 'Ancora un caffè.',
    description: 'La luce sulla tavola, qualcosa di dolce e il tempo di scegliere come cominciare.',
    href: '/ristorante', link: 'Colazione e aperitivo',
    caption: 'Una tavola nella luce del mattino',
  },
  {
    id: 'pomeriggio', label: 'Il pomeriggio', time: '15:00', photo: 'spa',
    title: 'Una pausa, a bordo acqua.',
    description: 'Le righe degli ombrelloni, un riflesso azzurro e un’ombra in cui fermarsi.',
    href: '/spa', link: 'Piscina e relax',
    caption: 'Il cortile e la piscina, nel pomeriggio',
  },
  {
    id: 'sera', label: 'L’ultima luce', time: '19:00', photo: 'dining',
    title: 'Restiamo ancora un po’.',
    description: 'Due bicchieri sulla terrazza. Il sole scende e la conversazione può continuare.',
    href: '/ristorante', link: 'L’ora dell’aperitivo',
    caption: 'Un brindisi vicino al mare',
  },
] as const;

/** A photographic daybook: three independent scenes, never a fabricated time-lapse. */
export function DayDial() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const instance = useId();
  const moment = moments[selected];
  const panelId = `${instance}-day-panel`;

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = (index + 1) % moments.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + moments.length) % moments.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = moments.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return <section id="giornata" className="ed-day-dial" aria-labelledby="ed-day-heading">
    <header className="ed-day-heading">
      <div><p className="ed-day-kicker">03 / La giornata</p><h2 id="ed-day-heading">Ogni ora, <em>un altro ritmo.</em></h2></div>
      <p>Dal primo caffè all’ultima luce. Tocca un momento e cambia prospettiva.</p>
    </header>
    <div className="ed-day-selector" role="tablist" aria-label="Scegli un momento della giornata">
      {moments.map((item, index) => <button key={item.id} type="button" role="tab"
        ref={element => { tabs.current[index] = element; }}
        id={`${instance}-day-tab-${index}`} aria-controls={panelId}
        aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
        className={selected === index ? 'is-selected' : ''}
        onClick={() => setSelected(index)} onKeyDown={event => moveTab(event, index)}>
        <span className="ed-day-tab-time">{item.time}</span><span className="ed-day-tab-label">{item.label}</span>
        <span className="ed-day-tab-dot" aria-hidden="true" />
      </button>)}
    </div>
    <div id={panelId} className="ed-day-panel" role="tabpanel" aria-labelledby={`${instance}-day-tab-${selected}`} tabIndex={0}>
      <figure className={`ed-day-photograph ed-day-${moment.id}`}>
        <div className="ed-day-image-stack">
          {moments.map((item, index) => <div className={`ed-day-frame ${selected === index ? 'is-active' : ''}`}
            key={item.id} aria-hidden={selected !== index}>
            <Photo id={item.photo} decorative={selected !== index} sizes="(max-width: 767px) 100vw, 90vw" />
          </div>)}
          <div className="ed-day-image-label" aria-hidden="true"><span>{moment.time}</span><span>{moment.label}</span></div>
        </div>
        <figcaption><span>{moment.caption}</span><span>Tre scene, una giornata immaginata</span></figcaption>
      </figure>
      <div className="ed-day-detail">
        <h3 aria-live="polite" aria-atomic="true">{moment.title}</h3>
        <p>{moment.description}</p>
        <Link to={moment.href} className="ed-day-link">{moment.link}<Arrow direction="diagonal" /></Link>
      </div>
    </div>
    <p className="ed-day-note">Immagini concept. Gli orari raccontano la giornata e non indicano gli orari di apertura dei servizi.</p>
  </section>;
}

export default DayDial;
