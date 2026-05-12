import { getStructures } from "@/lib/supabase/queries";
import MixedCodeForm from "../MixedCodeForm";
import { MixedCodesFormShell } from "../MixedCodesFormShell";

export const dynamic = "force-dynamic";
export const metadata = { title: "เพิ่ม Mix Code | Concrete Works" };

export default async function NewMixedCodePage() {
  const structures = await getStructures();

  return (
    <MixedCodesFormShell
      badge="เพิ่ม Mix Code"
      heading="แบบฟอร์มเพิ่ม Mix Code"
      hint={
        <>
          ฟิลด์ที่มี <span className="text-orange-500 font-medium">*</span> จำเป็นต้องระบุ
        </>
      }
    >
      <MixedCodeForm mode="create" structures={structures} />
    </MixedCodesFormShell>
  );
}
