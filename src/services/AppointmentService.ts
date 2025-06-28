import { supabase } from "../lib/SupaBase";

export interface Appointment {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  notes?: string;
  patient?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  created_at?: string;
  updated_at?: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
}

const AppointmentService = {
  //Get all appointments
  async getAllAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase.from("appointments").select();
    console.log("Fetching appointments...", data, error);
    if (error) {
      console.error("Error fetching appointments:", error.message);
      return [];
    }

    console.log("Fetched appointments:", data);
    return data;
  },

  //Get all Categories
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from("categories").select();

    if (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }

    console.log("Fetched categories:", data);
    return data;
  },

  async create(appointment: Partial<Appointment>): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from("appointments")
      .insert(appointment)
      .select()
      .single();

    if (error) {
      console.error("Error creating appointment:", error.message);
      return null;
    }

    return data;
  },

  async update(
    id: string,
    updates: Partial<Appointment>
  ): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from("appointments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating appointment:", error.message);
      return null;
    }

    return data;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting appointment:", error.message);
      return false;
    }

    return true;
  },
};

export default AppointmentService;
