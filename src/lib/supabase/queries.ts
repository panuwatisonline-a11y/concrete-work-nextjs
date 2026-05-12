import { createReadonlyClient } from "@/lib/supabase/readonly";
import type { Tables } from "@/types/database.types";

export type RequestView = Tables<"Request_View">;
/** คอลัมน์ที่หน้ารายการคำขอใช้ — ลด payload จาก Request_View */
export type RequestViewListItem = Pick<
  RequestView,
  | "id"
  | "request_date"
  | "request_time"
  | "booked_by_name"
  | "client_name"
  | "full_location"
  | "structure_no"
  | "concrete_work"
  | "mixcode"
  | "volume_request"
  | "status_id"
  | "status_name"
  | "casting_date"
  | "structure_name"
  | "remarks"
>;
export type Status = Tables<"Status">;

const REQUEST_VIEW_LIST_SELECT = [
  "id",
  "request_date",
  "request_time",
  "booked_by_name",
  "client_name",
  "full_location",
  "structure_no",
  "concrete_work",
  "mixcode",
  "volume_request",
  "status_id",
  "status_name",
  "casting_date",
  "structure_name",
  "remarks",
].join(",");
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

/* ── Requests ──────────────────────────────────────────────────── */

export async function getRequests(limit: number, offset: number) {
  const supabase = createReadonlyClient();
  if (!supabase) return { data: [], count: 0 };
  const { data, error, count } = await supabase
    .from("Request_View")
    .select("*", { count: "estimated" })
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("request_date", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getRequestsByStatus(statusId: number, limit = 200, offset = 0) {
  const supabase = createReadonlyClient();
  if (!supabase) return { data: [], count: 0 };
  const { data, error, count } = await supabase
    .from("Request_View")
    .select(REQUEST_VIEW_LIST_SELECT, { count: "estimated" })
    .eq("status_id", statusId)
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("request_date", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { data: (data ?? []) as unknown as RequestViewListItem[], count: count ?? 0 };
}

export async function getRequestById(id: string): Promise<RequestView | null> {
  const supabase = createReadonlyClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("Request_View")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getStatusList() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("Status").select("*").order("id");
  if (error) throw error;
  return data ?? [];
}

export async function getStatusById(id: number): Promise<Status | null> {
  const supabase = createReadonlyClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("Status").select("id, status_name").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getStatusSummary() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data: statuses, error: statusErr } = await supabase
    .from("Status").select("id, status_name").order("id");
  if (statusErr) throw statusErr;

  const counts = await Promise.all(
    (statuses ?? []).map((s) =>
      supabase
        .from("Request_View")
        .select("*", { count: "exact", head: true })
        .eq("status_id", s.id)
        .then(({ count }) => ({ status_id: s.id, count: count ?? 0 }))
    )
  );

  const countMap: Record<number, number> = {};
  for (const { status_id, count } of counts) countMap[status_id] = count;

  return (statuses ?? []).map((s) => ({
    status_id: s.id,
    status_name: s.status_name ?? "ไม่ระบุ",
    count: countMap[s.id] ?? 0,
  }));
}

/* ── Lookup tables (no cache — always fresh) ───────────────────── */

export async function getLocations() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("Location").select("*").order("full_location");
  if (error) throw error;
  return data ?? [];
}

export async function getStructures() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("Structure").select("*").order("structure_name");
  if (error) throw error;
  return data ?? [];
}

export async function getClients() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("Client").select("*").order("client_name");
  if (error) throw error;
  return data ?? [];
}

export async function getMixedCodes() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("Mixed Code").select("*").order("mixcode");
  if (error) throw error;
  return data ?? [];
}

export async function getMixedCodeById(id: number): Promise<MixedCode | null> {
  const supabase = createReadonlyClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("Mixed Code").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getConcreteWorks() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("Concrete Works").select("*").order("concrete_work");
  if (error) throw error;
  return data ?? [];
}

export async function getProfiles() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("profiles").select("*").order("fname");
  if (error) throw error;
  return data ?? [];
}

export async function getJobs() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("Jobs").select("*").order("job_name");
  if (error) throw error;
  return data ?? [];
}

export async function getABCCodes() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("ABC Code").select("*").order("full_abc");
  if (error) throw error;
  return data ?? [];
}

export async function getWBSCodes() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("WBS Code").select("*").order("full_wbs");
  if (error) throw error;
  return data ?? [];
}

export async function getCompressionMachines() {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("Compression Machine").select("*").order("machine");
  if (error) throw error;
  return data ?? [];
}

/* ── Mixed Code volume aggregation ────────────────────────────── */

export type MixcodeVolume = {
  mixcode_id: number;
  volume_used: number;
};

export async function getVolumeByMixcode(): Promise<MixcodeVolume[]> {
  const supabase = createReadonlyClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("Request")
    .select("mixcode_id, volume_confirm, volume_request")
    .not("mixcode_id", "is", null);

  if (error) throw error;

  const map: Record<number, number> = {};
  for (const row of data ?? []) {
    if (row.mixcode_id == null) continue;
    // ใช้ volume_confirm ถ้ามี ไม่มีก็ใช้ volume_request
    const vol = row.volume_confirm ?? row.volume_request;
    if (vol == null) continue;
    map[row.mixcode_id] = (map[row.mixcode_id] ?? 0) + vol;
  }

  return Object.entries(map).map(([id, vol]) => ({
    mixcode_id: Number(id),
    volume_used: vol,
  }));
}
