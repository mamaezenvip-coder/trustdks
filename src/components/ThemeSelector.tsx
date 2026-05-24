import {Card} from'@/components/ui/card';
import {Button} from'@/components/ui/button';
import {useTheme} from'@/contexts/ThemeContext';
import {useCountry} from'@/contexts/CountryContext';
import {Palette} from'lucide-react';
import {toast} from'sonner';

const ThemeSelector = () => {
 const {themeColor, setThemeColor} = useTheme();
 const {isUSA} = useCountry();

 const handleThemeChange = (color:'pink'|'blue') => {
 setThemeColor(color);
 const message = isUSA 
?`${color ==='pink'?'Pink':'Blue'} theme activated!`:`Tema ${color ==='pink'?'Rosa':'Azul'} ativado!`;
 toast.success(message);
};

 return (
 <Card className="p-4 bg-gradient-to-br from-secondary/50 to-primary/50 border-primary/20">
 <div className="flex items-center gap-2 mb-3">
 <Palette className="w-5 h-5 text-primary"/>
 <h3 className="font-bold text-sm text-primary">
 {isUSA?'Choose Theme':'Escolha o Tema'}
 </h3>
 </div>
 
 <div className="grid grid-cols-2 gap-2">
 <Button
 onClick={() => handleThemeChange('pink')}
 variant={themeColor ==='pink'?'default':'outline'}
 className={`${
 themeColor ==='pink'?'bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary text-foreground shadow-lg shadow-primary/30':'border-primary/30 bg-secondary/30 text-primary hover:bg-secondary/50 hover:text-primary'}`}
 size="sm">
 <span className="text-lg mr-2"></span>
 {isUSA?'Pink':'Rosa'}
 </Button>
 
 <Button
 onClick={() => handleThemeChange('blue')}
 variant={themeColor ==='blue'?'default':'outline'}
 className={`${
 themeColor ==='blue'?'bg-gradient-to-r from-secondary to-secondary hover:from-secondary hover:to-secondary text-foreground shadow-lg shadow-secondary/30':'border-secondary/30 bg-secondary/30 text-secondary hover:bg-secondary/50 hover:text-secondary'}`}
 size="sm">
 <span className="text-lg mr-2"></span>
 {isUSA?'Blue':'Azul'}
 </Button>
 </div>
 </Card>
);
};

export default ThemeSelector;
