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
import { ArrowLeft, Plus, Search, Edit, Trash2, Briefcase } from "lucide-react";

const Postes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées
  const postes = [
    {
      codeposte: "P001",
      libelle: "Administrateur",
      indice: 500,
      description: "Gestion complète du système",
      nbEmployes: 3,
    },
    {
      codeposte: "P002",
      libelle: "Magasinier",
      indice: 300,
      description: "Gestion du stock et des articles",
      nbEmployes: 8,
    },
    {
      codeposte: "P003",
      libelle: "Livreur",
      indice: 250,
      description: "Livraison des commandes clients",
      nbEmployes: 18,
    },
    {
      codeposte: "P004",
      libelle: "Chef Livreur",
      indice: 350,
      description: "Coordination des livraisons",
      nbEmployes: 5,
    },
  ];

  const filteredPostes = postes.filter(
    (poste) =>
      poste.codeposte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poste.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIndiceBadge = (indice: number) => {
    if (indice >= 400) return <Badge className="bg-destructive text-destructive-foreground">Élevé</Badge>;
    if (indice >= 300) return <Badge className="bg-warning text-warning-foreground">Moyen</Badge>;
    return <Badge className="bg-info text-info-foreground">Base</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Gestion des Postes</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Poste
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Postes Définis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Types de postes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">Tous postes confondus</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Indice Moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">321</div>
              <p className="text-xs text-muted-foreground">Base de calcul</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Postes</CardTitle>
              <div className="flex items-center gap-2 w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par code ou libellé..."
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
                  <TableHead>Code Poste</TableHead>
                  <TableHead>Libellé</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Indice</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Nb Employés</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPostes.map((poste) => (
                  <TableRow key={poste.codeposte}>
                    <TableCell className="font-medium">{poste.codeposte}</TableCell>
                    <TableCell className="font-semibold">{poste.libelle}</TableCell>
                    <TableCell className="text-muted-foreground">{poste.description}</TableCell>
                    <TableCell className="font-mono">{poste.indice}</TableCell>
                    <TableCell>{getIndiceBadge(poste.indice)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{poste.nbEmployes} employés</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={poste.nbEmployes > 0}>
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

        {/* Info sur les postes et leurs autorisations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Effectifs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {postes.map((poste) => (
                <div key={poste.codeposte} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{poste.libelle}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(poste.nbEmployes / 34) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {poste.nbEmployes}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modules par Rôle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Administrateur</p>
                <p className="text-muted-foreground">Accès complet à tous les modules</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Magasinier</p>
                <p className="text-muted-foreground">Articles, Commandes</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Chef Livreur</p>
                <p className="text-muted-foreground">Livraisons uniquement</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Livreur</p>
                <p className="text-muted-foreground">Consultation livraisons</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Postes;
