import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingConfig, officialBookingUrl, requestEndpoint } from '../src/booking/config.ts';
import type { BookingConfig } from '../src/booking/config.ts';
import { makeStayText, parseReceipt, sendAvailabilityRequest, validateContact } from '../src/booking/request.ts';
import { emptyBooking } from '../src/booking/validation.ts';

const draft = { ...emptyBooking, arrival: '2099-06-01', departure: '2099-06-05', children: 2, roomId: 'suite-panorama', interests: ['spiaggia'] };
const contact = { name: '  Ospite Demo  ', email: '  ospite@example.test  ', permission: true };
const configured: BookingConfig = { officialUrl: null, requestEndpoint: '/api/availability', recipientLabel: 'Struttura di test' };
const options = (fetcher: typeof fetch) => ({ requestId: 'test-request-001', fetcher });

test('Concept defaults expose no booking destination or request recipient', () => {
  assert.equal(officialBookingUrl(bookingConfig), null);
  assert.equal(requestEndpoint(bookingConfig), null);
  assert.equal(bookingConfig.recipientLabel, null);
});

test('Destinations require explicit HTTPS or a same-origin request path and named recipient', () => {
  assert.equal(officialBookingUrl({ ...configured, officialUrl: 'https://booking.example.test/stay' }), 'https://booking.example.test/stay');
  for (const url of ['http://booking.example.test', 'javascript:alert(1)', '//booking.example.test', 'https://user:password@booking.example.test']) {
    assert.equal(officialBookingUrl({ ...configured, officialUrl: url }), null);
  }
  assert.equal(requestEndpoint(configured), '/api/availability');
  assert.equal(requestEndpoint({ ...configured, requestEndpoint: 'https://booking.example.test/request' }), 'https://booking.example.test/request');
  assert.equal(requestEndpoint({ ...configured, recipientLabel: ' ' }), null);
  for (const endpoint of ['//external.example.test/request', '/\\external.example.test', 'http://external.example.test', 'https://user:password@external.example.test', 'https://external.example.test/#fragment']) {
    assert.equal(requestEndpoint({ ...configured, requestEndpoint: endpoint }), null);
  }
});

test('Unconfigured request and invalid dates or contacts never send any data', async () => {
  let calls = 0;
  const fetcher = (async () => { calls++; throw new Error('Unexpected request'); }) as typeof fetch;
  await assert.rejects(sendAvailabilityRequest(bookingConfig, draft, contact, options(fetcher)), /Nessun dato/);
  await assert.rejects(sendAvailabilityRequest(configured, emptyBooking, contact, options(fetcher)), /Controlla le date/);
  await assert.rejects(sendAvailabilityRequest(configured, draft, { ...contact, permission: false }, options(fetcher)), /Controlla le date/);
  await assert.rejects(sendAvailabilityRequest(configured, draft, { ...contact, email: 'not-an-email' }, options(fetcher)), /Controlla le date/);
  assert.equal(calls, 0);
  assert(validateContact({ ...contact, name: 'A' }).name);
});

test('A 2xx response alone cannot become a receipt or confirmed reservation', async () => {
  for (const payload of [null, {}, { success: true }, { status: 'received' }, { receiptId: 'r1', status: 'confirmed' }, { receiptId: ' ', status: 'received' }]) {
    const fetcher = (async () => Response.json(payload)) as typeof fetch;
    await assert.rejects(sendAvailabilityRequest(configured, draft, contact, options(fetcher)), /ricevuta valida/);
    assert.equal(parseReceipt(payload), null);
  }
  const unreadable = (async () => new Response('<html>OK</html>', { status: 200 })) as typeof fetch;
  await assert.rejects(sendAvailabilityRequest(configured, draft, contact, options(unreadable)), /ricevuta leggibile/);
});

test('Backend errors, rate limiting and network errors remain truthful failures', async () => {
  for (const status of [400, 403, 500]) {
    const fetcher = (async () => Response.json({ receiptId: 'r1', status: 'received' }, { status })) as typeof fetch;
    await assert.rejects(sendAvailabilityRequest(configured, draft, contact, options(fetcher)), /non ha confermato/);
  }
  const rateLimited = (async () => new Response('', { status: 429 })) as typeof fetch;
  await assert.rejects(sendAvailabilityRequest(configured, draft, contact, options(rateLimited)), /troppe richieste/);
  const offline = (async () => { throw new TypeError('Failed to fetch'); }) as typeof fetch;
  await assert.rejects(sendAvailabilityRequest(configured, draft, contact, options(offline)), /ricezione non è confermata/);
});

test('A valid backend acknowledgment returns its receipt with a normalized explicit payload', async () => {
  let calls = 0;
  const fetcher = (async (input, init) => {
    calls++;
    assert.equal(input, '/api/availability');
    assert.equal(init?.method, 'POST');
    assert.equal(init?.credentials, 'same-origin');
    assert.equal(init?.signal?.aborted, false);
    assert.deepEqual(JSON.parse(String(init?.body)), {
      version: 1,
      requestId: 'test-request-001',
      stay: draft,
      contact: { name: 'Ospite Demo', email: 'ospite@example.test', permission: true },
    });
    return Response.json({ receiptId: ' receipt-123 ', status: 'received' });
  }) as typeof fetch;
  const result = await sendAvailabilityRequest(configured, draft, contact, options(fetcher));
  assert.deepEqual(result, { receiptId: 'receipt-123', status: 'received' });
  assert.equal(calls, 1);
  assert(!('reservationCreated' in result));
});

test('Cancelling the request propagates abort and cannot return a receipt', async () => {
  const controller = new AbortController();
  const fetcher = (async (_input, init) => new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    queueMicrotask(() => controller.abort());
  })) as typeof fetch;
  await assert.rejects(sendAvailabilityRequest(configured, draft, contact, { ...options(fetcher), signal: controller.signal }), error => error instanceof DOMException && error.name === 'AbortError');
});

test('Exported plan preserves the selected stay and explicitly says it was not sent', () => {
  const result = makeStayText(draft, 'Family Room', ['Spiaggia']);
  assert.match(result, /non è una richiesta inviata o una prenotazione/);
  assert.match(result, /Durata: 4 notti/);
  assert.match(result, /Ospiti: 2 adulti, 2 bambini/);
  assert.match(result, /Preferenza camera: Family Room/);
  assert.match(result, /Invio non attivo/);
});
