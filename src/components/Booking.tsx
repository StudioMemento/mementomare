import { useEffect, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';
import { Arrow, CloseIcon, Modal, Photo } from './Primitives';
import { useUI } from './UIContext';
import { content } from '../data/editorial';
import { bookingConfig, officialBookingUrl, requestEndpoint } from '../booking/config';
import { makeStayText, sendAvailabilityRequest, validateContact } from '../booking/request';
import type { RequestContact, RequestReceipt } from '../booking/request';
import { displayDate, stayNights, todayInRome, validateBooking } from '../booking/validation';
import type { BookingDraft } from '../booking/validation';

const emptyContact: RequestContact = { name: '', email: '', permission: false };
type StayErrors = Partial<Record<keyof BookingDraft, string>>;
type ContactErrors = Partial<Record<keyof RequestContact, string>>;

export function HeroBooking() {
  const { openBooking } = useUI();
  return <button className="ed-button ed-button-primary" onClick={() => openBooking()}>Prenota <Arrow /></button>;
}

export function BookingInvitation() {
  const { draft, openBooking } = useUI();
  return <section className="ed-booking-invitation" aria-labelledby="ed-booking-invitation-title">
    <div className="ed-booking-invitation-heading"><p className="ed-kicker">06 / Il prossimo soggiorno</p><h2 id="ed-booking-invitation-title">Fai spazio<br /><em>a qualche giorno.</em></h2></div>
    <div className="ed-booking-invitation-content"><p>Comincia dalle date e dalle persone con cui vuoi partire.</p>
      <div className="ed-stay-strip"><dl><div><dt>Arrivo</dt><dd>{draft.arrival ? displayDate(draft.arrival) : 'Scegli la data'}</dd></div><div><dt>Partenza</dt><dd>{draft.departure ? displayDate(draft.departure) : 'Scegli la data'}</dd></div><div><dt>Ospiti</dt><dd>{draft.adults} {draft.adults === 1 ? 'adulto' : 'adulti'}{draft.children > 0 ? ` · ${draft.children} ${draft.children === 1 ? 'bambino' : 'bambini'}` : ''}</dd></div></dl><button className="ed-button ed-button-primary" onClick={() => openBooking()}>Scegli il soggiorno <Arrow /></button></div>
      {!officialBookingUrl(bookingConfig) && !requestEndpoint(bookingConfig) && <p className="ed-booking-concept-note">Concept Memento · Puoi preparare il tuo piano. Invio e disponibilità non sono ancora collegati a una struttura.</p>}
    </div>
  </section>;
}

function minDeparture(arrival: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival)) return todayInRome();
  const next = new Date(`${arrival}T00:00:00Z`);
  if (Number.isNaN(next.getTime())) return todayInRome();
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

export function BookingDrawer() {
  const { draft, setDraft, overlay, setOverlay } = useUI();
  const open = overlay?.type === 'booking';
  const officialUrl = officialBookingUrl(bookingConfig);
  const privacyUrl = officialBookingUrl({ ...bookingConfig, officialUrl: bookingConfig.privacyUrl ?? null });
  const endpoint = requestEndpoint(bookingConfig);
  const mode = officialUrl ? 'engine' : endpoint ? 'request' : 'plan';
  const [step, setStep] = useState<'dates' | 'review' | 'receipt'>('dates');
  const [errors, setErrors] = useState<StayErrors>({});
  const [contact, setContact] = useState<RequestContact>(emptyContact);
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [receipt, setReceipt] = useState<RequestReceipt | null>(null);
  const [pending, setPending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [showText, setShowText] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const requestId = useRef('');

  useEffect(() => {
    if (open) {
      setStep('dates'); setErrors({}); setContact(emptyContact); setContactErrors({});
      setReceipt(null); setSendError(''); setCopyStatus(''); setShowText(false); setPending(false); requestId.current = '';
    }
    return () => { requestRef.current?.abort(); };
  }, [open]);

  const roomLabel = content.rooms.find(room => room.id === draft.roomId)?.name || 'Da scegliere';
  const nights = stayNights(draft.arrival, draft.departure);
  const interestLabels = draft.interests.flatMap(id => { const service = content.services.find(item => item.id === id); return service ? [service.label] : []; });
  const stayText = makeStayText(draft, roomLabel, interestLabels);
  const title = step === 'dates' ? 'Il tuo soggiorno.' : step === 'receipt' ? 'Richiesta ricevuta.' : mode === 'plan' ? 'Il piano è pronto.' : 'Rivedi la richiesta.';

  function focusTitle() { requestAnimationFrame(() => document.getElementById('ed-booking-title')?.focus()); }
  function close() { requestRef.current?.abort(); setOverlay(null); }
  function update<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
    requestId.current = '';
  }
  function updateContact<K extends keyof RequestContact>(key: K, value: RequestContact[K]) {
    setContact(current => ({ ...current, [key]: value }));
    setContactErrors(current => ({ ...current, [key]: undefined }));
    setSendError(''); requestId.current = '';
  }
  function review(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateBooking({ ...draft, notes: mode === 'request' ? draft.notes : '' });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus());
      return;
    }
    setStep('review'); setCopyStatus(''); setSendError(''); focusTitle();
  }
  async function send(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode !== 'request' || pending) return;
    const nextErrors = validateContact(contact);
    setContactErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus());
      return;
    }
    setPending(true); setSendError('');
    const controller = new AbortController(); requestRef.current = controller;
    requestId.current ||= globalThis.crypto?.randomUUID?.() || `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const result = await sendAvailabilityRequest(bookingConfig, draft, contact, { requestId: requestId.current, signal: controller.signal });
      if (!controller.signal.aborted) { setReceipt(result); setStep('receipt'); focusTitle(); }
    } catch (error) {
      if (!controller.signal.aborted) {
        setSendError(error instanceof Error ? error.message : 'Ricezione non confermata. Riprova tra poco.');
        requestAnimationFrame(() => document.getElementById('ed-send-error')?.focus());
      }
    } finally { if (!controller.signal.aborted) setPending(false); }
  }
  async function copyPlan() {
    setCopyStatus('');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(stayText);
      setCopyStatus('Riepilogo copiato. Nessuna richiesta è stata inviata.');
    } catch {
      setShowText(true); setCopyStatus('La copia automatica non è disponibile. Seleziona il testo qui sotto o scarica il riepilogo.');
      requestAnimationFrame(() => { const field = document.getElementById('ed-copy-text') as HTMLTextAreaElement | null; field?.focus(); field?.select(); });
    }
  }
  function downloadPlan() {
    const url = URL.createObjectURL(new Blob([stayText], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'Memento_piano_soggiorno.txt';
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopyStatus('Riepilogo preparato per il download. Nessuna richiesta è stata inviata.');
  }
  const fieldError = (field: keyof BookingDraft) => errors[field] ? <p className="ed-field-error" id={`ed-${field}-error`}>{errors[field]}</p> : null;
  const contactError = (field: keyof RequestContact) => contactErrors[field] ? <p className="ed-field-error" id={`ed-${field}-error`}>{contactErrors[field]}</p> : null;

  return <Modal open={open} onClose={close} kind="ed-booking" titleId="ed-booking-title"><div className="ed-booking-layout">
    <aside className="ed-booking-photo" aria-hidden="true"><Photo id={draft.roomId || 'hero-beach'} decorative /><div className="ed-booking-photo-caption"><span>MEMENTO</span><p>Le ore<br /><em>del mare.</em></p><span>{draft.roomId ? roomLabel : 'Hotel & Beach · Concept'}</span></div></aside>
    <div className="ed-booking-pane"><header className="ed-booking-head"><span>MEMENTO / Soggiorno</span><button className="ed-close" onClick={close} aria-label="Chiudi il percorso di soggiorno"><CloseIcon /></button></header>
      <div className="ed-booking-body"><p className="ed-booking-progress">{step === 'dates' ? '01 / Date e ospiti' : step === 'receipt' ? 'Ricevuta della richiesta' : '02 / Riepilogo'}<span>{mode === 'plan' ? 'Concept' : 'Prenotazione'}</span></p>
        <h2 id="ed-booking-title" tabIndex={-1} data-initial-focus>{title}</h2>
        {step === 'dates' ? <form ref={formRef} noValidate onSubmit={review} className="ed-booking-form">
          <p className="ed-booking-lead">Le date, le persone, una preferenza per la camera.</p>
          <div className="ed-booking-field-pair"><div className="ed-field"><label htmlFor="ed-arrival">Arrivo</label><input id="ed-arrival" name="arrival" type="date" required min={todayInRome()} value={draft.arrival} onChange={event => update('arrival', event.target.value)} aria-invalid={!!errors.arrival} aria-describedby={errors.arrival ? 'ed-arrival-error' : undefined} />{fieldError('arrival')}</div><div className="ed-field"><label htmlFor="ed-departure">Partenza</label><input id="ed-departure" name="departure" type="date" required min={minDeparture(draft.arrival)} value={draft.departure} onChange={event => update('departure', event.target.value)} aria-invalid={!!errors.departure} aria-describedby={errors.departure ? 'ed-departure-error' : undefined} />{fieldError('departure')}</div></div>
          {nights > 0 && <p className="ed-booking-nights" aria-live="polite">{nights} {nights === 1 ? 'notte' : 'notti'} · {draft.adults + draft.children} {draft.adults + draft.children === 1 ? 'ospite' : 'ospiti'}</p>}
          <div className="ed-booking-field-pair"><div className="ed-field"><label htmlFor="ed-adults">Adulti</label><select id="ed-adults" name="adults" value={draft.adults} onChange={event => update('adults', Number(event.target.value))} aria-invalid={!!errors.adults} aria-describedby={errors.adults ? 'ed-adults-error' : undefined}>{[1, 2, 3, 4, 5, 6].map(value => <option key={value} value={value}>{value} {value === 1 ? 'adulto' : 'adulti'}</option>)}</select>{fieldError('adults')}</div><div className="ed-field"><label htmlFor="ed-children">Bambini</label><select id="ed-children" name="children" value={draft.children} onChange={event => update('children', Number(event.target.value))} aria-invalid={!!errors.children} aria-describedby={errors.children ? 'ed-children-error' : undefined}>{[0, 1, 2, 3, 4].map(value => <option key={value} value={value}>{value} {value === 1 ? 'bambino' : 'bambini'}</option>)}</select>{fieldError('children')}</div></div>
          <div className="ed-field"><label htmlFor="ed-roomId">Preferenza camera <span>Facoltativa</span></label><select id="ed-roomId" name="roomId" value={draft.roomId} onChange={event => update('roomId', event.target.value)} aria-invalid={!!errors.roomId} aria-describedby={errors.roomId ? 'ed-roomId-error' : 'ed-room-note'}><option value="">Da scegliere</option>{content.rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}</select>{fieldError('roomId')}<small id="ed-room-note">La preferenza non garantisce disponibilità o capienza.</small></div>
          <button className="ed-button ed-button-primary ed-booking-next" type="submit">Rivedi il soggiorno <Arrow /></button>
        </form> : step === 'review' ? <div className="ed-booking-review">
          <dl className="ed-stay-summary"><div><dt>Arrivo</dt><dd>{displayDate(draft.arrival)}</dd></div><div><dt>Partenza</dt><dd>{displayDate(draft.departure)} <small>({nights} {nights === 1 ? 'notte' : 'notti'})</small></dd></div><div><dt>Ospiti</dt><dd>{draft.adults} {draft.adults === 1 ? 'adulto' : 'adulti'}{draft.children ? ` · ${draft.children} ${draft.children === 1 ? 'bambino' : 'bambini'}` : ''}</dd></div><div><dt>Camera</dt><dd>{roomLabel}</dd></div>{interestLabels.length > 0 && <div><dt>Interessi</dt><dd>{interestLabels.join(' · ')}</dd></div>}</dl>
          <button type="button" className="ed-booking-edit" disabled={pending} onClick={() => { setStep('dates'); setSendError(''); focusTitle(); }}><Arrow direction="left" />Modifica date e ospiti</button>
          {mode === 'plan' ? <div className="ed-plan-result"><div className="ed-booking-note"><strong>Invio non attivo</strong><p>Questo è un concept. Il piano resta nel tuo browser: puoi copiarlo o scaricarlo. Nessuna richiesta viene inviata.</p></div><div className="ed-plan-actions"><button className="ed-button ed-button-primary" type="button" onClick={copyPlan}>Copia il piano <Arrow /></button><button className="ed-booking-text-button" type="button" onClick={downloadPlan}>Scarica .txt <Arrow direction="down" /></button></div><p className="ed-copy-status" role="status">{copyStatus}</p>{showText && <div className="ed-field"><label htmlFor="ed-copy-text">Riepilogo da copiare</label><textarea id="ed-copy-text" rows={8} value={stayText} readOnly /></div>}</div> : mode === 'engine' ? <div className="ed-engine-next"><p>Prosegui nel sistema ufficiale della struttura per verificare le date, le tariffe e completare la prenotazione.</p><a className="ed-button ed-button-primary" href={officialUrl!}>Apri il booking ufficiale <Arrow /></a><small>Le date e le preferenze andranno confermate nel sistema della struttura.</small></div> : <form ref={formRef} noValidate onSubmit={send} className="ed-booking-form ed-contact-form" aria-busy={pending}>
            <p className="ed-booking-lead">La richiesta sarà inviata a {bookingConfig.recipientLabel}. Indica l’indirizzo email per la risposta.</p>
            <div className="ed-field"><label htmlFor="ed-contact-name">Nome</label><input id="ed-contact-name" name="name" autoComplete="name" maxLength={120} required disabled={pending} value={contact.name} onChange={event => updateContact('name', event.target.value)} aria-invalid={!!contactErrors.name} aria-describedby={contactErrors.name ? 'ed-name-error' : undefined} />{contactError('name')}</div>
            <div className="ed-field"><label htmlFor="ed-contact-email">Email</label><input id="ed-contact-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} required disabled={pending} value={contact.email} onChange={event => updateContact('email', event.target.value)} aria-invalid={!!contactErrors.email} aria-describedby={contactErrors.email ? 'ed-email-error' : undefined} />{contactError('email')}</div>
            <div className="ed-field"><label htmlFor="ed-notes">Una nota <span>Facoltativa</span></label><textarea id="ed-notes" name="notes" rows={2} maxLength={1200} value={draft.notes} disabled={pending} onChange={event => update('notes', event.target.value)} placeholder="Preferenze utili per il soggiorno" /><small>Non inserire dati sensibili o di pagamento.</small></div>
            <label className="ed-contact-permission"><input name="permission" type="checkbox" checked={contact.permission} disabled={pending} onChange={event => updateContact('permission', event.target.checked)} aria-invalid={!!contactErrors.permission} aria-describedby={contactErrors.permission ? 'ed-permission-error' : undefined} /><span>Chiedo a {bookingConfig.recipientLabel} di rispondere a questa richiesta usando il nome e l’email indicati.</span></label>{contactError('permission')}
            {privacyUrl && <a className="ed-booking-text-button" href={privacyUrl} target="_blank" rel="noopener noreferrer">Informativa della struttura <Arrow direction="diagonal" /></a>}
            {sendError && <p className="ed-send-error" id="ed-send-error" role="alert" tabIndex={-1}>{sendError}</p>}
            <button type="submit" className="ed-button ed-button-primary ed-booking-next" disabled={pending}>{pending ? 'Invio in corso…' : 'Invia richiesta di disponibilità'}{!pending && <Arrow />}</button><p className="ed-request-note">L’invio non crea una prenotazione e non prevede pagamenti.</p>
          </form>}
        </div> : receipt && <div className="ed-receipt" role="status"><p>{bookingConfig.recipientLabel} ha confermato la ricezione della richiesta.</p><dl><div><dt>Codice di ricezione</dt><dd>{receipt.receiptId}</dd></div><div><dt>Risposta a</dt><dd>{contact.email}</dd></div></dl><p>La prenotazione non è ancora confermata. La struttura ti risponderà per disponibilità e condizioni.</p><button type="button" className="ed-button ed-button-primary" onClick={close}>Torna al sito <Arrow /></button></div>}
        {mode === 'plan' && <p className="ed-booking-bottom-note">Disponibilità e prezzi non sono simulati. Il percorso sarà attivo quando collegato al booking ufficiale o al destinatario della struttura.</p>}
      </div>
    </div>
  </div></Modal>;
}
