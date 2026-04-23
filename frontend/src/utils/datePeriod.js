function fmt(d) {
  return d.toISOString().slice(0, 10);
}

export function todayIso() {
  return fmt(new Date());
}

export function rangeLastDays(days) {
  const end = new Date();
  const start = new Date(end.getTime() - (Math.max(1, Number(days) || 1) - 1) * 86400000);
  return { start: fmt(start), end: fmt(end) };
}

export function rangeThisMonth() {
  const now = new Date();
  return { start: fmt(new Date(now.getFullYear(), now.getMonth(), 1)), end: fmt(now) };
}

export function prevRange(startIso, endIso) {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const ms = e - s;
  const prevEnd = new Date(s.getTime() - 86400000);
  const prevStart = new Date(prevEnd.getTime() - ms);
  return { start: fmt(prevStart), end: fmt(prevEnd) };
}

export function pctChange(current, previous) {
  const cur = Number(current || 0);
  const prev = Number(previous || 0);
  if (Number.isNaN(cur) || Number.isNaN(prev)) return undefined;
  if (prev === 0) return cur > 0 ? null : 0;
  return Math.round(((cur - prev) / prev) * 100);
}

