import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLivraisons } from "@/hooks/useLivraisons";
import { useCommandes } from "@/hooks/useCommandes";
import { usePersonnel } from "@/hooks/usePersonnel";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Plus, Search, Trash2, Truck, Clock, CheckCircle, Package } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const livraisonSchema = z.object({
  nocde: z.string().min(1, "Sélectionnez une commande"),
  dateliv: z.string().min(1, "Date requise"),
  livreur: z.string().min(1, "Sélectionnez un livreur"),
  modepay: z.string().min(1, "Mode de paiement requis"),
});

const Livraisons = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { livraisons, isLoading, addLivraison, deleteLivraison } = useLivraisons();
  const { commandes, isLoading: commandesLoading } = useCommandes();
  const { personnel, isLoading: personnelLoading } = usePersonnel();

  const form = useForm<z.infer<typeof livraisonSchema>>({
    resolver: zodResolver(livraisonSchema),
    defaultValues: {
      nocde: "",
      dateliv: new Date().toISOString().split('T')[0],
      livreur: "",
      modepay: "",
    },
  });

  const commandesPretes = commandes.filter(c => c.etatcde === "PR");
  const livreurs = personnel.filter(p => p.codeposte === "LIV");

  const onSubmit = (data: z.infer<typeof livraisonSchema>) => {
    addLivraison({ 
      nocde: Number(data.nocde), 
      dateliv: data.dateliv, 
      livreur: Number(data.livreur), 
      modepay: data.modepay,
      etatliv: "EC"
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (id: string) => {
    deleteLivraison(id);
  };

  const getEtatStyle = (etat: string | null) => {
    switch (etat) {
      case "EC": return "bg-info/20 text-info border-info/40";
      case "LI": return "bg-success/20 text-success border-success/40";
      case "AL": return "bg-destructive/20 text-destructive border-destructive/40";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getEtatLabel = (etat: string | null) => {
    switch (etat) {
      case "EC": return "En cours";
      case "LI": return "Livrée";
      case "AL": return "Annulée";
      default: return etat || "—";
    }
  };

  const filteredLivraisons = livraisons.filter(
    (liv) =>
      liv.nocde?.toString().includes(searchTerm) ||
      (liv.commandes?.clients?.nomclt || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (liv.personnel?.nompers || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enCoursCount = livraisons.filter(l => l.etatliv === "EC").length;
  const livreesCount = livraisons.filter(l => l.etatliv === "LI").length;

  if (isLoading || commandesLoading || personnelLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Livraisons</h1>
              <p className="text-xs text-muted-foreground">{livraisons.length} au total</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl bg-gradient-to-r from-primary to-accent glow-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-info/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{enCoursCount}</p>
              <p className="text-xs text-muted-foreground">En cours</p>
            </div>
          </div>
          <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{livreesCount}</p>
              <p className="text-xs text-muted-foreground">Livrées</p>
            </div>
          </div>
          <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{commandesPretes.length}</p>
              <p className="text-xs text-muted-foreground">Prêtes</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-2xl glass border-border/50 focus:border-primary"
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLivraisons.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Aucune livraison trouvée</p>
            </div>
          ) : (
            filteredLivraisons.map((livraison) => (
              <div key={livraison.id} className="glass rounded-2xl p-5 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className={`${getEtatStyle(livraison.etatliv)} border rounded-full px-3 text-xs`}>
                    {getEtatLabel(livraison.etatliv)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                    onClick={() => handleDelete(livraison.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <p className="font-mono text-lg font-bold text-primary mb-2">#{livraison.nocde}</p>
                
                <div className="space-y-2 text-sm">
                  <p className="text-foreground font-medium">
                    {livraison.commandes?.clients 
                      ? `${livraison.commandes.clients.nomclt} ${livraison.commandes.clients.prenomclt || ""}` 
                      : "—"}
                  </p>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{livraison.dateliv ? new Date(livraison.dateliv).toLocaleDateString("fr-FR") : "—"}</span>
                    <span>{livraison.personnel?.nompers || "—"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {livraison.modepay === "avant_livraison" ? "Paiement avant" : livraison.modepay === "apres_livraison" ? "Paiement après" : "—"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-strong rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nouvelle Livraison</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="nocde"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Commande</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commandesPretes.map((cmd) => (
                          <SelectItem key={cmd.nocde} value={String(cmd.nocde)}>
                            #{cmd.nocde} - {cmd.clients?.nomclt || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateliv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-12 rounded-xl bg-secondary/50 border-border/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="livreur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Livreur</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {livreurs.map((liv) => (
                          <SelectItem key={liv.idpers} value={String(liv.idpers)}>
                            {liv.nompers} {liv.prenompers}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modepay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Paiement</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="avant_livraison">Avant livraison</SelectItem>
                        <SelectItem value="apres_livraison">Après livraison</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-12 rounded-xl">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent glow-primary">
                  Planifier
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Livraisons;