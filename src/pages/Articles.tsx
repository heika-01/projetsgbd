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
import { ArrowLeft, Plus, Search, Edit, Trash2, Package } from "lucide-react";

const Articles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées
  const articles = [
    {
      refart: "ART001",
      designation: "Ordinateur Portable HP",
      prixA: 450,
      prixV: 699,
      codetva: 20,
      categorie: "Informatique",
      qtestk: 15,
      supp: false,
    },
    {
      refart: "ART002",
      designation: "Souris Sans Fil Logitech",
      prixA: 15,
      prixV: 29.99,
      codetva: 20,
      categorie: "Accessoires",
      qtestk: 50,
      supp: false,
    },
    {
      refart: "ART003",
      designation: "Écran LED 24 pouces",
      prixA: 120,
      prixV: 189,
      codetva: 20,
      categorie: "Informatique",
      qtestk: 8,
      supp: false,
    },
    {
      refart: "ART004",
      designation: "Clavier Mécanique RGB",
      prixA: 45,
      prixV: 79.99,
      codetva: 20,
      categorie: "Accessoires",
      qtestk: 25,
      supp: false,
    },
  ];

  const filteredArticles = articles.filter(
    (art) =>
      art.refart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockBadge = (qte: number) => {
    if (qte === 0) return <Badge variant="destructive">Rupture</Badge>;
    if (qte < 10) return <Badge className="bg-warning text-warning-foreground">Stock Bas</Badge>;
    return <Badge className="bg-success text-success-foreground">En Stock</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Gestion des Articles</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Article
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Articles Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">15 catégories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valeur Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245,890 €</div>
              <p className="text-xs text-muted-foreground">Stock total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ruptures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Articles en rupture</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Stock Bas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Nécessitent réapprovisionnement</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Catalogue Articles</CardTitle>
              <div className="flex items-center gap-2 w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par référence, désignation ou catégorie..."
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
                  <TableHead>Référence</TableHead>
                  <TableHead>Désignation</TableHead>
                  <TableHead>Prix Achat</TableHead>
                  <TableHead>Prix Vente</TableHead>
                  <TableHead>TVA</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>État Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.refart}>
                    <TableCell className="font-medium">{article.refart}</TableCell>
                    <TableCell>{article.designation}</TableCell>
                    <TableCell>{article.prixA.toFixed(2)} €</TableCell>
                    <TableCell className="font-semibold">{article.prixV.toFixed(2)} €</TableCell>
                    <TableCell>{article.codetva}%</TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.categorie}</Badge>
                    </TableCell>
                    <TableCell>{article.qtestk}</TableCell>
                    <TableCell>{getStockBadge(article.qtestk)}</TableCell>
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
        <Card className="mt-6 border-info">
          <CardHeader>
            <CardTitle className="text-info">Règles de Gestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Le prix de vente doit toujours être supérieur au prix d'achat</p>
            <p>• Un article ne peut être ajouté qu'une seule fois (unicité)</p>
            <p>• Suppression logique si l'article est dans des commandes, physique sinon</p>
            <p>• Modification possible: désignation, prix, TVA, catégorie uniquement</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Articles;
