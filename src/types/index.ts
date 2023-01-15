export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      answer: {
        Row: {
          comments: string | null
          id: number
          points: number
          question_id: number
          questionnaire_id: number
          student_id: number
        }
        Insert: {
          comments?: string | null
          id?: number
          points: number
          question_id: number
          questionnaire_id: number
          student_id: number
        }
        Update: {
          comments?: string | null
          id?: number
          points?: number
          question_id?: number
          questionnaire_id?: number
          student_id?: number
        }
      }
      assignment: {
        Row: {
          attachment: string | null
          description: string | null
          enrollment_id: string
          id: string
          status: string | null
          title: string
        }
        Insert: {
          attachment?: string | null
          description?: string | null
          enrollment_id: string
          id?: string
          status?: string | null
          title: string
        }
        Update: {
          attachment?: string | null
          description?: string | null
          enrollment_id?: string
          id?: string
          status?: string | null
          title?: string
        }
      }
      countries: {
        Row: {
          continent: Database["public"]["Enums"]["continents"] | null
          id: number
          iso2: string
          iso3: string | null
          local_name: string | null
          name: string | null
        }
        Insert: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2: string
          iso3?: string | null
          local_name?: string | null
          name?: string | null
        }
        Update: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2?: string
          iso3?: string | null
          local_name?: string | null
          name?: string | null
        }
      }
      course: {
        Row: {
          id: string
          name: string | null
          school_id: string
        }
        Insert: {
          id?: string
          name?: string | null
          school_id: string
        }
        Update: {
          id?: string
          name?: string | null
          school_id?: string
        }
      }
      employment: {
        Row: {
          id: string
          school_id: string
          teacher_id: string
        }
        Insert: {
          id?: string
          school_id: string
          teacher_id: string
        }
        Update: {
          id?: string
          school_id?: string
          teacher_id?: string
        }
      }
      enrollment: {
        Row: {
          course_id: string
          id: string
          student_id: string
        }
        Insert: {
          course_id: string
          id?: string
          student_id: string
        }
        Update: {
          course_id?: string
          id?: string
          student_id?: string
        }
      }
      item: {
        Row: {
          id: number
          location: number
          name: string
        }
        Insert: {
          id?: number
          location: number
          name: string
        }
        Update: {
          id?: number
          location?: number
          name?: string
        }
      }
      location: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      lyrics: {
        Row: {
          artist: string | null
          has_chords: boolean
          id: number
          lyrics: string | null
          songtitle: string
        }
        Insert: {
          artist?: string | null
          has_chords: boolean
          id?: never
          lyrics?: string | null
          songtitle: string
        }
        Update: {
          artist?: string | null
          has_chords?: boolean
          id?: never
          lyrics?: string | null
          songtitle?: string
        }
      }
      orderline: {
        Row: {
          address: string | null
          id: string
          name: string
          notes: string | null
          number_of_items: number
          owner_id: string
        }
        Insert: {
          address?: string | null
          id?: string
          name: string
          notes?: string | null
          number_of_items: number
          owner_id?: string
        }
        Update: {
          address?: string | null
          id?: string
          name?: string
          notes?: string | null
          number_of_items?: number
          owner_id?: string
        }
      }
      participant: {
        Row: {
          description: string | null
          email: string | null
          id: number
          name: string | null
          phone_number: string | null
          rvsp_ceremony: string | null
          rvsp_party: string | null
          sort_order: string | null
          tasks: string | null
        }
        Insert: {
          description?: string | null
          email?: string | null
          id: number
          name?: string | null
          phone_number?: string | null
          rvsp_ceremony?: string | null
          rvsp_party?: string | null
          sort_order?: string | null
          tasks?: string | null
        }
        Update: {
          description?: string | null
          email?: string | null
          id?: number
          name?: string | null
          phone_number?: string | null
          rvsp_ceremony?: string | null
          rvsp_party?: string | null
          sort_order?: string | null
          tasks?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      question: {
        Row: {
          comments: string | null
          id: number
          name: string
          points: number
          questionnaire_id: number
        }
        Insert: {
          comments?: string | null
          id?: number
          name: string
          points: number
          questionnaire_id: number
        }
        Update: {
          comments?: string | null
          id?: number
          name?: string
          points?: number
          questionnaire_id?: number
        }
      }
      questionnaire: {
        Row: {
          id: number
          name: string | null
          owner_id: string
        }
        Insert: {
          id?: number
          name?: string | null
          owner_id: string
        }
        Update: {
          id?: number
          name?: string | null
          owner_id?: string
        }
      }
      school: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id?: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
      }
      student: {
        Row: {
          comments: string | null
          id: number
          name: string
          owner_id: string
        }
        Insert: {
          comments?: string | null
          id?: number
          name: string
          owner_id: string
        }
        Update: {
          comments?: string | null
          id?: number
          name?: string
          owner_id?: string
        }
      }
      teacher: {
        Row: {
          course_id: string
          id: string
          teacher_id: string
        }
        Insert: {
          course_id: string
          id?: string
          teacher_id: string
        }
        Update: {
          course_id?: string
          id?: string
          teacher_id?: string
        }
      }
    }
    Views: {
      ceremony_statistics: {
        Row: {
          count: number | null
          rvsp_ceremony: string | null
        }
      }
      orderline_statistics: {
        Row: {
          amount_pr_item: number | null
          label: string | null
          number_of_items: number | null
          total_amount: number | null
          unit: string | null
        }
      }
      participant_statistics: {
        Row: {
          count: number | null
          rvsp_party: string | null
        }
      }
      user: {
        Row: {
          email: string | null
          id: string | null
          role: string | null
        }
        Insert: {
          email?: string | null
          id?: string | null
          role?: string | null
        }
        Update: {
          email?: string | null
          id?: string | null
          role?: string | null
        }
      }
    }
    Functions: {
      canmodify: {
        Args: { "": string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_school_admin: {
        Args: { school_id: string }
        Returns: boolean
      }
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
    }
  }
}
