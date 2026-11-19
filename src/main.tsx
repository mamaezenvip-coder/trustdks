import {createRoot} from"react-dom/client";
import App from"./App.tsx";
import {HelmetProvider} from"react-helmet-async";
import"./index.css";

// Se um arquivo antigo do app falhar ao carregar (versão nova publicada), recarrega uma vez.
window.addEventListener('vite:preloadError', (event) => {
 event.preventDefault();
 const key = 'mz_chunk_reload';
 const last = Number(sessionStorage.getItem(key) || 0);
 if (Date.now() - last > 30000) {
 sessionStorage.setItem(key, String(Date.now()));
 window.location.reload();
 }
});

createRoot(document.getElementById("root")!).render(<HelmetProvider><App /></HelmetProvider>);
