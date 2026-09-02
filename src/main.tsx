import {createRoot} from"react-dom/client";
import App from"./App.tsx";
import {HelmetProvider} from"react-helmet-async";
import"./index.css";

const host = window.location.hostname;
const isLovablePreview = host.startsWith('id-preview--') || host.startsWith('preview--') || host.includes('lovableproject.com') || host.includes('lovableproject-dev.com');
const isEmbeddedPreview = window.self !== window.top;

// Register service worker only outside Lovable previews to avoid stale cache during development.
if ('serviceWorker'in navigator && !isLovablePreview && !isEmbeddedPreview) {
 window.addEventListener('load', () => {
 navigator.serviceWorker.register('/sw.js').catch(() => {
 // Service worker registration failed, app will still work without offline support
});
});
}

createRoot(document.getElementById("root")!).render(<HelmetProvider><App /></HelmetProvider>);
