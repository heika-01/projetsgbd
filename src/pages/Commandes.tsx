import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCommandes } from "@/hooks/useCommandes";
import { useClients } from "@/hooks/useClients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Search, Edit, Trash2, ShoppingCart } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ThemeToggle } from "@/components/ThemeToggle";

const commandeSchema = z.object({
  noclt: z.string().min(1, "Sélectionnez un client"),
  datecde: z.string().min(1, "Date requise"),
});

const etats = [
  { value: "EC", label: "En Cours", color: "bg-info/20 text-info border-info/40" },
  { value: "Pr", label: "Prête", color: "bg-warning/20 text-warning border-warning/40" },
  { value: "lI", label: "Livrée", color: "bg-success/20 text-success border-success/40" },
  { value: "SO", label: "Sortie", color: "bg-primary/20 text-primary border-primary/40" },
  { value: "AN", label: "Annulée", color: "bg-destructive/20 text-destructive border-destructive/40" },
  { value: "AL", label: "Annulée Livrée", color: "bg-muted text-muted-foreground border-border" },
];

const Commandes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCommande, setEditingCommande] = useState<any>(null);

  const { commandes, isLoading, addCommande, updateCommande, deleteCommande } = useCommandes();
  const { clients, isLoading: clientsLoading } = useClients();

  const form = useForm<z.infer<typeof commandeSchema>>({
    resolver: zodResolver(commandeSchema),
    defaultValues: { noclt: "", datecde: new Date().toISOString().split('T')[0] },
  });

  const getEtat = (etat: string) => etats.find(e => e.value === etat) || etats[0];

  const onSubmit = (data: z.infer<typeof commandeSchema>) => {
    addCommande({ noclt: Number(data.noclt), datecde: data.datecde, etatcde: "EC" });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEdit = (commande: any) => {
    setEditingCommande(commande);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (newEtat: string) => {
    if (editingCommande) {
      updateCommande({ nocde: editingCommande.nocde, etatcde: newEtat });
      setIsEditDialogOpen(false);
      setEditingCommande(null);
    }
  };

  const handleDelete = (nocde: string) => deleteCommande(Number(nocde));

  const filteredCommandes = commandes.filter(cmd =>
    cmd.nocde.toString().includes(searchTerm) ||
    (cmd.clients?.nomclt || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cmd.datecde || "").includes(searchTerm)
  );

  if (isLoading || clientsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Commandes</h1>
              <p className="text-xs text-muted-foreground">{commandes.length} commandes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-xl bg-gradient-to-r from-primary to-accent glow-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par numéro, client ou date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-2xl glass border-border/50 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommandes.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Aucune commande trouvée</p>
            </div>
          ) : (
            filteredCommandes.map((commande) => {
              const etat = getEtat(commande.etatcde || "");
              return (
                <div key={commande.nocde} className="glass rounded-2xl p-5 hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className={`${etat.color} border rounded-full px-3 text-xs`}>
                      {etat.label}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => handleEdit(commande)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-destructive/10" onClick={() => handleDelete(commande.nocde.toString())}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="font-mono text-lg font-bold text-primary mb-2">#{commande.nocde}</p>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground font-medium">
                      {commande.clients ? `${commande.clients.nomclt} ${commande.clients.prenomclt || ""}` : "N/A"}
                    </p>
                    <p className="text-muted-foreground">
                      {commande.datecde ? new Date(commande.datecde).toLocaleDateString('fr-FR') : "N/A"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-strong rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nouvelle Commande</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="noclt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Client</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.noclt} value={String(client.noclt)}>
                            {client.nomclt} {client.prenomclt || ""} ({client.noclt})
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
                name="datecde"
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
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="flex-1 h-12 rounded-xl">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent glow-primary">
                  Créer
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-strong rounded-3xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Modifier l'état</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label className="text-muted-foreground text-sm">État actuel</Label>
              <Badge className={`${getEtat(editingCommande?.etatcde).color} border rounded-full px-3 mt-2`}>
                {getEtat(editingCommande?.etatcde).label}
              </Badge>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Nouvel état</Label>
              <Select onValueChange={handleSaveEdit}>
                <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-border/50 mt-2">
                  <SelectValue placeholder="Sélectionner un état" />
                </SelectTrigger>
                <SelectContent>
                  {etats.map((etat) => (
                    <SelectItem key={etat.value} value={etat.value}>{etat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Commandes;