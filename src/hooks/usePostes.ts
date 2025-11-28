import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Poste = Tables<"postes">;
type PosteInsert = TablesInsert<"postes">;

export const usePostes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: postes = [], isLoading } = useQuery({
    queryKey: ["postes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("postes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Poste[];
    },
  });

  const addPoste = useMutation({
    mutationFn: async (poste: Omit<PosteInsert, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("postes")
        .insert([poste])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postes"] });
      toast({
        title: "Poste ajouté",
        description: "Le poste a été ajouté avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le poste",
        variant: "destructive",
      });
    },
  });

  const deletePoste = useMutation({
    mutationFn: async (codeposte: string) => {
      const { error } = await supabase
        .from("postes")
        .delete()
        .eq("codeposte", codeposte);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postes"] });
      toast({
        title: "Poste supprimé",
        description: "Le poste a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le poste",
        variant: "destructive",
      });
    },
  });

  return {
    postes,
    isLoading,
    addPoste: addPoste.mutate,
    deletePoste: deletePoste.mutate,
    isAdding: addPoste.isPending,
    isDeleting: deletePoste.isPending,
  };
};
