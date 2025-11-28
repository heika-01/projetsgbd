import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Personnel = Tables<"personnel">;
type PersonnelInsert = TablesInsert<"personnel">;

export const usePersonnel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: personnel = [], isLoading } = useQuery({
    queryKey: ["personnel"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personnel")
        .select(`
          *,
          postes (
            codeposte,
            libelle
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addPersonnel = useMutation({
    mutationFn: async (person: Omit<PersonnelInsert, "idpers" | "created_at">) => {
      const { data, error } = await supabase
        .from("personnel")
        .insert([person])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
      toast({
        title: "Employé ajouté",
        description: "L'employé a été ajouté avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'employé",
        variant: "destructive",
      });
    },
  });

  const deletePersonnel = useMutation({
    mutationFn: async (idpers: number) => {
      const { error } = await supabase
        .from("personnel")
        .delete()
        .eq("idpers", idpers);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnel"] });
      toast({
        title: "Employé supprimé",
        description: "L'employé a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'employé",
        variant: "destructive",
      });
    },
  });

  return {
    personnel,
    isLoading,
    addPersonnel: addPersonnel.mutate,
    deletePersonnel: deletePersonnel.mutate,
    isAdding: addPersonnel.isPending,
    isDeleting: deletePersonnel.isPending,
  };
};
