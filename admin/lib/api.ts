export const API_BASE_URL = "http://127.0.0.1:8000";

export interface DashboardData {
  kpi?: {
    total_users?: number;
    total_activities?: number;
    total_carbon_points?: number;
    total_distance_km?: number;
  };
  trend?: {
    dates?: string[];
    points?: number[];
  };
  distribution?: Array<{
    name: string;
    value: number;
  }>;
  advanced_stats?: {
    avg_points_per_trip?: number;
    std_dev_points?: number;
    total_reduction_ratio?: number;
  };
}

export interface PredictionData {
  future_dates?: string[];
  future_points?: number[];
  model_confidence?: number | string;
  growth_trend?: string;
  historical_base?: number[];
}

export interface PioneerSample {
  username: string;
  total_points: number;
  activity_count?: number;
  avatar_url?: string;
}

// 辅助请求函数
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {}
    throw new Error(errorDetail);
  }

  return response.json();
}
