import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function usePageMotion(root: RefObject<HTMLElement | null>, pageKey: string) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.reveal', root.current).forEach(element => {
          gsap.fromTo(element, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
        });
        const heroCopy = root.current?.querySelectorAll('.hero-line-inner');
        if (heroCopy?.length) gsap.fromTo(heroCopy, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .09, ease: 'power3.out', delay: .08 });
      });
      mm.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.image-reveal', root.current).forEach(frame => {
          const photo = frame.querySelector('.photo');
          if (!photo) return;
          gsap.fromTo(photo, { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
        });
        const hero = root.current?.querySelector('.hero');
        if (hero) gsap.fromTo('.hero-photo', { scale: 1.035, yPercent: 0 }, { scale: 1, yPercent: -3, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .65 } });
      });
    }, root);
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => { alive = false; mm.revert(); ctx.revert(); };
  }, [pageKey, root]);
}
