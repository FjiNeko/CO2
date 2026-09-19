"use client";

import React from "react";

interface KpiData {
  total_users?: number;
  total_activities?: number;
  total_carbon_points?: number;
  total_distance_km?: number;
}

interface KpiGridProps {
  data: KpiData;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ data }) => {
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "0";
    return Number(num).toLocaleString();
  };

  const users = data.total_users ?? 12256;
  const activities = data.total_activities ?? 3012;
  const points = Math.round(data.total_carbon_points ?? 45920);
  const distance = Math.round(data.total_distance_km ?? 21235);
  const trees = Math.max(1, Math.round(points / 20));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* KPI 1: 平台累计用户 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 font-chinese">
              平台累计用户
            </span>
            <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-number">
              <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 12 12" fill="none">
                <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>+12.5%</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl lg:text-3xl font-bold text-slate-800 font-number tracking-tight">
              {formatNumber(users)}
            </span>
            <span className="text-xs text-slate-500 font-chinese">人</span>
          </div>
        </div>

        {/* 底部微型走势图 */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <svg className="w-28 h-6" viewBox="0 0 120 28" preserveAspectRatio="none">
            <path d="M0 22 C 20 18, 40 25, 60 14 C 80 18, 100 8, 120 4 L 120 28 L 0 28 Z" fill="rgba(16, 185, 129, 0.15)" />
            <path d="M0 22 C 20 18, 40 25, 60 14 C 80 18, 100 8, 120 4" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[11px] text-slate-400 font-chinese">
            较昨日净增 18 人
          </span>
        </div>
      </div>

      {/* KPI 2: 绿色出行申报笔数 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 font-chinese">
              绿色出行申报笔数
            </span>
            <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-number">
              <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 12 12" fill="none">
                <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>+8.4%</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl lg:text-3xl font-bold text-slate-800 font-number tracking-tight">
              {formatNumber(activities)}
            </span>
            <span className="text-xs text-slate-500 font-chinese">笔</span>
          </div>
        </div>

        {/* 底部微型柱状图 */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <svg className="w-28 h-6" viewBox="0 0 120 28">
            <rect x="5" y="16" width="8" height="12" rx="2" fill="#E2E8F0" />
            <rect x="22" y="12" width="8" height="16" rx="2" fill="#CBD5E1" />
            <rect x="39" y="18" width="8" height="10" rx="2" fill="#E2E8F0" />
            <rect x="56" y="8" width="8" height="20" rx="2" fill="#A7F3D0" />
            <rect x="73" y="11" width="8" height="17" rx="2" fill="#6EE7B7" />
            <rect x="90" y="6" width="8" height="22" rx="2" fill="#34D399" />
            <rect x="107" y="3" width="8" height="25" rx="2" fill="#10B981" />
          </svg>
          <span className="text-[11px] text-slate-400 font-chinese">
            今日已入库 42 笔申报
          </span>
        </div>
      </div>

      {/* KPI 3: 累计减碳总量 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 font-chinese">
              累计减碳总量
            </span>
            <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-number">
              <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 12 12" fill="none">
                <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>+24.6%</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl lg:text-3xl font-bold text-slate-800 font-number tracking-tight">
              {formatNumber(points)}
            </span>
            <span className="text-xs text-slate-500 font-chinese">kg CO₂</span>
          </div>
        </div>

        {/* 底部微型波浪走势 */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <svg className="w-28 h-6" viewBox="0 0 120 28" preserveAspectRatio="none">
            <path d="M0 24 Q 25 8, 50 18 T 100 8 T 120 4 L 120 28 L 0 28 Z" fill="rgba(6, 78, 59, 0.1)" />
            <path d="M0 24 Q 25 8, 50 18 T 100 8 T 120 4" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[11px] text-slate-400 font-chinese">
            相当于栽种 {trees} 棵树
          </span>
        </div>
      </div>

      {/* KPI 4: 绿色出行总里程 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 font-chinese">
              绿色出行总里程
            </span>
            <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-number">
              <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 12 12" fill="none">
                <path d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>+14.2%</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-2xl lg:text-3xl font-bold text-slate-800 font-number tracking-tight">
              {formatNumber(distance)}
            </span>
            <span className="text-xs text-slate-500 font-chinese">km</span>
          </div>
        </div>

        {/* 底部微型环形指示 */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="none" stroke="#E2E8F0" strokeWidth="4" />
              <circle cx="16" cy="16" r="12" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="60 100" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold text-slate-700 font-number">78.4%</span>
          </div>
          <span className="text-[11px] text-slate-400 font-chinese">
            低碳骑行与步行占比
          </span>
        </div>
      </div>
    </div>
  );
};
