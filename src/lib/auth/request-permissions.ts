/** สิทธิ์คำขอ — ใช้ได้ทั้งฝั่งเซิร์ฟเวอร์และคอมโพเนนต์ลูกค้า (ไม่มี "use server") */

export function normRole(role: string | null | undefined): string {
  return (role ?? "").trim().toLowerCase();
}

export function isAdminRole(role: string | null | undefined): boolean {
  return normRole(role) === "admin";
}

export function canEditOrCancelPendingRequest(opts: {
  viewerUserId: string;
  viewerRole: string | null | undefined;
  bookedByUserId: string | null | undefined;
}): boolean {
  if (isAdminRole(opts.viewerRole)) return true;
  if (!opts.bookedByUserId) return false;
  return opts.bookedByUserId === opts.viewerUserId;
}

/** รับรอง / ปฏิเสธคำขอที่รอตรวจ — ปัจจุบันจำกัดเฉพาะ role admin (ตั้งค่าในตาราง profiles.role) */
export function canInspectPendingRequest(viewerRole: string | null | undefined): boolean {
  return isAdminRole(viewerRole);
}
