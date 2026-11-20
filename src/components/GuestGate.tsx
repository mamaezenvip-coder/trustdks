import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Crown, Check, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openInApp } from '@/lib/inAppBrowser';
import { getGuestStart, guestRemainingMs, PLAN_MONTHLY_URL, PLAN_YEARLY_URL } from '@/lib/guestTrial';

const pay = (url: string) => openInApp(url, 'Pagamento Mamãe Zen');

export const PlanOffer = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center px-5 py-10 max-w-sm mx-auto">
        <Crown className="w-10 h-10 text-primary mb-4" />
        <h2 className="text-2xl font-extrabold text-foreground text-center leading-tight">Gostou da experiência com o Mamãe Zen?</h2>
        <p className="text-sm text-muted-foreground text-center mt-2 mb-6">Continue com todas as funções liberadas para cuidar do seu bebê com tranquilidade.</p>

        <div className="w-full rounded-2xl border-2 border-primary bg-card p-5 relative">
          <span className="absolute -top-3 left-5 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">Mais escolhido</span>
          <p className="text-sm font-semibold text-foreground">Plano Anual</p>
          <p className="text-3xl font-extrabold text-foreground mt-1">R$ 29,90<span className="text-sm font-medium text-muted-foreground"> / ano</span></p>
          <p className="text-xs text-primary mt-1">Menos de R$ 2,50 por mês • 360 dias</p>
          <Button className="w-full mt-4 h-12 font-bold" onClick={() => pay(PLAN_YEARLY_URL)}>Garantir 1 ano de acesso</Button>
        </div>

        <div className="w-full rounded-2xl border border-border bg-card/60 p-5 mt-4">
          <p className="text-sm font-semibold text-foreground">Plano Mensal</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">R$ 9,90<span className="text-sm font-medium text-muted-foreground"> / mês</span></p>
          <Button variant="outline" className="w-full mt-4 h-11 font-semibold" onClick={() => pay(PLAN_MONTHLY_URL)}>Assinar mensal</Button>
        </div>

        <ul className="w-full mt-5 space-y-2 text-xs text-muted-foreground">
          {['Emergência com 1 toque e rota no Uber/99', 'Manual de sintomas e medicamentos', 'Sons de ninar sem anúncios, com tela apagada'].map(t => (
            <li key={t} className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0" />{t}</li>
          ))}
        </ul>

        <div className="w-full mt-6 pt-5 border-t border-border/40 text-center">
          <p className="text-xs text-muted-foreground mb-3">Já pagou ou tem chave? Crie seu cadastro para a licença ficar salva na sua conta.</p>
          <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}><UserPlus className="w-4 h-4 mr-2" />Criar cadastro / Entrar</Button>
        </div>
      </div>
    </div>
  );
};

/** Barra do teste de convidado; ao fim dos 30 minutos mostra a oferta. */
const GuestGate = () => {
  const [left, setLeft] = useState(() => guestRemainingMs(getGuestStart()));
  useEffect(() => {
    const t = setInterval(() => setLeft(guestRemainingMs(getGuestStart())), 1000);
    return () => clearInterval(t);
  }, []);
  if (left <= 0) return <PlanOffer />;
  const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
  return (
    <div className="sticky top-0 z-40 px-3 pt-3">
      <div className="flex items-center gap-2 rounded-xl border border-primary/40 bg-card/90 backdrop-blur-md px-3 py-2">
        <Clock className="w-4 h-4 text-primary shrink-0" />
        <p className="text-xs text-foreground flex-1">Degustação VIP: <b>{m}:{String(s).padStart(2, '0')}</b> para testar tudo</p>
      </div>
    </div>
  );
};
export default GuestGate;
