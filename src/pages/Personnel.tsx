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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Search, Edit, Trash2, UserCog, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const personnelSchema = z.object({
  idpers: z.string().min(1, "ID obligatoire"),
  nompers: z.string().min(2, "Nom minimum 2 caractères"),
  prenonpers: z.string().min(2, "Prénom minimum 2 caractères"),
  adrpers: z.string().min(5, "Adresse minimum 5 caractères"),
  villepers: z.string().min(2, "Ville obligatoire"),
  telpers: z.string().regex(/^0[1-9]\d{8}$/, "Format: 0123456789"),
  d_embauche: z.string().min(1, "Date obligatoire"),
  Login: z.string().min(3, "Login minimum 3 caractères"),
  codeposte: z.string().min(1, "Poste obligatoire"),
});

const Personnel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const postes = [
    { code: "P001", libelle: "Administrateur" },
    { code: "P002", libelle: "Magasinier" },
    { code: "P003", libelle: "Livreur" },
    { code: "P004", libelle: "Chef Livreur" },
  ];

  const form = useForm<z.infer<typeof personnelSchema>>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      idpers: "",
      nompers: "",
      prenonpers: "",
      adrpers: "",
      villepers: "",
      telpers: "",
      d_embauche: new Date().toISOString().split('T')[0],
      Login: "",
      codeposte: "",
    },
  });

  // Données simulées
  const [personnel, setPersonnel] = useState([
    {
      idpers: "PER001",
      nompers: "Administrateur",
      prenonpers: "Admin",
      adrpers: "Siège Social",
      villepers: "Paris",
      telpers: "0123456789",
      d_embauche: "2020-01-15",
      Login: "admin",
      codeposte: "P001",
      libellePoste: "Administrateur",
    },
    {
      idpers: "PER002",
      nompers: "Martin",
      prenonpers: "Pierre",
      adrpers: "12 Rue du Stock",
      villepers: "Paris",
      telpers: "0145678901",
      d_embauche: "2021-03-20",
      Login: "pmartin",
      codeposte: "P002",
      libellePoste: "Magasinier",
    },
    {
      idpers: "PER003",
      nompers: "Dubois",
      prenonpers: "Jean",
      adrpers: "8 Avenue des Livraisons",
      villepers: "Paris",
      telpers: "0156789012",
      d_embauche: "2021-06-10",
      Login: "jdubois",
      codeposte: "P003",
      libellePoste: "Livreur",
    },
    {
      idpers: "PER004",
      nompers: "Petit",
      prenonpers: "Marie",
      adrpers: "25 Boulevard des Livraisons",
      villepers: "Paris",
      telpers: "0167890123",
      d_embauche: "2022-02-15",
      Login: "mpetit",
      codeposte: "P004",
      libellePoste: "Chef Livreur",
    },
  ]);

  const filteredPersonnel = personnel.filter(
    (pers) =>
      pers.idpers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.nompers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.prenonpers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.Login.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.libellePoste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (poste: string) => {
    switch (poste) {
      case "Administrateur":
        return <Badge className="bg-destructive text-destructive-foreground">Admin</Badge>;
      case "Chef Livreur":
        return <Badge className="bg-warning text-warning-foreground">Chef</Badge>;
      case "Magasinier":
        return <Badge className="bg-info text-info-foreground">Magasin</Badge>;
      case "Livreur":
        return <Badge className="bg-success text-success-foreground">Livreur</Badge>;
      default:
        return <Badge variant="outline">{poste}</Badge>;
    }
  };

  const onSubmit = (data: z.infer<typeof personnelSchema>) => {
    if (personnel.some(p => p.idpers === data.idpers)) {
      toast({
        title: "Erreur",
        description: "Cet ID existe déjà",
        variant: "destructive",
      });
      return;
    }

    const posteInfo = postes.find(p => p.code === data.codeposte);
    setPersonnel([...personnel, { ...data, libellePoste: posteInfo?.libelle || "" } as any]);
    toast({
      title: "Employé ajouté",
      description: `${data.prenonpers} ${data.nompers} a été ajouté`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (idpers: string) => {
    setPersonnel(personnel.filter(p => p.idpers !== idpers));
    toast({
      title: "Employé supprimé",
      description: "L'employé a été supprimé",
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
            <UserCog className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Gestion du Personnel</h1>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Employé
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Employés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">Tous postes confondus</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Livreurs Actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Sur le terrain</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Magasiniers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Gestion stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Accès complet</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Liste des Employés</CardTitle>
              <div className="flex items-center gap-2 w-80">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, login ou poste..."
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date Embauche</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.map((pers) => (
                  <TableRow key={pers.idpers}>
                    <TableCell className="font-medium">{pers.idpers}</TableCell>
                    <TableCell>{pers.nompers}</TableCell>
                    <TableCell>{pers.prenonpers}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-sm">{pers.Login}</span>
                      </div>
                    </TableCell>
                    <TableCell>{pers.villepers}</TableCell>
                    <TableCell>{pers.telpers}</TableCell>
                    <TableCell>
                      {new Date(pers.d_embauche).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>{getRoleBadge(pers.libellePoste)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(pers.idpers)}>
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
        <Card className="mt-6 border-warning">
          <CardHeader>
            <CardTitle className="text-warning">Règles de Gestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Login et mot de passe obligatoires pour l'authentification</p>
            <p>• Vérification du format du numéro de téléphone obligatoire</p>
            <p>• Chaque employé doit être associé à un poste (codeposte)</p>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvel Employé</DialogTitle>
            <DialogDescription>
              Ajouter un nouvel employé au personnel
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idpers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Personnel</FormLabel>
                      <FormControl>
                        <Input placeholder="PER001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Login</FormLabel>
                      <FormControl>
                        <Input placeholder="jdupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nompers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prenonpers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
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
                name="adrpers"
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
                  name="villepers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telpers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="0123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="d_embauche"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Embauche</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="codeposte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poste</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un poste" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {postes.map((poste) => (
                            <SelectItem key={poste.code} value={poste.code}>
                              {poste.libelle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

export default Personnel;
