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

const STEP = 26; // degrees between items
const RADIUS = 132; // px

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
    setAngle(clamp(startAngle.current - delta * 0.28));
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
        className="relative h-[120px] overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        {/* Trilho do anel */}
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full border border-primary/25"
          style={{
            width: RADIUS * 2,
            height: RADIUS * 2,
            top: 34,
            boxShadow: '0 0 40px -12px hsl(var(--primary) / 0.55) inset',
          }}
        />

        {/* Marcador do topo */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1 w-16 h-16 rounded-full border-2 border-primary neon-glow" />

        <div
          className="absolute left-1/2 will-change-transform"
          style={{
            top: 34 + RADIUS,
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transition: dragging.current ? 'none' : 'transform 380ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * STEP;
            const diff = Math.abs(itemAngle + angle);
            const isActive = i === activeIndex;
            const visible = diff < 75;
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
                  opacity: visible ? Math.max(0.25, 1 - diff / 70) : 0,
                  pointerEvents: visible ? 'auto' : 'none',
                  transition: dragging.current ? 'none' : 'opacity 300ms ease',
                }}
                aria-label={item.label}
              >
                <span
                  className={`relative flex flex-col items-center justify-center gap-0.5 rounded-full border transition-all ${
                    isActive
                      ? 'w-14 h-14 bg-primary text-primary-foreground border-primary shadow-[0_0_26px_-4px_hsl(var(--primary)/0.9)] scale-105'
                      : 'w-12 h-12 bg-card/80 text-muted-foreground border-primary/30 backdrop-blur-sm'
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
