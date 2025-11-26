import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft, Plus, Search, Edit, Trash2, Users, Mail, Phone } from "lucide-react";

const Clients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées
  const clients = [
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
  ];

  const filteredClients = clients.filter(
    (client) =>
      client.noclt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nomclt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenomclt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.adrmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.code_postal.includes(searchTerm)
  );

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
          <Button>
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
                        <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default Clients;
