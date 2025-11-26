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
import { ArrowLeft, Plus, Search, Edit, Trash2, UserCog, Shield } from "lucide-react";

const Personnel = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées
  const personnel = [
    {
      idpers: "PER001",
      nompers: "Administrateur",
      prenonpers: "Admin",
      adrpers: "Siège Social",
      villepers: "Paris",
      telpers: "0123456789",
      d_embauche: "2020-01-15",
      Login: "admin",
      codeposte: "P001",
      libellePoste: "Administrateur",
    },
    {
      idpers: "PER002",
      nompers: "Martin",
      prenonpers: "Pierre",
      adrpers: "12 Rue du Stock",
      villepers: "Paris",
      telpers: "0145678901",
      d_embauche: "2021-03-20",
      Login: "pmartin",
      codeposte: "P002",
      libellePoste: "Magasinier",
    },
    {
      idpers: "PER003",
      nompers: "Dubois",
      prenonpers: "Jean",
      adrpers: "8 Avenue des Livraisons",
      villepers: "Paris",
      telpers: "0156789012",
      d_embauche: "2021-06-10",
      Login: "jdubois",
      codeposte: "P003",
      libellePoste: "Livreur",
    },
    {
      idpers: "PER004",
      nompers: "Petit",
      prenonpers: "Marie",
      adrpers: "25 Boulevard des Livraisons",
      villepers: "Paris",
      telpers: "0167890123",
      d_embauche: "2022-02-15",
      Login: "mpetit",
      codeposte: "P004",
      libellePoste: "Chef Livreur",
    },
  ];

  const filteredPersonnel = personnel.filter(
    (pers) =>
      pers.idpers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.nompers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.prenonpers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.Login.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.libellePoste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (poste: string) => {
    switch (poste) {
      case "Administrateur":
        return <Badge className="bg-destructive text-destructive-foreground">Admin</Badge>;
      case "Chef Livreur":
        return <Badge className="bg-warning text-warning-foreground">Chef</Badge>;
      case "Magasinier":
        return <Badge className="bg-info text-info-foreground">Magasin</Badge>;
      case "Livreur":
        return <Badge className="bg-success text-success-foreground">Livreur</Badge>;
      default:
        return <Badge variant="outline">{poste}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <UserCog className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Gestion du Personnel</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Employé
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Livreurs Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Sur le terrain</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Magasiniers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Gestion stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Accès complet</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Employés</CardTitle>
              <div className="flex items-center gap-2 w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, login ou poste..."
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date Embauche</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.map((pers) => (
                  <TableRow key={pers.idpers}>
                    <TableCell className="font-medium">{pers.idpers}</TableCell>
                    <TableCell>{pers.nompers}</TableCell>
                    <TableCell>{pers.prenonpers}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-sm">{pers.Login}</span>
                      </div>
                    </TableCell>
                    <TableCell>{pers.villepers}</TableCell>
                    <TableCell>{pers.telpers}</TableCell>
                    <TableCell>
                      {new Date(pers.d_embauche).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>{getRoleBadge(pers.libellePoste)}</TableCell>
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

        {/* Règles de gestion */}
        <Card className="mt-6 border-warning">
          <CardHeader>
            <CardTitle className="text-warning">Règles de Gestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Login et mot de passe obligatoires pour l'authentification</p>
            <p>• Vérification du format du numéro de téléphone obligatoire</p>
            <p>• Chaque employé doit être associé à un poste (codeposte)</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Personnel;
