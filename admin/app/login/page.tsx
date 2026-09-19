"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("testuser");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("请输入管理员账号与密码");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await fetch(`${API_BASE_URL}/v5/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || "登录认证失败");
      }

      if (data.role !== "admin") {
        throw new Error("权限不足：该系统仅限系统管理员访问，普通居民账号请使用移动端");
      }

      // 存储管理员凭据
      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("admin_role", data.role);
      localStorage.setItem("admin_username", username);

      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "登录请求异常，请检查网络或后端服务");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAdmin = () => {
    setUsername("testuser");
    setPassword("123456");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900/90 relative overflow-hidden px-4">
      {/* 背景装饰光斑与几何网格 */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-800/30 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 relative z-10">
        {/* 头部品牌 Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 8V16M12 16C12 14 14 13 16 13M12 16C12 14 10 13 8 13" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 font-chinese tracking-tight">
            低碳畅行 Cloud Data
          </h1>
          <p className="text-xs text-slate-400 font-number tracking-widest mt-1">
            ENTERPRISE MANAGEMENT CONSOLE
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-chinese">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>管理后台认证网关 · 宽屏桌面端专属</span>
          </div>
        </div>

        {/* 错误提示 */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2 font-chinese">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" />
              <path d="M10 6V11M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-chinese">
              管理员账号标识
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3 18C3 14.6863 6.13401 12 10 12C13.866 12 17 14.6863 17 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入管理员账号"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-chinese"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-chinese">
              登录安全密码
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M7 9V6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入安全密码"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-chinese"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 快捷测试账号填入 */}
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={fillQuickAdmin}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-chinese flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>快捷填入：testuser / 123456</span>
            </button>
            <span className="text-[11px] text-slate-400 font-chinese">默认管理员凭据</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 font-chinese"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3013 3 18.1884 4.77814 19.7545 7.42909M21 3V8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>身份认证中...</span>
              </>
            ) : (
              <span>进入管理控制台</span>
            )}
          </button>
        </form>

        {/* 底部免责与环境标识 */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 font-chinese">
          安全通信网关已接入 · 访问行为全程审计
        </div>
      </div>
    </div>
  );
}
