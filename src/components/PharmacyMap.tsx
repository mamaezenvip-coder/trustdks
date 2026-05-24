import {useState} from'react';
import {MapPin, Navigation, Loader2} from'lucide-react';
import {useCountry} from'@/contexts/CountryContext';
import {Button} from'@/components/ui/button';
import {Card} from'@/components/ui/card';
import {toast} from'sonner';
import {Badge} from'@/components/ui/badge';

interface Pharmacy {
 id: string;
 name: string;
 address: string;
 distance?: number;
 lat: number;
 lng: number;
}

const PharmacyMap = () => {
 const {isUSA} = useCountry();
 const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
 const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
 const [loading, setLoading] = useState(false);
 const [isActivated, setIsActivated] = useState(false);

 const getCurrentLocation = () => {
 if (!isActivated) {
 setIsActivated(true);
}
 setLoading(true);
 
 if (!navigator.geolocation) {
 const message = isUSA 
?'Geolocation is not supported by your browser':'Geolocalização não é suportada pelo seu navegador';
 toast.error(message);
 setLoading(false);
 return;
}

 const timeoutId = setTimeout(() => {
 const message = isUSA 
?'Location request timed out. Please try again.':'Tempo esgotado. Tente novamente.';
 toast.error(message);
 setLoading(false);
}, 10000);

 navigator.geolocation.getCurrentPosition(
 (position) => {
 clearTimeout(timeoutId);
 try {
 const location = {
 lat: position.coords.latitude,
 lng: position.coords.longitude,
};
 setUserLocation(location);
 searchNearbyPharmacies(location);
 const message = isUSA 
?'Your location has been found':'Sua localização foi encontrada';
 toast.success(message);
} catch (err) {
 console.error('Error processing location:', err);
 const message = isUSA 
?'Error processing location. Please try again.':'Erro ao processar localização. Tente novamente.';
 toast.error(message);
 setLoading(false);
}
},
 (error) => {
 clearTimeout(timeoutId);
 console.error('Error getting location:', error);
 let message = isUSA 
?'Could not get your location. Please enable GPS.':'Não foi possível obter sua localização. Ative o GPS.';
 
 if (error.code === error.PERMISSION_DENIED) {
 message = isUSA 
?'Location permission denied. Please enable in settings.':'Permissão de localização negada. Ative nas configurações.';
}
 
 toast.error(message);
 setLoading(false);
},
 {
 enableHighAccuracy: true,
 timeout: 10000,
 maximumAge: 0
}
);
};

 const searchNearbyPharmacies = async (location: {lat: number; lng: number}) => {
 setLoading(true);
 try {
 const searchTerm = isUSA?'pharmacy':'farmácia';
 
 const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=20&lat=${location.lat}&lon=${location.lng}&bounded=1&viewbox=${location.lng - 0.1},${location.lat - 0.1},${location.lng + 0.1},${location.lat + 0.1}`);
 
 if (!response.ok) throw new Error('Search failed');
 
 const data = await response.json();
 
 const pharmacyList: Pharmacy[] = data
.filter((place: any) => {
 const displayName = place.display_name.toLowerCase();
 return displayName.includes('farm') || displayName.includes('pharm') || displayName.includes('drog');
})
.map((place: any) => {
 const lat = parseFloat(place.lat);
 const lng = parseFloat(place.lon);
 const distance = calculateDistance(location.lat, location.lng, lat, lng);
 
 return {
 id: place.place_id,
 name: place.display_name.split(',')[0],
 address: place.display_name,
 distance,
 lat,
 lng,
};
})
.sort((a: Pharmacy, b: Pharmacy) => (a.distance || 0) - (b.distance || 0))
.slice(0, 10);
 
 setPharmacies(pharmacyList);
 
 if (pharmacyList.length === 0) {
 const message = isUSA 
?'No pharmacies found nearby.':'Nenhuma farmácia encontrada próxima.';
 toast.info(message);
} else {
 const message = isUSA 
?`Found ${pharmacyList.length} pharmacies nearby`:`Encontradas ${pharmacyList.length} farmácias próximas`;
 toast.success(message);
}
} catch (error) {
 if (import.meta.env.DEV) {
 console.error('Error searching pharmacies:', error);
}
 const message = isUSA 
?'Error searching for pharmacies. Please try again.':'Erro ao buscar farmácias. Por favor, tente novamente.';
 toast.error(message);
} finally {
 setLoading(false);
}
};

 const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
 const R = 6371;
 const dLat = toRad(lat2 - lat1);
 const dLon = toRad(lon2 - lon1);
 const a =
 Math.sin(dLat / 2) * Math.sin(dLat / 2) +
 Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 return R * c;
};

 const toRad = (value: number): number => {
 return (value * Math.PI) / 180;
};

 const openInMaps = (pharmacy: Pharmacy) => {
 const url =`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
 window.open(url,'_blank');
};

 return (
 <div className="space-y-4">
 {!isActivated? (
 <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
 <div className="p-8 text-center space-y-6">
 <div className="flex justify-center">
 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
 <MapPin className="w-10 h-10 text-foreground"/>
 </div>
 </div>
 
 <div>
 <h3 className="text-2xl font-bold text-foreground mb-2">
 {isUSA?'Find Pharmacies':'Localizar Farmácias'}
 </h3>
 <p className="text-muted-foreground">
 {isUSA 
?'Find pharmacies near you with your real-time location':'Encontre farmácias próximas com sua localização em tempo real'}
 </p>
 </div>

 <Button 
 onClick={getCurrentLocation}
 size="lg"className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-6 shadow-lg">
 <MapPin className="w-5 h-5 mr-2"/>
 {isUSA?'Activate Location':'Ativar Localização'}
 </Button>

 <p className="text-xs text-muted-foreground">
 {isUSA 
?'Your location data is safe and will only be used to find nearby pharmacies':'Seus dados de localização são seguros e serão usados apenas para encontrar farmácias próximas'}
 </p>
 </div>
 </Card>
): (
 <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
 <div className="p-6 space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 text-primary">
 <MapPin className="w-5 h-5"/>
 <h3 className="font-semibold text-lg">
 {isUSA?'Nearby Pharmacies':'Farmácias Próximas'}
 </h3>
 </div>
 {userLocation && (
 <div className="flex items-center gap-2 text-primary">
 <div className="w-2 h-2 bg-primary rounded-full animate-pulse"/>
 <span className="text-xs font-medium">
 {isUSA?'Live Location':'Localização Ativa'}
 </span>
 </div>
)}
 </div>
 
 <p className="text-sm text-muted-foreground">
 {isUSA 
?'Pharmacies near your current location':'Farmácias próximas da sua localização atual'}
 </p>

 <Button 
 onClick={getCurrentLocation}
 variant="outline"className="w-full"disabled={loading}
 >
 {loading? <Loader2 className="w-4 h-4 mr-2 animate-spin"/>: <MapPin className="w-4 h-4 mr-2"/>}
 {isUSA?'Update Location':'Atualizar Localização'}
 </Button>
 </div>
 </Card>
)}

 {loading && (
 <Card className="p-8">
 <div className="flex flex-col items-center justify-center gap-3">
 <Loader2 className="w-8 h-8 animate-spin text-primary"/>
 <p className="text-sm text-muted-foreground">
 {isUSA?'Searching for pharmacies...':'Buscando farmácias...'}
 </p>
 </div>
 </Card>
)}

 {!loading && pharmacies.length > 0 && (
 <div className="space-y-3">
 <div className="flex items-center justify-between">
 <h4 className="text-sm font-semibold text-muted-foreground">
 {isUSA?`${pharmacies.length} pharmacies found`:`${pharmacies.length} farmácias encontradas`}
 </h4>
 </div>
 
 {pharmacies.map((pharmacy) => (
 <Card 
 key={pharmacy.id}
 className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
 <div className="space-y-2">
 <div className="flex items-start justify-between gap-2">
 <div className="flex-1 min-w-0">
 <h4 className="font-semibold text-sm line-clamp-2">
 {pharmacy.name}
 </h4>
 <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
 {pharmacy.address}
 </p>
 </div>
 </div>
 
 {pharmacy.distance && (
 <Badge variant="secondary"className="text-xs">
 {pharmacy.distance.toFixed(1)} km
 </Badge>
)}
 
 <div className="flex gap-2">
 <Button 
 onClick={() => openInMaps(pharmacy)} 
 size="sm"variant="default"className="w-full">
 <Navigation className="w-3 h-3 mr-2"/>
 {isUSA?'Get Directions':'Rotas'}
 </Button>
 </div>
 </div>
 </Card>
))}
 </div>
)}

 {!loading && pharmacies.length === 0 && userLocation && (
 <Card className="p-8">
 <div className="text-center space-y-2">
 <MapPin className="w-12 h-12 mx-auto text-muted-foreground opacity-50"/>
 <p className="text-sm text-muted-foreground">
 {isUSA 
?'No pharmacies found. Try a different search.':'Nenhuma farmácia encontrada. Tente uma busca diferente.'}
 </p>
 </div>
 </Card>
)}
 </div>
);
};

export default PharmacyMap;
