import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Zap, ArrowRight, Lock, User } from "lucide-react";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login && password) {
      localStorage.setItem("userLogin", login);
      localStorage.setItem("userRole", "Administrateur");
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${login}`,
      });
      
      navigate("/dashboard");
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent glow-primary mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestion<span className="gradient-text">Pro</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Système de gestion des livraisons
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-sm font-medium text-muted-foreground">
                Identifiant
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login"
                  type="text"
                  placeholder="Votre identifiant"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-secondary/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all glow-primary font-semibold text-base"
            >
              Se connecter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          © 2024 GestionPro • Tous droits réservés
        </p>
      </div>
    </div>
  );
};

export default Login;