import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Worker bundled locally — PDF renders fully inside the app, no external viewer.
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfReaderProps {
  file: string;
}

const PdfReader = ({ file }: PdfReaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const renderIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const renderId = ++renderIdRef.current;

    const render = async () => {
      setLoading(true);
      setError(false);
      try {
        const doc = await pdfjsLib.getDocument(file).promise;
        const container = containerRef.current;
        if (!container || cancelled || renderId !== renderIdRef.current) return;
        container.innerHTML = '';

        const containerWidth = container.clientWidth - 16;

        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          if (cancelled || renderId !== renderIdRef.current) return;
          const page = await doc.getPage(pageNum);
          const baseViewport = page.getViewport({ scale: 1 });
          const fitScale = (containerWidth / baseViewport.width) * scale;
          const viewport = page.getViewport({ scale: fitScale * (window.devicePixelRatio || 1) });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${Math.floor(fitScale * baseViewport.width)}px`;
          canvas.style.height = 'auto';
          canvas.className = 'mx-auto mb-3 rounded-lg border border-primary/20 bg-white';

          container.appendChild(canvas);
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled && renderId === renderIdRef.current) setLoading(false);
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [file, scale]);

  return (
    <div className="relative flex flex-col h-full bg-background">
      <div className="flex items-center justify-end gap-2 px-3 py-2 border-b border-primary/20 bg-card/60">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-primary/30"
          onClick={() => setScale((s) => Math.max(0.6, +(s - 0.2).toFixed(2)))}
          aria-label="Diminuir zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-primary/30"
          onClick={() => setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(2)))}
          aria-label="Aumentar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Carregando e-book…</p>
        </div>
      )}

      {error ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível abrir o e-book agora. Tente novamente.
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="flex-1 overflow-y-auto p-2 overscroll-contain" />
      )}
    </div>
  );
};

export default PdfReader;
