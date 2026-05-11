import { getClients, getLocations, getStructures, getConcreteWorks, getMixedCodes, getWBSCodes, getABCCodes } from "@/lib/supabase/queries";
import BookingForm from "./BookingForm";
import Link from "next/link";
import { AppLogo } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "จองคอนกรีต | Concrete Works" };

export default async function BookPage() {
  const [clients, locations, structures, concreteWorks, mixedCodes, wbsCodes, abcCodes] = await Promise.all([
    getClients(), getLocations(), getStructures(), getConcreteWorks(), getMixedCodes(), getWBSCodes(), getABCCodes(),
  ]);

  return (
    <main className="min-h-screen bg-zinc-100">
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-screen-md mx-auto px-4 h-12 flex items-center gap-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition shrink-0">
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
          clients={clients} locations={locations} structures={structures}
          concreteWorks={concreteWorks} mixedCodes={mixedCodes}
          wbsCodes={wbsCodes} abcCodes={abcCodes}
        />
      </div>
    </main>
  );
}
