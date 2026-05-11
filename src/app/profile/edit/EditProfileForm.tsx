"use client";

import { useActionState } from "react";
import { updateProfile, type UpdateProfileState } from "@/app/actions/profile";

type Job = { id: number; job_name: string | null };

type Props = {
  initialData: {
    fname: string | null;
    lname: string | null;
    employee_id: string | null;
    phone: string | null;
    role: string | null;
    job: number | null;
  };
  jobs: Job[];
};

const initialState: UpdateProfileState = {};

export default function EditProfileForm({ initialData, jobs }: Props) {
  const [state, action, isPending] = useActionState(updateProfile, initialState);

  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="fname"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            ชื่อ
          </label>
          <input
            id="fname"
            name="fname"
            type="text"
            defaultValue={initialData.fname ?? ""}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="lname"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            นามสกุล
          </label>
          <input
            id="lname"
            name="lname"
            type="text"
            defaultValue={initialData.lname ?? ""}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="employee_id"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          รหัสพนักงาน
        </label>
        <input
          id="employee_id"
          name="employee_id"
          type="text"
          defaultValue={initialData.employee_id ?? ""}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          เบอร์โทรศัพท์
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={initialData.phone ?? ""}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          ตำแหน่ง
        </label>
        <input
          id="role"
          name="role"
          type="text"
          defaultValue={initialData.role ?? ""}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="job"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          โครงการ
        </label>
        <select
          id="job"
          name="job"
          defaultValue={initialData.job ?? ""}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        >
          <option value="" className="text-slate-500">
            -- ไม่ระบุโครงการ --
          </option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id} className="bg-slate-800">
              {j.job_name}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          บันทึกข้อมูลเรียบร้อยแล้ว
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
      >
        {isPending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
      </button>
    </form>
  );
}
