import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { photographs } from '../data/rich';

export function Arrow({ direction = 'right', className = '' }: { direction?: 'right' | 'left' | 'down' | 'diagonal'; className?: string }) {
  const paths = { right: 'M5 12h14M13 6l6 6-6 6', left: 'M19 12H5M11 6l-6 6 6 6', down: 'M12 5v14M6 13l6 6 6-6', diagonal: 'M6 18 18 6M6 6h12v12' };
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[direction]} /></svg>;
}

export function CloseIcon() {
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>;
}

export function HeroPhoto(props: { className?: string; priority?: boolean; decorative?: boolean }) { return <Photo id="hero-beach" {...props} />; }

export function Photo({ id, className = '', decorative = false, priority = false, sizes = '100vw' }: { id: string; className?: string; decorative?: boolean; priority?: boolean; sizes?: string }) {
  const [reducedFile, setReducedFile] = useState<string | null>(null);
  const [failedFile, setFailedFile] = useState<string | null>(null);
  const key = id === 'suite' ? 'suite-baia' : id;
  const photo = photographs[key] ?? photographs['hero-beach'];
  const reduced = reducedFile === photo.file;
  return failedFile === photo.file ? <div className={`photo photo-fallback ${className}`} role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : photo.alt}><span>Immagine non disponibile</span><small>{photo.label}</small></div> : <img
    key={`${photo.file}-${reduced ? 'reduced' : 'responsive'}`}
    className={`photo ${className}`} src={`/assets/photos/${photo.file}-${reduced ? '768' : '1536'}.webp`}
    srcSet={reduced ? undefined : `/assets/photos/${photo.file}-768.webp 768w, /assets/photos/${photo.file}-1536.webp 1536w`}
    sizes={sizes} width={1536} height={1024}
    alt={decorative ? '' : photo.alt} loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : 'auto'} decoding="async" onError={() => reduced ? setFailedFile(photo.file) : setReducedFile(photo.file)}
  />;
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Modal({ open, onClose, kind, titleId, children }: { open: boolean; onClose: () => void; kind: string; titleId: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => (dialog.querySelector('[data-initial-focus]') as HTMLElement | null)?.focus());
    return () => {
      cancelAnimationFrame(frame);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);
  if (!open) return null;
  return <dialog ref={ref} className={`modal modal-${kind}`} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); closeRef.current(); }}
    onClick={event => { if (event.target === event.currentTarget) closeRef.current(); }}>
    <div className="modal-inner">{children}</div>
  </dialog>;
}
