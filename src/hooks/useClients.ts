import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Client = Tables<"clients">;
type ClientInsert = TablesInsert<"clients">;

export const useClients = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    },
  });

  const addClient = useMutation({
    mutationFn: async (client: Omit<ClientInsert, "created_at">) => {
      const { data, error } = await supabase
        .from("clients")
        .insert([client])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client ajouté",
        description: "Le client a été ajouté avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le client",
        variant: "destructive",
      });
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (noclt: number) => {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("noclt", noclt);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le client",
        variant: "destructive",
      });
    },
  });

  return {
    clients,
    isLoading,
    addClient: addClient.mutate,
    deleteClient: deleteClient.mutate,
    isAdding: addClient.isPending,
    isDeleting: deleteClient.isPending,
  };
};
