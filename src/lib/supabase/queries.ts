import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type RequestView = Tables<"Request_View">;
export type Status = Tables<"Status">;
export type Location = Tables<"Location">;
export type Structure = Tables<"Structure">;
export type Client = Tables<"Client">;
export type MixedCode = Tables<"Mixed Code">;
export type ConcreteWork = Tables<"Concrete Works">;
export type Profile = Tables<"profiles">;
export type Job = Tables<"Jobs">;
export type ABCCode = Tables<"ABC Code">;
export type WBSCode = Tables<"WBS Code">;
export type CompressionMachine = Tables<"Compression Machine">;

export async function getRequests(limit = 50, offset = 0) {
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("Request_View")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("request_date", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getRequestsByStatus(statusId: number, limit = 200, offset = 0) {
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("Request_View")
    .select("*", { count: "exact" })
    .eq("status_id", statusId)
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("request_date", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getRequestById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Request_View")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getStatusList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Status")
    .select("*")
    .order("id");

  if (error) throw error;
  return data ?? [];
}

export async function getStatusSummary() {
  const supabase = await createClient();

  const [{ data: statuses, error: statusErr }, { data: counts, error: countErr }] =
    await Promise.all([
      supabase.from("Status").select("id, status_name").order("id"),
      supabase.from("Request_View").select("status_id"),
    ]);

  if (statusErr) throw statusErr;
  if (countErr) throw countErr;

  const countMap: Record<number, number> = {};
  for (const row of counts ?? []) {
    if (row.status_id != null) {
      countMap[row.status_id] = (countMap[row.status_id] ?? 0) + 1;
    }
  }

  return (statuses ?? []).map((s) => ({
    status_id: s.id,
    status_name: s.status_name ?? "ไม่ระบุ",
    count: countMap[s.id] ?? 0,
  }));
}

export async function getLocations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Location")
    .select("*")
    .order("full_location");

  if (error) throw error;
  return data ?? [];
}

export async function getStructures() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Structure")
    .select("*")
    .order("structure_name");

  if (error) throw error;
  return data ?? [];
}

export async function getClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Client")
    .select("*")
    .order("client_name");

  if (error) throw error;
  return data ?? [];
}

export async function getMixedCodes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Mixed Code")
    .select("*")
    .order("mixcode");

  if (error) throw error;
  return data ?? [];
}

export async function getConcreteWorks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Concrete Works")
    .select("*")
    .order("concrete_work");

  if (error) throw error;
  return data ?? [];
}

export async function getProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("fname");

  if (error) throw error;
  return data ?? [];
}

export async function getJobs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Jobs")
    .select("*")
    .order("job_name");

  if (error) throw error;
  return data ?? [];
}

export async function getABCCodes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ABC Code")
    .select("*")
    .order("full_abc");

  if (error) throw error;
  return data ?? [];
}

export async function getWBSCodes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("WBS Code")
    .select("*")
    .order("full_wbs");

  if (error) throw error;
  return data ?? [];
}

export async function getCompressionMachines() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Compression Machine")
    .select("*")
    .order("machine");

  if (error) throw error;
  return data ?? [];
}
