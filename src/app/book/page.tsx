import { getClients, getLocations, getStructures, getConcreteWorks, getMixedCodes, getWBSCodes, getABCCodes } from "@/lib/supabase/queries";
import BookingForm from "./BookingForm";
import Link from "next/link";
import { AppLogo } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = { title: "จองคอนกรีต | Concrete Works" };

export default async function BookPage() {
  const [clients, locations, structures, concreteWorks, mixedCodes, wbsCodes, abcCodes] =
    await Promise.all([getClients(), getLocations(), getStructures(), getConcreteWorks(), getMixedCodes(), getWBSCodes(), getABCCodes()]);

  return (
    <main className="min-h-screen">
      <header className="border-b border-[--border] bg-[--surface] sticky top-0 z-10">
        <div className="max-w-screen-md mx-auto px-4 h-12 flex items-center gap-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-[--radius-sm] hover:bg-[--border-subtle] transition shrink-0">
            <svg className="w-4 h-4 text-[--text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <AppLogo />
          <span className="text-[--text-faint] text-xs">/</span>
          <span className="text-xs text-[--accent] font-medium">จองคอนกรีต</span>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-[--text]">แบบฟอร์มจองคอนกรีต</h2>
          <p className="text-xs text-[--text-faint] mt-1">ฟิลด์ที่มี <span className="text-[--accent]">*</span> จำเป็นต้องระบุ</p>
        </div>
        <BookingForm clients={clients} locations={locations} structures={structures} concreteWorks={concreteWorks} mixedCodes={mixedCodes} wbsCodes={wbsCodes} abcCodes={abcCodes} />
      </div>
    </main>
  );
}
