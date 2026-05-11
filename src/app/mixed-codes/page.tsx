import Link from "next/link";
import { getMixedCodes } from "@/lib/supabase/queries";
import type { MixedCode } from "@/lib/supabase/queries";
import TabNav from "@/components/TabNav";

export const metadata = {
  title: "Mixed Code | Concrete Works",
};

function MixedCodeRow({ mc }: { mc: MixedCode }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 font-mono text-xs font-semibold text-orange-600 whitespace-nowrap">
        {mc.mixcode ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
        {mc.supplier ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap tabular-nums">
        {mc.strength != null ? (
          <span>
            {mc.strength} {mc.strength_type ?? ""}
          </span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
        {mc.slump ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
        {mc.sample_type ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap tabular-nums">
        {mc.qty ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
        {mc.structure_list ?? "-"}
      </td>
    </tr>
  );
}

function MixedCodeCard({ mc }: { mc: MixedCode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
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
          <span className="ml-1.5 text-gray-700 tabular-nums">
            {mc.strength != null ? `${mc.strength} ${mc.strength_type ?? ""}` : "-"}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Slump</span>
          <span className="ml-1.5 text-gray-700">{mc.slump ?? "-"}</span>
        </div>
        <div>
          <span className="text-gray-400">ตัวอย่าง</span>
          <span className="ml-1.5 text-gray-700">{mc.sample_type ?? "-"}</span>
        </div>
        <div>
          <span className="text-gray-400">จำนวน</span>
          <span className="ml-1.5 text-gray-700 tabular-nums">{mc.qty ?? "-"}</span>
        </div>
      </div>
      {mc.structure_list && (
        <div className="text-xs text-gray-400 leading-snug">
          <span className="text-gray-400">โครงสร้าง: </span>
          {mc.structure_list}
        </div>
      )}
    </div>
  );
}

export default async function MixedCodesPage() {
  const mixedCodes = await getMixedCodes();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
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
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Mixed Code
          </h2>
          <span className="text-gray-400 text-xs">{mixedCodes.length.toLocaleString()} รายการ</span>
        </div>

        {mixedCodes.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm shadow-sm">
            ไม่พบข้อมูล Mixed Code
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden space-y-2">
              {mixedCodes.map((mc) => (
                <MixedCodeCard key={mc.id} mc={mc} />
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Mix Code
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        กำลัง
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Slump
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ตัวอย่าง
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        จำนวน
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        โครงสร้าง
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mixedCodes.map((mc) => (
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
