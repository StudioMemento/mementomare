import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '../data/editorial';
import { Arrow, Eyebrow, HeroPhoto, Photo } from './Primitives';

gsap.registerPlugin(ScrollTrigger);

export function DaySequence() {
  const ref = useRef<HTMLElement>(null);
  const stages = ['spiaggia', 'spa', 'ristorante'].map(id => content.services.find(s => s.id === id)!);
  const moments = ['La mattina, senza fretta', 'Un pomeriggio per sé', 'La sera, da assaporare'];
  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const panels = Array.from(section.querySelectorAll<HTMLElement>('.day-stage'));
      const dots = Array.from(section.querySelectorAll<HTMLElement>('.day-dot'));
      section.dataset.pinned = 'true';
      let current = -1;
      const setStage = (index: number) => {
        if (current === index) return;
        current = index;
        panels.forEach((panel, i) => {
          panel.classList.toggle('is-active', i === index);
          panel.inert = i !== index;
          panel.setAttribute('aria-hidden', String(i !== index));
        });
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      };
      setStage(0);
      const trigger = ScrollTrigger.create({
        trigger: section, start: 'top top', end: () => `+=${Math.round(window.innerHeight * 1.2)}`,
        pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => setStage(Math.min(2, Math.floor(self.progress * 3))),
      });
      return () => {
        trigger.kill();
        delete section.dataset.pinned;
        panels.forEach(panel => { panel.inert = false; panel.removeAttribute('aria-hidden'); panel.classList.remove('is-active'); });
      };
    });
    return () => mm.revert();
  }, []);
  return <section className="day-section" id="un-giorno" ref={ref} aria-label="Un giorno a MEMENTO">
    <div className="day-landscape"><HeroPhoto decorative /><div className="day-landscape-shade" /><div className="day-title"><Eyebrow>Un luogo, mille piccoli momenti</Eyebrow><h2>Un giorno<br />a MEMENTO.</h2><p>Segui la luce.<br />Al resto, pensiamo noi.</p><span className="day-landscape-line" /></div></div>
    <div className="day-content"><div className="day-progress" aria-hidden="true">{stages.map((s, i) => <span className="day-dot" key={s.id}><b>0{i + 1}</b><i /></span>)}</div><div className="day-stages">{stages.map((service, index) => <article className="day-stage" key={service.id}><div className="day-photo"><Photo id={service.imageId} /></div><Eyebrow>{moments[index]}</Eyebrow><h3>{service.title}</h3><p>{service.description}</p><Link className="text-link" to={`/${service.id}`}>{service.label} <Arrow direction="diagonal" /></Link></article>)}</div></div>
  </section>;
}
