import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Eyebrow, Photo } from './Primitives';

export function Sun({ className = '' }: { className?: string }) {
 return <svg className={`summer-sun ${className}`} viewBox="0 0 100 100" fill="none" aria-hidden="true"><circle cx="50" cy="50" r="19" stroke="currentColor" strokeWidth="2" />{Array.from({length:12},(_,i)=><path key={i} d="M50 7v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i*30} 50 50)`}/>)}</svg>;
}

export function SummerScene({ id, index, tone, image, label, title, description, href, cta, snapshot, snapshotLabel, children }: { id:string;index:string;tone:string;image:string;label:string;title:ReactNode;description:string;href:string;cta:string;snapshot?:string;snapshotLabel?:string;children?:ReactNode }) {
 return <section className={`scroll-chapter chapter-${tone}`} id={id} aria-labelledby={`${id}-title`} data-chapter={index}>
   <div className="scene-sticky">
     <div className="scene-visual"><Photo id={image} decorative /></div><div className="scene-tint" />
     <div className="scene-topline"><span>0{index} / L’estate MEMENTO</span><span>{label}</span></div>
     <div className="scene-copy"><Eyebrow>{label}</Eyebrow><h2 id={`${id}-title`}>{title}</h2><div className="scene-description"><p>{description}</p><Link to={href} className="sun-link">{cta}<span><Arrow /></span></Link></div>{children}</div>
     {snapshot&&<figure className="scene-snapshot"><Photo id={snapshot} /><figcaption>{snapshotLabel}<Sun /></figcaption></figure>}
     <span className="scene-word" aria-hidden="true">{tone==='sea'?'barefoot':tone==='rooms'?'stay':tone==='pool'?'slow':'together'}</span>
     <div className="scene-bottom"><span>Scorri. Cambia ritmo.</span><span className="scene-meter"><i /></span><span>0{index} — 04</span></div>
   </div>
 </section>;
}
