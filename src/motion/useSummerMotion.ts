import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export function useSummerMotion(root: RefObject<HTMLDivElement | null>, onChapter: (value: string) => void, motion: boolean) {
 useLayoutEffect(() => {
  const el=root.current;
  if(!el)return;
  const mm=gsap.matchMedia();
  const context=gsap.context(() => {
   el.querySelectorAll<HTMLElement>('[data-nav-chapter]').forEach(section => {
    ScrollTrigger.create({ trigger: section, start:'top 45%', end:'bottom 45%', onEnter:()=>onChapter(section.id.replace(/-nav$/,'')), onEnterBack:()=>onChapter(section.id.replace(/-nav$/,'')) });
   });
   if(!motion)return;
   mm.add('(prefers-reduced-motion: no-preference)',() => {
    gsap.fromTo('.summer-hero-title>span',{yPercent:110,rotate:3},{yPercent:0,rotate:0,duration:1.15,stagger:.12,ease:'power4.out'});
    const hero=el.querySelector('.summer-hero');
    gsap.to('.summer-hero-image',{scale:1.08,yPercent:12,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
    gsap.to('.hero-sun',{rotation:90,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
    el.querySelectorAll<HTMLElement>('.scroll-chapter').forEach(section=>{
     section.dataset.animated='true';
     const q=gsap.utils.selector(section);
     gsap.fromTo(q('.scene-visual'),{clipPath:'inset(8% 6% 8% 6% round 36px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:section,start:'top 85%',end:'top top',scrub:.6}});
     const t=gsap.timeline({scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.7,invalidateOnRefresh:true}});
     t.fromTo(q('.scene-visual .photo'),{scale:1.09},{scale:1,ease:'none',duration:1},0)
      .fromTo(q('.scene-copy'),{y:45},{y:0,ease:'power1.out',duration:.55},0)
      .fromTo(q('.scene-word'),{xPercent:12},{xPercent:-8,ease:'none',duration:1},0)
      .fromTo(q('.scene-meter i'),{scaleX:0},{scaleX:1,ease:'none',duration:1},0);
     if(q('.scene-snapshot').length)t.fromTo(q('.scene-snapshot'),{y:120,rotation:9,opacity:0},{y:0,rotation:-5,opacity:1,duration:.45,ease:'power2.out'},.2);
    });
    gsap.fromTo('.summer-photo-strip>a',{y:70,rotation:8},{y:0,rotation:(i:number)=>i%2?-4:4,ease:'power2.out',stagger:.13,scrollTrigger:{trigger:'.summer-photo-strip',start:'top 85%',end:'top 25%',scrub:1}});
   });
  },root);
  const images=Array.from(el.querySelectorAll('img'));
  const refresh=()=>ScrollTrigger.refresh();
  images.forEach(img=>img.addEventListener('load',refresh,{once:true}));
  let alive=true;
  document.fonts.ready.then(()=>{if(alive)refresh();});
  return()=>{alive=false;images.forEach(img=>img.removeEventListener('load',refresh));mm.revert();context.revert();el.querySelectorAll<HTMLElement>('.scroll-chapter').forEach(s=>delete s.dataset.animated);};
 },[root,onChapter,motion]);
}
