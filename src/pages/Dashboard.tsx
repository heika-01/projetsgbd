import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Truck,
  Users,
  UserCog,
  Briefcase,
  LogOut,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const userLogin = localStorage.getItem("userLogin") || "Utilisateur";
  const userRole = localStorage.getItem("userRole") || "Administrateur";

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const menuItems = [
    {
      title: "Gestion des Commandes",
      description: "Ajouter, modifier, rechercher des commandes",
      icon: ShoppingCart,
      path: "/commandes",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Gestion des Livraisons",
      description: "Gérer les livraisons et les livreurs",
      icon: Truck,
      path: "/livraisons",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Gestion des Articles",
      description: "Catalogue des produits et stock",
      icon: Package,
      path: "/articles",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Gestion des Clients",
      description: "Base de données clients",
      icon: Users,
      path: "/clients",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Gestion du Personnel",
      description: "Employés et utilisateurs",
      icon: UserCog,
      path: "/personnel",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Gestion des Postes",
      description: "Définition des postes et rôles",
      icon: Briefcase,
      path: "/postes",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Système de Gestion</h1>
              <p className="text-xs text-muted-foreground">Livraisons & Commandes</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{userLogin}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Commandes Aujourd'hui</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12% par rapport à hier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Livraisons en Cours</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">6 livreurs actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Articles en Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">15 catégories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">+23 ce mois</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Modules de Gestion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card
                key={item.path}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate(item.path)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Accéder au module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
