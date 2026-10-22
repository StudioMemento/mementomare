import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { ContactPage, ExperiencesPage, GalleryPage, NotFound, ServicePage, SuiteListPage, SuitePage } from './pages/Details';
import { Footer, Header, MenuDialog } from './components/Shell';
import { BookingDrawer } from './components/Booking';
import { GalleryDialog } from './components/Content';
import { UIContext } from './components/UIContext';
import type { Overlay } from './components/UIContext';
import { emptyBooking } from './booking/validation';
import type { BookingDraft } from './booking/validation';

function PageContent() {
  const location = useLocation();
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    let target: HTMLElement | null = null;
    try { target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch { /* A malformed hash must not break navigation. */ }
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    const titles: Record<string, string> = { '/': 'Le ore del mare', '/suite': 'Le camere', '/spiaggia': 'Mare e spiaggia', '/spa': 'Piscina e relax', '/fitness': 'Bici e dintorni', '/ristorante': 'A tavola', '/esperienze': 'Le esperienze', '/galleria': 'Galleria', '/contatti': 'Contatti' };
    const name = titles[location.pathname] ?? (location.pathname.startsWith('/suite/') ? 'La tua camera' : 'MEMENTO');
    document.title = `${name} — MEMENTO · Hotel & Beach`;
  }, [location.pathname, location.hash, location.key]);
  return <main id="main-content" ref={root} className="site-main" tabIndex={-1}>
    <Routes><Route path="/" element={<Home />} /><Route path="/suite" element={<SuiteListPage />} /><Route path="/suite/:id" element={<SuitePage />} />{['spiaggia', 'spa', 'fitness', 'ristorante'].map(id => <Route path={`/${id}`} element={<ServicePage id={id} key={id} />} key={id} />)}<Route path="/esperienze" element={<ExperiencesPage />} /><Route path="/galleria" element={<GalleryPage />} /><Route path="/contatti" element={<ContactPage />} /><Route path="*" element={<NotFound />} /></Routes>
  </main>;
}

export default function App() {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [draft, setDraft] = useState<BookingDraft>({ ...emptyBooking });
  const value = useMemo(() => ({
    overlay, setOverlay, draft, setDraft,
    openBooking: (context?: { roomId?: string; interest?: string }) => {
      if (context) setDraft(current => ({ ...current,
        roomId: context.roomId ?? current.roomId,
        interests: context.interest && !current.interests.includes(context.interest) ? [...current.interests, context.interest] : current.interests,
      }));
      setOverlay({ type: 'booking' });
    },
  }), [overlay, draft]);
  return <UIContext.Provider value={value}><div className="editorial-site"><a href="#main-content" className="skip-link">Vai al contenuto</a><Header /><PageContent /><Footer /><MenuDialog /><BookingDrawer /><GalleryDialog /></div></UIContext.Provider>;
}
