import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

export type RingItem = {
  value: string;
  label: string;
  icon: React.ReactNode;
  locked?: boolean;
};

type Props = {
  items: RingItem[];
  value: string;
  onChange: (value: string) => void;
};

const STEP = 12; // degrees between items
const RADIUS = 340; // px (arco largo = scroll suave e mais próximo)

/**
 * Anel giratório de funções: o usuário arrasta o dedo para girar
 * o anel e o item no topo fica selecionado.
 */
const FeatureRing = ({ items, value, onChange }: Props) => {
  const count = items.length;
  const activeIndex = Math.max(0, items.findIndex((i) => i.value === value));
  const [angle, setAngle] = useState(-activeIndex * STEP);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);
  const moved = useRef(false);

  // Sincroniza quando a seleção muda de fora
  useEffect(() => {
    if (!dragging.current) setAngle(-activeIndex * STEP);
  }, [activeIndex]);

  const clamp = (a: number) => Math.min(0, Math.max(-(count - 1) * STEP, a));

  const settle = (a: number) => {
    const index = Math.min(count - 1, Math.max(0, Math.round(-a / STEP)));
    setAngle(-index * STEP);
    if (items[index] && items[index].value !== value) onChange(items[index].value);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    moved.current = false;
    startX.current = e.clientX;
    startAngle.current = angle;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 4) moved.current = true;
    setAngle(clamp(startAngle.current + delta * 0.11));
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    settle(angle);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = clamp(angle - Math.sign(e.deltaY) * STEP);
    settle(next);
  };

  return (
    <div className="relative select-none">
      {/* Rótulo do item ativo */}
      <div className="text-center pb-1">
        <p className="text-sm font-bold text-primary neon-text tracking-wide">
          {items[activeIndex]?.label}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {count} {count === 1 ? 'função' : 'funções'} · arraste para girar
        </p>
      </div>

      <div
        className="relative h-[124px] overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 16%, black 84%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 16%, black 84%, transparent)',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        {/* Trilho do anel */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full border-t border-primary/20"
          style={{
            width: RADIUS * 2,
            height: RADIUS * 2,
            top: 62,
          }}
        />

        {/* Marcador do topo */}
        <div className="pointer-events-none absolute left-1/2 top-[62px] -translate-x-1/2 -translate-y-1/2 w-[74px] h-[74px] rounded-full border border-primary/70 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.8)]" />

        <div
          className="absolute left-1/2 will-change-transform"
          style={{
            top: 62 + RADIUS,
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transition: dragging.current ? 'none' : 'transform 380ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >

          {items.map((item, i) => {
            const itemAngle = i * STEP;
            const diff = Math.abs(itemAngle + angle);
            const isActive = i === activeIndex;
            const visible = diff < 38;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  if (moved.current) return;
                  onChange(item.value);
                }}
                className="absolute left-0 top-0 origin-center"
                style={{
                  transform: `rotate(${itemAngle}deg) translateY(-${RADIUS}px) rotate(${-itemAngle - angle}deg) translate(-50%, -50%)`,
                  opacity: visible ? Math.max(0.3, 1 - diff / 36) : 0,
                  pointerEvents: visible ? 'auto' : 'none',
                  transition: dragging.current ? 'none' : 'opacity 300ms ease',
                }}
                aria-label={item.label}
              >
                <span
                  className={`relative flex flex-col items-center justify-center gap-0.5 rounded-full border transition-all ${
                    isActive
                      ? 'w-16 h-16 bg-primary text-primary-foreground border-primary shadow-[0_0_32px_-4px_hsl(var(--primary)/0.95)] scale-105'
                      : 'w-14 h-14 bg-card/80 text-foreground/70 border-primary/30 backdrop-blur-sm'
                  }`}
                >
                  {item.icon}
                  {item.locked && (
                    <Lock className="w-3 h-3 text-primary absolute -top-0.5 -right-0.5 drop-shadow-[0_0_4px_hsl(var(--primary))]" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pontinhos de progresso */}
      <div className="flex items-center justify-center gap-1 pt-1">
        {items.map((item, i) => (
          <span
            key={item.value}
            className={`h-1 rounded-full transition-all ${
              i === activeIndex ? 'w-4 bg-primary neon-glow' : 'w-1 bg-primary/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureRing;
