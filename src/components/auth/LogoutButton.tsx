"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BtnPrimary } from "@/components/ui";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoading(false);
    router.refresh();
    router.push("/");
  }

  return (
    <BtnPrimary type="button" onClick={onLogout} disabled={loading} className="text-xs">
      {loading ? "กำลังออก…" : "ออกจากระบบ"}
    </BtnPrimary>
  );
}
