import { notFound } from "next/navigation";
import { getMixedCodeById, getStructures } from "@/lib/supabase/queries";
import MixedCodeForm from "../../MixedCodeForm";
import { MixedCodesFormShell } from "../../MixedCodesFormShell";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `แก้ไข Mix Code #${id} | Concrete Works` };
}

export default async function EditMixedCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const [mc, structures] = await Promise.all([getMixedCodeById(id), getStructures()]);
  if (!mc) notFound();

  return (
    <MixedCodesFormShell
      badge="แก้ไข Mix Code"
      heading={`แก้ไข Mix Code — ${mc.mixcode ?? `#${mc.id}`}`}
      hint={
        <>
          ฟิลด์ที่มี <span className="text-orange-500 font-medium">*</span> จำเป็นต้องระบุ
        </>
      }
    >
      <MixedCodeForm mode="edit" initial={mc} structures={structures} />
    </MixedCodesFormShell>
  );
}
