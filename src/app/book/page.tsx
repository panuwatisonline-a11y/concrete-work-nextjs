import {
  getClients,
  getLocations,
  getStructures,
  getConcreteWorks,
  getMixedCodes,
  getWBSCodes,
  getABCCodes,
} from "@/lib/supabase/queries";
import BookingForm from "./BookingForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "จองคอนกรีต | Concrete Works",
};

export default async function BookPage() {
  const [clients, locations, structures, concreteWorks, mixedCodes, wbsCodes, abcCodes] =
    await Promise.all([
      getClients(),
      getLocations(),
      getStructures(),
      getConcreteWorks(),
      getMixedCodes(),
      getWBSCodes(),
      getABCCodes(),
    ]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-md mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 leading-none group-hover:text-orange-500 transition">
                Concrete Works
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">ระบบจัดการคำขอเทคอนกรีต</p>
            </div>
          </Link>
          <span className="text-gray-300 mx-2">/</span>
          <span className="text-orange-500 text-sm font-medium">จองคอนกรีต</span>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">แบบฟอร์มจองคอนกรีต</h2>
          <p className="text-gray-500 text-sm mt-1">
            กรอกข้อมูลให้ครบถ้วน ฟิลด์ที่มี <span className="text-red-500">*</span> จำเป็นต้องระบุ
          </p>
        </div>

        <BookingForm
          clients={clients}
          locations={locations}
          structures={structures}
          concreteWorks={concreteWorks}
          mixedCodes={mixedCodes}
          wbsCodes={wbsCodes}
          abcCodes={abcCodes}
        />
      </div>
    </main>
  );
}
