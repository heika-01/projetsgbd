import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, Plus, Search, Trash2, Users, Mail, Phone, MapPin } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { ThemeToggle } from "@/components/ThemeToggle";

const clientSchema = z.object({
  nomclt: z.string().min(2, "Nom minimum 2 caractères"),
  prenomclt: z.string().optional(),
  adrclt: z.string().min(5, "Adresse minimum 5 caractères"),
  code_postal: z.coerce.number().int().positive(),
  telclt: z.coerce.number().int().positive(),
  adrmail: z.string().email("Email invalide"),
  villecit: z.string().optional(),
});

const Clients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clients, isLoading, addClient, deleteClient } = useClients();

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: { nomclt: "", prenomclt: "", adrclt: "", code_postal: 0, telclt: 0, adrmail: "", villecit: "" },
  });

  const filteredClients = clients.filter(
    (client) =>
      String(client.noclt).includes(searchTerm) ||
      client.nomclt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.prenomclt && client.prenomclt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.adrmail && client.adrmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const onSubmit = (data: z.infer<typeof clientSchema>) => {
    addClient({ nomclt: data.nomclt, prenomclt: data.prenomclt, adrclt: data.adrclt, code_postal: data.code_postal, telclt: data.telclt, adrmail: data.adrmail, villecit: data.villecit });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (noclt: number) => deleteClient(noclt);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <header className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Clients</h1>
              <p className="text-xs text-muted-foreground">{clients.length} clients</p>
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
            placeholder="Rechercher par nom, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-2xl glass border-border/50 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.length === 0 ? (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Aucun client trouvé</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div key={client.noclt} className="glass rounded-2xl p-5 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-bold text-primary">
                    {client.nomclt.charAt(0)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                    onClick={() => handleDelete(client.noclt)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <p className="font-semibold text-foreground mb-1">
                  {client.nomclt} {client.prenomclt || ""}
                </p>
                <p className="font-mono text-xs text-muted-foreground mb-3">#{client.noclt}</p>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{client.adrmail || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{client.telclt || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{client.code_postal} {client.villecit || ""}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-strong rounded-3xl border-border/50 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Nouveau Client</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomclt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Dupont" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                      <FormLabel className="text-muted-foreground">Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                    <FormLabel className="text-muted-foreground">Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="15 Rue de la Paix" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                      <FormLabel className="text-muted-foreground">Code Postal</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="75001" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                      <FormLabel className="text-muted-foreground">Téléphone</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0145678901" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
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
                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="client@email.com" {...field} className="h-11 rounded-xl bg-secondary/50 border-border/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="flex-1 h-12 rounded-xl">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent glow-primary">
                  Ajouter
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;