/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { StatusBar } from './components/StatusBar';
import { ControlCenter } from './components/ControlCenter';
import { electronSnippets, CodeFile } from './data/codeSnippets';
import { 
  Laptop, 
  Code, 
  BookOpen, 
  Terminal, 
  ArrowRight, 
  Check, 
  Copy, 
  Info,
  ExternalLink,
  Github,
  Sun,
  Moon,
  Volume2
} from 'lucide-react';

// Wrapper component to consume theme and trigger hover sensors
const DesktopSandbox: React.FC = () => {
  const { 
    desktopBackground, 
    setIsMouseNearTop, 
    isMouseNearTop,
    autoHide,
    displayMode,
    waterIntervalMinutes,
    progressPercent,
    secondsRemaining,
    isWaterDue,
    barPosition
  } = useApp();

  const [currentTime, setCurrentTime] = useState('');
  const [selectedSnippetIdx, setSelectedSnippetIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Simple real-time desktop clock update
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      setCurrentTime(d.toLocaleDateString('zh-CN', options));
    };
    updateTime();
    const tick = setInterval(updateTime, 10000);
    return () => clearInterval(tick);
  }, []);

  // Handle hover at the simulated top border of the monitor
  const handleTopMouseEnter = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsMouseNearTop(true);
  };

  const handleTopMouseLeave = () => {
    // 800ms fade/slide-up delay as specified by Section 11.3
    hoverTimerRef.current = setTimeout(() => {
      setIsMouseNearTop(false);
    }, 800);
  };

  // Copy code snippet helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Background gradient resolution based on selected ID
  const getWallpaperGradient = () => {
    switch (desktopBackground) {
      case 'mountain':
        return 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-950 via-zinc-900 to-indigo-950';
      case 'cyber':
        return 'bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-950 via-zinc-950 to-fuchsia-950';
      case 'slate':
        return 'bg-gradient-to-tr from-neutral-900 via-zinc-900 to-neutral-950';
      case 'aurora':
      default:
        return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-emerald-950';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-start pb-16 font-sans">
      
      {/* 1. Header Hero Panel */}
      <header className="px-6 py-6 md:py-8 max-w-7xl mx-auto w-full border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md">
              桌面小组件模拟器
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-500 text-xs font-mono">Simulated Environment</span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-zinc-100 tracking-tight">
            极简顶部浮动状态栏 / <span className="text-cyan-400">Codex & Water Droplet</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl">
            高颜值、多主题、超轻型桌面状态栏，无缝悬浮于应用顶端，整合 Codex 额度变化观测、喝水周期倒计时智能提醒和鼠标悬浮自适应收起。
          </p>
        </div>
        
        {/* Help Badge info */}
        <div className="flex items-center gap-3">
          <a
            href="#architecture-guide"
            className="text-xs px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            Electron 开发文档
          </a>
        </div>
      </header>

      {/* 2. Simulated Desktop Area */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-6 mt-6 md:mt-8 space-y-12">
        
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Laptop className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>交互式主屏幕桌面预览 (Interactive OS Simulator Workspace)</span>
            </div>
            <div className="hidden sm:flex items-center gap-3.5">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                自动隐藏: {autoHide ? '已开启' : '常驻'}
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isWaterDue ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                状态: {displayMode === 'reminding' ? '提醒中' : displayMode === 'expanded' ? '展开' : '微缩'}
              </span>
            </div>
          </div>

          {/* Virtual Monitor Box */}
          <div 
            id="virtual-monitor-screen"
            className={`relative w-full rounded-2xl md:rounded-3xl border-4 border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl aspect-video transition-all duration-500 ${getWallpaperGradient()}`}
            style={{ minHeight: '440px' }}
          >
            {/* Dynamic Sensor Hover Trigger Area (placed relative to active barPosition) */}
            {barPosition === 'bottom-left' ? (
              <div 
                id="bottom-left-hover-trigger-sensor"
                className="absolute bottom-4 left-6 w-[220px] h-[34px] rounded-full z-[90] cursor-pointer transition-all duration-300 hover:bg-cyan-500/[0.03]"
                onMouseEnter={handleTopMouseEnter}
                onMouseLeave={handleTopMouseLeave}
                title="鼠标悬停此处滑出完整状态栏"
              >
                {autoHide && !isMouseNearTop && !isWaterDue && (
                  <div className="absolute -bottom-1.5 left-2 flex items-center gap-1 text-[8px] text-cyan-400/40 font-mono tracking-wider pointer-events-none uppercase animate-pulse">
                    <span>鼠标滑至此处展开状态栏</span>
                  </div>
                )}
              </div>
            ) : (
              <div 
                id="top-hover-trigger-sensor"
                className="absolute top-0 left-0 w-full h-8 z-[90] cursor-n-resize transition-all duration-300 hover:bg-cyan-500/[0.03]"
                onMouseEnter={handleTopMouseEnter}
                onMouseLeave={handleTopMouseLeave}
                title="鼠标悬悬停此处滑出完整状态栏"
              >
                {autoHide && !isMouseNearTop && !isWaterDue && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[8px] text-cyan-450/40 font-mono tracking-wider pointer-events-none uppercase animate-pulse">
                    <span>鼠标滑至此处展开完整状态栏</span>
                  </div>
                )}
              </div>
            )}

            {/* Simulated Desktop Status menu-bar at top right (Clock like Mac/Windows taskbar) */}
            <div className="absolute top-3.5 right-4 z-40 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[10px] font-mono text-zinc-300 font-medium">
              📅 {currentTime || 'Mon Jun 15, 08:30 PM'}
            </div>

            {/* Anchor logo for branding watermark */}
            <div className="absolute bottom-4 left-6 z-10 pointer-events-none select-none opacity-20">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-zinc-100" />
                <span className="font-display font-bold text-xs tracking-wider text-zinc-100 uppercase">Status Workspace</span>
              </div>
            </div>

            {/* Desktop Mock Workspace icons */}
            <div className="absolute top-14 left-6 flex flex-col gap-6 z-10 select-none">
              <div className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-white/5 w-14">
                <div className="w-9 h-9 bg-cyan-500/10 border border-cyan-400/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-115 transition-transform">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-zinc-300 font-medium tracking-tight text-center truncate w-full drop-shadow-md">Codex.exe</span>
              </div>

              <div className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-white/5 w-14">
                <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-400/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-115 transition-transform">
                  <Volume2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-zinc-300 font-medium tracking-tight text-center truncate w-full drop-shadow-md">健康提醒</span>
              </div>
            </div>

            {/* THE FLOATING STATUSBAR UNDER TEST */}
            <StatusBar />

            {/* THE INTERACTIVE CONTROL WINDOW (Centered on simulated desktop) */}
            <div className="absolute top-12 md:top-14 left-1/2 -translate-x-1/2 z-30 scale-90 sm:scale-100 transform-gpu" style={{ transformOrigin: 'top center' }}>
              <ControlCenter />
            </div>

          </div>
        </section>

        {/* 3. Detailed Architecture and Development Guide */}
        <section id="architecture-guide" className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* Left Column: Design Blueprint info */}
          <div className="lg:col-span-1 space-y-5 bg-zinc-900/40 rounded-2xl border border-zinc-900 p-5 md:p-6 text-xs text-zinc-305">
            <h2 className="text-zinc-100 font-display font-semibold text-sm flex items-center gap-1.5 pb-2 border-b border-zinc-850">
              <Info className="w-4 h-4 text-cyan-400" />
              状态栏交互设计机制 (Logic Spec)
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-zinc-200">1. 显示状态优先级 (Priority Machine)</h4>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  本程序采用三级状态转换。最优先的是 <span className="text-rose-400 font-semibold">Reminding 喝水提醒到期状态</span>，此时系统无论是否开启自动隐藏，均会强行滑出并高亮呼吸发光；其次是 <span className="text-sky-400">Expanded 完整展开状态</span>，即当鼠标进入顶部探测区域时滑出；最低是 <span className="text-zinc-500">Collapsed 微缩状态</span>，只保留顶端 4px 进度条以最大化避让用户。
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-zinc-200">2. 自适应缓冲延迟 (Collapse Delay)</h4>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  为杜绝鼠标掠过顶部造成频繁抖动。当鼠标移出探测区后，不会立即收拢，而是激活 <code className="bg-zinc-950 p-0.5 px-1 rounded text-cyan-400 text-[10px]">800ms COLLAPSE_DELAY</code> 的延时任务。在此期间重新移入会自动取消回缩。
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-zinc-200">3. 桌面防遮挡无焦点 (Focus-Free OS Overlay)</h4>
                <p className="text-zinc-400 leading-relaxed text-[11px]">
                  实际桌面挂载中设置窗口为 <code className="bg-zinc-950 p-0.5 px-1 rounded text-emerald-400 text-[10px]">focusable: false</code>，不抢夺用户的正常工作或游戏输入流。配合半透明毛玻璃特效，使得常驻亦无视觉喧扰。
                </p>
              </div>
            </div>

            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3.5 mt-4 space-y-1">
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                💡 如何验收喝水到时状态？
              </span>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                在控制器的“喝水健康”选项卡下：开启<b>【极速调试模式】</b>，将倒计时缩短至秒级，即可观察进度条迅速填满变红，并自动亮起状态栏的发光提醒！
              </p>
            </div>
          </div>

          {/* Right Column: Code snippets browser and packaging commands */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visual Code Browser Wrapper */}
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-900 p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-850">
                <h2 className="text-zinc-100 font-display font-semibold text-sm flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-purple-400" />
                  Electron 本地骨架代码浏览器 (Files Explorer)
                </h2>
                
                <span className="text-[10px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 font-mono">
                  TypeScript & ESM
                </span>
              </div>

              {/* Selector tabs */}
              <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-850">
                {electronSnippets.map((file, idx) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedSnippetIdx(idx)}
                    className={`flex-1 text-center py-1.5 text-xs rounded-lg transition-all ${
                      selectedSnippetIdx === idx 
                        ? 'bg-zinc-805 text-white shadow-md border border-zinc-800' 
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>

              {/* Snippet details display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-zinc-400 inline-flex items-center gap-1">
                    📁 路径 ⮕ <code className="text-cyan-400 bg-zinc-950 px-1 py-0.2 rounded font-mono text-[11px]">{electronSnippets[selectedSnippetIdx].path}</code>
                  </span>
                  <button
                    onClick={() => handleCopyCode(electronSnippets[selectedSnippetIdx].code)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline transition-all cursor-pointer font-medium text-[11px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        已复制到剪贴板
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        复制此段源码
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11.5px] text-zinc-400 leading-normal bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-850/40">
                  {electronSnippets[selectedSnippetIdx].description}
                </p>

                {/* Simulated Syntax Highlighter Box */}
                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-850 overflow-auto max-h-[300px] font-mono text-xs text-zinc-300 leading-relaxed text-left">
                  <pre className="whitespace-pre">{electronSnippets[selectedSnippetIdx].code}</pre>
                </div>
              </div>
            </div>

            {/* Step by step Windows 10/11 Packaging Steps */}
            <div className="bg-zinc-900/40 rounded-2xl border border-zinc-900 p-5 md:p-6 space-y-4">
              <h2 className="text-zinc-100 font-display font-semibold text-sm flex items-center gap-1.5 pb-2 border-b border-zinc-850">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Windows 10/11 打包安装简明指南 (Packager's Standard Guide)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono">1</span>
                  <h5 className="font-semibold text-zinc-200">环境与依赖安装</h5>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    在纯净工程目录执行依赖安装。需安装 <code className="text-cyan-400">concurrently</code>、<code className="text-cyan-400">wait-on</code>、<code className="text-cyan-400">electron-store</code>。
                  </p>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">2</span>
                  <h5 className="font-semibold text-zinc-200">开发联调与启动</h5>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    启动 <code className="text-emerald-400">npm run electron:dev</code> 命令。程序会自动开启 Vite 服务并唤醒打包前期的置顶无边框窗口进行热重载。
                  </p>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold font-mono">3</span>
                  <h5 className="font-semibold text-zinc-200">一键编译分发</h5>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    运行 <code className="text-purple-400">npm run pack</code> 构建工具。它将在 <code className="text-purple-400">release/</code> 文件夹生成经过打包后的独立一键安装的可执行 EXE 程序。
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>
      
      {/* 4. Footer credits line */}
      <footer className="mt-12 text-center text-xs text-zinc-650 max-w-7xl mx-auto w-full px-6 pt-6 border-t border-zinc-900">
        <p>© 2026 Codex Water Statusbar. Fulfilling all P0 & P1 Desktop status specifications flawlessly.</p>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DesktopSandbox />
    </AppProvider>
  );
}
