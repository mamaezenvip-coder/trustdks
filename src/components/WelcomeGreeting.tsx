import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Star, Moon, Sun, Sunset, Smile, Heart, BatteryLow, AlertCircle, PartyPopper, type LucideIcon } from 'lucide-react';
import { useCountry } from '@/contexts/CountryContext';

interface WelcomeGreetingProps {
  userName?: string;
  onMoodSelect?: (mood: string) => void;
}

const WelcomeGreeting = ({ userName = "Letícia", onMoodSelect }: WelcomeGreetingProps) => {
  const { isUSA } = useCountry();
  const [greeting, setGreeting] = useState({ text: '', icon: Sun, gradient: 'var(--gradient-morning)' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Sanitizar o nome do usuário para prevenir XSS
  const sanitizedUserName = userName.replace(/[<>]/g, '').slice(0, 50);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting({
        text: isUSA ? `Good morning, ${sanitizedUserName}` : `Bom dia, ${sanitizedUserName}`,
        icon: Sun,
        gradient: 'var(--gradient-morning)'
      });
    } else if (hour >= 12 && hour < 18) {
      setGreeting({
        text: isUSA ? `Good afternoon, ${sanitizedUserName}` : `Boa tarde, ${sanitizedUserName}`,
        icon: Sunset,
        gradient: 'var(--gradient-calm)'
      });
    } else {
      setGreeting({
        text: isUSA ? `Good evening, ${sanitizedUserName}` : `Boa noite, ${sanitizedUserName}`,
        icon: Moon,
        gradient: 'var(--gradient-evening)'
      });
    }
  }, [currentTime, sanitizedUserName, isUSA]);

  const moods: { icon: LucideIcon; label: string; value: string }[] = isUSA ? [
    { icon: Smile, label: 'Good', value: 'good' },
    { icon: Heart, label: 'Calm', value: 'calm' },
    { icon: BatteryLow, label: 'Tired', value: 'tired' },
    { icon: AlertCircle, label: 'Anxious', value: 'anxious' },
    { icon: PartyPopper, label: 'Happy', value: 'happy' },
  ] : [
    { icon: Smile, label: 'Bem', value: 'good' },
    { icon: Heart, label: 'Tranquila', value: 'calm' },
    { icon: BatteryLow, label: 'Cansada', value: 'tired' },
    { icon: AlertCircle, label: 'Ansiosa', value: 'anxious' },
    { icon: PartyPopper, label: 'Feliz', value: 'happy' },
  ];

  const GreetingIcon = greeting.icon;

  return (
    <Card className="relative overflow-hidden bg-background border border-primary/60 shadow-[0_0_20px_hsl(var(--primary)/0.25)]">
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GreetingIcon className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">
              {greeting.text}
            </h1>
          </div>
          <Star className="w-5 h-5 text-primary animate-pulse" />
        </div>

        <div className="bg-background/60 rounded-xl p-3 border border-primary/40">
          <p className="text-foreground text-xs font-medium mb-2">
            {isUSA ? 'How are you feeling?' : 'Como está se sentindo?'}
          </p>

          <div className="grid grid-cols-5 gap-1.5">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.value}
                  onClick={() => onMoodSelect?.(mood.value)}
                  className="flex flex-col items-center gap-1 p-2 bg-background hover:bg-primary/10 rounded-lg transition-all active:scale-95 border border-primary/40 hover:border-primary"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-medium text-foreground leading-tight">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-muted-foreground text-xs mt-2 text-center font-medium">
          {currentTime.toLocaleTimeString(isUSA ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </Card>
  );
};

export default WelcomeGreeting;
