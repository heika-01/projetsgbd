import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, Edit, Trash2, Truck } from "lucide-react";

const Livraisons = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées
  const livraisons = [
    {
      nocde: "CMD001",
      client: "Dupont Jean",
      dateliv: "2025-11-26",
      livreur: "Pierre Martin",
      ville: "75001",
      modepay: "CB",
      etaliv: "En cours",
    },
    {
      nocde: "CMD002",
      client: "Martin Sophie",
      dateliv: "2025-11-26",
      livreur: "Jean Dubois",
      ville: "75002",
      modepay: "Espèces",
      etaliv: "Livrée",
    },
    {
      nocde: "CMD003",
      client: "Bernard Marie",
      dateliv: "2025-11-27",
      livreur: "Pierre Martin",
      ville: "75001",
      modepay: "Chèque",
      etaliv: "Planifiée",
    },
  ];

  const getEtatColor = (etat: string) => {
    switch (etat) {
      case "Planifiée":
        return "bg-blue-500";
      case "En cours":
        return "bg-yellow-500";
      case "Livrée":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredLivraisons = livraisons.filter(
    (liv) =>
      liv.nocde.toLowerCase().includes(searchTerm.toLowerCase()) ||
      liv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      liv.livreur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      liv.ville.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Truck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Gestion des Livraisons</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Livraison
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Livraisons Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">5 livreurs actifs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground">Sur les 30 derniers jours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Délai Moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45 min</div>
              <p className="text-xs text-muted-foreground">Temps de livraison moyen</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Livraisons</CardTitle>
              <div className="flex items-center gap-2 w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par commande, client, livreur ou ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date Livraison</TableHead>
                  <TableHead>Livreur</TableHead>
                  <TableHead>Ville (CP)</TableHead>
                  <TableHead>Mode Paiement</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLivraisons.map((livraison) => (
                  <TableRow key={livraison.nocde}>
                    <TableCell className="font-medium">{livraison.nocde}</TableCell>
                    <TableCell>{livraison.client}</TableCell>
                    <TableCell>
                      {new Date(livraison.dateliv).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>{livraison.livreur}</TableCell>
                    <TableCell>{livraison.ville}</TableCell>
                    <TableCell>{livraison.modepay}</TableCell>
                    <TableCell>
                      <Badge className={`${getEtatColor(livraison.etaliv)} text-white`}>
                        {livraison.etaliv}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Contraintes importantes */}
        <Card className="mt-6 border-warning">
          <CardHeader>
            <CardTitle className="text-warning">Règles de Gestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Maximum 15 livraisons par livreur et par jour et par ville (code postal)</p>
            <p>• Modifications avant 9h pour livraisons matin / avant 14h pour livraisons après-midi</p>
            <p>• Seules les commandes "Prêtes" peuvent être ajoutées aux livraisons</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Livraisons;
