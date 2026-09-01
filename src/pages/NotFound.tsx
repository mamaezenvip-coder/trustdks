import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.7)]">404</h1>
        <p className="text-lg font-semibold text-foreground">Página não encontrada</p>
        <p className="text-sm text-muted-foreground">
          O caminho <span className="text-primary">{location.pathname}</span> não existe no Mamãe Zen.
        </p>
        <Button asChild className="font-bold">
          <a href="/">
            <Home className="w-4 h-4 mr-2" />
            Voltar ao início
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
