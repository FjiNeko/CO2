"use client";

import React from "react";

interface SidebarProps {
  currentSection: string;
  onSectionClick: (sectionId: string) => void;
  onTriggerSpider: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSectionClick,
  onTriggerSpider,
}) => {
  const menuGroups = [
    {
      groupTitle: "数据可视化与分析",
      items: [
        {
          id: "overviewSection",
          name: "大数据核心指标",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
            </svg>
          ),
        },
        {
          id: "trendSection",
          name: "减碳走势与智能预测",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M19 9L14 14L10 10L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ),
        },
        {
          id: "distributionSection",
          name: "出行场景减碳拓扑",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 12A10 10 0 0 0 12 2V12H22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          ),
        },
      ],
    },
    {
      groupTitle: "统计分析与调度中心",
      items: [
        {
          id: "samplesSection",
          name: "高贡献减碳样本分析",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M4 10H20M10 4V20" stroke="currentColor" strokeWidth="2" />
            </svg>
          ),
        },
        {
          id: "metricsSection",
          name: "减碳效能与统计分析",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ),
        },
        {
          id: "spiderTrigger",
          name: "政务爬虫调度中心",
          onClick: onTriggerSpider,
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3013 3 18.1884 4.77814 19.7545 7.42909M21 3V8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between py-6 px-4">
      {/* 菜单组 */}
      <div className="space-y-6">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 px-3 tracking-wider font-chinese mb-2">
              {group.groupTitle}
            </div>
            {group.items.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      onSectionClick(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-semibold shadow-sm border border-emerald-200/50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? "text-emerald-600" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span className="font-chinese">{item.name}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 侧边栏底部版本标识 */}
      <div className="pt-6 border-t border-slate-100 px-2 text-center">
        <div className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-500 font-number mb-1.5">
          ENTERPRISE v4.0 · CLOUD ADMIN
        </div>
        <p className="text-[11px] text-slate-400 font-chinese">
          绿色消费账户大数据平台 · 管理中心
        </p>
      </div>
    </aside>
  );
};
