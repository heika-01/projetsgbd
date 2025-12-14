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
import { ArrowLeft, Plus, Search, Edit, Trash2, Truck, Package, Clock, CheckCircle } from "lucide-react";
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
  const modesPaiement = ["avant_livraison", "apres_livraison"];

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
      case "EC":
        return "bg-info/20 text-info border-info/30";
      case "LI":
        return "bg-success/20 text-success border-success/30";
      case "AL":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEtatLabel = (etat: string | null) => {
    switch (etat) {
      case "EC": return "En cours";
      case "LI": return "Livrée";
      case "AL": return "Annulée";
      default: return etat || "N/A";
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
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header minimaliste */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="rounded-full hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">Livraisons</h1>
              <p className="text-sm text-muted-foreground">{livraisons.length} livraisons au total</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="rounded-full px-5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats compactes */}
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-info/10 border border-info/20">
            <Clock className="h-5 w-5 text-info" />
            <div>
              <span className="text-2xl font-bold text-foreground">{enCoursCount}</span>
              <span className="text-sm text-muted-foreground ml-2">en cours</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-success/10 border border-success/20">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <span className="text-2xl font-bold text-foreground">{livreesCount}</span>
              <span className="text-sm text-muted-foreground ml-2">livrées</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-secondary border border-border">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-2xl font-bold text-foreground">{commandesPretes.length}</span>
              <span className="text-sm text-muted-foreground ml-2">prêtes</span>
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par commande, client ou livreur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-xl bg-card border-border/50 focus:border-primary"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-medium">Commande</TableHead>
                <TableHead className="font-medium">Client</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Livreur</TableHead>
                <TableHead className="font-medium">Paiement</TableHead>
                <TableHead className="font-medium">État</TableHead>
                <TableHead className="text-right font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLivraisons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Aucune livraison trouvée</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLivraisons.map((livraison) => (
                  <TableRow key={livraison.id} className="group hover:bg-muted/20">
                    <TableCell className="font-mono font-medium text-primary">
                      #{livraison.nocde}
                    </TableCell>
                    <TableCell>
                      {livraison.commandes?.clients 
                        ? `${livraison.commandes.clients.nomclt} ${livraison.commandes.clients.prenomclt || ""}` 
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {livraison.dateliv ? new Date(livraison.dateliv).toLocaleDateString("fr-FR") : "—"}
                    </TableCell>
                    <TableCell>
                      {livraison.personnel ? `${livraison.personnel.nompers}` : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {livraison.modepay === "avant_livraison" ? "Avant" : livraison.modepay === "apres_livraison" ? "Après" : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getEtatStyle(livraison.etatliv)} border rounded-full px-3`}>
                        {getEtatLabel(livraison.etatliv)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-destructive/10"
                          onClick={() => handleDelete(livraison.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Règles */}
        <div className="mt-6 p-4 rounded-xl bg-warning/5 border border-warning/20">
          <p className="text-sm text-warning font-medium mb-2">Règles de gestion</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Max 15 livraisons/livreur/jour/ville</li>
            <li>• Modifications: avant 9h (matin) / 14h (après-midi)</li>
          </ul>
        </div>
      </main>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Nouvelle Livraison</DialogTitle>
            <DialogDescription>
              Planifier une livraison pour une commande prête
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nocde"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commande</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
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
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl" />
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
                    <FormLabel>Livreur</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
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
                    <FormLabel>Paiement</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
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
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="rounded-full px-6">
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
