import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Truck,
  Users,
  UserCog,
  Briefcase,
  LogOut,
  Zap,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Dashboard = () => {
  const navigate = useNavigate();
  const userLogin = localStorage.getItem("userLogin") || "Utilisateur";
  const userRole = localStorage.getItem("userRole") || "Administrateur";

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const stats = [
    { label: "Commandes", value: "24", change: "+12%", icon: ShoppingCart },
    { label: "Livraisons", value: "18", change: "+8%", icon: Truck },
    { label: "Articles", value: "1,234", change: "+3%", icon: Package },
    { label: "Clients", value: "856", change: "+23", icon: Users },
  ];

  const menuItems = [
    { title: "Commandes", description: "Gérer les commandes clients", icon: ShoppingCart, path: "/commandes" },
    { title: "Livraisons", description: "Suivi des livraisons", icon: Truck, path: "/livraisons" },
    { title: "Articles", description: "Catalogue produits", icon: Package, path: "/articles" },
    { title: "Clients", description: "Base clients", icon: Users, path: "/clients" },
    { title: "Personnel", description: "Gestion employés", icon: UserCog, path: "/personnel" },
    { title: "Postes", description: "Définition des rôles", icon: Briefcase, path: "/postes" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">GestionPro</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{userLogin}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bonjour, <span className="gradient-text">{userLogin}</span>
          </h2>
          <p className="text-muted-foreground">Voici un aperçu de votre activité aujourd'hui.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-success text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Modules */}
        <h3 className="text-lg font-semibold text-foreground mb-5">Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="glass rounded-2xl p-6 text-left hover:shadow-xl hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;