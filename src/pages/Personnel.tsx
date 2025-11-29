import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePersonnel } from "@/hooks/usePersonnel";
import { usePostes } from "@/hooks/usePostes";
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
  nompers: z.string().min(2, "Nom minimum 2 caractères"),
  prenompers: z.string().min(2, "Prénom minimum 2 caractères"),
  adrpers: z.string().min(5, "Adresse minimum 5 caractères"),
  villepers: z.string().min(2, "Ville obligatoire"),
  telpers: z.coerce.number().min(10000000, "Téléphone invalide"),
  d_embauche: z.string().min(1, "Date obligatoire"),
  login: z.string().min(3, "Login minimum 3 caractères"),
  motp: z.string().min(8, "Mot de passe minimum 8 caractères"),
  codeposte: z.string().min(1, "Poste obligatoire"),
});

const Personnel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { personnel, isLoading, addPersonnel, deletePersonnel } = usePersonnel();
  const { postes, isLoading: postesLoading } = usePostes();

  const form = useForm<z.infer<typeof personnelSchema>>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      nompers: "",
      prenompers: "",
      adrpers: "",
      villepers: "",
      telpers: 0,
      d_embauche: new Date().toISOString().split('T')[0],
      login: "",
      motp: "",
      codeposte: "",
    },
  });

  const filteredPersonnel = personnel.filter(
    (pers) =>
      pers.idpers.toString().includes(searchTerm) ||
      pers.nompers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.prenompers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pers.login || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pers.postes?.libelle || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (libelle: string | undefined) => {
    if (!libelle) return <Badge variant="outline">N/A</Badge>;
    switch (libelle) {
      case "Administrateur":
        return <Badge className="bg-destructive text-destructive-foreground">Admin</Badge>;
      case "Chef Livreur":
        return <Badge className="bg-warning text-warning-foreground">Chef</Badge>;
      case "Magasinier":
        return <Badge className="bg-info text-info-foreground">Magasin</Badge>;
      case "Livreur":
        return <Badge className="bg-success text-success-foreground">Livreur</Badge>;
      default:
        return <Badge variant="outline">{libelle}</Badge>;
    }
  };

  const onSubmit = (data: z.infer<typeof personnelSchema>) => {
    addPersonnel({
      nompers: data.nompers,
      prenompers: data.prenompers,
      adrpers: data.adrpers,
      villepers: data.villepers,
      telpers: data.telpers,
      d_embauche: data.d_embauche,
      login: data.login,
      motp: data.motp,
      codeposte: data.codeposte,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (idpers: number) => {
    deletePersonnel(idpers);
  };

  if (isLoading || postesLoading) {
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
                    <TableCell>{pers.prenompers}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono text-sm">{pers.login}</span>
                      </div>
                    </TableCell>
                    <TableCell>{pers.villepers}</TableCell>
                    <TableCell>{pers.telpers}</TableCell>
                    <TableCell>
                      {pers.d_embauche ? new Date(pers.d_embauche).toLocaleDateString("fr-FR") : "N/A"}
                    </TableCell>
                    <TableCell>{getRoleBadge(pers.postes?.libelle)}</TableCell>
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
                  name="login"
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
                <FormField
                  control={form.control}
                  name="motp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="pass1234" {...field} />
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
                  name="prenompers"
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
                        <Input type="number" placeholder="20373057" {...field} />
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
                            <SelectItem key={poste.codeposte} value={poste.codeposte}>
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
