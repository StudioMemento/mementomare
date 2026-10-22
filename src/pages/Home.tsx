import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Eyebrow, Photo } from '../components/Primitives';
import { useUI } from '../components/UIContext';
import { DayDial } from '../components/DayDial';
import { BookingInvitation } from '../components/Booking';
import { InfoAndContact } from '../components/InfoAndContact';
import { RoomExplorer } from '../components/RoomExplorer';
import { useEditorialMotion } from '../motion/useEditorialMotion';

export default function Home(){
 const root=useRef<HTMLDivElement>(null);
 const [motion,setMotion]=useState(true);
 const {openBooking}=useUI();
 useEditorialMotion(root,motion);
 return <div className={`ed-home ${motion?'':'ed-motion-off'}`} ref={root}>
  <section className="ed-arrival" id="arrivo" aria-labelledby="arrival-title">
   <div className="ed-arrival-media"><Photo id="spa" priority decorative /></div>
   <div className="ed-arrival-shade" />
   <div className="ed-arrival-copy"><Eyebrow>MEMENTO Hotel & Beach · Alto Adriatico · Concept</Eyebrow><h1 id="arrival-title">Il mare.<br /><em>Il resto può aspettare.</em></h1><p>Una giornata da abitare, dalla prima luce all’ultimo brindisi.</p><div className="ed-arrival-actions"><button className="ed-button" onClick={()=>openBooking()}>Prenota <Arrow direction="diagonal" /></button><a href="#camere" className="ed-link">Esplora le camere <Arrow direction="down" /></a></div></div>
   <figure className="ed-arrival-window"><Photo id="hero-beach" sizes="(max-width:767px) 1px, 24vw" /><figcaption><span>Fuori, il mare.</span><span>01 / L’arrivo</span></figcaption></figure>
   <div className="ed-arrival-meta"><span>Le ore del mare <i aria-hidden="true">—</i> Un racconto Memento</span><a href="#dimora" aria-label="Scopri il primo capitolo"><Arrow direction="down" /></a><button type="button" className="ed-motion-toggle" aria-pressed={!motion} onClick={()=>setMotion(v=>!v)}>{motion?'Riduci movimento':'Attiva movimento'}</button></div>
  </section>
  <section className="ed-intro" id="dimora" aria-labelledby="intro-title">
   <div className="ed-intro-head"><Eyebrow>01 / Entrare in vacanza</Eyebrow><h2 id="intro-title">Prima di disfare<br />la valigia, <em>respira.</em></h2></div><div className="ed-intro-copy"><p>La luce sulle facciate, l’ombra dei pini, una finestra aperta. Il nostro racconto dell’Alto Adriatico comincia dalle cose che fanno cambiare passo.</p><p className="ed-concept-note">Un hotel immaginato da Memento Design Studio. Fotografie e ambienti illustrano il concept.</p><Link to="/spiaggia" className="ed-link">Scopri il mare <Arrow direction="diagonal" /></Link></div>
   <figure className="ed-intro-photo-wide" data-ed-photo-drift><Photo id="private-beach" sizes="(max-width:767px) 100vw, 60vw" /><figcaption>La prima passeggiata, senza guardare l’ora.</figcaption></figure><figure className="ed-intro-photo-detail" data-ed-photo-drift><Photo id="food" sizes="(max-width:767px) 55vw, 25vw" /><figcaption>I piccoli rituali dell’estate.</figcaption></figure>
  </section>
  <RoomExplorer />
  <DayDial />
  <section id="fuori" className="ed-outside" aria-labelledby="outside-title">
   <figure className="ed-outside-landscape"><Photo id="private-beach" sizes="100vw" /><figcaption><span>04 / Fuori, senza programmi</span><span>La spiaggia, nel racconto Memento</span></figcaption></figure>
   <div className="ed-outside-bottom"><div className="ed-outside-copy"><Eyebrow>Tra la sabbia e i pini</Eyebrow><h2 id="outside-title">La strada lunga.<br /><em>Il tempo giusto.</em></h2><p>Camminare sulla riva, prendere la bici, fermarsi ancora un momento. Il paesaggio suggerisce una direzione; il ritmo lo scegli tu.</p><Link to="/fitness" className="ed-link">Bici e dintorni <Arrow direction="diagonal" /></Link></div><figure className="ed-outside-detail"><Photo id="fitness" sizes="(max-width:767px) 100vw, 45vw" /><figcaption>Un giro in pineta, nel concept.</figcaption></figure></div>
  </section>
  <InfoAndContact />
  <div id="soggiorno"><BookingInvitation /></div>
 </div>;
}
