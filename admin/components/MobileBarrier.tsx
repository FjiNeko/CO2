"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface MobileBarrierProps {
  screenWidth: number;
}

export const MobileBarrier: React.FC<MobileBarrierProps> = ({ screenWidth }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    router.replace("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 text-center flex flex-col items-center">
        {/* 电脑视口保护矢量 SVG 图标 */}
        <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
          <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none">
            <rect x="6" y="8" width="52" height="36" rx="4" fill="#E6F7F0" stroke="#10B981" strokeWidth="3" />
            <path d="M6 36H58" stroke="#10B981" strokeWidth="2.5" />
            <path d="M26 44L22 56H42L38 44" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="56" x2="48" y2="56" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="40" r="1.5" fill="#10B981" />
            <path d="M14 28L24 20L34 26L48 14" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="48" cy="14" r="3" fill="#F59E0B" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-3 font-chinese">
          请使用电脑浏览器进入管理后台
        </h2>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-medium mb-4">
          <svg className="w-4 h-4 text-amber-600" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L2 3.5V7.5C2 11.5 8 15 8 15C8 15 14 11.5 14 7.5V3.5L8 1Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.4" />
            <path d="M8 5V8.5M8 11H8.01" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="font-chinese">管理员专属 · 宽屏桌面端视口保护</span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6 font-chinese">
          检测到当前屏幕宽度为 <span className="font-number font-bold text-emerald-600">{screenWidth}px</span>（移动端或窄屏视口）。为确保全平台碳减排大数据多维分析看板、未来趋势研判及场景分析的完整解析与交互体验，管理后台仅支持在 PC 电脑浏览器（分辨率宽度 ≥ 1024px）下操作。
        </p>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 font-medium transition-colors border border-slate-200"
        >
          <svg className="w-5 h-5 text-current" viewBox="0 0 20 20" fill="none">
            <path d="M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7M13 14L17 10M17 10L13 6M17 10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-chinese">退出当前登录</span>
        </button>
      </div>
    </div>
  );
};
