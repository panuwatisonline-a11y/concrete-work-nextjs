"use server";

import { createClient } from "@/lib/supabase/server";

export type MixedCodeState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseForm(formData: FormData) {
  return {
    mixcode: (formData.get("mixcode") as string | null)?.trim() || null,
    supplier: (formData.get("supplier") as string | null)?.trim() || null,
    strength: formData.get("strength") ? Number(formData.get("strength")) : null,
    strength_type: (formData.get("strength_type") as string | null)?.trim() || null,
    slump: (formData.get("slump") as string | null)?.trim() || null,
    sample_type: (formData.get("sample_type") as string | null)?.trim() || null,
    qty: formData.get("qty") ? Number(formData.get("qty")) : null,
    structure_list: (formData.get("structure_list") as string | null)?.trim() || null,
  };
}

function validate(data: ReturnType<typeof parseForm>) {
  const fieldErrors: Record<string, string> = {};
  if (!data.mixcode) fieldErrors.mixcode = "กรุณาระบุ Mix Code";
  return fieldErrors;
}

export async function createMixedCode(
  _prevState: MixedCodeState,
  formData: FormData
): Promise<MixedCodeState> {
  const data = parseForm(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.from("Mixed Code").insert(data);
  if (error) return { error: `บันทึกไม่สำเร็จ: ${error.message}` };

  return { success: true };
}

export async function updateMixedCode(
  _prevState: MixedCodeState,
  formData: FormData
): Promise<MixedCodeState> {
  const id = Number(formData.get("id"));
  if (!id) return { error: "ไม่พบ ID" };

  const data = parseForm(formData);
  const fieldErrors = validate(data);
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.from("Mixed Code").update(data).eq("id", id);
  if (error) return { error: `แก้ไขไม่สำเร็จ: ${error.message}` };

  return { success: true };
}
