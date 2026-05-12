"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import {
  canEditOrCancelPendingRequest,
  canInspectPendingRequest,
} from "@/lib/auth/request-permissions";
import {
  acceptPendingRequest,
  approveInspectedRequest,
  cancelOpenRequest,
  completeConfirmedRequest,
  confirmApprovedRequest,
  postponeConfirmedRequest,
  rejectOpenRequest,
  resumePostponedRequest,
} from "@/app/requests/status-actions";

const btnBase =
  "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-[11px] font-semibold motion-safe:transition-colors motion-safe:duration-150 disabled:opacity-50 disabled:pointer-events-none";

const S_PENDING = 1;
const S_INSPECTED = 2;
const S_APPROVED = 3;
const S_CONFIRMED = 4;
const S_POSTPONED = 5;
const S_REJECTED = 6;
const S_CANCELLED = 7;
const S_COMPLETED = 8;

type DoubleConfirmState =
  | null
  | {
      step: 1 | 2;
      primaryMessage: string;
      onComplete: () => void;
    };

function canCancelForStatus(
  statusId: number,
  viewerUserId: string,
  viewerRole: string | null,
  bookedByUserId: string | null,
): boolean {
  if (![S_PENDING, S_INSPECTED, S_APPROVED, S_CONFIRMED, S_POSTPONED].includes(statusId)) return false;
  if (statusId === S_PENDING) {
    return canEditOrCancelPendingRequest({ viewerUserId, viewerRole, bookedByUserId });
  }
  if (canInspectPendingRequest(viewerRole)) return true;
  return bookedByUserId != null && bookedByUserId === viewerUserId;
}

export function RequestStatusOneActions({
  requestId,
  statusId,
  bookedByUserId,
  viewerUserId,
  viewerRole,
  layout = "wrap",
}: {
  requestId: string;
  statusId: number;
  bookedByUserId: string | null;
  viewerUserId: string;
  viewerRole: string | null;
  layout?: "wrap" | "row";
}) {
  const router = useRouter();
  const dialogTitleId = useId();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [postponeOpen, setPostponeOpen] = useState(false);
  const [postponeDate, setPostponeDate] = useState("");
  const [postponeTime, setPostponeTime] = useState("");
  const [postponeReason, setPostponeReason] = useState("");
  const [doubleConfirm, setDoubleConfirm] = useState<DoubleConfirmState>(null);

  const isAdmin = canInspectPendingRequest(viewerRole);
  const canCancel = canCancelForStatus(statusId, viewerUserId, viewerRole, bookedByUserId);
  const canEdit = statusId === S_PENDING && canEditOrCancelPendingRequest({ viewerUserId, viewerRole, bookedByUserId });

  function run(fn: () => Promise<{ ok?: true; error?: string }>) {
    startTransition(async () => {
      setError(null);
      const r = await fn();
      if (r.error) setError(r.error);
      else router.refresh();
    });
  }

  /** ยืนยัน 2 ขั้นใน UI (ไม่ใช้ window.confirm — บางเบราว์เซอร์ไม่แสดงหรือข้ามได้) */
  function openDoubleConfirm(primaryMessage: string, onComplete: () => void) {
    setDoubleConfirm({ step: 1, primaryMessage, onComplete });
  }

  function goEdit() {
    openDoubleConfirm(
      "ไปหน้าแก้ไขคำขอนี้? ข้อมูลที่ยังไม่บันทึกในหน้าอื่นจะไม่ถูกเก็บ",
      () => router.push(`/requests/${requestId}/edit`),
    );
  }

  function goDetail() {
    openDoubleConfirm("ไปหน้ารายละเอียดคำขอนี้?", () => router.push(`/requests/${requestId}`));
  }

  const confirmOverlay =
    doubleConfirm &&
    typeof document !== "undefined" &&
    createPortal(
      <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 sm:p-6" role="presentation">
        <button
          type="button"
          className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[1px] motion-safe:transition-opacity"
          aria-label="ปิด"
          onClick={() => setDoubleConfirm(null)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          className="relative z-[1] w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-900/15 pointer-events-auto"
        >
          <p id={dialogTitleId} className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            ยืนยันการดำเนินการ
          </p>
          <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
            {doubleConfirm.step === 1
              ? doubleConfirm.primaryMessage
              : "ยืนยันอีกครั้งก่อนดำเนินการ\n\nกด «ยืนยัน» เพื่อดำเนินการจริง หรือ «ยกเลิก» เพื่อปิด"}
          </p>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className={`${btnBase} border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50`}
              onClick={() => setDoubleConfirm(null)}
            >
              ยกเลิก
            </button>
            {doubleConfirm.step === 1 ? (
              <button
                type="button"
                className={`${btnBase} border border-orange-200 bg-orange-500 text-white hover:bg-orange-600`}
                onClick={() => setDoubleConfirm((c) => (c ? { ...c, step: 2 } : c))}
              >
                ถัดไป — ยืนยันขั้นที่ 2
              </button>
            ) : (
              <button
                type="button"
                className={`${btnBase} border border-orange-200 bg-orange-500 text-white hover:bg-orange-600`}
                onClick={() => {
                  const cb = doubleConfirm.onComplete;
                  setDoubleConfirm(null);
                  cb();
                }}
              >
                ยืนยัน
              </button>
            )}
          </div>
        </div>
      </div>,
      document.body,
    );

  const wrapCls = layout === "row" ? "flex flex-wrap items-center gap-2" : "space-y-2";

  if (statusId < 1 || statusId > S_COMPLETED) {
    return (
      <>
        {confirmOverlay}
        <div className={wrapCls}>
          {error && <p className="text-[11px] text-red-600 w-full">{error}</p>}
          <p className="text-[11px] text-zinc-400 w-full">ไม่ระบุสถานะในระบบ</p>
          <button
            type="button"
            disabled={pending}
            className={`${btnBase} border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50`}
            onClick={goDetail}
          >
            เปิดรายละเอียด
          </button>
        </div>
      </>
    );
  }

  if (statusId === S_REJECTED || statusId === S_CANCELLED || statusId === S_COMPLETED) {
    return (
      <>
        {confirmOverlay}
        <div className={wrapCls}>
          {error && <p className="text-[11px] text-red-600 w-full">{error}</p>}
          <p className="text-[11px] text-zinc-400 w-full">สถานะสุดทางแล้ว</p>
          <button
            type="button"
            disabled={pending}
            className={`${btnBase} border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50`}
            onClick={goDetail}
          >
            เปิดรายละเอียด
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {confirmOverlay}
      <div className={layout === "row" ? "flex flex-wrap items-center gap-2" : "space-y-2"}>
        {error && <p className="text-[11px] text-red-600 w-full">{error}</p>}

        <div className={`flex flex-wrap gap-2 ${layout === "row" ? "" : "pt-1"}`}>
          {statusId === S_PENDING && canEdit && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50`}
              onClick={goEdit}
            >
              แก้ไข
            </button>
          )}
          {statusId === S_PENDING && canCancel && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200/90`}
              onClick={() =>
                openDoubleConfirm(
                  "ยกเลิกคำขอนี้? สถานะจะเป็น «ยกเลิก» และไม่สามารถแก้ในขั้นตอนเดิมได้",
                  () => run(() => cancelOpenRequest(requestId)),
                )
              }
            >
              ยกเลิก
            </button>
          )}
          {statusId === S_PENDING && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100/90`}
              onClick={() =>
                openDoubleConfirm("รับรองคำขอนี้ (ตรวจสอบผ่าน) และเปลี่ยนเป็นสถานะถัดไป?", () =>
                  run(() => acceptPendingRequest(requestId)),
                )
              }
            >
              รับรอง
            </button>
          )}
          {statusId === S_PENDING && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100/90`}
              onClick={() =>
                openDoubleConfirm("เปิดฟอร์มปฏิเสธคำขอ?", () => {
                  setError(null);
                  setRejectOpen(true);
                })
              }
            >
              ปฏิเสธ
            </button>
          )}

          {statusId === S_INSPECTED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100/90`}
              onClick={() =>
                openDoubleConfirm("อนุมัติคำขอนี้และเลื่อนไปขั้นอนุมัติแล้ว?", () =>
                  run(() => approveInspectedRequest(requestId)),
                )
              }
            >
              อนุมัติ
            </button>
          )}
          {statusId === S_INSPECTED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100/90`}
              onClick={() =>
                openDoubleConfirm("เปิดฟอร์มปฏิเสธคำขอ?", () => {
                  setRejectOpen(true);
                })
              }
            >
              ปฏิเสธ
            </button>
          )}
          {statusId === S_INSPECTED && canCancel && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200/90`}
              onClick={() =>
                openDoubleConfirm("ยกเลิกคำขอนี้? สถานะจะเป็น «ยกเลิก»", () => run(() => cancelOpenRequest(requestId)))
              }
            >
              ยกเลิก
            </button>
          )}

          {statusId === S_APPROVED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100/90`}
              onClick={() =>
                openDoubleConfirm("ยืนยันรายการนี้และเลื่อนไปขั้นยืนยันแล้ว?", () =>
                  run(() => confirmApprovedRequest(requestId)),
                )
              }
            >
              ยืนยันรายการ
            </button>
          )}
          {statusId === S_APPROVED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100/90`}
              onClick={() =>
                openDoubleConfirm("เปิดฟอร์มปฏิเสธคำขอ?", () => {
                  setRejectOpen(true);
                })
              }
            >
              ปฏิเสธ
            </button>
          )}
          {statusId === S_APPROVED && canCancel && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200/90`}
              onClick={() =>
                openDoubleConfirm("ยกเลิกคำขอนี้? สถานะจะเป็น «ยกเลิก»", () => run(() => cancelOpenRequest(requestId)))
              }
            >
              ยกเลิก
            </button>
          )}

          {statusId === S_CONFIRMED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100/90`}
              onClick={() =>
                openDoubleConfirm("ปิดงาน / ทำเครื่องหมายว่าเสร็จสิ้น?", () =>
                  run(() => completeConfirmedRequest(requestId)),
                )
              }
            >
              เสร็จสิ้น
            </button>
          )}
          {statusId === S_CONFIRMED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100/90`}
              onClick={() =>
                openDoubleConfirm("เปิดฟอร์มเลื่อนวันเท?", () => {
                  setPostponeOpen(true);
                })
              }
            >
              เลื่อนวันเท
            </button>
          )}
          {statusId === S_CONFIRMED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100/90`}
              onClick={() =>
                openDoubleConfirm("เปิดฟอร์มปฏิเสธคำขอ?", () => {
                  setRejectOpen(true);
                })
              }
            >
              ปฏิเสธ
            </button>
          )}
          {statusId === S_CONFIRMED && canCancel && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200/90`}
              onClick={() =>
                openDoubleConfirm("ยกเลิกคำขอนี้? สถานะจะเป็น «ยกเลิก»", () => run(() => cancelOpenRequest(requestId)))
              }
            >
              ยกเลิก
            </button>
          )}

          {statusId === S_POSTPONED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100/90`}
              onClick={() =>
                openDoubleConfirm(
                  "นำคำขอกลับสู่สถานะ «ยืนยันรายการแล้ว» เพื่อดำเนินการต่อ?",
                  () => run(() => resumePostponedRequest(requestId)),
                )
              }
            >
              กลับดำเนินการ
            </button>
          )}
          {statusId === S_POSTPONED && isAdmin && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100/90`}
              onClick={() =>
                openDoubleConfirm("เปิดฟอร์มปฏิเสธคำขอ?", () => {
                  setRejectOpen(true);
                })
              }
            >
              ปฏิเสธ
            </button>
          )}
          {statusId === S_POSTPONED && canCancel && (
            <button
              type="button"
              disabled={pending}
              className={`${btnBase} border border-zinc-300 bg-zinc-100 text-zinc-700 hover:bg-zinc-200/90`}
              onClick={() =>
                openDoubleConfirm("ยกเลิกคำขอนี้? สถานะจะเป็น «ยกเลิก»", () => run(() => cancelOpenRequest(requestId)))
              }
            >
              ยกเลิก
            </button>
          )}
        </div>

        {rejectOpen && isAdmin && [S_PENDING, S_INSPECTED, S_APPROVED, S_CONFIRMED, S_POSTPONED].includes(statusId) && (
          <div className="rounded-lg border border-red-100 bg-red-50/50 p-3 space-y-2">
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-red-800/80">
              เหตุผลปฏิเสธ (ถ้ามี)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-red-100 bg-white px-3 py-2 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-300/60"
              placeholder="ระบุเหตุผล…"
            />
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                className={`${btnBase} border border-zinc-200 bg-white text-zinc-600`}
                onClick={() =>
                  openDoubleConfirm("ปิดฟอร์มปฏิเสธโดยไม่ส่งข้อมูล?", () => {
                    setRejectOpen(false);
                    setRejectReason("");
                  })
                }
              >
                ปิด
              </button>
              <button
                type="button"
                disabled={pending}
                className={`${btnBase} border border-red-300 bg-red-600 text-white hover:bg-red-700`}
                onClick={() =>
                  openDoubleConfirm("ยืนยันปฏิเสธคำขอนี้? สถานะจะเป็น «ปฏิเสธ»", () =>
                    run(async () => {
                      const r = await rejectOpenRequest(requestId, rejectReason.trim() || null);
                      if (r.ok) {
                        setRejectOpen(false);
                        setRejectReason("");
                      }
                      return r;
                    }),
                  )
                }
              >
                ยืนยันปฏิเสธ
              </button>
            </div>
          </div>
        )}

        {postponeOpen && isAdmin && statusId === S_CONFIRMED && (
          <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-3 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-900/80">เลื่อนวันเท</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-zinc-500 mb-0.5">วันที่เลื่อนเป็น *</label>
                <input
                  type="date"
                  value={postponeDate}
                  onChange={(e) => setPostponeDate(e.target.value)}
                  className="w-full rounded-lg border border-orange-100 bg-white px-3 py-2 text-xs text-zinc-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 mb-0.5">เวลา (ถ้ามี)</label>
                <input
                  type="time"
                  value={postponeTime}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="w-full rounded-lg border border-orange-100 bg-white px-3 py-2 text-xs text-zinc-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-0.5">เหตุผลเลื่อน</label>
              <textarea
                value={postponeReason}
                onChange={(e) => setPostponeReason(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-orange-100 bg-white px-3 py-2 text-xs text-zinc-800"
                placeholder="ระบุเหตุผล…"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                className={`${btnBase} border border-zinc-200 bg-white text-zinc-600`}
                onClick={() =>
                  openDoubleConfirm("ปิดฟอร์มเลื่อนวันเทโดยไม่บันทึก?", () => {
                    setPostponeOpen(false);
                    setPostponeDate("");
                    setPostponeTime("");
                    setPostponeReason("");
                  })
                }
              >
                ปิด
              </button>
              <button
                type="button"
                disabled={pending}
                className={`${btnBase} border border-orange-300 bg-orange-600 text-white hover:bg-orange-700`}
                onClick={() =>
                  openDoubleConfirm("ยืนยันเลื่อนวันเทตามที่ระบุ? สถานะจะเป็น «เลื่อนวันเท»", () =>
                    run(async () => {
                      const r = await postponeConfirmedRequest(
                        requestId,
                        postponeDate,
                        postponeTime.trim() || null,
                        postponeReason.trim() || null,
                      );
                      if (r.ok) {
                        setPostponeOpen(false);
                        setPostponeDate("");
                        setPostponeTime("");
                        setPostponeReason("");
                      }
                      return r;
                    }),
                  )
                }
              >
                ยืนยันเลื่อน
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
