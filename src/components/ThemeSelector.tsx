import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useTheme} from '@/contexts/ThemeContext';
import {useCountry} from '@/contexts/CountryContext';
import {Palette} from 'lucide-react';
import {toast} from 'sonner';

const ThemeSelector = () => {
  const {themeColor, setThemeColor} = useTheme();
  const {isUSA} = useCountry();

  const handleThemeChange = (color: 'pink' | 'blue') => {
    setThemeColor(color);
    const message = isUSA
      ? `${color === 'pink' ? 'Pink' : 'Blue'} theme activated!`
      : `Tema ${color === 'pink' ? 'Rosa' : 'Azul'} ativado!`;
    toast.success(message);
  };

  return (
    <Card className="p-4 bg-background border border-primary/60 shadow-[0_0_20px_hsl(var(--primary)/0.25)]">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-sm text-foreground">
          {isUSA ? 'Choose Theme' : 'Escolha o Tema'}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => handleThemeChange('pink')}
          variant="outline"
          size="sm"
          className={
            themeColor === 'pink'
              ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_hsl(var(--primary)/0.6)] hover:bg-primary/90'
              : 'bg-background text-foreground border-primary/40 hover:bg-primary/10 hover:text-primary'
          }
        >
          {isUSA ? 'Pink' : 'Rosa'}
        </Button>

        <Button
          onClick={() => handleThemeChange('blue')}
          variant="outline"
          size="sm"
          className={
            themeColor === 'blue'
              ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_hsl(var(--primary)/0.6)] hover:bg-primary/90'
              : 'bg-background text-foreground border-primary/40 hover:bg-primary/10 hover:text-primary'
          }
        >
          {isUSA ? 'Blue' : 'Azul'}
        </Button>
      </div>
    </Card>
  );
};

export default ThemeSelector;
