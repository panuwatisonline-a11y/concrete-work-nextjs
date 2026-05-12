import { getMixedCodes, getVolumeByMixcode } from "@/lib/supabase/queries";
import type { MixedCode, MixcodeVolume } from "@/lib/supabase/queries";
import TabNav from "@/components/TabNav";
import { AddMixedCodeButton, EditMixedCodeButton } from "./MixedCodeActions";
import { AppLogo, Card } from "@/components/ui";
import BottomNav from "@/components/BottomNav";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mixed Code | Concrete Works" };

type MC = MixedCode & { volume_used: number; volume_remaining: number | null };

function fmt(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function UsageBar({ used, total }: { used: number; total: number | null }) {
  if (!total || total <= 0) return null;
  const pct = Math.min(Math.round((used / total) * 100), 100);
  const over = used > total;
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px] text-zinc-400">
        <span>{pct}%</span>
        <span>{fmt(total)} m³</span>
      </div>
      <div className="w-full bg-zinc-50 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${over ? "bg-red-400" : pct > 80 ? "bg-amber-400" : "bg-orange-400"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* Mobile card */
function MCCard({ mc }: { mc: MC }) {
  const hasQty = mc.qty != null && mc.qty > 0;
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-orange-500">{mc.mixcode ?? "—"}</span>
        <div className="flex items-center gap-2">
          {mc.supplier && <span className="text-xs text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">{mc.supplier}</span>}
          <EditMixedCodeButton mc={mc} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div><span className="text-zinc-400">กำลัง </span><span className="text-zinc-700">{mc.strength != null ? `${mc.strength} ${mc.strength_type ?? ""}` : "—"}</span></div>
        <div><span className="text-zinc-400">Slump </span><span className="text-zinc-700">{mc.slump ?? "—"}</span></div>
        <div><span className="text-zinc-400">ตัวอย่าง </span><span className="text-zinc-700">{mc.sample_type ?? "—"}</span></div>
      </div>
      {hasQty && (
        <div className="pt-2 border-t border-zinc-100 space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["ปริมาณ", fmt(mc.qty!), "text-zinc-700"], ["เทแล้ว", fmt(mc.volume_used), "text-zinc-700"], ["คงเหลือ", fmt(mc.volume_remaining!), mc.volume_remaining! < 0 ? "text-red-500 font-semibold" : "text-emerald-600 font-semibold"]].map(([label, val, cls]) => (
              <div key={label}>
                <p className="text-[9px] uppercase tracking-widest text-zinc-400">{label}</p>
                <p className={`text-xs tabular-nums ${cls}`}>{val}</p>
              </div>
            ))}
          </div>
          <UsageBar used={mc.volume_used} total={mc.qty} />
        </div>
      )}
    </Card>
  );
}

/* Desktop table row */
function MCRow({ mc }: { mc: MC }) {
  const hasQty = mc.qty != null && mc.qty > 0;
  return (
    <tr className="border-b border-zinc-100 hover:bg-zinc-50 motion-safe:transition-colors motion-safe:duration-150">
      <td className="px-4 py-3 font-mono text-xs font-semibold text-orange-500 whitespace-nowrap">{mc.mixcode ?? "—"}</td>
      <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">{mc.supplier ?? "—"}</td>
      <td className="px-4 py-3 text-xs text-zinc-700 whitespace-nowrap">{mc.strength != null ? `${mc.strength} ${mc.strength_type ?? ""}` : "—"}</td>
      <td className="px-4 py-3 text-xs text-zinc-700 whitespace-nowrap">{mc.slump ?? "—"}</td>
      <td className="px-4 py-3 text-xs text-right tabular-nums text-zinc-700">{hasQty ? fmt(mc.qty!) : "—"}</td>
      <td className="px-4 py-3 text-xs text-right tabular-nums text-zinc-700">{mc.volume_used > 0 ? fmt(mc.volume_used) : "—"}</td>
      <td className="px-4 py-3 text-xs text-right tabular-nums whitespace-nowrap">
        {hasQty ? <span className={mc.volume_remaining! < 0 ? "text-red-500 font-semibold" : "text-emerald-600 font-semibold"}>{fmt(mc.volume_remaining!)}</span> : "—"}
      </td>
      <td className="px-4 py-3 w-32">
        {hasQty && <UsageBar used={mc.volume_used} total={mc.qty} />}
      </td>
      <td className="px-3 py-3"><EditMixedCodeButton mc={mc} /></td>
    </tr>
  );
}

export default async function MixedCodesPage() {
  const [mixedCodes, volumes] = await Promise.all([getMixedCodes(), getVolumeByMixcode()]);

  const volMap: Record<number, number> = {};
  for (const v of volumes) volMap[v.mixcode_id] = v.volume_used;

  const data: MC[] = mixedCodes.map((mc) => {
    const used = volMap[mc.id] ?? 0;
    return { ...mc, volume_used: used, volume_remaining: mc.qty != null ? mc.qty - used : null };
  });

  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Top header */}
      <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <AppLogo />
          </div>
          <AddMixedCodeButton />
        </div>
      </header>

      {/* Tab nav */}
      <TabNav active="mixed-codes" />

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:pb-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Mixed Code</p>
          <span className="text-xs text-zinc-400">{data.length} รายการ</span>
        </div>

        {data.length === 0 ? (
          <Card className="py-16 text-center">
            <p className="text-zinc-400 text-sm">ไม่พบข้อมูล Mixed Code</p>
          </Card>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden space-y-2 stagger-rise">
              {data.map((mc) => <MCCard key={mc.id} mc={mc} />)}
            </div>

            {/* Desktop */}
            <div className="hidden md:block bg-white border border-zinc-200 rounded-xl overflow-hidden motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-md hover:shadow-zinc-900/[0.04]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                      {["Mix Code","Supplier","กำลัง","Slump","ปริมาณ (m³)","เทแล้ว (m³)","คงเหลือ (m³)","การใช้งาน",""].map((h, i) => (
                        <th key={i} className={`px-4 py-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest whitespace-nowrap ${i >= 4 && i <= 6 ? "text-right" : ""} ${i === 7 ? "w-32" : ""} ${i === 8 ? "w-10" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="stagger-rise">
                    {data.map((mc) => <MCRow key={mc.id} mc={mc} />)}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
