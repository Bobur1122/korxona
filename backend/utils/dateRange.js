function isIsoDateOnly(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseRangeStart(value) {
  if (!value) return null;
  if (isIsoDateOnly(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0); // local start-of-day
  }
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function parseRangeEnd(value) {
  if (!value) return null;
  if (isIsoDateOnly(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d, 23, 59, 59, 999); // local end-of-day
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  dt.setHours(23, 59, 59, 999);
  return dt;
}

function buildCreatedAtFilter(startDate, endDate) {
  let start = parseRangeStart(startDate);
  let end = parseRangeEnd(endDate);

  // If user accidentally flips dates, normalize by swapping.
  if (start && end && start > end) {
    const swappedStart = parseRangeStart(endDate);
    const swappedEnd = parseRangeEnd(startDate);
    start = swappedStart;
    end = swappedEnd;
  }

  const createdAt = {};
  if (start) createdAt.$gte = start;
  if (end) createdAt.$lte = end;
  return Object.keys(createdAt).length ? createdAt : null;
}

module.exports = {
  isIsoDateOnly,
  parseRangeStart,
  parseRangeEnd,
  buildCreatedAtFilter,
};

