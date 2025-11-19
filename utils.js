// utils.js - helper functions used by chat.js

/**
 * Formats an ISO timestamp or Date object into a human-friendly short string.
 * Examples returned: "now", "5m ago", "2h ago", "Jan 12", "2024-11-12 13:45"
 */
function friendlyTimestamp(value) {
  if (!value) return '';
  const d = (value instanceof Date) ? value : new Date(value);
  if (isNaN(d)) return '';
  const now = new Date();
  const diff = Math.floor((now - d) / 1000); // seconds

  if (diff < 6) return 'now';
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  // If within same year show "Mon DD" else full date
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric' });
  }
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Simple fetch wrapper with JSON handling and error catching
 * Always returns {ok: boolean, status, data}
 */
async function fetchJson(url, opts = {}) {
  try {
    const cfg = Object.assign({ credentials: 'include' }, opts);
    const res = await fetch(url, cfg);
    const ct = res.headers.get('content-type') || '';
    let data = null;
    if (ct.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { error: 'network_error' } };
  }
}
