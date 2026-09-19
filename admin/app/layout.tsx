import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "低碳畅行 Cloud Data - 全平台碳减排大数据看板",
  description: "企业级绿色出行全域减碳大数据分析与未来趋势研判平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-brand-bg text-slate-800 antialiased selection:bg-brand-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}
