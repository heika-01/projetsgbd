import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePersonnel } from "@/hooks/usePersonnel";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Search, Trash2, UserCog } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { personnel, isLoading, addPersonnel, deletePersonnel } = usePersonnel();
  const { postes, isLoading: postesLoading } = usePostes();

  const form = useForm<z.infer<typeof personnelSchema>>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      nompers: "", prenompers: "", adrpers: "", villepers: "", telpers: 0,
      d_embauche: new Date().toISOString().split('T')[0], login: "", motp: "", codeposte: "",
    },
  });

  const filteredPersonnel = personnel.filter(
    (pers) =>
      pers.idpers.toString().includes(searchTerm) ||
      pers.nompers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pers.prenompers.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pers.login || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (libelle: string | undefined) => {
    const styles: Record<string, string> = {
      "Administrateur": "bg-destructive/20 text-destructive border-destructive/40",
      "Chef Livreur": "bg-warning/20 text-warning border-warning/40",
      "Magasinier": "bg-info/20 text-info border-info/40",
      "Livreur": "bg-success/20 text-success border-success/40",
    };
    return <Badge variant="outline" className={`${styles[libelle || ""] || "bg-muted text-muted-foreground"} border rounded-full`}>{libelle || "N/A"}</Badge>;
  };

  const onSubmit = (data: z.infer<typeof personnelSchema>) => {
    addPersonnel({ nompers: data.nompers, prenompers: data.prenompers, adrpers: data.adrpers, villepers: data.villepers, telpers: data.telpers, d_embauche: data.d_embauche, login: data.login, motp: data.motp, codeposte: data.codeposte });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (idpers: number) => deletePersonnel(idpers);

  if (isLoading || postesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Personnel</h1>
              <p className="text-xs text-muted-foreground">{personnel.length} employés</p>
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
            placeholder="Rechercher par nom, login..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-2xl glass border-border/50 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersonnel.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <UserCog className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Aucun employé trouvé</p>
            </div>
          ) : (
            filteredPersonnel.map((pers) => (
              <div key={pers.idpers} className="glass rounded-2xl p-5 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-bold text-primary">
                    {pers.prenompers.charAt(0)}{pers.nompers.charAt(0)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                    onClick={() => handleDelete(pers.idpers)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <p className="font-semibold text-foreground">{pers.prenompers} {pers.nompers}</p>
                <p className="font-mono text-xs text-muted-foreground mb-3">@{pers.login}</p>
                
                <div className="flex items-center justify-between">
                  {getRoleBadge(pers.postes?.libelle)}
                  <span className="text-xs text-muted-foreground">{pers.villepers}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-strong rounded-3xl border-border/50 max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nouvel Employé</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="login" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Login</FormLabel>
                    <FormControl><Input placeholder="jdupont" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="motp" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Mot de passe</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nompers" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Nom</FormLabel>
                    <FormControl><Input placeholder="Dupont" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="prenompers" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Prénom</FormLabel>
                    <FormControl><Input placeholder="Jean" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="adrpers" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Adresse</FormLabel>
                  <FormControl><Input placeholder="15 Rue de la Paix" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="villepers" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Ville</FormLabel>
                    <FormControl><Input placeholder="Paris" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="telpers" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Téléphone</FormLabel>
                    <FormControl><Input type="number" placeholder="0612345678" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="d_embauche" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Date Embauche</FormLabel>
                    <FormControl><Input type="date" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="codeposte" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Poste</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 rounded-xl bg-secondary/50 border-border/50">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {postes.map((poste) => (
                          <SelectItem key={poste.codeposte} value={poste.codeposte}>{poste.libelle}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
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

export default Personnel;