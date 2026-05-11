"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type SignInState } from "@/app/actions/auth";

const initialState: SignInState = {};

export default function SignInForm() {
  const [state, action, isPending] = useActionState(signIn, initialState);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          อีเมล
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500 transition-colors"
        />
      </div>

      {state.error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
      >
        {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-sm text-slate-400">
        ยังไม่มีบัญชี?{" "}
        <Link
          href="/sign-up"
          className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
        >
          สมัครใช้งาน
        </Link>
      </p>
    </form>
  );
}
