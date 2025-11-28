import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Commande = Tables<"commandes">;
type CommandeInsert = TablesInsert<"commandes">;
type CommandeUpdate = TablesUpdate<"commandes">;

export const useCommandes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: commandes = [], isLoading } = useQuery({
    queryKey: ["commandes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commandes")
        .select(`
          *,
          clients (
            noclt,
            nomclt,
            prenomclt
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addCommande = useMutation({
    mutationFn: async (commande: Omit<CommandeInsert, "nocde" | "created_at">) => {
      const { data, error } = await supabase
        .from("commandes")
        .insert([commande])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      toast({
        title: "Commande créée",
        description: "La commande a été créée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la commande",
        variant: "destructive",
      });
    },
  });

  const updateCommande = useMutation({
    mutationFn: async ({ nocde, ...update }: CommandeUpdate & { nocde: number }) => {
      const { data, error } = await supabase
        .from("commandes")
        .update(update)
        .eq("nocde", nocde)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      toast({
        title: "Commande modifiée",
        description: "La commande a été modifiée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier la commande",
        variant: "destructive",
      });
    },
  });

  const deleteCommande = useMutation({
    mutationFn: async (nocde: number) => {
      const { error } = await supabase
        .from("commandes")
        .delete()
        .eq("nocde", nocde);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      toast({
        title: "Commande supprimée",
        description: "La commande a été supprimée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la commande",
        variant: "destructive",
      });
    },
  });

  return {
    commandes,
    isLoading,
    addCommande: addCommande.mutate,
    updateCommande: updateCommande.mutate,
    deleteCommande: deleteCommande.mutate,
    isAdding: addCommande.isPending,
    isUpdating: updateCommande.isPending,
    isDeleting: deleteCommande.isPending,
  };
};
