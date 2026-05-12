import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BookingForm, { type BookingEditDefaults } from "@/app/book/BookingForm";
import { AppLogo } from "@/components/ui";
import { canEditOrCancelPendingRequest } from "@/lib/auth/request-permissions";
import {
  formatRemarksForDisplay,
  parseCastingTimeFromRemarks,
  parseStructurePickFromRemarks,
} from "@/lib/request-format";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/readonly";
import type { RequestView } from "@/lib/supabase/queries";
import {
  getABCCodes,
  getClients,
  getConcreteWorks,
  getLocations,
  getMixedCodeById,
  getMixedCodes,
  getRequestById,
  getVolumeByMixcode,
  getWBSCodes,
} from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";
export const metadata = { title: "แก้ไขคำขอ | Concrete Works" };

/** วันที่ปฏิทินใน Asia/Bangkok + n วัน → YYYY-MM-DD */
function bangkokYMDPlusDays(days: number): string {
  const ymd = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  const [y, m, d] = ymd.split("-").map((n) => Number(n));
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

function buildEditDefaults(req: RequestView, mixedSupplier: string): BookingEditDefaults | null {
  const id = req.id;
  if (!id) return null;
  const structurePick =
    (req.structure_name?.trim() || parseStructurePickFromRemarks(req.remarks)) ?? "";
  const castingTime = parseCastingTimeFromRemarks(req.remarks) ?? "09:00";
  return {
    id,
    request_date: req.request_date,
    request_time: req.request_time,
    concrete_work_id: String(req.concrete_work_id ?? ""),
    structure_pick: structurePick,
    strength: String(req.strength ?? ""),
    supplier: mixedSupplier.trim(),
    mixcode_id: String(req.mixcode_id ?? ""),
    casting_date: req.casting_date ?? "",
    casting_time: castingTime,
    client_id: String(req.client_id ?? ""),
    location_id: String(req.location_id ?? ""),
    structure_no: req.structure_no ?? "",
    wbs_code_id: req.wbs_code_id != null ? String(req.wbs_code_id) : "",
    abc_code_id: req.abc_code_id != null ? String(req.abc_code_id) : "",
    volume_dwg: req.volume_dwg != null ? String(req.volume_dwg) : "",
    volume_request: req.volume_request != null ? String(req.volume_request) : "",
    sample_qty: req.sample_qty != null ? String(req.sample_qty) : "9",
    remarksUser: formatRemarksForDisplay(req.remarks) ?? "",
  };
}

export default async function RequestEditPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const req = await getRequestById(id).catch(() => null);
  if (!req) notFound();

  if (req.status_id !== 1) {
    redirect(`/requests/${id}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, fname, lname, phone, client_id")
    .eq("id", user.id)
    .maybeSingle();

  if (
    !canEditOrCancelPendingRequest({
      viewerUserId: user.id,
      viewerRole: profile?.role ?? null,
      bookedByUserId: req.booked_by,
    })
  ) {
    redirect(`/requests/${id}`);
  }

  const mixed = req.mixcode_id != null ? await getMixedCodeById(req.mixcode_id) : null;
  const mixedSupplier = (mixed?.supplier ?? "").trim();

  const editDefaults = buildEditDefaults(req, mixedSupplier);
  if (!editDefaults) notFound();

  const [
    clients,
    locations,
    concreteWorks,
    mixedCodes,
    wbsCodes,
    abcCodes,
    volRows,
  ] = await Promise.all([
    getClients(),
    getLocations(),
    getConcreteWorks(),
    getMixedCodes(),
    getWBSCodes(),
    getABCCodes(),
    getVolumeByMixcode(),
  ]);

  const volumeUsedByMixcode = Object.fromEntries(volRows.map((r) => [r.mixcode_id, r.volume_used]));
  if (req.mixcode_id != null && req.volume_request != null) {
    const mid = req.mixcode_id;
    const cur = volumeUsedByMixcode[mid] ?? 0;
    volumeUsedByMixcode[mid] = Math.max(0, cur - Number(req.volume_request));
  }

  const fullName = [profile?.fname, profile?.lname].filter(Boolean).join(" ").trim();
  const requester = {
    fullName: fullName || "—",
    phone: profile?.phone?.trim() ? profile.phone.trim() : null,
  };

  const profileClientId = profile?.client_id ?? null;
  const defaultClientId =
    profileClientId != null && clients.some((c) => c.id === profileClientId) ? profileClientId : null;

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/requests/${id}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-50 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] shrink-0"
          >
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <AppLogo />
          <span className="text-zinc-300 text-sm">/</span>
          <span className="text-xs font-medium text-orange-500">แก้ไขคำขอ</span>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-6 space-y-5">
        <div>
          <h1 className="text-base font-semibold text-zinc-900">แก้ไขรายละเอียดคำขอ</h1>
          <p className="text-xs text-zinc-400 mt-1">
            แก้ไขได้เฉพาะคำขอที่ยังอยู่ในสถานะรอตรวจสอบ — สิทธิ์เฉพาะผู้จองหรือแอดมิน
          </p>
        </div>
        <BookingForm
          key={id}
          clients={clients}
          defaultClientId={defaultClientId}
          locations={locations}
          concreteWorks={concreteWorks}
          mixedCodes={mixedCodes}
          wbsCodes={wbsCodes}
          abcCodes={abcCodes}
          volumeUsedByMixcode={volumeUsedByMixcode}
          defaultCastingDate={bangkokYMDPlusDays(2)}
          requester={requester}
          editRequest={editDefaults}
        />
      </div>
    </main>
  );
}
