import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePostes } from "@/hooks/usePostes";
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
import { ArrowLeft, Plus, Search, Trash2, Briefcase } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const posteSchema = z.object({
  codeposte: z.string().min(1, "Code obligatoire"),
  libelle: z.string().min(3, "Libellé minimum 3 caractères"),
  indice: z.coerce.number().min(1, "Indice minimum 1").max(100, "Indice maximum 100"),
  description: z.string().optional(),
});

const Postes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { postes, isLoading, addPoste, deletePoste } = usePostes();

  const form = useForm<z.infer<typeof posteSchema>>({
    resolver: zodResolver(posteSchema),
    defaultValues: { codeposte: "", libelle: "", indice: 5, description: "" },
  });

  const filteredPostes = postes.filter(
    (poste) =>
      poste.codeposte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poste.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIndiceBadge = (indice: number) => {
    if (indice >= 7) return <Badge className="bg-destructive/20 text-destructive border-destructive/40 border rounded-full">Élevé</Badge>;
    if (indice >= 5) return <Badge className="bg-warning/20 text-warning border-warning/40 border rounded-full">Moyen</Badge>;
    return <Badge className="bg-info/20 text-info border-info/40 border rounded-full">Base</Badge>;
  };

  const onSubmit = (data: z.infer<typeof posteSchema>) => {
    addPoste({ codeposte: data.codeposte, libelle: data.libelle, indice: data.indice, description: data.description });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (codeposte: string) => deletePoste(codeposte);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Postes</h1>
              <p className="text-xs text-muted-foreground">{postes.length} postes</p>
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
            placeholder="Rechercher par code ou libellé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-2xl glass border-border/50 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPostes.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Aucun poste trouvé</p>
            </div>
          ) : (
            filteredPostes.map((poste) => (
              <div key={poste.codeposte} className="glass rounded-2xl p-5 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                    onClick={() => handleDelete(poste.codeposte)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <p className="font-mono text-sm text-primary mb-1">{poste.codeposte}</p>
                <p className="font-semibold text-foreground mb-2">{poste.libelle}</p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{poste.description || "Aucune description"}</p>
                
                <div className="flex items-center justify-between">
                  {getIndiceBadge(poste.indice)}
                  <span className="font-mono text-sm text-muted-foreground">Indice {poste.indice}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-strong rounded-3xl border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nouveau Poste</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="codeposte" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Code</FormLabel>
                    <FormControl><Input placeholder="P005" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="indice" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Indice</FormLabel>
                    <FormControl><Input type="number" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="libelle" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Libellé</FormLabel>
                  <FormControl><Input placeholder="Responsable Logistique" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Description</FormLabel>
                  <FormControl><Input placeholder="Gestion de la logistique" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-12 rounded-xl">Annuler</Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent glow-primary">Ajouter</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Postes;