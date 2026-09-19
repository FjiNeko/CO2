"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  adminUsername: string;
  isSyncing: boolean;
  isRefreshing: boolean;
  onTriggerSpider: () => void;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  adminUsername,
  isSyncing,
  isRefreshing,
  onTriggerSpider,
  onRefresh,
}) => {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("确定要退出管理后台吗？")) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_role");
      localStorage.removeItem("admin_username");
      router.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between shadow-sm">
      {/* 左侧：品牌 Logo 与面包屑导航 */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 8V16M12 16C12 14 14 13 16 13M12 16C12 14 10 13 8 13" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-slate-800 tracking-tight font-chinese flex items-center gap-2">
              低碳畅行 Cloud Data
            </div>
            <div className="text-[10px] font-semibold text-slate-400 tracking-widest font-number">
              BIG DATA ANALYTICS PLATFORM
            </div>
          </div>
        </div>

        {/* 分隔线与面包屑 */}
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-500">
          <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 6.5L8 2L13.5 6.5V13.5H9.5V9.5H6.5V13.5H2.5V6.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-chinese">数据可视化</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-emerald-700 font-chinese">大数据看板</span>
        </div>
      </div>

      {/* 右侧：引擎状态指示、爬虫调度、刷新、用户卡片与登出 */}
      <div className="flex items-center gap-3">
        {/* 引擎运行状态胶囊 */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium font-chinese">智能分析引擎在线 · 云端数据实时连通</span>
        </div>

        {/* 启动因子爬虫按钮 */}
        <button
          onClick={onTriggerSpider}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200 transition-colors disabled:opacity-60"
        >
          <svg className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3013 3 18.1884 4.77814 19.7545 7.42909M21 3V8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-chinese">{isSyncing ? "爬虫调度中..." : "启动因子爬虫"}</span>
        </button>

        {/* 刷新看板按钮 */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
        >
          <svg className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none">
            <path d="M4 4V9H9M20 20V15H15M20 9C18.7 5.6 15.6 3.2 12 3.2C7.1 3.2 3.2 7.1 3.2 12M4 15C5.3 18.4 8.4 20.8 12 20.8C16.9 20.8 20.8 16.9 20.8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-chinese">刷新看板</span>
        </button>

        {/* 管理员账号身份徽章 */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold font-number shadow-sm">
            {adminUsername ? adminUsername.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 font-chinese">
              {adminUsername || "系统管理员"}
            </div>
            <div className="text-[10px] text-emerald-600 font-number font-medium">
              ROLE_ADMIN
            </div>
          </div>
        </div>

        {/* 退出登录 */}
        <button
          onClick={handleLogout}
          title="退出登录"
          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
            <path d="M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7M13 14L17 10M17 10L13 6M17 10H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
};
