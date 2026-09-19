"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface TrendData {
  dates?: string[];
  points?: number[];
}

interface PredictionData {
  future_dates?: string[];
  future_points?: number[];
  model_confidence?: number | string;
  growth_trend?: string;
}

interface TrendChartProps {
  trend?: TrendData;
  prediction?: PredictionData;
}

export const TrendChart: React.FC<TrendChartProps> = ({ trend, prediction }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const historyDates = trend?.dates && trend.dates.length > 0
      ? trend.dates
      : ["09-13", "09-14", "09-15", "09-16", "09-17", "09-18", "09-19"];

    const historyPoints = trend?.points && trend.points.length > 0
      ? trend.points
      : [120, 180, 240, 310, 390, 480, 560];

    const futureDates = prediction?.future_dates && prediction.future_dates.length > 0
      ? prediction.future_dates
      : ["09-20", "09-21", "09-22", "09-23", "09-24", "09-25", "09-26"];

    const futurePoints = prediction?.future_points && prediction.future_points.length > 0
      ? prediction.future_points
      : [630, 710, 790, 875, 960, 1050, 1140];

    const allDates = [...historyDates, ...futureDates];
    const lastHistoryVal = historyPoints.length > 0 ? historyPoints[historyPoints.length - 1] : 0;
    const predictSeries = [
      ...new Array(Math.max(0, historyPoints.length - 1)).fill(null),
      lastHistoryVal,
      ...futurePoints,
    ];

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(6, 78, 59, 0.95)",
        borderColor: "#10B981",
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: "#FFFFFF", fontSize: 13 },
        axisPointer: {
          lineStyle: { color: "#10B981", type: "dashed" },
        },
      },
      legend: {
        data: ["实际减碳走势", "未来预测趋势"],
        top: 0,
        right: 10,
        icon: "circle",
        textStyle: { color: "#064E3B", fontSize: 12, fontWeight: "bold" },
      },
      grid: { left: "3%", right: "4%", bottom: "6%", top: "15%", containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: allDates,
        axisLine: { lineStyle: { color: "#E2E8F0" } },
        axisLabel: { color: "#64748B", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#F1F5F9", type: "dashed" } },
        axisLabel: { color: "#64748B", fontSize: 11 },
      },
      series: [
        {
          name: "实际减碳走势",
          type: "line",
          smooth: true,
          data: historyPoints,
          symbolSize: 6,
          itemStyle: { color: "#10B981" },
          lineStyle: { width: 3.2, color: "#10B981" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(16, 185, 129, 0.35)" },
              { offset: 1, color: "rgba(16, 185, 129, 0.02)" },
            ]),
          },
        },
        {
          name: "未来预测趋势",
          type: "line",
          smooth: true,
          data: predictSeries,
          symbolSize: 6,
          lineStyle: { type: "dashed", width: 2.8, color: "#F59E0B" },
          itemStyle: { color: "#F59E0B" },
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
  }, [trend, prediction]);

  const confidence = prediction?.model_confidence ?? "0.89";

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      {/* 头部标题与研判状态 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M3 3V21H21" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />
              <path d="M19 9L14 14L10 10L4 16" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 font-chinese">
              碳积分走势与未来趋势预测 (未来 7 天)
            </h2>
            <p className="text-xs text-slate-400 font-chinese">
              实线为历史实际减碳走势 · 虚线为未来趋势研判
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold font-number border border-emerald-200/60">
            TREND FORECAST
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
            <span className="font-chinese">可靠度：</span>
            <span className="font-number font-bold text-emerald-600">{confidence}</span>
          </div>
        </div>
      </div>

      {/* ECharts 容器 */}
      <div ref={chartRef} className="w-full h-80"></div>
    </div>
  );
};
