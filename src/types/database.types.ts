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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      "ABC Code": {
        Row: {
          abc_code1: number | null
          abc_code2: number | null
          abc_code3: number | null
          abc_code4: number | null
          description: string | null
          full_abc: string | null
          id: number
        }
        Insert: {
          abc_code1?: number | null
          abc_code2?: number | null
          abc_code3?: number | null
          abc_code4?: number | null
          description?: string | null
          full_abc?: string | null
          id?: number
        }
        Update: {
          abc_code1?: number | null
          abc_code2?: number | null
          abc_code3?: number | null
          abc_code4?: number | null
          description?: string | null
          full_abc?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ABC Code_abc_code1_fkey"
            columns: ["abc_code1"]
            isOneToOne: false
            referencedRelation: "ABC Code1"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ABC Code_abc_code2_fkey"
            columns: ["abc_code2"]
            isOneToOne: false
            referencedRelation: "ABC Code2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ABC Code_abc_code3_fkey"
            columns: ["abc_code3"]
            isOneToOne: false
            referencedRelation: "ABC Code3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ABC Code_abc_code4_fkey"
            columns: ["abc_code4"]
            isOneToOne: false
            referencedRelation: "ABC Code4"
            referencedColumns: ["id"]
          },
        ]
      }
      "ABC Code1": {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      "ABC Code2": {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      "ABC Code3": {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      "ABC Code4": {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      Client: {
        Row: {
          client_name: string | null
          id: number
        }
        Insert: {
          client_name?: string | null
          id?: number
        }
        Update: {
          client_name?: string | null
          id?: number
        }
        Relationships: []
      }
      "Compression Machine": {
        Row: {
          cal_date: string | null
          file: string | null
          id: number
          k: string | null
          k1: number | null
          k2: number | null
          machine: string | null
          serial: string | null
        }
        Insert: {
          cal_date?: string | null
          file?: string | null
          id?: number
          k?: string | null
          k1?: number | null
          k2?: number | null
          machine?: string | null
          serial?: string | null
        }
        Update: {
          cal_date?: string | null
          file?: string | null
          id?: number
          k?: string | null
          k1?: number | null
          k2?: number | null
          machine?: string | null
          serial?: string | null
        }
        Relationships: []
      }
      "Concrete Works": {
        Row: {
          concrete_work: string | null
          id: number
          structure_list: string | null
        }
        Insert: {
          concrete_work?: string | null
          id?: number
          structure_list?: string | null
        }
        Update: {
          concrete_work?: string | null
          id?: number
          structure_list?: string | null
        }
        Relationships: []
      }
      Contractors: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      Jobs: {
        Row: {
          id: number
          job_name: string | null
        }
        Insert: {
          id?: number
          job_name?: string | null
        }
        Update: {
          id?: number
          job_name?: string | null
        }
        Relationships: []
      }
      Location: {
        Row: {
          description: string | null
          full_location: string | null
          id: number
          location1: string | null
          location2: string | null
          location3: string | null
        }
        Insert: {
          description?: string | null
          full_location?: string | null
          id?: number
          location1?: string | null
          location2?: string | null
          location3?: string | null
        }
        Update: {
          description?: string | null
          full_location?: string | null
          id?: number
          location1?: string | null
          location2?: string | null
          location3?: string | null
        }
        Relationships: []
      }
      "Mixed Code": {
        Row: {
          id: number
          mixcode: string | null
          qty: number | null
          sample_type: string | null
          slump: string | null
          strength: number | null
          strength_type: string | null
          structure_list: string | null
          supplier: string | null
        }
        Insert: {
          id?: number
          mixcode?: string | null
          qty?: number | null
          sample_type?: string | null
          slump?: string | null
          strength?: number | null
          strength_type?: string | null
          structure_list?: string | null
          supplier?: string | null
        }
        Update: {
          id?: number
          mixcode?: string | null
          qty?: number | null
          sample_type?: string | null
          slump?: string | null
          strength?: number | null
          strength_type?: string | null
          structure_list?: string | null
          supplier?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          client_id: number | null
          client_name: string | null
          created_at: string | null
          employee_id: string | null
          fname: string | null
          id: string
          Job: number | null
          lname: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: number | null
          client_name?: string | null
          created_at?: string | null
          employee_id?: string | null
          fname?: string | null
          id: string
          Job?: number | null
          lname?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number | null
          client_name?: string | null
          created_at?: string | null
          employee_id?: string | null
          fname?: string | null
          id?: string
          Job?: number | null
          lname?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_Job_fkey"
            columns: ["Job"]
            isOneToOne: false
            referencedRelation: "Jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      Request: {
        Row: {
          abc_code_id: number | null
          after_image: string | null
          approved_at: string | null
          approved_by: string | null
          before_image: string | null
          booked_at: string | null
          booked_by: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          casting_date: string | null
          checksheet_url: string | null
          client_id: number | null
          concrete_work_id: number | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          eslip_url: string | null
          id: string
          inspected_at: string | null
          inspected_by: string | null
          location_id: number | null
          mixcode_id: number | null
          pct_loss: number | null
          postpone_date: string | null
          postpone_time: string | null
          postponed_at: string | null
          postponed_by: string | null
          reason_cancel: string | null
          reason_postpone: string | null
          reason_reject: string | null
          rejected_at: string | null
          rejected_by: string | null
          remarks: string | null
          request_date: string | null
          request_time: string | null
          sample_qty: number | null
          status_id: number | null
          strength: number | null
          structure_id: number | null
          structure_no: string | null
          updated_at: string | null
          volume_actual: number | null
          volume_confirm: number | null
          volume_dwg: number | null
          volume_loss: number | null
          volume_request: number | null
          wbs_code_id: number | null
        }
        Insert: {
          abc_code_id?: number | null
          after_image?: string | null
          approved_at?: string | null
          approved_by?: string | null
          before_image?: string | null
          booked_at?: string | null
          booked_by?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          casting_date?: string | null
          checksheet_url?: string | null
          client_id?: number | null
          concrete_work_id?: number | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          eslip_url?: string | null
          id?: string
          inspected_at?: string | null
          inspected_by?: string | null
          location_id?: number | null
          mixcode_id?: number | null
          pct_loss?: number | null
          postpone_date?: string | null
          postpone_time?: string | null
          postponed_at?: string | null
          postponed_by?: string | null
          reason_cancel?: string | null
          reason_postpone?: string | null
          reason_reject?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          remarks?: string | null
          request_date?: string | null
          request_time?: string | null
          sample_qty?: number | null
          status_id?: number | null
          strength?: number | null
          structure_id?: number | null
          structure_no?: string | null
          updated_at?: string | null
          volume_actual?: number | null
          volume_confirm?: number | null
          volume_dwg?: number | null
          volume_loss?: number | null
          volume_request?: number | null
          wbs_code_id?: number | null
        }
        Update: {
          abc_code_id?: number | null
          after_image?: string | null
          approved_at?: string | null
          approved_by?: string | null
          before_image?: string | null
          booked_at?: string | null
          booked_by?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          casting_date?: string | null
          checksheet_url?: string | null
          client_id?: number | null
          concrete_work_id?: number | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          eslip_url?: string | null
          id?: string
          inspected_at?: string | null
          inspected_by?: string | null
          location_id?: number | null
          mixcode_id?: number | null
          pct_loss?: number | null
          postpone_date?: string | null
          postpone_time?: string | null
          postponed_at?: string | null
          postponed_by?: string | null
          reason_cancel?: string | null
          reason_postpone?: string | null
          reason_reject?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          remarks?: string | null
          request_date?: string | null
          request_time?: string | null
          sample_qty?: number | null
          status_id?: number | null
          strength?: number | null
          structure_id?: number | null
          structure_no?: string | null
          updated_at?: string | null
          volume_actual?: number | null
          volume_confirm?: number | null
          volume_dwg?: number | null
          volume_loss?: number | null
          volume_request?: number | null
          wbs_code_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Request_abc_code_id_fkey"
            columns: ["abc_code_id"]
            isOneToOne: false
            referencedRelation: "ABC Code"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_booked_by_fkey"
            columns: ["booked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_concrete_work_id_fkey"
            columns: ["concrete_work_id"]
            isOneToOne: false
            referencedRelation: "Concrete Works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_inspected_by_fkey"
            columns: ["inspected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "Location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_mixcode_id_fkey"
            columns: ["mixcode_id"]
            isOneToOne: false
            referencedRelation: "Mixed Code"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_postponed_by_fkey"
            columns: ["postponed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "Status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "Structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_wbs_code_id_fkey"
            columns: ["wbs_code_id"]
            isOneToOne: false
            referencedRelation: "WBS Code"
            referencedColumns: ["id"]
          },
        ]
      }
      Request_Log: {
        Row: {
          action: string
          action_by: string | null
          created_at: string | null
          id: number
          note: string | null
          postpone_date: string | null
          postpone_time: string | null
          request_id: string
          status_id: number | null
        }
        Insert: {
          action: string
          action_by?: string | null
          created_at?: string | null
          id?: number
          note?: string | null
          postpone_date?: string | null
          postpone_time?: string | null
          request_id: string
          status_id?: number | null
        }
        Update: {
          action?: string
          action_by?: string | null
          created_at?: string | null
          id?: number
          note?: string | null
          postpone_date?: string | null
          postpone_time?: string | null
          request_id?: string
          status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Request_Log_action_by_fkey"
            columns: ["action_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_Log_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "Request"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_Log_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "Request_View"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_Log_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "Status"
            referencedColumns: ["id"]
          },
        ]
      }
      Status: {
        Row: {
          id: number
          status_name: string | null
        }
        Insert: {
          id?: number
          status_name?: string | null
        }
        Update: {
          id?: number
          status_name?: string | null
        }
        Relationships: []
      }
      Structure: {
        Row: {
          id: number
          structure_name: string | null
        }
        Insert: {
          id?: number
          structure_name?: string | null
        }
        Update: {
          id?: number
          structure_name?: string | null
        }
        Relationships: []
      }
      "WBS Code": {
        Row: {
          description: string | null
          full_wbs: string | null
          id: number
          wbs1: number | null
          wbs2: number | null
          wbs3: number | null
          wbs4: number | null
          wbs5: number | null
          wbs6: number | null
          wbs7: number | null
        }
        Insert: {
          description?: string | null
          full_wbs?: string | null
          id?: number
          wbs1?: number | null
          wbs2?: number | null
          wbs3?: number | null
          wbs4?: number | null
          wbs5?: number | null
          wbs6?: number | null
          wbs7?: number | null
        }
        Update: {
          description?: string | null
          full_wbs?: string | null
          id?: number
          wbs1?: number | null
          wbs2?: number | null
          wbs3?: number | null
          wbs4?: number | null
          wbs5?: number | null
          wbs6?: number | null
          wbs7?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "WBS Code_wbs1_fkey"
            columns: ["wbs1"]
            isOneToOne: false
            referencedRelation: "WBS1"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WBS Code_wbs2_fkey"
            columns: ["wbs2"]
            isOneToOne: false
            referencedRelation: "WBS2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WBS Code_wbs3_fkey"
            columns: ["wbs3"]
            isOneToOne: false
            referencedRelation: "WBS3"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WBS Code_wbs4_fkey"
            columns: ["wbs4"]
            isOneToOne: false
            referencedRelation: "WBS4"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WBS Code_wbs5_fkey"
            columns: ["wbs5"]
            isOneToOne: false
            referencedRelation: "WBS5"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WBS Code_wbs6_fkey"
            columns: ["wbs6"]
            isOneToOne: false
            referencedRelation: "WBS6"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "WBS Code_wbs7_fkey"
            columns: ["wbs7"]
            isOneToOne: false
            referencedRelation: "WBS7"
            referencedColumns: ["id"]
          },
        ]
      }
      WBS1: {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      WBS2: {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      WBS3: {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      WBS4: {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      WBS5: {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      WBS6: {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      WBS7: {
        Row: {
          code_name: string | null
          description: string | null
          id: number
        }
        Insert: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Update: {
          code_name?: string | null
          description?: string | null
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      Request_View: {
        Row: {
          abc_code_id: number | null
          after_image: string | null
          approved_at: string | null
          approved_by: string | null
          approved_by_name: string | null
          before_image: string | null
          booked_at: string | null
          booked_by: string | null
          booked_by_name: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          cancelled_by_name: string | null
          casting_date: string | null
          checksheet_url: string | null
          client_id: number | null
          client_name: string | null
          concrete_work: string | null
          concrete_work_id: number | null
          confirmed_at: string | null
          confirmed_by: string | null
          confirmed_by_name: string | null
          created_at: string | null
          eslip_url: string | null
          full_abc: string | null
          full_location: string | null
          full_wbs: string | null
          id: string | null
          inspected_at: string | null
          inspected_by: string | null
          inspected_by_name: string | null
          location_id: number | null
          mixcode: string | null
          mixcode_id: number | null
          pct_loss: number | null
          postpone_date: string | null
          postpone_time: string | null
          postponed_at: string | null
          postponed_by: string | null
          postponed_by_name: string | null
          reason_cancel: string | null
          reason_postpone: string | null
          reason_reject: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejected_by_name: string | null
          remarks: string | null
          request_date: string | null
          request_time: string | null
          sample_qty: number | null
          sample_type: string | null
          slump: string | null
          status_id: number | null
          status_name: string | null
          strength: number | null
          strength_type: string | null
          structure_id: number | null
          structure_name: string | null
          structure_no: string | null
          supplier: string | null
          updated_at: string | null
          volume_actual: number | null
          volume_confirm: number | null
          volume_dwg: number | null
          volume_loss: number | null
          volume_request: number | null
          wbs_code_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Request_abc_code_id_fkey"
            columns: ["abc_code_id"]
            isOneToOne: false
            referencedRelation: "ABC Code"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_booked_by_fkey"
            columns: ["booked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_concrete_work_id_fkey"
            columns: ["concrete_work_id"]
            isOneToOne: false
            referencedRelation: "Concrete Works"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_inspected_by_fkey"
            columns: ["inspected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "Location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_mixcode_id_fkey"
            columns: ["mixcode_id"]
            isOneToOne: false
            referencedRelation: "Mixed Code"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_postponed_by_fkey"
            columns: ["postponed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "Status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "Structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Request_wbs_code_id_fkey"
            columns: ["wbs_code_id"]
            isOneToOne: false
            referencedRelation: "WBS Code"
            referencedColumns: ["id"]
          },
        ]
      }
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
