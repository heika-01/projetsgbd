import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Article = Tables<"articles">;
type ArticleInsert = TablesInsert<"articles">;

export const useArticles = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
  });

  const addArticle = useMutation({
    mutationFn: async (article: Omit<ArticleInsert, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("articles")
        .insert([article])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'article",
        variant: "destructive",
      });
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async (refart: string) => {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("refart", refart);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'article",
        variant: "destructive",
      });
    },
  });

  return {
    articles,
    isLoading,
    addArticle: addArticle.mutate,
    deleteArticle: deleteArticle.mutate,
    isAdding: addArticle.isPending,
    isDeleting: deleteArticle.isPending,
  };
};
