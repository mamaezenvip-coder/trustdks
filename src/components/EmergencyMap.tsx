import {useState} from"react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from"@/components/ui/card";
import {Button} from"@/components/ui/button";
import {MapPin, Phone, Navigation, Hospital, Stethoscope, Loader2} from"lucide-react";
import {toast} from"sonner";
import {Badge} from"@/components/ui/badge";
import {useCountry} from"@/contexts/CountryContext";
import RouteMapDialog from"@/components/RouteMapDialog";

interface Location {
 lat: number;
 lng: number;
}

interface Emergency {
 name: string;
 type:"hospital"|"clinica"|"pronto-socorro"|"publico"|"particular";
 phone: string;
 address: string;
 distance?: number;
 lat?: number;
 lng?: number;
 isPublic?: boolean;
}

 const EmergencyMap = () => {
  const {isUSA} = useCountry();
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<Emergency[]>([]);
  const [locationCity, setLocationCity] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<Emergency | null>(null);

 const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
 const R = 6371;
 const dLat = (lat2 - lat1) * Math.PI / 180;
 const dLon = (lon2 - lon1) * Math.PI / 180;
 const a = 
 Math.sin(dLat/2) * Math.sin(dLat/2) +
 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
 Math.sin(dLon/2) * Math.sin(dLon/2);
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
 return R * c;
};

 const reverseGeocode = async (lat: number, lng: number): Promise<{city: string; region: string}> => {
 try {
 const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`, { signal: AbortSignal.timeout(4000) });
 const data = await response.json();
 const city = data.address?.city || data.address?.town || data.address?.municipality || data.address?.village ||"";
 const region = data.address?.state || data.address?.region ||"";
 return {city, region};
} catch (error) {
 console.error("Erro ao obter cidade:", error);
 return {city:"", region:""};
}
};

 const searchNearbyHospitals = async (lat: number, lng: number, city: string, region: string): Promise<Emergency[]> => {
 const terms = isUSA ? ["hospital","emergency room","urgent care","clinic"] : ["hospital","pronto socorro","upa","maternidade","clinica","posto de saude"];
 const d = 0.15;
 const viewbox = `${lng - d},${lat + d},${lng + d},${lat - d}`;
 const results = await Promise.allSettled(terms.map(async (term) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&q=${encodeURIComponent(term)}&limit=25&bounded=1&viewbox=${viewbox}`;
  const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`Nominatim ${r.status}`);
  return (await r.json()) as any[];
 }));
 const seen = new Set<string>();
 const list: Emergency[] = [];
 results.forEach((res) => {
  if (res.status !== "fulfilled" || !Array.isArray(res.value)) return;
  res.value.forEach((place: any) => {
   const pLat = parseFloat(place.lat), pLng = parseFloat(place.lon);
   if (!isFinite(pLat) || !isFinite(pLng)) return;
   const key = String(place.place_id);
   if (seen.has(key)) return;
   const name = (place.name || place.display_name?.split(",")[0] || "").trim();
   const lower = `${name} ${place.type || ""} ${place.class || ""}`.toLowerCase();
   const isHealth = place.class === "amenity" && ["hospital","clinic","doctors"].includes(place.type) || place.class === "healthcare" || /hospital|upa|pronto|socorro|cl[ií]nica|maternidade|ubs|posto|sa[uú]de|emergency|urgent|clinic|medical/.test(lower);
   if (!isHealth) return;
   seen.add(key);
   let type: Emergency["type"] = "clinica";
   if (/upa|pronto|socorro|emerg|urgent|ubs|posto/.test(lower)) type = "pronto-socorro";
   else if (/hospital|maternidade/.test(lower)) type = "hospital";
   const tags = place.extratags || {};
   const a = place.address || {};
   const address = [a.road && `${a.road}${a.house_number ? " " + a.house_number : ""}`, a.suburb].filter(Boolean).join(", ") || place.display_name?.split(",").slice(1, 3).join(",").trim() || "";
   list.push({
    name: name || (isUSA ? "Health facility" : "Unidade de saúde"),
    type,
    phone: tags.phone || tags["contact:phone"] || (isUSA ? "Not available" : "Não disponível"),
    address,
    lat: pLat, lng: pLng,
    distance: calculateDistance(lat, lng, pLat, pLng),
    isPublic: /upa|ubs|posto|municipal|estadual|sus|regional/.test(lower) || tags["healthcare:funding"] === "public" || undefined,
   });
  });
 });
 if (list.length === 0 && results.every((r) => r.status === "rejected")) {
  toast.error(isUSA ? "Error searching nearby facilities" : "Erro ao buscar unidades próximas");
 }
 void city; void region;
 return list.sort((x, y) => (x.distance || 0) - (y.distance || 0)).slice(0, 40);
};

 // Limpeza leve de storage antes de buscas pesadas (evita tela preta por storage cheio).
 // Nunca remove service worker, Cache API ou sessão de login/música.
 const trimAppStorage = () => {
 try {
 const keysToTrim = ['sleepEntries','feedingEntries','notifications','musicCache','youtubeCache'];
 keysToTrim.forEach(key => {
 const stored = localStorage.getItem(key);
 if (!stored) return;
 try {
 const data = JSON.parse(stored);
 if (Array.isArray(data) && data.length > 50) {
 localStorage.setItem(key, JSON.stringify(data.slice(0, 30)));
 }
 } catch {
 localStorage.removeItem(key);
 }
 });

 const keysToRemove: string[] = [];
 for (let i = 0; i < localStorage.length; i++) {
 const key = localStorage.key(i);
 if (key && (key.startsWith('temp_') || key.startsWith('cache_'))) keysToRemove.push(key);
 }
 keysToRemove.forEach(key => localStorage.removeItem(key));
 } catch (error) {
 if (import.meta.env.DEV) console.error('Storage cleanup error:', error);
 }
 };


 const getLocation = async () => {
 setLoading(true);
 trimAppStorage();
 toast.info(isUSA?"Searching hospitals in your area...":"Buscando hospitais da sua região...");
 
 if (!navigator.geolocation) {
 toast.error(isUSA?"Geolocation is not supported by your browser":"Geolocalização não é suportada pelo seu navegador");
 setLoading(false);
 return;
}

 // Guarda para não disparar dois avisos (timeout manual + timeout do GPS)
 let settled = false;
 const timeoutId = window.setTimeout(() => {
 if (settled) return;
 settled = true;
 toast.error(isUSA?"Location request timed out. Please try again.":"Tempo esgotado. Tente novamente.");
 setLoading(false);
}, 20000);

 navigator.geolocation.getCurrentPosition(
 async (position) => {
 if (settled) return;
 settled = true;
 clearTimeout(timeoutId);

 try {
 const location = {
 lat: position.coords.latitude,
 lng: position.coords.longitude,
};
 setUserLocation(location);
 
 // Cache de 10 min por área (~1 km) para abrir instantaneamente em novos cliques
 const cacheKey = `mz-emerg-${location.lat.toFixed(2)}-${location.lng.toFixed(2)}`;
 let cached: { t: number; name: string; list: Emergency[] } | null = null;
 try { cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null'); } catch { cached = null; }
 if (cached && Date.now() - cached.t < 600000 && cached.list?.length) {
 setLocationCity(cached.name);
 setNearbyPlaces(cached.list);
 toast.success(isUSA ? `Found ${cached.list.length} health facilities nearby!` : `Encontradas ${cached.list.length} unidades de saúde!`);
 return;
 }

 // Cidade e hospitais buscados em paralelo (a cidade nunca trava a busca)
 const geoPromise = reverseGeocode(location.lat, location.lng);
 const hospitalsPromise = searchNearbyHospitals(location.lat, location.lng, "", "");
 const {city, region} = await geoPromise;
 const locationName = city && region?`${city} - ${region}`: (city || region || (isUSA?"Your location":"Sua localização"));
 setLocationCity(locationName);
 
 const suffix = city && region ? `${city} - ${region}` : (city || region);
 const hospitals = (await hospitalsPromise).map((h) => ({
 ...h,
 address: (h.address || "").replace(/,\s*-\s*$/, "").replace(/[,\s-]+$/, "") + (suffix ? `, ${suffix}` : ""),
 }));
 if (hospitals.length > 0) {
 try { sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), name: locationName, list: hospitals })); } catch { /* storage cheio */ }
 }
 
 if (hospitals.length > 0) {
 setNearbyPlaces(hospitals);
 toast.success(isUSA 
?`Found ${hospitals.length} health facilities nearby!`:`Encontradas ${hospitals.length} unidades de saúde!`);
} else {
 toast.warning(isUSA 
?"No facilities found nearby. Try again.":"Nenhuma unidade encontrada próxima. Tente novamente.");
}
} catch (error) {
 console.error("Erro:", error);
 toast.error(isUSA?"Error searching hospitals. Try again.":"Erro ao buscar hospitais. Tente novamente.");
} finally {
 setLoading(false);
}
},
 (error) => {
 if (settled) return;
 settled = true;
 clearTimeout(timeoutId);
 if (import.meta.env.DEV) console.error('Error getting location:', error);
 let message = isUSA 
?"Could not get your location. Please enable GPS.":"Não foi possível obter sua localização. Ative o GPS.";
 
 if (error.code === error.PERMISSION_DENIED) {
 message = isUSA 
?"Location permission denied. Please enable in settings.":"Permissão de localização negada. Ative nas configurações.";
}
 
 toast.error(message);
 setLoading(false);
},
 {
 enableHighAccuracy: true,
 timeout: 15000,
 maximumAge: 30000
}
);
};

  const openInMaps = (place: Emergency) => {
    setSelectedDestination(place);
  };

 const hasPhone = (phone: string) =>
 !!phone && phone!=="Não disponível"&& phone!=="Not available";


 const callPhone = (phone: string) => {
 window.location.href =`tel:${phone}`;
};

 const getTypeIcon = (type: string) => {
 switch (type) {
 case"hospital":
 return <Hospital className="w-4 h-4"/>;
 case"pronto-socorro":
 return <Stethoscope className="w-4 h-4"/>;
 default:
 return <MapPin className="w-4 h-4"/>;
}
};

 const getTypeBadge = (place: Emergency) => {
 const badges = [];
 
 if (place.type ==="hospital") {
 badges.push(<Badge key="type"className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">Hospital</Badge>);
} else if (place.type ==="pronto-socorro") {
 badges.push(<Badge key="type"className="text-[10px] px-1.5 py-0 bg-secondary text-secondary-foreground">{isUSA?"ER":"Pronto-Socorro"}</Badge>);
} else {
 badges.push(<Badge key="type"className="text-[10px] px-1.5 py-0 bg-accent text-accent-foreground">{isUSA?"Clinic":"Clínica"}</Badge>);
}
 
 if (place.isPublic!== undefined) {
 badges.push(
 <Badge key="funding"variant="outline"className="text-[10px] px-1.5 py-0">
 {place.isPublic? (isUSA?"Public":"Público"): (isUSA?"Private":"Particular")}
 </Badge>
);
}
 
 return badges;
};

  return (
  <>
  <RouteMapDialog
    destination={selectedDestination}
    origin={userLocation}
    open={selectedDestination !== null}
    onOpenChange={(open) => { if (!open) setSelectedDestination(null); }}
  />
  <div className="space-y-4">
  <Card className="bg-card border-2 border-primary/30">
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Hospital className="w-5 h-5 text-primary"/>
 <CardTitle className="text-lg text-primary">
 {isUSA?"All nearby health facilities":"Todas as unidades de saúde próximas"}
 </CardTitle>
 </div>
 <CardDescription className="text-xs leading-relaxed">
 {locationCity? (
 <> {isUSA?"Your location":"Sua região"}: <strong>{locationCity}</strong></>
): (
 <>{isUSA?"Hospitals, clinics, and emergency rooms in one place":"Hospitais, clínicas, UBS e pronto-socorros em um só lugar"}</>
)}
 </CardDescription>
 </CardHeader>
 <CardContent className="p-3 pt-0">
 <Button 
 onClick={getLocation} 
 disabled={loading}
 className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"size="lg">
 {loading? (
 <>
 <Loader2 className="w-4 h-4 animate-spin"/>
 {isUSA?"Searching nearby facilities...":"Buscando unidades próximas..."}
 </>
): userLocation? (
 <>
 <Navigation className="w-4 h-4"/>
 {isUSA?"Update location":"Atualizar localização"}
 </>
): (
 <>
 <Hospital className="w-4 h-4"/>
 {isUSA?"Emergency - Activate search":"Emergência - Ativar busca"}
 </>
)}
 </Button>
 
 {userLocation && (
 <div className="flex items-center justify-center gap-2 mt-2 text-primary">
 <div className="w-2 h-2 bg-primary rounded-full animate-pulse"/>
 <span className="text-xs font-medium">
 {isUSA?"GPS Active":"GPS Ativo"}
 </span>
 </div>
)}
 </CardContent>
 </Card>

 {/* Emergency Numbers */}
 <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-2 border-primary">
 <CardContent className="p-4">
 <div className="space-y-2">
 {isUSA? (
 <>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-bold text-sm"> Emergency Services</p>
 <p className="text-xs opacity-90">Police, Fire, Medical</p>
 </div>
 <Button 
 onClick={() => callPhone("911")} 
 size="sm"className="bg-background text-primary hover:bg-background/80">
 <Phone className="w-4 h-4"/>
 911
 </Button>
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-bold text-sm"> Poison Control</p>
 <p className="text-xs opacity-90">Poisoning emergencies</p>
 </div>
 <Button 
 onClick={() => callPhone("1-800-222-1222")} 
 size="sm"className="bg-background text-primary hover:bg-background/80 text-[10px]">
 <Phone className="w-3 h-3"/>
 Call
 </Button>
 </div>
 </>
): (
 <>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-bold text-sm"> SAMU - Emergência</p>
 <p className="text-xs opacity-90">Atendimento médico de urgência</p>
 </div>
 <Button 
 onClick={() => callPhone("192")} 
 size="sm"className="bg-background text-primary hover:bg-background/80">
 <Phone className="w-4 h-4"/>
 192
 </Button>
 </div>
 <div className="flex items-center justify-between">
 <div>
 <p className="font-bold text-sm"> Bombeiros</p>
 <p className="text-xs opacity-90">Emergências e resgates</p>
 </div>
 <Button 
 onClick={() => callPhone("193")} 
 size="sm"className="bg-background text-primary hover:bg-background/80">
 <Phone className="w-4 h-4"/>
 193
 </Button>
 </div>
 </>
)}
 </div>
 </CardContent>
 </Card>

 {/* Lista de Hospitais e Clínicas */}
 <div className="space-y-2">
  {nearbyPlaces.length > 0 && (
  <div className="bg-card p-3 rounded-lg border border-primary/20">
 <h3 className="text-sm font-bold text-foreground">
 {nearbyPlaces.length} {isUSA?"facilities found":"unidades encontradas"} {locationCity &&`- ${locationCity}`}
 </h3>
 </div>
)}
 {nearbyPlaces.map((place, index) => (
 <Card key={index} className="hover:shadow-md transition-shadow">
 <CardContent className="p-3">
 <div className="space-y-2">
 <div className="flex items-start justify-between gap-2">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 {getTypeIcon(place.type)}
 <h4 className="font-semibold text-sm leading-tight">{place.name}</h4>
 </div>
 <div className="flex items-center gap-2 flex-wrap">
 {getTypeBadge(place)}
 {place.distance && (
 <Badge variant="outline"className="text-[10px] px-1.5 py-0">
 {place.distance.toFixed(1)} km
 </Badge>
)}
 </div>
 </div>
 </div>
 
 <p className="text-xs text-muted-foreground">{place.address}</p>
 
 <div className="flex gap-2">
 <Button 
 onClick={() => openInMaps(place)} 
 size="sm"variant="default"className="flex-1">
 <Navigation className="w-3 h-3"/>
 {isUSA?"Directions":"Rotas"}
 </Button>
 {hasPhone(place.phone) && (
 <Button 
 onClick={() => callPhone(place.phone)} 
 size="sm"variant="outline"className="flex-1">
 <Phone className="w-3 h-3"/>
 {isUSA?"Call":"Ligar"}
 </Button>
)}
 </div>

 </div>
 </CardContent>
 </Card>
))}
 </div>

 <Card className="bg-card border border-primary/20">
 <CardContent className="p-3">
 <p className="text-xs text-center leading-relaxed">
 <strong> {isUSA?"Tip":"Dica"}:</strong> {isUSA 
?"Save emergency numbers in your phone contacts. In emergencies with babies, every second counts!":"Salve os números de emergência na agenda do seu celular. Em situações de emergência com bebês, cada segundo conta!"}
 </p>
 </CardContent>
  </Card>
  </div>
  </>
 );
};

export default EmergencyMap;
