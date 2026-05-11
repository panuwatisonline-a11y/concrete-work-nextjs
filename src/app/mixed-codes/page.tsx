import Link from "next/link";
import { getMixedCodes, getVolumeByMixcode, getStructures } from "@/lib/supabase/queries";
import type { MixedCode, MixcodeVolume, Structure } from "@/lib/supabase/queries";
import TabNav from "@/components/TabNav";
import { AddMixedCodeButton, EditMixedCodeButton } from "./MixedCodeActions";
import { AppLogo, BtnPrimary, Card, PlusIcon } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mixed Code | Concrete Works",
};

type MixedCodeWithVolume = MixedCode & {
  volume_used: number;
  volume_remaining: number | null;
};

function fmt(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function VolumeBar({ used, total }: { used: number; total: number | null }) {
  if (total == null || total <= 0) return null;
  const pct = Math.min(Math.round((used / total) * 100), 100);
  const overused = used > total;
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-1">
      <div
        className={`h-full rounded-full transition-all ${overused ? "bg-red-500" : pct > 80 ? "bg-amber-400" : "bg-orange-400"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function MixedCodeRow({ mc, structures }: { mc: MixedCodeWithVolume; structures: Structure[] }) {
  const hasQty = mc.qty != null && mc.qty > 0;
  return (
    <tr className="hover:bg-[--border-subtle] transition-colors group">
      <td className="px-4 py-2.5 font-mono text-xs font-medium text-[--accent] whitespace-nowrap">{mc.mixcode ?? "-"}</td>
      <td className="px-4 py-2.5 text-xs text-[--text-muted] whitespace-nowrap">{mc.supplier ?? "-"}</td>
      <td className="px-4 py-2.5 text-xs text-[--text-2] whitespace-nowrap">{mc.strength != null ? `${mc.strength} ${mc.strength_type ?? ""}` : "-"}</td>
      <td className="px-4 py-2.5 text-xs text-[--text-2] whitespace-nowrap">{mc.slump ?? "-"}</td>
      <td className="px-4 py-2.5 text-xs text-right tabular-nums text-[--text-2] whitespace-nowrap">{hasQty ? fmt(mc.qty!) : "-"}</td>
      <td className="px-4 py-2.5 text-xs text-right tabular-nums text-[--text-2] whitespace-nowrap">{mc.volume_used > 0 ? fmt(mc.volume_used) : "-"}</td>
      <td className="px-4 py-2.5 text-xs text-right tabular-nums whitespace-nowrap">
        {hasQty ? <span className={mc.volume_remaining! < 0 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>{fmt(mc.volume_remaining!)}</span> : "-"}
      </td>
      <td className="px-4 py-2.5 w-28">
        {hasQty && (
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
              <span>{Math.min(Math.round((mc.volume_used / mc.qty!) * 100), 100)}%</span>
            </div>
            <VolumeBar used={mc.volume_used} total={mc.qty} />
          </div>
        )}
      </td>
      <td className="px-3 py-2.5 whitespace-nowrap">
        <EditMixedCodeButton mc={mc} structures={structures} />
      </td>
    </tr>
  );
}

function MixedCodeCard({ mc, structures }: { mc: MixedCodeWithVolume; structures: Structure[] }) {
  const hasQty = mc.qty != null && mc.qty > 0;
  const pct = hasQty ? Math.min(Math.round((mc.volume_used / mc.qty!) * 100), 100) : 0;

  return (
    <div className="bg-[--surface] border border-[--border] rounded-[--radius] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-medium text-[--accent]">
          {mc.mixcode ?? "-"}
        </span>
        <div className="flex items-center gap-2">
          {mc.supplier && (
            <span className="text-xs text-[--text-faint] bg-[--border-subtle] px-2 py-0.5 rounded-full border border-[--border]">
              {mc.supplier}
            </span>
          )}
          <EditMixedCodeButton mc={mc} structures={structures} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div>
          <span className="text-gray-400">กำลัง</span>
          <span className="ml-1.5 text-gray-700">
            {mc.strength != null ? `${mc.strength} ${mc.strength_type ?? ""}` : "-"}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Slump</span>
          <span className="ml-1.5 text-gray-700">{mc.slump ?? "-"}</span>
        </div>
      </div>

      {hasQty && (
        <div className="space-y-1.5 pt-1 border-t border-gray-100">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">ปริมาณทั้งหมด</span>
            <span className="tabular-nums text-gray-700">{fmt(mc.qty!)} m³</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">เทไปแล้ว</span>
            <span className="tabular-nums text-gray-700">{mc.volume_used > 0 ? fmt(mc.volume_used) : "0.00"} m³</span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-600">คงเหลือ</span>
            <span className={`tabular-nums ${mc.volume_remaining! < 0 ? "text-red-600" : "text-green-700"}`}>
              {fmt(mc.volume_remaining!)} m³
            </span>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
              <span>0</span>
              <span>{pct}% used</span>
            </div>
            <VolumeBar used={mc.volume_used} total={mc.qty} />
          </div>
        </div>
      )}

      {!hasQty && mc.volume_used > 0 && (
        <div className="flex justify-between text-xs pt-1 border-t border-gray-100">
          <span className="text-gray-500">เทไปแล้ว</span>
          <span className="tabular-nums text-gray-700">{fmt(mc.volume_used)} m³</span>
        </div>
      )}
    </div>
  );
}

export default async function MixedCodesPage() {
  const [mixedCodes, volumes, structures] = await Promise.all([
    getMixedCodes(),
    getVolumeByMixcode(),
    getStructures(),
  ]);

  const volumeMap: Record<number, MixcodeVolume> = {};
  for (const v of volumes) {
    volumeMap[v.mixcode_id] = v;
  }

  const data: MixedCodeWithVolume[] = mixedCodes.map((mc) => {
    const used = volumeMap[mc.id]?.volume_used ?? 0;
    const remaining = mc.qty != null ? mc.qty - used : null;
    return { ...mc, volume_used: used, volume_remaining: remaining };
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-[--border] bg-[--surface] sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <AppLogo />
          <BtnPrimary href="/book"><PlusIcon />จองคอนกรีต</BtnPrimary>
        </div>
        <TabNav active="mixed-codes" />
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Mixed Code</h2>
            <span className="text-gray-400 text-xs">{data.length.toLocaleString()} รายการ</span>
          </div>
          <AddMixedCodeButton structures={structures} />
        </div>

        {data.length === 0 ? (
          <Card className="py-16 text-center">
            <p className="text-sm text-[--text-faint]">ไม่พบข้อมูล Mixed Code</p>
          </Card>
        ) : (
          <>
            <div className="md:hidden space-y-2">
              {data.map((mc) => <MixedCodeCard key={mc.id} mc={mc} structures={structures} />)}
            </div>
            <div className="hidden md:block bg-[--surface] border border-[--border] rounded-[--radius] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[--border] bg-[--bg]">
                      {["Mix Code","Supplier","กำลัง","Slump","ปริมาณ (m³)","เทแล้ว (m³)","คงเหลือ (m³)","การใช้งาน",""].map((h, i) => (
                        <th key={i} className={`px-4 py-2.5 text-[10px] font-semibold text-[--text-faint] uppercase tracking-widest whitespace-nowrap ${i >= 4 && i <= 6 ? "text-right" : ""} ${i === 7 ? "w-28" : ""} ${i === 8 ? "w-10" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--border-subtle]">
                    {data.map((mc) => <MixedCodeRow key={mc.id} mc={mc} structures={structures} />)}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
