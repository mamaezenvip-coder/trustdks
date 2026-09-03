import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car, Navigation, MapPin } from "lucide-react";
import { useCountry } from "@/contexts/CountryContext";

export interface RouteDestination {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  distance?: number;
}

interface RouteMapDialogProps {
  destination: RouteDestination | null;
  origin?: { lat: number; lng: number } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RouteMapDialog = ({ destination, origin, open, onOpenChange }: RouteMapDialogProps) => {
  const { isUSA } = useCountry();

  if (!destination) return null;

  const hasCoords = typeof destination.lat === "number" && typeof destination.lng === "number";
  const lat = destination.lat ?? 0;
  const lng = destination.lng ?? 0;

  const delta = 0.012;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const embedUrl = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
    : "";

  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openUber = () => {
    if (!hasCoords) return;
    const url = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(destination.name)}`;
    openExternal(url);
  };

  const open99 = () => {
    if (!hasCoords) return;
    const deepLink = `taxis99://call?dropoff_latitude=${lat}&dropoff_longitude=${lng}&dropoff_title=${encodeURIComponent(destination.name)}&deep_link_product_id=316`;
    // Tenta abrir o app; se não estiver instalado, cai na página do 99.
    const fallback = window.setTimeout(() => {
      openExternal("https://99app.com/");
    }, 1500);
    const cancel = () => window.clearTimeout(fallback);
    document.addEventListener("visibilitychange", cancel, { once: true });
    window.location.href = deepLink;
  };

  const openGoogleMaps = () => {
    const url = hasCoords
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.address || destination.name)}`;
    openExternal(url);
  };

  const openOsmRoute = () => {
    if (!hasCoords) return;
    const from = origin ? `${origin.lat},${origin.lng}` : "";
    openExternal(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${from};${lat},${lng}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg bg-card border border-primary/40 p-4">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-base text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="leading-tight">{destination.name}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {destination.address}
            {destination.distance ? ` • ${destination.distance.toFixed(1)} km` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl overflow-hidden border border-primary/30 neon-glow bg-background">
          {hasCoords ? (
            <iframe
              title={`Mapa ${destination.name}`}
              src={embedUrl}
              className="w-full h-[280px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="h-[280px] flex items-center justify-center px-6 text-center text-xs text-muted-foreground">
              {isUSA ? "Map unavailable for this facility." : "Mapa indisponível para esta unidade."}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={open99} className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2">
            <Car className="w-4 h-4" />
            {isUSA ? "Call a ride (99)" : "Chamar 99"}
          </Button>
          <Button onClick={openUber} variant="outline" className="h-11 border-primary/50 text-foreground hover:bg-primary/10 font-bold gap-2">
            <Car className="w-4 h-4" />
            Uber
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={openGoogleMaps} variant="ghost" className="h-10 text-xs text-foreground hover:bg-primary/10 gap-2">
            <Navigation className="w-3.5 h-3.5 text-primary" />
            Google Maps
          </Button>
          <Button onClick={openOsmRoute} variant="ghost" className="h-10 text-xs text-foreground hover:bg-primary/10 gap-2">
            <Navigation className="w-3.5 h-3.5 text-primary" />
            {isUSA ? "Full route" : "Rota completa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteMapDialog;
