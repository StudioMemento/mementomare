import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Native scroll with bounded photographic movement only.
 * Text, links and controls have no animation-dependent visibility state.
 */
export function useEditorialMotion(root: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    const media = gsap.matchMedia();
    let alive = true;
    let refreshFrame: number | undefined;

    const scheduleRefresh = () => {
      if (!alive || refreshFrame !== undefined) return;
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = undefined;
        if (alive) ScrollTrigger.refresh();
      });
    };

    const context = gsap.context(() => {
      media.add({
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 768px)',
      }, match => {
        if (!match.conditions?.motion) return;
        const desktop = Boolean(match.conditions.desktop);
        const arrival = element.querySelector<HTMLElement>('.ed-arrival');
        const arrivalImage = element.querySelector<HTMLElement>('.ed-arrival-media .photo');
        const arrivalWindow = element.querySelector<HTMLElement>('.ed-arrival-window');
        if (arrival && arrivalImage) {
          gsap.fromTo(arrivalImage, { scale: 1.025, y: 0 }, {
            scale: 1.045, y: desktop ? 22 : 10, ease: 'none',
            scrollTrigger: {
              trigger: arrival, start: 'top top', end: 'bottom top',
              scrub: .6, invalidateOnRefresh: true,
            },
          });
        }
        if (arrival && arrivalWindow && desktop) {
          gsap.fromTo(arrivalWindow, { y: 0 }, {
            y: -24, ease: 'none',
            scrollTrigger: { trigger: arrival, start: 'top top', end: 'bottom top', scrub: .6 },
          });
        }
        // A single quiet transition into the house. No repeated text reveals.
        const intro = element.querySelector<HTMLElement>('.ed-intro');
        if (intro) {
          const images = intro.querySelectorAll<HTMLElement>('[data-ed-photo-drift]');
          images.forEach((image, index) => {
            gsap.fromTo(image, { y: desktop ? (index % 2 ? 20 : -16) : 8 }, {
              y: 0, ease: 'none',
              scrollTrigger: {
                trigger: intro, start: 'top bottom', end: 'center center',
                scrub: .65, invalidateOnRefresh: true,
              },
            });
          });
        }
      });
    }, element);

    const images = Array.from(element.querySelectorAll('img'));
    images.forEach(image => image.addEventListener('load', scheduleRefresh, { once: true }));
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleRefresh) : null;
    observer?.observe(element);
    document.fonts?.ready.then(scheduleRefresh);
    scheduleRefresh();

    return () => {
      alive = false;
      if (refreshFrame !== undefined) cancelAnimationFrame(refreshFrame);
      images.forEach(image => image.removeEventListener('load', scheduleRefresh));
      observer?.disconnect();
      media.revert();
      context.revert();
    };
  }, [root, enabled]);
}
