import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyBooking, stayNights, todayInRome, validateBooking, buildDemoSummary } from '../src/booking/validation.ts';

test('Rome date changes at local midnight, including summer time', () => {
  assert.equal(todayInRome(new Date('2026-07-16T22:30:00Z')), '2026-07-17');
  assert.equal(todayInRome(new Date('2026-12-16T22:30:00Z')), '2026-12-16');
  assert.equal(todayInRome(new Date('2026-12-16T23:30:00Z')), '2026-12-17');
});
test('Empty fields, past dates and departure order receive specific errors', () => {
  assert.equal(Object.keys(validateBooking(emptyBooking, '2026-10-16')).length, 2);
  const draft = { ...emptyBooking, arrival: '2026-10-15', departure: '2026-10-15' };
  const errors = validateBooking(draft, '2026-10-16');
  assert.match(errors.arrival!, /passato/);
  assert.match(errors.departure!, /successiva/);
});
test('Rejects impossible calendar dates and accepts a leap day', () => {
  assert(validateBooking({ ...emptyBooking, arrival: '2027-02-29', departure: '2027-03-02' }, '2026-10-16').arrival);
  assert(validateBooking({ ...emptyBooking, arrival: '2026-13-01', departure: '2027-01-01' }, '2026-10-16').arrival);
  assert.deepEqual(validateBooking({ ...emptyBooking, arrival: '2028-02-29', departure: '2028-03-02' }, '2026-10-16'), {});
});
test('Night count remains correct across both daylight saving transitions', () => {
  assert.equal(stayNights('2026-03-28', '2026-03-30'), 2);
  assert.equal(stayNights('2026-10-24', '2026-10-26'), 2);
  assert.equal(stayNights('2026-10-26', '2026-10-24'), 0);
});
test('Rejects invalid adult counts and unknown suite selections', () => {
  const draft = { ...emptyBooking, arrival: '2027-06-01', departure: '2027-06-06' };
  for (const adults of [0, 7, 1.5, NaN]) assert(validateBooking({ ...draft, adults }, '2026-10-16').adults);
  assert(validateBooking({ ...draft, roomId: 'nonexistent' }, '2026-10-16').roomId);
  assert.deepEqual(validateBooking({ ...draft, adults: 6, roomId: 'suite-baia' }, '2026-10-16'), {});
});
test('Summary is an isolated snapshot and cannot claim a real reservation', () => {
  const draft = { ...emptyBooking, arrival: '2099-06-01', departure: '2099-06-06', interests: ['spa'] };
  const summary = buildDemoSummary(draft);
  draft.interests.push('ristorante');
  assert.deepEqual(summary.draft.interests, ['spa']);
  assert.equal(summary.nights, 5);
  assert.equal(summary.mode, 'demo');
  assert.equal(summary.reservationCreated, false);
  assert.throws(() => buildDemoSummary(emptyBooking), /Invalid stay/);
});

test('Family guest count is validated and preserved in the demo summary', () => {
 const draft={...emptyBooking,arrival:'2099-06-01',departure:'2099-06-08',children:2,roomId:'suite-panorama'};
 assert.deepEqual(validateBooking(draft,'2026-10-16'),{});
 for(const children of [-1,5,1.5,NaN])assert(validateBooking({...draft,children},'2026-10-16').children);
 const result=buildDemoSummary(draft);
 assert.equal(result.draft.children,2);
 assert.equal(result.reservationCreated,false);
});
