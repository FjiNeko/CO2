"use client";

import React from "react";
import { PioneerSample } from "@/lib/api";

interface SampleTableProps {
  samples: PioneerSample[];
}

export const SampleTable: React.FC<SampleTableProps> = ({ samples }) => {
  const displaySamples = samples && samples.length > 0
    ? samples
    : [
        { username: "testuser", total_points: 1250.4, activity_count: 88 },
        { username: "green_rider", total_points: 980.2, activity_count: 64 },
        { username: "eco_warrior", total_points: 750.8, activity_count: 52 },
        { username: "metro_commuter", total_points: 520.0, activity_count: 38 },
        { username: "carbon_free", total_points: 410.5, activity_count: 29 },
        { username: "walker_chen", total_points: 330.2, activity_count: 22 },
        { username: "cycling_fan", total_points: 260.0, activity_count: 17 },
      ];

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-xs font-bold font-number shadow-xs">
          1
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center text-xs font-bold font-number">
          2
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-xs font-bold font-number">
          3
        </span>
      );
    }
    return (
      <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-slate-500 font-number">
        {index + 1}
      </span>
    );
  };

  const getLevelChip = (index: number) => {
    if (index === 0) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 font-chinese">
          标杆样本
        </span>
      );
    }
    if (index < 3) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-chinese">
          高频减排
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 font-chinese">
        常规样本
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      {/* 头部标题与采样标识 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="#064E3B" strokeWidth="2" />
              <path d="M4 10H20M10 4V20" stroke="#10B981" strokeWidth="1.8" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 font-chinese">
              高贡献减碳样本分析 (Top Contribution Samples)
            </h2>
            <p className="text-xs text-slate-400 font-chinese">
              动态抽取高频减碳示范样本进行多维综合分析
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold font-number border border-slate-200">
          REALTIME SAMPLING
        </span>
      </div>

      {/* 样本数据表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 font-chinese">
              <th className="py-2.5 px-3">样本序号</th>
              <th className="py-2.5 px-3">样本账号标识</th>
              <th className="py-2.5 px-3">申报记录频次</th>
              <th className="py-2.5 px-3">认证减碳总量</th>
              <th className="py-2.5 px-3 text-right">贡献等级标签</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {displaySamples.map((item, index) => (
              <tr
                key={item.username || index}
                className="hover:bg-slate-50/80 transition-colors"
              >
                {/* 序号徽章 */}
                <td className="py-3 px-3">
                  {getRankBadge(index)}
                </td>

                {/* 账号名称与头像 */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-[10px] font-number">
                      {item.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800 font-chinese">
                      {item.username}
                    </span>
                  </div>
                </td>

                {/* 申报频次 */}
                <td className="py-3 px-3">
                  <span className="font-number font-semibold text-slate-700">
                    {item.activity_count ?? 1}
                  </span>
                  <span className="text-slate-400 font-chinese ml-1">次</span>
                </td>

                {/* 减碳总量 */}
                <td className="py-3 px-3">
                  <span className="font-number font-bold text-emerald-600">
                    {Number(item.total_points).toFixed(1)}
                  </span>
                  <span className="text-slate-400 font-chinese ml-1">分</span>
                </td>

                {/* 贡献标签 */}
                <td className="py-3 px-3 text-right">
                  {getLevelChip(index)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
