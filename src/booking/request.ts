import type { BookingConfig } from './config.ts';
import { requestEndpoint } from './config.ts';
import type { BookingDraft } from './validation.ts';
import { displayDate, stayNights, validateBooking } from './validation.ts';

export type RequestContact = { name: string; email: string; permission: boolean };
export type RequestReceipt = { receiptId: string; status: 'accepted' | 'received' };

export function validateContact(contact: RequestContact) {
  const errors: Partial<Record<keyof RequestContact, string>> = {};
  if (contact.name.trim().length < 2 || contact.name.trim().length > 120) errors.name = 'Inserisci il tuo nome (da 2 a 120 caratteri).';
  if (contact.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) errors.email = 'Inserisci un indirizzo email valido.';
  if (!contact.permission) errors.permission = 'Conferma che desideri ricevere una risposta a questa richiesta.';
  return errors;
}

export function makeStayText(draft: BookingDraft, roomLabel: string, interestLabels: string[] = []) {
  return [
    'MEMENTO Hotel & Beach — piano di soggiorno',
    'Concept dimostrativo. Questo documento non è una richiesta inviata o una prenotazione.',
    '',
    `Arrivo: ${displayDate(draft.arrival)}`,
    `Partenza: ${displayDate(draft.departure)}`,
    `Durata: ${stayNights(draft.arrival, draft.departure)} notti`,
    `Ospiti: ${draft.adults} adulti, ${draft.children} bambini`,
    `Preferenza camera: ${roomLabel}`,
    ...(interestLabels.length ? [`Interessi: ${interestLabels.join(', ')}`] : []),
    '',
    'Invio non attivo: manca il collegamento al booking ufficiale o al destinatario della struttura.',
  ].join('\n');
}

/** A 2xx response alone never counts as a confirmed receipt. */
export function parseReceipt(value: unknown): RequestReceipt | null {
  if (!value || typeof value !== 'object') return null;
  const receipt = value as Record<string, unknown>;
  if (typeof receipt.receiptId !== 'string' || !receipt.receiptId.trim() || receipt.receiptId.length > 160) return null;
  if (receipt.status !== 'accepted' && receipt.status !== 'received') return null;
  return { receiptId: receipt.receiptId.trim(), status: receipt.status };
}

export async function sendAvailabilityRequest(
  config: BookingConfig,
  draft: BookingDraft,
  contact: RequestContact,
  options: { requestId: string; signal?: AbortSignal; fetcher?: typeof fetch },
): Promise<RequestReceipt> {
  const endpoint = requestEndpoint(config);
  if (!endpoint) throw new Error('L’invio non è ancora collegato alla struttura. Nessun dato è stato inviato.');
  if (Object.keys(validateBooking(draft)).length || Object.keys(validateContact(contact)).length) throw new Error('Controlla le date e i recapiti prima di inviare.');
  if (!options.requestId) throw new Error('Impossibile identificare questa richiesta. Riapri il modulo e riprova.');

  const timeout = new AbortController();
  let expired = false;
  const timer = setTimeout(() => { expired = true; timeout.abort(); }, 15000);
  const abort = () => timeout.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) timeout.abort();

  try {
    const response = await (options.fetcher ?? fetch)(endpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        version: 1,
        requestId: options.requestId,
        stay: { ...draft, interests: [...draft.interests] },
        contact: { name: contact.name.trim(), email: contact.email.trim(), permission: true },
      }),
      signal: timeout.signal,
    });
    if (response.status === 429) throw new Error('Sono arrivate troppe richieste in poco tempo. Attendi qualche minuto prima di riprovare.');
    if (!response.ok) throw new Error('Il servizio non ha confermato la ricezione. Controlla i dati e riprova tra poco.');
    let payload: unknown;
    try { payload = await response.json(); } catch { throw new Error('Il servizio ha risposto senza una ricevuta leggibile. Non possiamo confermare l’invio.'); }
    const receipt = parseReceipt(payload);
    if (!receipt) throw new Error('Il servizio non ha restituito una ricevuta valida. Non possiamo confermare l’invio.');
    return receipt;
  } catch (error) {
    if (expired) throw new Error('La risposta sta impiegando troppo tempo. La ricezione non è confermata; riprova tra poco.');
    if (options.signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
    if (error instanceof TypeError) throw new Error('Connessione non disponibile. La ricezione non è confermata; controlla la rete e riprova.');
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', abort);
  }
}
