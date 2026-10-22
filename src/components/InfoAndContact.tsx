import { Link } from 'react-router-dom';
import { Arrow, Eyebrow, Photo } from './Primitives';

export function InfoAndContact() {
  return <section id="informazioni" className="ed-information" aria-labelledby="ed-information-title">
    <div className="ed-information-heading"><Eyebrow>Il luogo / Prima di partire</Eyebrow><h2 id="ed-information-title">Un orizzonte vicino.<br /><em>Le cose da sapere.</em></h2><p>Spiagge ampie, pineta e giornate all’aperto: l’Alto Adriatico è il paesaggio a cui si ispira questo progetto.</p></div>
    <div className="ed-information-grid">
      <figure className="ed-information-location"><Photo id="fitness" /><figcaption>Pineta e mare · Un’immagine del concept</figcaption></figure>
      <div className="ed-information-details">
        <dl className="ed-information-list">
          <div><dt>Il progetto</dt><dd>MEMENTO Hotel &amp; Beach è un hotel immaginario, ideato da Memento Design Studio per esplorare un nuovo modo di raccontare l’ospitalità balneare.</dd></div>
          <div><dt>La posizione</dt><dd>Alto Adriatico come riferimento, senza un indirizzo reale. La località e le indicazioni di arrivo saranno quelle della struttura che adotterà il progetto.</dd></div>
          <div><dt>Il soggiorno</dt><dd>Puoi scegliere date e preferenze. In questa anteprima non sono collegati una reception, tariffe o disponibilità reali.</dd></div>
        </dl>
        <Link className="ed-text-link" to="/contatti">Informazioni e domande <Arrow direction="diagonal" /></Link>
      </div>
    </div>
  </section>;
}
