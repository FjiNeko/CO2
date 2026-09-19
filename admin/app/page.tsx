"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { KpiGrid } from "@/components/KpiGrid";
import { TrendChart } from "@/components/TrendChart";
import { DistributionChart } from "@/components/DistributionChart";
import { SampleTable } from "@/components/SampleTable";
import { MetricsPanel } from "@/components/MetricsPanel";
import { MobileBarrier } from "@/components/MobileBarrier";
import {
  apiRequest,
  DashboardData,
  PredictionData,
  PioneerSample,
} from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();

  // 1. 认证与响应式状态
  const [mounted, setMounted] = useState(false);
  const [adminUsername, setAdminUsername] = useState("管理员");
  const [screenWidth, setScreenWidth] = useState(1280);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState("overviewSection");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  // 2. 数据状态
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [predictionData, setPredictionData] = useState<PredictionData>({});
  const [sampleList, setSampleList] = useState<PioneerSample[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg("");
    }, 3000);
  };

  // 3. 屏幕自适应检测
  useEffect(() => {
    setMounted(true);
    const checkWidth = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 1024);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // 4. 路由守卫：校验管理员登录凭证
  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem("admin_token");
    const role = localStorage.getItem("admin_role");
    const storedUsername = localStorage.getItem("admin_username");

    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }

    if (storedUsername) {
      setAdminUsername(storedUsername);
    }
  }, [mounted, router]);

  // 5. 数据拉取
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 拉取看板综合指标
      const dashRes = await apiRequest<{ code: number; data: DashboardData }>(
        "/api/v4/admin/dashboard"
      ).catch(() => null);

      if (dashRes && dashRes.data) {
        setDashboardData(dashRes.data);
      }

      // 拉取未来趋势研判预测
      const predRes = await apiRequest<{ code: number; data: PredictionData }>(
        "/api/v4/admin/predict_trend"
      ).catch(() => null);

      if (predRes && predRes.data) {
        setPredictionData(predRes.data);
      }

      // 拉取示范样本排行榜
      const rankRes = await apiRequest<{ code: number; data: PioneerSample[] }>(
        "/api/v4/rank/top"
      ).catch(() => null);

      if (rankRes && Array.isArray(rankRes.data)) {
        setSampleList(rankRes.data);
      }

      // 获取当前管理员信息
      const meRes = await apiRequest<{ user_info: { username: string } }>(
        "/api/v4/user/me"
      ).catch(() => null);

      if (meRes?.user_info?.username) {
        setAdminUsername(meRes.user_info.username);
      }
    } catch (e) {
      console.warn("数据同步或拉取提示:", e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted, fetchData]);

  // 6. 启动政务因子爬虫
  const handleTriggerSpider = async () => {
    setIsSyncing(true);
    try {
      const res = await apiRequest<{ code: number; message: string }>(
        "/api/v4/admin/trigger_spider",
        { method: "POST" }
      );
      showToast(res.message || "政务排放因子爬虫已成功分发调度");
    } catch (err: any) {
      showToast(err.message || "爬虫调度失败，请检查网络");
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
      }, 2500);
    }
  };

  // 7. 页面平滑滚动定位
  const scrollToSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const timeRanges = [
    { key: "today", label: "今日" },
    { key: "7d", label: "近 7 天" },
    { key: "30d", label: "近 30 天" },
    { key: "year", label: "全年" },
  ];

  const trendTag =
    predictionData?.growth_trend === "Increasing"
      ? "趋势研判：持续增长态势"
      : "趋势研判：平稳向好态势";

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {/* A. 移动端/窄屏拦截警示遮罩 (屏幕宽度 < 1024px 时严格阻断) */}
      {isMobile && <MobileBarrier screenWidth={screenWidth} />}

      {/* B. 桌面端全局头部 */}
      <Header
        adminUsername={adminUsername}
        isSyncing={isSyncing}
        isRefreshing={isRefreshing}
        onTriggerSpider={handleTriggerSpider}
        onRefresh={fetchData}
      />

      {/* 浮动 Toast 提示 */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-chinese shadow-lg flex items-center gap-2 animate-bounce">
          <svg className="w-4 h-4 text-emerald-300" viewBox="0 0 20 20" fill="none">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* C. 下部主体：左侧侧边栏 + 右侧大数据画布 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧模块侧边栏 */}
        <Sidebar
          currentSection={currentSection}
          onSectionClick={scrollToSection}
          onTriggerSpider={handleTriggerSpider}
        />

        {/* 右侧大数据内容主画布 */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 space-y-6">
          {/* 1. 画布顶部标题与时间范围选择 */}
          <div
            id="overviewSection"
            className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/60"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/60 font-chinese">
                  <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" fill="currentColor" />
                  </svg>
                  <span>实时全域计算</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium font-chinese border border-slate-200">
                  {trendTag}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 font-chinese tracking-tight">
                全平台碳减排大数据看板
              </h1>
              <p className="text-xs text-slate-500 font-chinese mt-0.5">
                实时聚合全平台绿色出行数据，全方位洞悉全网减碳足迹与未来趋势
              </p>
            </div>

            {/* 时间维度选择控件 */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {timeRanges.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedTimeRange(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-chinese ${
                    selectedTimeRange === t.key
                      ? "bg-white text-emerald-700 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 第一行：4 大核心指标 KPI 卡片组 */}
          <KpiGrid data={dashboardData.kpi || {}} />

          {/* 3. 第二行：双图表联动展示 (折线趋势研判预测 + 场景环形图) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div id="trendSection" className="lg:col-span-2">
              <TrendChart
                trend={dashboardData.trend}
                prediction={predictionData}
              />
            </div>
            <div id="distributionSection" className="lg:col-span-1">
              <DistributionChart distribution={dashboardData.distribution} />
            </div>
          </div>

          {/* 4. 第三行：高贡献减碳样本分析表格 + 算法统计监控面板 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div id="samplesSection" className="lg:col-span-2">
              <SampleTable samples={sampleList} />
            </div>
            <div id="metricsSection" className="lg:col-span-1">
              <MetricsPanel
                metrics={dashboardData.advanced_stats}
                modelConfidence={predictionData.model_confidence}
                isSyncing={isSyncing}
                onTriggerSpider={handleTriggerSpider}
              />
            </div>
          </div>

          {/* 底部留白 */}
          <div className="h-8"></div>
        </main>
      </div>
    </div>
  );
}
