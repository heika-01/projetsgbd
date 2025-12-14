import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
import { ArrowLeft, Plus, Search, Trash2, Package } from "lucide-react";
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
    defaultValues: { refart: "", designation: "", prixa: 0, prixv: 0, codetva: 20, categorie: "", qtestk: 0 },
  });

  const filteredArticles = articles.filter(
    (art) =>
      art.refart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.categorie && art.categorie.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStockBadge = (qte: number) => {
    if (qte === 0) return <Badge className="bg-destructive/20 text-destructive border-destructive/40 border rounded-full">Rupture</Badge>;
    if (qte < 10) return <Badge className="bg-warning/20 text-warning border-warning/40 border rounded-full">Stock Bas</Badge>;
    return <Badge className="bg-success/20 text-success border-success/40 border rounded-full">En Stock</Badge>;
  };

  const onSubmit = (data: z.infer<typeof articleSchema>) => {
    if (articles.some(a => a.refart === data.refart)) return;
    addArticle({ refart: data.refart, designation: data.designation, prixa: data.prixa, prixv: data.prixv, codetva: data.codetva, categorie: data.categorie, qtestk: data.qtestk });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (refart: string) => deleteArticle(refart);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Articles</h1>
              <p className="text-xs text-muted-foreground">{articles.length} produits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl bg-gradient-to-r from-primary to-accent glow-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par référence, désignation ou catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-2xl glass border-border/50 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Aucun article trouvé</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div key={article.refart} className="glass rounded-2xl p-5 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-3">
                  {getStockBadge(article.qtestk || 0)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                    onClick={() => handleDelete(article.refart)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <p className="font-mono text-sm text-primary mb-1">{article.refart}</p>
                <p className="font-semibold text-foreground mb-2 line-clamp-2">{article.designation}</p>
                
                <div className="flex items-baseline justify-between mb-2">
                  <p className="text-2xl font-bold text-foreground">{article.prixv?.toFixed(2)}€</p>
                  <p className="text-sm text-muted-foreground">Achat: {article.prixa?.toFixed(2)}€</p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-border/50">{article.categorie}</Badge>
                  <span>{article.qtestk} en stock</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-strong rounded-3xl border-border/50 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nouvel Article</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="refart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Référence</FormLabel>
                      <FormControl>
                        <Input placeholder="ART001" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                      <FormLabel className="text-muted-foreground">Catégorie</FormLabel>
                      <FormControl>
                        <Input placeholder="Informatique" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                    <FormLabel className="text-muted-foreground">Désignation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ordinateur Portable HP" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                      <FormLabel className="text-muted-foreground">Prix Achat €</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                      <FormLabel className="text-muted-foreground">Prix Vente €</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                      <FormLabel className="text-muted-foreground">TVA %</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                    <FormLabel className="text-muted-foreground">Quantité en Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-12 rounded-xl">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent glow-primary">
                  Ajouter
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Articles;