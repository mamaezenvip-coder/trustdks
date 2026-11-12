export const IN_APP_EVENT = 'mz-open-in-app';
export const openInApp = (url: string, title = 'Mamãe Zen') => {
  window.dispatchEvent(new CustomEvent(IN_APP_EVENT, { detail: { url, title } }));
};
