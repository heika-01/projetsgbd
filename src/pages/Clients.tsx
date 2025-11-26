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
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const clientSchema = z.object({
  noclt: z.string().min(1, "Numéro client obligatoire"),
  nomclt: z.string().min(2, "Nom minimum 2 caractères"),
  prenomclt: z.string().optional(),
  adrclt: z.string().min(5, "Adresse minimum 5 caractères"),
  code_postal: z.string().regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  telclt: z.string().regex(/^0[1-9]\d{8}$/, "Format: 0123456789"),
  adrmail: z.string().email("Email invalide"),
});

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      noclt: "",
      nomclt: "",
      prenomclt: "",
      adrclt: "",
      code_postal: "",
      telclt: "",
      adrmail: "",
    },
  });

  // Données simulées
  const [clients, setClients] = useState([
    {
      noclt: "CLT001",
      nomclt: "Dupont",
      prenomclt: "Jean",
      adrclt: "15 Rue de la Paix",
      code_postal: "75001",
      telclt: "0145678901",
      adrmail: "jean.dupont@email.com",
    },
    {
      noclt: "CLT002",
      nomclt: "Martin",
      prenomclt: "Sophie",
      adrclt: "28 Avenue des Champs",
      code_postal: "75008",
      telclt: "0156789012",
      adrmail: "sophie.martin@email.com",
    },
    {
      noclt: "CLT003",
      nomclt: "Bernard",
      prenomclt: "Marie",
      adrclt: "42 Boulevard Haussmann",
      code_postal: "75009",
      telclt: "0167890123",
      adrmail: "marie.bernard@email.com",
    },
    {
      noclt: "CLT004",
      nomclt: "SARL TechCorp",
      prenomclt: "",
      adrclt: "10 Rue du Commerce",
      code_postal: "75015",
      telclt: "0178901234",
      adrmail: "contact@techcorp.fr",
    },
  ]);

  const filteredClients = clients.filter(
    (client) =>
      client.noclt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nomclt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenomclt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.adrmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code_postal.includes(searchTerm)
  );

  const onSubmit = (data: z.infer<typeof clientSchema>) => {
    if (clients.some(c => c.noclt === data.noclt)) {
      toast({
        title: "Erreur",
        description: "Ce numéro client existe déjà",
        variant: "destructive",
      });
      return;
    }

    setClients([...clients, data as any]);
    toast({
      title: "Client ajouté",
      description: `${data.nomclt} ${data.prenomclt || ''} a été ajouté`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (noclt: string) => {
    setClients(clients.filter(c => c.noclt !== noclt));
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Gestion des Clients</h1>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Client
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">+23 ce mois</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">734</div>
              <p className="text-xs text-muted-foreground">Commandes récentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux (30j)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+18% vs mois dernier</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Base de Données Clients</CardTitle>
              <div className="flex items-center gap-2 w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email ou code postal..."
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
                  <TableHead>N° Client</TableHead>
                  <TableHead>Nom / Raison Sociale</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>CP</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.noclt}>
                    <TableCell className="font-medium">{client.noclt}</TableCell>
                    <TableCell className="font-semibold">{client.nomclt}</TableCell>
                    <TableCell>{client.prenomclt || "-"}</TableCell>
                    <TableCell>{client.adrclt}</TableCell>
                    <TableCell>{client.code_postal}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{client.telclt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{client.adrmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(client.noclt)}>
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
            <p>• Le nom peut être une personne physique ou morale (entreprise)</p>
            <p>• Vérification du format du numéro de téléphone obligatoire</p>
            <p>• Un même client ne peut être ajouté plusieurs fois (unicité)</p>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau Client</DialogTitle>
            <DialogDescription>
              Ajouter un nouveau client (personne physique ou morale)
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="noclt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro Client</FormLabel>
                    <FormControl>
                      <Input placeholder="CLT001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomclt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom / Raison Sociale</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont ou SARL TechCorp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prenomclt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="adrclt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="15 Rue de la Paix" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code_postal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code Postal</FormLabel>
                      <FormControl>
                        <Input placeholder="75001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telclt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="0145678901" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="adrmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="client@email.com" {...field} />
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

export default Clients;
