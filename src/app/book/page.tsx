import {
  getClients,
  getLocations,
  getConcreteWorks,
  getMixedCodes,
  getWBSCodes,
  getABCCodes,
  getVolumeByMixcode,
} from "@/lib/supabase/queries";
import BookingForm from "./BookingForm";
import Link from "next/link";
import { AppLogo } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "จองคอนกรีต | Concrete Works" };

/** วันที่ปฏิทินใน Asia/Bangkok + n วัน → YYYY-MM-DD */
function bangkokYMDPlusDays(days: number): string {
  const ymd = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  const [y, m, d] = ymd.split("-").map((n) => Number(n));
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

export default async function BookPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, clients, locations, concreteWorks, mixedCodes, wbsCodes, abcCodes, volRows] =
    await Promise.all([
      user
        ? supabase.from("profiles").select("fname, lname, phone, client_id").eq("id", user.id).maybeSingle()
        : Promise.resolve({ data: null as null }),
      getClients(),
      getLocations(),
      getConcreteWorks(),
      getMixedCodes(),
      getWBSCodes(),
      getABCCodes(),
      getVolumeByMixcode(),
    ]);

  let requester: { fullName: string; phone: string | null } | null = null;
  let profileClientId: number | null = null;
  if (user) {
    const fullName = [profile?.fname, profile?.lname].filter(Boolean).join(" ").trim();
    requester = {
      fullName: fullName || "—",
      phone: profile?.phone?.trim() ? profile.phone.trim() : null,
    };
    profileClientId = profile?.client_id ?? null;
  }

  const volumeUsedByMixcode = Object.fromEntries(volRows.map((r) => [r.mixcode_id, r.volume_used]));
  const defaultCastingDate = bangkokYMDPlusDays(2);
  const defaultClientId =
    profileClientId != null && clients.some((c) => c.id === profileClientId) ? profileClientId : null;

  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-50 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] shrink-0">
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <AppLogo />
          <span className="text-zinc-300 text-sm">/</span>
          <span className="text-xs font-medium text-orange-500">จองคอนกรีต</span>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-6 space-y-5">
        <div>
          <h1 className="text-base font-semibold text-zinc-900">แบบฟอร์มจองคอนกรีต</h1>
          <p className="text-xs text-zinc-400 mt-1">ฟิลด์ที่มี <span className="text-orange-500 font-medium">*</span> จำเป็นต้องระบุ</p>
        </div>
        <BookingForm
          clients={clients}
          defaultClientId={defaultClientId}
          locations={locations}
          concreteWorks={concreteWorks}
          mixedCodes={mixedCodes}
          wbsCodes={wbsCodes}
          abcCodes={abcCodes}
          volumeUsedByMixcode={volumeUsedByMixcode}
          defaultCastingDate={defaultCastingDate}
          requester={requester}
        />
      </div>
    </main>
  );
}
