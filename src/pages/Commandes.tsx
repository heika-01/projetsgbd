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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const commandeSchema = z.object({
  noclt: z.string().min(1, "Sélectionnez un client"),
  datecde: z.string().min(1, "Date requise"),
});

// États possibles: EC (En Cours), Pr (Prête), lI (Livrée), SO (Sortie), AN (Annulée), AL (Annulée Livrée)
const etats = [
  { value: "EC", label: "En Cours", color: "bg-blue-500" },
  { value: "Pr", label: "Prête", color: "bg-yellow-500" },
  { value: "lI", label: "Livrée", color: "bg-green-500" },
  { value: "SO", label: "Sortie", color: "bg-purple-500" },
  { value: "AN", label: "Annulée", color: "bg-red-500" },
  { value: "AL", label: "Annulée Livrée", color: "bg-orange-500" },
];

const Commandes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCommande, setEditingCommande] = useState<any>(null);

  const form = useForm<z.infer<typeof commandeSchema>>({
    resolver: zodResolver(commandeSchema),
    defaultValues: {
      noclt: "",
      datecde: new Date().toISOString().split('T')[0],
    },
  });

  // Liste des clients (simulée)
  const clients = [
    { noclt: "CLT001", nom: "Dupont Jean" },
    { noclt: "CLT002", nom: "Martin Sophie" },
    { noclt: "CLT003", nom: "Bernard Marie" },
  ];

  // Données simulées
  const [commandes, setCommandes] = useState([
    { nocde: "CMD001", noclt: "CLT001", nomClient: "Dupont Jean", datecde: "2025-11-20", etatcde: "EC" },
    { nocde: "CMD002", noclt: "CLT002", nomClient: "Martin Sophie", datecde: "2025-11-21", etatcde: "Pr" },
    { nocde: "CMD003", noclt: "CLT003", nomClient: "Bernard Marie", datecde: "2025-11-22", etatcde: "lI" },
    { nocde: "CMD004", noclt: "CLT001", nomClient: "Dupont Jean", datecde: "2025-11-23", etatcde: "EC" },
  ]);

  const getEtatColor = (etat: string) => {
    return etats.find(e => e.value === etat)?.color || "bg-gray-500";
  };

  const getEtatLabel = (etat: string) => {
    return etats.find(e => e.value === etat)?.label || etat;
  };

  const onSubmit = (data: z.infer<typeof commandeSchema>) => {
    const client = clients.find(c => c.noclt === data.noclt);
    const newCommande = {
      nocde: `CMD${String(commandes.length + 1).padStart(3, '0')}`,
      noclt: data.noclt,
      nomClient: client?.nom || "",
      datecde: data.datecde,
      etatcde: "EC",
    };

    setCommandes([...commandes, newCommande] as any);
    toast({
      title: "Commande créée",
      description: `Commande ${newCommande.nocde} ajoutée avec succès`,
    });
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEdit = (commande: any) => {
    setEditingCommande(commande);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (newEtat: string) => {
    // Vérifier les transitions valides
    const validTransitions: any = {
      "EC": ["Pr", "AN"],
      "Pr": ["lI", "SO", "AN", "AL"],
      "lI": [],
      "SO": [],
      "AN": [],
      "AL": []
    };

    if (editingCommande && validTransitions[editingCommande.etatcde].includes(newEtat)) {
      setCommandes(commandes.map(cmd => 
        cmd.nocde === editingCommande.nocde 
          ? { ...cmd, etatcde: newEtat }
          : cmd
      ));
      toast({
        title: "Commande modifiée",
        description: `État changé de ${getEtatLabel(editingCommande.etatcde)} à ${getEtatLabel(newEtat)}`,
      });
      setIsEditDialogOpen(false);
      setEditingCommande(null);
    } else {
      toast({
        title: "Transition invalide",
        description: "Cette transition d'état n'est pas autorisée",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (nocde: string) => {
    setCommandes(commandes.filter(cmd => cmd.nocde !== nocde));
    toast({
      title: "Commande annulée",
      description: "La commande a été annulée avec succès",
    });
  };

  const filteredCommandes = commandes.filter(cmd =>
    cmd.nocde.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.datecde.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Commandes</h1>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Commande
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Commandes</CardTitle>
              <div className="flex items-center gap-2 w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro, client ou date..."
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
                  <TableHead>Date</TableHead>
                  <TableHead>État</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommandes.map((commande) => (
                  <TableRow key={commande.nocde}>
                    <TableCell className="font-medium">{commande.nocde}</TableCell>
                    <TableCell>{commande.nomClient}</TableCell>
                    <TableCell>{new Date(commande.datecde).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Badge className={`${getEtatColor(commande.etatcde)} text-white`}>
                        {getEtatLabel(commande.etatcde)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(commande)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(commande.nocde)}
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
      </main>

      {/* Dialog d'ajout */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle Commande</DialogTitle>
            <DialogDescription>
              Créer une nouvelle commande client
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="noclt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.noclt} value={client.noclt}>
                            {client.nom} ({client.noclt})
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
                    <FormLabel>Date de Commande *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Créer la Commande</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'état de la commande</DialogTitle>
            <DialogDescription>
              Commande: {editingCommande?.nocde} - {editingCommande?.nomClient}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>État actuel</Label>
              <Badge className={`${getEtatColor(editingCommande?.etatcde)} text-white`}>
                {getEtatLabel(editingCommande?.etatcde)}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Nouvel état</Label>
              <Select onValueChange={handleSaveEdit}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un état" />
                </SelectTrigger>
                <SelectContent>
                  {etats.map((etat) => (
                    <SelectItem key={etat.value} value={etat.value}>
                      {etat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Transitions valides: EC→Pr→lI→SO ou EC→AN ou Pr→AN ou Pr→AL
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Commandes;
