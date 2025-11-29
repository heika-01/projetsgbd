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
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, Plus, Search, Edit, Trash2, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const livraisonSchema = z.object({
  nocde: z.string().min(1, "Sélectionnez une commande"),
  dateliv: z.string().min(1, "Date requise"),
  livreur: z.string().min(1, "Sélectionnez un livreur"),
  modepay: z.string().min(1, "Mode de paiement requis"),
});

const Livraisons = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  // Commandes "Prêtes" (état PR)
  const commandesPretes = commandes.filter(c => c.etatcde === "PR");

  // Livreurs (personnel avec codeposte LIV)
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

  const getEtatColor = (etat: string | null) => {
    switch (etat) {
      case "EC":
        return "bg-blue-500";
      case "LI":
        return "bg-green-500";
      case "AL":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEtatLabel = (etat: string | null) => {
    switch (etat) {
      case "EC":
        return "En cours";
      case "LI":
        return "Livrée";
      case "AL":
        return "Annulée Livrée";
      default:
        return etat || "N/A";
    }
  };

  const filteredLivraisons = livraisons.filter(
    (liv) =>
      liv.nocde?.toString().includes(searchTerm) ||
      (liv.commandes?.clients?.nomclt || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (liv.personnel?.nompers || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || commandesLoading || personnelLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

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
          <Button onClick={() => setIsDialogOpen(true)}>
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
                  <TableRow key={livraison.id}>
                    <TableCell className="font-medium">{livraison.nocde}</TableCell>
                    <TableCell>
                      {livraison.commandes?.clients 
                        ? `${livraison.commandes.clients.nomclt} ${livraison.commandes.clients.prenomclt || ""}` 
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {livraison.dateliv ? new Date(livraison.dateliv).toLocaleDateString("fr-FR") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {livraison.personnel ? `${livraison.personnel.nompers} ${livraison.personnel.prenompers}` : "N/A"}
                    </TableCell>
                    <TableCell>{livraison.commandes?.clients?.adrclt || "N/A"}</TableCell>
                    <TableCell>{livraison.modepay || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className={`${getEtatColor(livraison.etatliv)} text-white`}>
                        {getEtatLabel(livraison.etatliv)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(livraison.id)}
                        >
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

        {/* Dialog d'ajout */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle Livraison</DialogTitle>
              <DialogDescription>
                Planifier une nouvelle livraison (seules les commandes "Prêtes" sont disponibles)
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nocde"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commande *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une commande prête" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {commandesPretes.map((cmd) => (
                            <SelectItem key={cmd.nocde} value={String(cmd.nocde)}>
                              {cmd.nocde} - {cmd.clients ? `${cmd.clients.nomclt} ${cmd.clients.prenomclt || ""}` : "N/A"}
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
                      <FormLabel>Date de Livraison *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                      <FormLabel>Livreur *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un livreur" />
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
                      <FormLabel>Mode de Paiement *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modesPaiement.map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {mode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Planifier la Livraison</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

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
