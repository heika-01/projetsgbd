import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { ThemeToggle } from "@/components/ThemeToggle";

const articleSchema = z.object({
  refart: z.string().min(1, "Référence obligatoire"),
  designation: z.string().min(3, "Désignation minimum 3 caractères"),
  prixa: z.coerce.number().positive("Prix achat doit être positif"),
  prixv: z.coerce.number().positive("Prix vente doit être positif"),
  codetva: z.coerce.number().min(0).max(100, "TVA entre 0 et 100"),
  categorie: z.string().min(1, "Catégorie obligatoire"),
  qtestk: z.coerce.number().min(0, "Quantité ne peut être négative"),
}).refine((data) => data.prixv > data.prixa, {
  message: "Le prix de vente doit être supérieur au prix d'achat",
  path: ["prixv"],
});

const Articles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { articles, isLoading, addArticle, deleteArticle } = useArticles();

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      refart: "",
      designation: "",
      prixa: 0,
      prixv: 0,
      codetva: 20,
      categorie: "",
      qtestk: 0,
    },
  });

  const filteredArticles = articles.filter(
    (art) =>
      art.refart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.categorie && art.categorie.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStockBadge = (qte: number) => {
    if (qte === 0) return <Badge variant="destructive">Rupture</Badge>;
    if (qte < 10) return <Badge className="bg-warning text-warning-foreground">Stock Bas</Badge>;
    return <Badge className="bg-success text-success-foreground">En Stock</Badge>;
  };

  const onSubmit = (data: z.infer<typeof articleSchema>) => {
    if (articles.some(a => a.refart === data.refart)) {
      return;
    }

    addArticle({
      refart: data.refart,
      designation: data.designation,
      prixa: data.prixa,
      prixv: data.prixv,
      codetva: data.codetva,
      categorie: data.categorie,
      qtestk: data.qtestk,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (refart: string) => {
    deleteArticle(refart);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Chargement...</div>;
  }

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
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Article
            </Button>
          </div>
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
                    <TableCell>{article.prixa?.toFixed(2) || 0} €</TableCell>
                    <TableCell className="font-semibold">{article.prixv?.toFixed(2) || 0} €</TableCell>
                    <TableCell>{article.codetva}%</TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.categorie}</Badge>
                    </TableCell>
                    <TableCell>{article.qtestk}</TableCell>
                    <TableCell>{getStockBadge(article.qtestk || 0)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(article.refart)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouvel Article</DialogTitle>
            <DialogDescription>
              Ajouter un nouvel article au catalogue
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="refart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Référence</FormLabel>
                      <FormControl>
                        <Input placeholder="ART001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categorie"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Input placeholder="Informatique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Désignation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ordinateur Portable HP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="prixa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix Achat (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prixv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix Vente (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="codetva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TVA (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="qtestk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité en Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Articles;
