import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import content from '../data/content.it.json';
import { Arrow, Photo } from './Primitives';
import { useUI } from './UIContext';

const roomDetails: Record<string, { detail: string; materials: string[] }> = {
  'suite-baia': {
    detail: 'Tessuti chiari, accenti azzurri e gialli. Dal letto, lo sguardo continua verso il balcone e l’orizzonte.',
    materials: ['Luce naturale', 'Toni del mare', 'Balcone'],
  },
  'suite-giardino': {
    detail: 'Legno chiaro, trame morbide e il profilo dei pini oltre il balcone. Una stanza che abbassa il ritmo.',
    materials: ['Legno chiaro', 'Affaccio sui pini', 'Toni naturali'],
  },
  'suite-panorama': {
    detail: 'Il letto matrimoniale e l’alcova con due letti singoli convivono in un ambiente luminoso, pensato attorno allo stare insieme.',
    materials: ['Letto matrimoniale', 'Alcova con letti singoli', 'Luce calda'],
  },
};

/** Three real controls, one steady editorial composition. No drag gesture required. */
export function RoomExplorer() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const instance = useId();
  const { openBooking } = useUI();
  const room = content.rooms[selected];
  const details = roomDetails[room.id];
  const panelId = `${instance}-room-panel`;

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = (index + 1) % content.rooms.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + content.rooms.length) % content.rooms.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = content.rooms.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return <section id="camere" className="ed-room-explorer" aria-labelledby="ed-room-heading">
    <div className="ed-room-heading">
      <p className="ed-kicker"><span>02 / Dentro</span> Le camere</p>
      <h2 id="ed-room-heading">Trovare il proprio <em>spazio.</em></h2>
      <p>Tre interpretazioni del soggiorno. Scegli una camera, osserva i dettagli.</p>
    </div>
    <div className="ed-room-tabs" role="tablist" aria-label="Esplora le camere">
      {content.rooms.map((item, index) => <button
        key={item.id} ref={element => { tabs.current[index] = element; }}
        id={`${instance}-room-tab-${index}`} role="tab" type="button"
        aria-controls={panelId} aria-selected={selected === index}
        tabIndex={selected === index ? 0 : -1}
        className={selected === index ? 'is-selected' : ''}
        onClick={() => setSelected(index)} onKeyDown={event => moveTab(event, index)}>
        <span className="ed-room-tab-number" aria-hidden="true">0{index + 1}</span>
        <span>{item.name}</span><Arrow direction="diagonal" />
      </button>)}
    </div>
    <div id={panelId} className="ed-room-panel" role="tabpanel" aria-labelledby={`${instance}-room-tab-${selected}`} tabIndex={0}>
      <figure className="ed-room-photograph">
        <div className="ed-room-image-stack">
          {content.rooms.map((item, index) => <div key={item.id}
            className={`ed-room-frame ${selected === index ? 'is-active' : ''}`}
            aria-hidden={selected !== index}>
            <Photo id={item.id} decorative={selected !== index} sizes="(max-width: 700px) 100vw, (max-width: 1023px) 50vw, 60vw" />
          </div>)}
          <span className="ed-room-image-index" aria-hidden="true">0{selected + 1} <i>/</i> 03</span>
        </div>
        <figcaption><span>Interni / {room.name}</span><span>Fotografia concept</span></figcaption>
      </figure>
      <div className="ed-room-detail">
        <div className="ed-room-detail-copy" aria-live="polite" aria-atomic="true">
          <p className="ed-room-label">Uno sguardo dentro</p>
          <h3>{room.name}</h3>
          <p className="ed-room-description">{details.detail}</p>
          <ul className="ed-room-materials" aria-label="Elementi nell’immagine">
            {details.materials.map(material => <li key={material}>{material}</li>)}
          </ul>
        </div>
        <div className="ed-room-actions">
          <Link className="ed-room-link" to={`/suite/${room.id}`}>Esplora la camera <Arrow direction="diagonal" /></Link>
          <button type="button" className="ed-room-book" onClick={() => openBooking({ roomId: room.id })}>Scegli per il soggiorno <Arrow /></button>
        </div>
        <p className="ed-room-footnote">Ambienti dimostrativi. Dotazioni e disponibilità da confermare per la struttura reale.</p>
      </div>
    </div>
  </section>;
}

export default RoomExplorer;
