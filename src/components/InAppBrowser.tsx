import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { IN_APP_EVENT } from '@/lib/inAppBrowser';

const InAppBrowser = () => {
  const [page, setPage] = useState<{ url: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setLoading(true);
      setPage((e as CustomEvent).detail);
    };
    window.addEventListener(IN_APP_EVENT, onOpen);
    return () => window.removeEventListener(IN_APP_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!page) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [page]);

  if (!page) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-background">
      <div className="flex items-center justify-between gap-2 px-4 h-14 border-b border-primary/40 bg-background pt-[env(safe-area-inset-top)]">
        <span className="font-bold text-foreground truncate">{page.title}</span>
        <button
          onClick={() => setPage(null)}
          aria-label="Fechar"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <iframe
          src={page.url}
          title={page.title}
          onLoad={() => setLoading(false)}
          className="w-full h-full border-0 bg-background"
          allow="payment *; clipboard-write"
        />
      </div>
    </div>
  );
};

export default InAppBrowser;
