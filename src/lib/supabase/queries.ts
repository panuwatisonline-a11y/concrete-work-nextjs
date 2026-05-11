import { unstable_cache } from "next/cache";
import { createReadonlyClient } from "@/lib/supabase/readonly";
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

async function _getRequests(limit: number, offset: number) {
  const supabase = createReadonlyClient();
  const { data, error, count } = await supabase
    .from("Request_View")
    .select("*", { count: "estimated" })
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("request_date", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export const getRequests = unstable_cache(
  _getRequests,
  ["requests"],
  { tags: ["requests"], revalidate: 60 }
);

async function _getRequestsByStatus(statusId: number, limit: number, offset: number) {
  const supabase = createReadonlyClient();
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

export function getRequestsByStatus(statusId: number, limit = 200, offset = 0) {
  return unstable_cache(
    () => _getRequestsByStatus(statusId, limit, offset),
    [`requests-status-${statusId}-${limit}-${offset}`],
    { tags: ["requests", `requests-status-${statusId}`], revalidate: 60 }
  )();
}

export async function getRequestById(id: string) {
  return unstable_cache(
    async () => {
      const supabase = createReadonlyClient();
      const { data, error } = await supabase
        .from("Request_View")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    [`request-${id}`],
    { tags: ["requests", `request-${id}`], revalidate: 60 }
  )();
}

async function _getStatusList() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase
    .from("Status")
    .select("*")
    .order("id");
  if (error) throw error;
  return data ?? [];
}

export const getStatusList = unstable_cache(
  _getStatusList,
  ["statuses"],
  { tags: ["statuses"], revalidate: 3600 }
);

async function _getStatusSummary() {
  const supabase = createReadonlyClient();

  const { data: statuses, error: statusErr } = await supabase
    .from("Status")
    .select("id, status_name")
    .order("id");

  if (statusErr) throw statusErr;

  // Parallel HEAD count requests per status — no rows transferred
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
  for (const { status_id, count } of counts) {
    countMap[status_id] = count;
  }

  return (statuses ?? []).map((s) => ({
    status_id: s.id,
    status_name: s.status_name ?? "ไม่ระบุ",
    count: countMap[s.id] ?? 0,
  }));
}

export const getStatusSummary = unstable_cache(
  _getStatusSummary,
  ["status-summary"],
  { tags: ["requests", "statuses"], revalidate: 60 }
);

async function _getLocations() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("Location").select("*").order("full_location");
  if (error) throw error;
  return data ?? [];
}
export const getLocations = unstable_cache(_getLocations, ["locations"], { tags: ["locations"], revalidate: 3600 });

async function _getStructures() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("Structure").select("*").order("structure_name");
  if (error) throw error;
  return data ?? [];
}
export const getStructures = unstable_cache(_getStructures, ["structures"], { tags: ["structures"], revalidate: 3600 });

async function _getClients() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("Client").select("*").order("client_name");
  if (error) throw error;
  return data ?? [];
}
export const getClients = unstable_cache(_getClients, ["clients"], { tags: ["clients"], revalidate: 3600 });

async function _getMixedCodes() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("Mixed Code").select("*").order("mixcode");
  if (error) throw error;
  return data ?? [];
}
export const getMixedCodes = unstable_cache(_getMixedCodes, ["mixcodes"], { tags: ["mixcodes"], revalidate: 3600 });

async function _getConcreteWorks() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("Concrete Works").select("*").order("concrete_work");
  if (error) throw error;
  return data ?? [];
}
export const getConcreteWorks = unstable_cache(_getConcreteWorks, ["concrete-works"], { tags: ["concrete-works"], revalidate: 3600 });

async function _getProfiles() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("profiles").select("*").order("fname");
  if (error) throw error;
  return data ?? [];
}
export const getProfiles = unstable_cache(_getProfiles, ["profiles"], { tags: ["profiles"], revalidate: 3600 });

async function _getJobs() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("Jobs").select("*").order("job_name");
  if (error) throw error;
  return data ?? [];
}
export const getJobs = unstable_cache(_getJobs, ["jobs"], { tags: ["jobs"], revalidate: 3600 });

async function _getABCCodes() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("ABC Code").select("*").order("full_abc");
  if (error) throw error;
  return data ?? [];
}
export const getABCCodes = unstable_cache(_getABCCodes, ["abc-codes"], { tags: ["abc-codes"], revalidate: 3600 });

async function _getWBSCodes() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("WBS Code").select("*").order("full_wbs");
  if (error) throw error;
  return data ?? [];
}
export const getWBSCodes = unstable_cache(_getWBSCodes, ["wbs-codes"], { tags: ["wbs-codes"], revalidate: 3600 });

async function _getCompressionMachines() {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase.from("Compression Machine").select("*").order("machine");
  if (error) throw error;
  return data ?? [];
}
export const getCompressionMachines = unstable_cache(_getCompressionMachines, ["compression-machines"], { tags: ["compression-machines"], revalidate: 3600 });

export type MixcodeVolume = {
  mixcode_id: number;
  volume_used: number;
};

async function _getVolumeByMixcode(): Promise<MixcodeVolume[]> {
  const supabase = createReadonlyClient();
  const { data, error } = await supabase
    .from("Request")
    .select("mixcode_id, volume_actual")
    .not("mixcode_id", "is", null)
    .not("volume_actual", "is", null);

  if (error) throw error;

  const map: Record<number, number> = {};
  for (const row of data ?? []) {
    if (row.mixcode_id == null || row.volume_actual == null) continue;
    map[row.mixcode_id] = (map[row.mixcode_id] ?? 0) + row.volume_actual;
  }

  return Object.entries(map).map(([id, vol]) => ({
    mixcode_id: Number(id),
    volume_used: vol,
  }));
}

export const getVolumeByMixcode = unstable_cache(
  _getVolumeByMixcode,
  ["mixcode-volumes"],
  { tags: ["requests", "mixcodes"], revalidate: 60 }
);
