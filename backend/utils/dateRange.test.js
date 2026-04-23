const test = require('node:test');
const assert = require('node:assert/strict');

const { buildCreatedAtFilter } = require('./dateRange');

test('buildCreatedAtFilter: empty range returns null', () => {
  assert.equal(buildCreatedAtFilter(), null);
  assert.equal(buildCreatedAtFilter('', ''), null);
});

test('buildCreatedAtFilter: ISO date-only uses local day boundaries', () => {
  const f = buildCreatedAtFilter('2026-03-31', '2026-04-22');
  assert.ok(f);
  assert.ok(f.$gte instanceof Date);
  assert.ok(f.$lte instanceof Date);

  assert.equal(f.$gte.getFullYear(), 2026);
  assert.equal(f.$gte.getMonth(), 2); // March
  assert.equal(f.$gte.getDate(), 31);
  assert.equal(f.$gte.getHours(), 0);
  assert.equal(f.$gte.getMinutes(), 0);

  assert.equal(f.$lte.getFullYear(), 2026);
  assert.equal(f.$lte.getMonth(), 3); // April
  assert.equal(f.$lte.getDate(), 22);
  assert.equal(f.$lte.getHours(), 23);
  assert.equal(f.$lte.getMinutes(), 59);
  assert.equal(f.$lte.getSeconds(), 59);
});

test('buildCreatedAtFilter: swaps when start > end', () => {
  const f = buildCreatedAtFilter('2026-04-22', '2026-03-31');
  assert.ok(f);
  // normalized to 2026-03-31 .. 2026-04-22
  assert.equal(f.$gte.getMonth(), 2);
  assert.equal(f.$gte.getDate(), 31);
  assert.equal(f.$lte.getMonth(), 3);
  assert.equal(f.$lte.getDate(), 22);
});

test('buildCreatedAtFilter: supports open ranges', () => {
  const f1 = buildCreatedAtFilter('2026-03-31', '');
  assert.ok(f1);
  assert.ok(f1.$gte);
  assert.equal(f1.$lte, undefined);

  const f2 = buildCreatedAtFilter('', '2026-04-22');
  assert.ok(f2);
  assert.ok(f2.$lte);
  assert.equal(f2.$gte, undefined);
});

