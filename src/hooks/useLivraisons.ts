import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Livraison = Tables<"livraisoncom">;
type LivraisonInsert = TablesInsert<"livraisoncom">;

export const useLivraisons = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: livraisons = [], isLoading } = useQuery({
    queryKey: ["livraisons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("livraisoncom")
        .select(`
          *,
          commandes (
            nocde,
            noclt,
            clients (
              nomclt,
              prenomclt,
              adrclt
            )
          ),
          personnel (
            idpers,
            nompers,
            prenompers
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addLivraison = useMutation({
    mutationFn: async (livraison: Omit<LivraisonInsert, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("livraisoncom")
        .insert([livraison])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livraisons"] });
      toast({
        title: "Livraison programmée",
        description: "La livraison a été programmée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de programmer la livraison",
        variant: "destructive",
      });
    },
  });

  const deleteLivraison = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("livraisoncom")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livraisons"] });
      toast({
        title: "Livraison annulée",
        description: "La livraison a été annulée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'annuler la livraison",
        variant: "destructive",
      });
    },
  });

  return {
    livraisons,
    isLoading,
    addLivraison: addLivraison.mutate,
    deleteLivraison: deleteLivraison.mutate,
    isAdding: addLivraison.isPending,
    isDeleting: deleteLivraison.isPending,
  };
};
