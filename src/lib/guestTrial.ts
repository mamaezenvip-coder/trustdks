export const GUEST_TRIAL_MINUTES = 30;
const KEY = 'mz_guest_trial_start';
export const PLAN_MONTHLY_URL = 'https://pay.cakto.com.br/c88zju2_683076';
export const PLAN_YEARLY_URL = 'https://pay.cakto.com.br/g8cdz94';

export const getGuestStart = (): number | null => {
  try { const v = localStorage.getItem(KEY); return v ? Number(v) : null; } catch { return null; }
};
// Só inicia uma vez por aparelho: reabrir não reinicia o tempo.
export const startGuestTrial = () => {
  if (getGuestStart() === null) localStorage.setItem(KEY, String(Date.now()));
  window.dispatchEvent(new Event('mz-guest-change'));
};
export const guestRemainingMs = (start: number | null, now = Date.now()) =>
  start === null ? 0 : Math.max(0, start + GUEST_TRIAL_MINUTES * 60_000 - now);
