"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface DistributionItem {
  name: string;
  value: number;
}

interface DistributionChartProps {
  distribution?: DistributionItem[];
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ distribution }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const sceneMap: Record<string, string> = {
    bus: "公共汽车",
    subway: "城市轨道",
    bicycle: "绿色骑行",
    walking: "低碳步行",
  };

  const colors = ["#10B981", "#064E3B", "#F59E0B", "#3B82F6", "#8B5CF6"];

  const rawData = distribution && distribution.length > 0
    ? distribution
    : [
        { name: "bus", value: 450 },
        { name: "subway", value: 890 },
        { name: "bicycle", value: 1280 },
      ];

  const pieData = rawData.map((d) => ({
    name: sceneMap[d.name] || d.name,
    value: d.value,
  }));

  const totalVal = pieData.reduce((acc, cur) => acc + cur.value, 0);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(6, 78, 59, 0.95)",
        borderColor: "#10B981",
        borderWidth: 1,
        textStyle: { color: "#FFFFFF", fontSize: 13 },
        formatter: "{b}: {c} kg ({d}%)",
      },
      color: colors,
      series: [
        {
          name: "减碳贡献",
          type: "pie",
          radius: ["50%", "72%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: "#FFFFFF",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "center",
            formatter: () => `{val|${totalVal.toLocaleString()}}\n{txt|总减碳(kg)}`,
            rich: {
              val: {
                fontSize: 18,
                fontWeight: "bold",
                color: "#064E3B",
                lineHeight: 26,
              },
              txt: {
                fontSize: 11,
                color: "#64748B",
              },
            },
          },
          labelLine: { show: false },
          data: pieData,
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [distribution, totalVal]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      {/* 头部标题 */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 12A10 10 0 0 0 12 2V12H22Z" fill="#DEF7EC" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 font-chinese">
            出行场景贡献占比
          </h2>
          <p className="text-xs text-slate-400 font-chinese">
            全网减碳场景多维分布拓扑
          </p>
        </div>
      </div>

      {/* ECharts 环形图 */}
      <div ref={chartRef} className="w-full h-56"></div>

      {/* 场景分布自定义图例 */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {pieData.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors[idx % colors.length] }}
              ></span>
              <span className="text-slate-600 font-chinese">{item.name}</span>
            </div>
            <span className="font-number font-semibold text-slate-800">
              {item.value.toLocaleString()} kg
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
