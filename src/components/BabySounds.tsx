import {Card, CardContent, CardDescription, CardHeader, CardTitle} from"@/components/ui/card";
import {Button} from"@/components/ui/button";
import {Slider} from"@/components/ui/slider";
import {useState} from"react";
import {Play, Pause, Volume2, Music, Loader2, Info} from"lucide-react";
import {toast} from"@/hooks/use-toast";
import {useCountry} from"@/contexts/CountryContext";
import {useYouTubeEmbed} from"@/hooks/useYouTubeEmbed";

interface Sound {
 id: string;
 name: string;
 nameEN: string;
 description: string;
 descriptionEN: string;
 youtubeId: string;
 icon: string;
 quality: string;
}

const babySounds: Sound[] = [
 {
 id:"white-noise",
 name:"Ruído Branco",
 nameEN:"White Noise",
 description:"Som contínuo que acalma o bebê",
 descriptionEN:"Continuous sound that calms baby",
 youtubeId:"nMfPqeZjc2c",
 icon:"",
 quality:"10h 4K"},
 {
 id:"rain",
 name:"Chuva Suave",
 nameEN:"Gentle Rain",
 description:"Som relaxante de chuva caindo",
 descriptionEN:"Relaxing rain falling sound",
 youtubeId:"mPZkdNFkNps",
 icon:"",
 quality:"10h 4K"},
 {
 id:"heartbeat",
 name:"Para você mamãe",
 nameEN:"For you mom",
 description:"Melodia especial para o coração",
 descriptionEN:"Special melody for the heart",
 youtubeId:"P9nd2GbmLWU",
 icon:"",
 quality:"Premium HD"},
 {
 id:"lullaby",
 name:"Canção de Ninar",
 nameEN:"Lullaby",
 description:"Melodia suave para dormir",
 descriptionEN:"Soft melody for sleeping",
 youtubeId:"sgfMb2WycDo",
 icon:"",
 quality:"HD"},
 {
 id:"ocean",
 name:"Ondas do Mar",
 nameEN:"Ocean Waves",
 description:"Som tranquilo do oceano",
 descriptionEN:"Peaceful ocean sound",
 youtubeId:"WHPEKLQID4U",
 icon:"",
 quality:"12h 4K"},
 {
 id:"wind",
 name:"Vento Suave",
 nameEN:"Gentle Wind",
 description:"Brisa relaxante",
 descriptionEN:"Relaxing breeze",
 youtubeId:"wzjWIxXBs_s",
 icon:"",
 quality:"10h 4K"}
];

export default function BabySounds() {
 const {isUSA} = useCountry();
 const {
 isPlaying, 
 currentVideoId, 
 isLoading, 
 isIOS,
 containerRef,
 hiddenContainerRef,
 play, 
  pause,
  resume,
  setVolume: setPlayerVolume,
} = useYouTubeEmbed();

 const [volume, setVolume] = useState([70]);
 const currentSound = babySounds.find(s => s.youtubeId === currentVideoId);

 const texts = {
 title: isUSA?'Soothing Sounds Mamãe Zen':'Sons Calmantes Mamãe Zen',
 description: isUSA 
?'Premium high-quality audio to calm and help baby sleep':'Áudios premium em alta qualidade para acalmar e fazer o bebê dormir',
 playing: isUSA?'Playing...':'Tocando...',
  paused: isUSA?'Paused':'Pausado',
  resumed: isUSA?'Playing again':'Tocando novamente',
 loading: isUSA?'Loading...':'Carregando...',
 tapToPlay: isUSA?'Tap ▶ on video to start':'Toque ▶ no vídeo para iniciar',
 premium: isUSA 
?'Mamãe Zen Premium: High-quality YouTube audio, continuous playback. Works on iPhone, Android, Xiaomi!':'Mamãe Zen Premium: Áudio do YouTube em alta qualidade, reprodução contínua. Funciona em iPhone, Android, Xiaomi!',
};

 const handleSoundSelect = (sound: Sound) => {
 if (currentVideoId === sound.youtubeId) {
  if (isPlaying) {
  pause();
 toast({
  title: texts.paused,
  description: isUSA?"Playback paused":"Reprodução pausada",
});
 } else {
  resume();
  toast({
  title: texts.resumed,
  description: isUSA?"Playback resumed":"Reprodução retomada",
  });
 }
} else {
 const name = isUSA? sound.nameEN: sound.name;
 const desc = isUSA? sound.descriptionEN: sound.description;
  play(sound.youtubeId, true, {title: name, artist: desc, artwork:'/mamae-zen-og.png'});
 toast({
 title:`${name}`,
 description:`${desc} - ${sound.quality}`,
});
}
};

 const handlePauseResume = () => {
  if (isPlaying) {
  pause();
 toast({
  title: texts.paused,
  description: isUSA?"Playback paused":"Reprodução pausada",
});
 } else {
  resume();
  toast({
  title: texts.resumed,
  description: isUSA?"Playback resumed":"Reprodução retomada",
  });
 }
};

 const getSoundName = (sound: Sound) => isUSA? sound.nameEN: sound.name;

 const handleVolumeChange = (nextVolume: number[]) => {
  setVolume(nextVolume);
  setPlayerVolume(nextVolume[0]);
 };

 return (
 <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-secondary/40 to-primary/40">
 {/* Container oculto para background */}
 <div
 ref={hiddenContainerRef}
 style={{
 position:'fixed',
 bottom: 0,
 left: 0,
 width:'1px',
 height:'1px',
 opacity: 0.01,
 pointerEvents:'none',
 zIndex: -1,
}}
 />

 <CardHeader className="bg-gradient-to-r from-secondary/20 to-primary/20 pb-3">
 <CardTitle className="text-lg flex items-center gap-2 text-foreground">
 <Music className="w-5 h-5 text-primary"/>
 {texts.title}
 </CardTitle>
 <CardDescription className="text-xs text-primary/70">
 {texts.description}
 </CardDescription>
 </CardHeader>
 <CardContent className="pt-4">
 {/* Player do YouTube */}
 {currentVideoId && (
 <div className="mb-4">
 <div 
 ref={containerRef} 
 className="rounded-xl overflow-hidden shadow-lg border border-border"/>
 {isIOS && (
 <p className="text-center text-xs text-primary mt-2 flex items-center justify-center gap-1">
 <Info className="w-3 h-3"/>
 {texts.tapToPlay}
 </p>
)}
 </div>
)}

 {/* Container oculto quando não há vídeo */}
 {!currentVideoId && (
 <div ref={containerRef} className="hidden"/>
)}

 <div className="grid grid-cols-3 gap-2 mb-4">
 {babySounds.map((sound) => (
 <Button
 key={sound.id}
 variant={currentVideoId === sound.youtubeId?"default":"outline"}
 disabled={isLoading}
 className={`h-auto flex-col gap-1 p-3 relative text-xs transition-all ${
 currentVideoId === sound.youtubeId 
?'bg-gradient-to-br from-primary to-secondary text-foreground border-0 shadow-lg shadow-primary/30':'border-secondary/30 text-primary hover:bg-secondary/20 hover:text-foreground'}`}
 onClick={() => handleSoundSelect(sound)}
 >
 {isLoading && currentVideoId === sound.youtubeId? (
 <Loader2 className="w-6 h-6 animate-spin"/>
): (
 <span className="text-2xl">{sound.icon}</span>
)}
 <div className="text-center">
 <div className="font-semibold text-xs leading-tight">{getSoundName(sound)}</div>
 <div className="text-[10px] opacity-70 mt-0.5">{sound.quality}</div>
 </div>
 {currentVideoId === sound.youtubeId && isPlaying && (
 <div className="absolute top-1 right-1">
 <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>
 </div>
)}
 </Button>
))}
 </div>

 {currentSound && (
 <div className="space-y-3 p-3 rounded-lg bg-[#1e1b4b] border border-secondary/30">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="text-xl">{currentSound.icon}</span>
 <div>
 <p className="font-semibold text-sm text-foreground">{getSoundName(currentSound)}</p>
 <p className="text-xs text-primary/70">
 {isLoading? texts.loading: texts.playing} • {currentSound.quality}
 </p>
 </div>
 </div>
 <Button
  size="icon"variant="outline"onClick={handlePauseResume}
 className="h-8 w-8 border-secondary/30 text-primary hover:bg-secondary/20">
  {isPlaying? <Pause className="w-3 h-3"/>: <Play className="w-3 h-3"/>}
 </Button>
 </div>

 <div className="space-y-1.5">
 <div className="flex items-center gap-2">
 <Volume2 className="w-3 h-3 text-primary/70"/>
 <Slider
 value={volume}
  onValueChange={handleVolumeChange}
 max={100}
 step={1}
 className="flex-1"/>
 <span className="text-xs text-primary/70 w-10 text-right">
 {volume[0]}%
 </span>
 </div>
 </div>
 </div>
)}

 <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
 <p className="text-xs text-green-200">
 <strong className="text-green-400"></strong> {texts.premium}
 </p>
 </div>
 </CardContent>
 </Card>
);
}
