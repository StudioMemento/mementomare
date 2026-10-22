export type BookingDraft = {
  arrival: string;
  departure: string;
  adults: number;
  children: number;
  roomId: string;
  interests: string[];
  notes: string;
};

export const emptyBooking: BookingDraft = {
  arrival: '', departure: '', adults: 2, children: 0, roomId: '', interests: [], notes: '',
};

export function todayInRome(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateBooking(draft: BookingDraft, today = todayInRome()) {
  const errors: Partial<Record<keyof BookingDraft, string>> = {};
  if (!validDate(draft.arrival)) errors.arrival = 'Scegli una data di arrivo valida.';
  else if (draft.arrival < today) errors.arrival = 'La data di arrivo non può essere nel passato.';
  if (!validDate(draft.departure)) errors.departure = 'Scegli una data di partenza valida.';
  else if (validDate(draft.arrival) && draft.departure <= draft.arrival)
    errors.departure = 'La partenza deve essere successiva all’arrivo.';
  if (!Number.isInteger(draft.adults) || draft.adults < 1 || draft.adults > 6)
    errors.adults = 'Seleziona da 1 a 6 adulti per questa simulazione.';
  if (!Number.isInteger(draft.children) || draft.children < 0 || draft.children > 4)
    errors.children = 'Seleziona da 0 a 4 bambini per questa simulazione.';
  if (draft.roomId && !['suite-baia', 'suite-giardino', 'suite-panorama'].includes(draft.roomId))
    errors.roomId = 'Seleziona una delle camere proposte.';
  if (draft.notes.length > 1200) errors.notes = 'Usa al massimo 1.200 caratteri.';
  return errors;
}

export function stayNights(arrival: string, departure: string): number {
  if (!validDate(arrival) || !validDate(departure)) return 0;
  return Math.max(0, Math.round((Date.parse(`${departure}T00:00:00Z`) - Date.parse(`${arrival}T00:00:00Z`)) / 86400000));
}

export function displayDate(value: string): string {
  if (!validDate(value)) return 'Da scegliere';
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

// Integration boundary: replace this adapter when a booking engine is configured.
// The demo never sends data, checks availability or creates a reservation.
export function buildDemoSummary(draft: BookingDraft) {
  const errors = validateBooking(draft);
  if (Object.keys(errors).length) throw new Error('Invalid stay');
  return { mode: 'demo' as const, draft: structuredClone(draft), nights: stayNights(draft.arrival, draft.departure), reservationCreated: false as const };
}
