import Link from "next/link";
import { Card } from "@/components/ui";

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-6 text-center space-y-3">
        <h1 className="text-sm font-semibold text-zinc-800">ยืนยันลิงก์ไม่สำเร็จ</h1>
        <p className="text-xs text-zinc-500 leading-relaxed">ลิงก์หมดอายุหรือใช้ไม่ได้แล้ว ลองขอลิงก์ใหม่จากหน้าเข้าสู่ระบบ</p>
        <Link href="/" className="inline-block text-sm font-medium text-orange-600 hover:underline mt-2">
          กลับหน้าเข้าสู่ระบบ
        </Link>
      </Card>
    </main>
  );
}
