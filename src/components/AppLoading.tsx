import mamaeZenLogo from '@/assets/mamae-zen-logo.png';

const AppLoading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-4 border-primary/25 border-t-primary animate-spin" />
      <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse shadow-[0_0_40px_hsl(var(--primary)/0.6)]" />
      <img src={mamaeZenLogo} alt="Mamãe Zen" className="relative w-20 h-20 rounded-full object-cover" />
    </div>
    <p className="text-sm font-semibold text-foreground">Carregando o Mamãe Zen...</p>
  </div>
);

export default AppLoading;
