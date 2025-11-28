export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          categorie: string | null
          codetva: number | null
          created_at: string | null
          designation: string
          id: string
          prixa: number | null
          prixv: number | null
          qtestk: number | null
          refart: string
        }
        Insert: {
          categorie?: string | null
          codetva?: number | null
          created_at?: string | null
          designation: string
          id?: string
          prixa?: number | null
          prixv?: number | null
          qtestk?: number | null
          refart: string
        }
        Update: {
          categorie?: string | null
          codetva?: number | null
          created_at?: string | null
          designation?: string
          id?: string
          prixa?: number | null
          prixv?: number | null
          qtestk?: number | null
          refart?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adrclt: string | null
          adrmail: string | null
          code_postal: number | null
          created_at: string | null
          noclt: number
          nomclt: string
          prenomclt: string | null
          telclt: number | null
          villecit: string | null
        }
        Insert: {
          adrclt?: string | null
          adrmail?: string | null
          code_postal?: number | null
          created_at?: string | null
          noclt?: number
          nomclt: string
          prenomclt?: string | null
          telclt?: number | null
          villecit?: string | null
        }
        Update: {
          adrclt?: string | null
          adrmail?: string | null
          code_postal?: number | null
          created_at?: string | null
          noclt?: number
          nomclt?: string
          prenomclt?: string | null
          telclt?: number | null
          villecit?: string | null
        }
        Relationships: []
      }
      commandes: {
        Row: {
          created_at: string | null
          datecde: string | null
          etatcde: string | null
          nocde: number
          noclt: number | null
        }
        Insert: {
          created_at?: string | null
          datecde?: string | null
          etatcde?: string | null
          nocde?: number
          noclt?: number | null
        }
        Update: {
          created_at?: string | null
          datecde?: string | null
          etatcde?: string | null
          nocde?: number
          noclt?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "commandes_noclt_fkey"
            columns: ["noclt"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["noclt"]
          },
        ]
      }
      hcommandesannulees: {
        Row: {
          avantliv: string | null
          code_postal: number | null
          created_at: string | null
          dateannulation: string | null
          datecde: string | null
          id: string
          montantc: number | null
          nbrart: number | null
          nocde: number | null
          noclt: number | null
        }
        Insert: {
          avantliv?: string | null
          code_postal?: number | null
          created_at?: string | null
          dateannulation?: string | null
          datecde?: string | null
          id?: string
          montantc?: number | null
          nbrart?: number | null
          nocde?: number | null
          noclt?: number | null
        }
        Update: {
          avantliv?: string | null
          code_postal?: number | null
          created_at?: string | null
          dateannulation?: string | null
          datecde?: string | null
          id?: string
          montantc?: number | null
          nbrart?: number | null
          nocde?: number | null
          noclt?: number | null
        }
        Relationships: []
      }
      ligcdes: {
        Row: {
          created_at: string | null
          id: string
          nocde: number | null
          qtecde: number
          refart: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nocde?: number | null
          qtecde: number
          refart?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nocde?: number | null
          qtecde?: number
          refart?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ligcdes_nocde_fkey"
            columns: ["nocde"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["nocde"]
          },
          {
            foreignKeyName: "ligcdes_refart_fkey"
            columns: ["refart"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["refart"]
          },
        ]
      }
      livraisoncom: {
        Row: {
          created_at: string | null
          dateliv: string | null
          etatliv: string | null
          id: string
          livreur: number | null
          modepay: string | null
          nocde: number | null
        }
        Insert: {
          created_at?: string | null
          dateliv?: string | null
          etatliv?: string | null
          id?: string
          livreur?: number | null
          modepay?: string | null
          nocde?: number | null
        }
        Update: {
          created_at?: string | null
          dateliv?: string | null
          etatliv?: string | null
          id?: string
          livreur?: number | null
          modepay?: string | null
          nocde?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "livraisoncom_livreur_fkey"
            columns: ["livreur"]
            isOneToOne: false
            referencedRelation: "personnel"
            referencedColumns: ["idpers"]
          },
          {
            foreignKeyName: "livraisoncom_nocde_fkey"
            columns: ["nocde"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["nocde"]
          },
        ]
      }
      personnel: {
        Row: {
          adrpers: string | null
          codeposte: string | null
          created_at: string | null
          d_embauche: string | null
          idpers: number
          login: string | null
          motp: string | null
          nompers: string
          prenompers: string
          telpers: number | null
          villepers: string | null
        }
        Insert: {
          adrpers?: string | null
          codeposte?: string | null
          created_at?: string | null
          d_embauche?: string | null
          idpers?: number
          login?: string | null
          motp?: string | null
          nompers: string
          prenompers: string
          telpers?: number | null
          villepers?: string | null
        }
        Update: {
          adrpers?: string | null
          codeposte?: string | null
          created_at?: string | null
          d_embauche?: string | null
          idpers?: number
          login?: string | null
          motp?: string | null
          nompers?: string
          prenompers?: string
          telpers?: number | null
          villepers?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personnel_codeposte_fkey"
            columns: ["codeposte"]
            isOneToOne: false
            referencedRelation: "postes"
            referencedColumns: ["codeposte"]
          },
        ]
      }
      postes: {
        Row: {
          codeposte: string
          created_at: string | null
          description: string | null
          id: string
          indice: number
          libelle: string
        }
        Insert: {
          codeposte: string
          created_at?: string | null
          description?: string | null
          id?: string
          indice: number
          libelle: string
        }
        Update: {
          codeposte?: string
          created_at?: string | null
          description?: string | null
          id?: string
          indice?: number
          libelle?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
