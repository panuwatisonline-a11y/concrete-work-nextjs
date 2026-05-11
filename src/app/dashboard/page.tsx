import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
function getStatusClasses(statusName: string | null): string {
  const s = (statusName ?? "").toLowerCase();
  if (s.includes("อนุมัติ") || s.includes("approv"))
    return "bg-green-500/10 border border-green-500/30 text-green-400";
  if (s.includes("ยืนยัน") || s.includes("confirm"))
    return "bg-blue-500/10 border border-blue-500/30 text-blue-400";
  if (s.includes("จอง") || s.includes("book"))
    return "bg-orange-500/10 border border-orange-500/30 text-orange-400";
  if (s.includes("ตรวจ") || s.includes("inspect"))
    return "bg-purple-500/10 border border-purple-500/30 text-purple-400";
  if (s.includes("ปฏิเสธ") || s.includes("reject"))
    return "bg-red-500/10 border border-red-500/30 text-red-400";
  if (s.includes("ยกเลิก") || s.includes("cancel"))
    return "bg-slate-700/50 border border-slate-600 text-slate-400";
  if (s.includes("เลื่อน") || s.includes("postpone"))
    return "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400";
  if (s.includes("รอ") || s.includes("pending") || s.includes("submit"))
    return "bg-amber-500/10 border border-amber-500/30 text-amber-400";
  return "bg-slate-700/30 border border-slate-600 text-slate-300";
}

function getStatusDotClass(statusName: string | null): string {
  const s = (statusName ?? "").toLowerCase();
  if (s.includes("อนุมัติ") || s.includes("approv")) return "bg-green-400";
  if (s.includes("ยืนยัน") || s.includes("confirm")) return "bg-blue-400";
  if (s.includes("จอง") || s.includes("book")) return "bg-orange-400";
  if (s.includes("ตรวจ") || s.includes("inspect")) return "bg-purple-400";
  if (s.includes("ปฏิเสธ") || s.includes("reject")) return "bg-red-400";
  if (s.includes("ยกเลิก") || s.includes("cancel")) return "bg-slate-500";
  if (s.includes("เลื่อน") || s.includes("postpone")) return "bg-yellow-400";
  if (s.includes("รอ") || s.includes("pending") || s.includes("submit")) return "bg-amber-400";
  return "bg-slate-500";
}

function formatThaiDate(date: string | null): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function formatTime(time: string | null): string {
  if (!time) return "-";
  return time.slice(0, 5);
}

function StatusBadge({ name }: { name: string | null }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusClasses(name)}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDotClass(name)}`} />
      {name ?? "ไม่ระบุ"}
    </span>
  );
}

function StatCard({
  label,
  count,
  statusName,
}: {
  label: string;
  count: number;
  statusName?: string | null;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className="text-slate-400 text-xs mb-2 truncate">{label}</p>
      <p className="text-2xl font-bold text-white">{count}</p>
      {statusName !== undefined && (
        <div className="mt-2">
          <StatusBadge name={statusName} />
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { status: filterStatus } = await searchParams;

  const [{ data: allRequests }, { data: profile }] = await Promise.all([
    supabase
      .from("Request_View")
      .select(
        "id, request_date, request_time, client_name, full_location, concrete_work, structure_name, structure_no, volume_request, status_name, status_id, created_at"
      )
      .order("request_date", { ascending: false })
      .order("request_time", { ascending: false }),
    supabase.from("profiles").select("fname, lname").eq("id", user.id).single(),
  ]);

  const requests = allRequests ?? [];

  // Build status counts
  const statusCountMap = new Map<string, number>();
  for (const r of requests) {
    const name = r.status_name ?? "ไม่ระบุ";
    statusCountMap.set(name, (statusCountMap.get(name) ?? 0) + 1);
  }
  const statusList = Array.from(statusCountMap.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  // Filter requests for table display
  const displayRequests = filterStatus
    ? requests.filter((r) => r.status_name === filterStatus)
    : requests;

  const displayName =
    [profile?.fname, profile?.lname].filter(Boolean).join(" ") || null;

  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-white text-sm">
              CW
            </div>
            <span className="font-semibold text-white tracking-wide hidden sm:block">
              Concrete Works
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {displayName && (
              <span className="text-slate-400 text-sm hidden sm:block">
                {displayName}
              </span>
            )}
            <Link
              href="/profile"
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
            >
              โปรไฟล์
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                งานจองคอนกรีต
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                ภาพรวมคำขอเทคอนกรีตทั้งหมด — แสดง {displayRequests.length}{" "}
                รายการ
              </p>
            </div>
          </div>

          {/* Summary stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <StatCard label="ทั้งหมด" count={requests.length} />
            {statusList.slice(0, 4).map(([name, count]) => (
              <StatCard key={name} label={name} count={count} statusName={name} />
            ))}
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link
              href="/dashboard"
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                !filterStatus
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
              }`}
            >
              ทั้งหมด ({requests.length})
            </Link>
            {statusList.map(([name, count]) => (
              <Link
                key={name}
                href={`/dashboard?status=${encodeURIComponent(name)}`}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  filterStatus === name
                    ? "bg-slate-700 border-slate-500 text-white"
                    : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(name)}`}
                />
                {name} ({count})
              </Link>
            ))}
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {displayRequests.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-slate-500 text-sm">ไม่มีข้อมูลคำขอ</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                        วันที่
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                        เวลา
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap hidden md:table-cell">
                        ผู้รับเหมา
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                        สถานที่
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                        ประเภทงาน
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        โครงสร้าง
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                        ปริมาณ (ม³)
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                        สถานะ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {displayRequests.map((r) => (
                      <tr
                        key={r.id ?? Math.random()}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {formatThaiDate(r.request_date)}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono text-xs">
                          {formatTime(r.request_time)}
                        </td>
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap hidden md:table-cell max-w-[160px] truncate">
                          {r.client_name ?? (
                            <span className="text-slate-600 italic">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 hidden lg:table-cell max-w-[200px]">
                          <span className="block truncate" title={r.full_location ?? ""}>
                            {r.full_location ?? (
                              <span className="text-slate-600 italic">-</span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap max-w-[150px]">
                          <span className="block truncate" title={r.concrete_work ?? ""}>
                            {r.concrete_work ?? (
                              <span className="text-slate-600 italic">-</span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 hidden sm:table-cell whitespace-nowrap">
                          {[r.structure_name, r.structure_no]
                            .filter(Boolean)
                            .join(" / ") || (
                            <span className="text-slate-600 italic">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300 font-mono hidden sm:table-cell whitespace-nowrap">
                          {r.volume_request != null ? (
                            r.volume_request.toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          ) : (
                            <span className="text-slate-600 italic">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge name={r.status_name} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table footer */}
            {displayRequests.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
                แสดง {displayRequests.length} รายการ
                {filterStatus && ` · กรองตามสถานะ: ${filterStatus}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
