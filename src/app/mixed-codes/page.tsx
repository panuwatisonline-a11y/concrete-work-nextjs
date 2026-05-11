import Link from "next/link";
import { getMixedCodes, getVolumeByMixcode } from "@/lib/supabase/queries";
import type { MixedCode, MixcodeVolume } from "@/lib/supabase/queries";
import TabNav from "@/components/TabNav";

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

function MixedCodeRow({ mc }: { mc: MixedCodeWithVolume }) {
  const hasQty = mc.qty != null && mc.qty > 0;
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs font-semibold text-orange-600 whitespace-nowrap">
        {mc.mixcode ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
        {mc.supplier ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
        {mc.strength != null ? `${mc.strength} ${mc.strength_type ?? ""}` : "-"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
        {mc.slump ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs text-right tabular-nums text-gray-700 whitespace-nowrap">
        {hasQty ? fmt(mc.qty!) : "-"}
      </td>
      <td className="px-4 py-3 text-xs text-right tabular-nums text-gray-700 whitespace-nowrap">
        {mc.volume_used > 0 ? fmt(mc.volume_used) : "-"}
      </td>
      <td className="px-4 py-3 text-xs text-right tabular-nums whitespace-nowrap">
        {hasQty ? (
          <span className={mc.volume_remaining! < 0 ? "text-red-600 font-semibold" : "text-green-700 font-semibold"}>
            {fmt(mc.volume_remaining!)}
          </span>
        ) : "-"}
      </td>
      <td className="px-4 py-3 w-28">
        {hasQty && (
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
              <span>{Math.min(Math.round((mc.volume_used / mc.qty!) * 100), 100)}%</span>
            </div>
            <VolumeBar used={mc.volume_used} total={mc.qty} />
          </div>
        )}
      </td>
    </tr>
  );
}

function MixedCodeCard({ mc }: { mc: MixedCodeWithVolume }) {
  const hasQty = mc.qty != null && mc.qty > 0;
  const pct = hasQty ? Math.min(Math.round((mc.volume_used / mc.qty!) * 100), 100) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold text-orange-600">
          {mc.mixcode ?? "-"}
        </span>
        {mc.supplier && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {mc.supplier}
          </span>
        )}
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
  const [mixedCodes, volumes] = await Promise.all([
    getMixedCodes(),
    getVolumeByMixcode(),
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
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
              C
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 leading-none group-hover:text-orange-500 transition">
                Concrete Works
              </h1>
              <p className="text-gray-500 text-[10px] mt-0.5">ระบบจัดการคำขอเทคอนกรีต</p>
            </div>
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 active:scale-95 transition text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            จองคอนกรีต
          </Link>
        </div>
        <TabNav active="mixed-codes" />
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Mixed Code</h2>
          <span className="text-gray-400 text-xs">{data.length.toLocaleString()} รายการ</span>
        </div>

        {data.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm shadow-sm">
            ไม่พบข้อมูล Mixed Code
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden space-y-2">
              {data.map((mc) => (
                <MixedCodeCard key={mc.id} mc={mc} />
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mix Code</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">กำลัง</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slump</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">ปริมาณ (m³)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">เทแล้ว (m³)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">คงเหลือ (m³)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">การใช้งาน</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.map((mc) => (
                      <MixedCodeRow key={mc.id} mc={mc} />
                    ))}
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
