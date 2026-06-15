import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Sliders, 
  Droplets, 
  Monitor, 
  Layout, 
  Eye, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  History, 
  HelpCircle,
  Clock,
  Settings
} from 'lucide-react';

export const ControlCenter: React.FC = () => {
  const {
    autoHide,
    setAutoHide,
    waterIntervalMinutes,
    setWaterIntervalMinutes,
    barPosition,
    setBarPosition,
    opacity,
    setOpacity,
    theme,
    setTheme,
    codexFiveHourPercent,
    setCodexFiveHourPercent,
    codexWeeklyPercent,
    setCodexWeeklyPercent,
    waterHistory,
    desktopBackground,
    setDesktopBackground,
    isTimerSpeedUp,
    setIsTimerSpeedUp,
    resetWaterTimer,
    triggerManualRemind,
    clearWaterHistory,
    isWaterDue,
    progressPercent,
    secondsRemaining
  } = useApp();

  const [activeTab, setActiveTab] = useState<'codex' | 'water' | 'style' | 'history'>('water');

  // Format time helper
  const formatTimeStr = (t: number) => {
    const d = new Date(t);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  // Preset backgrounds
  const bgs = [
    { id: 'aurora', name: '极光幻境', class: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white' },
    { id: 'mountain', name: '温暖雪山', class: 'bg-gradient-to-tr from-rose-950 via-gray-900 to-indigo-950 text-white' },
    { id: 'cyber', name: '赛博深邃', class: 'bg-gradient-to-br from-neutral-950 via-zinc-900 to-fuchsia-950 text-white' },
    { id: 'slate', name: '极简静谧', class: 'bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 text-white' }
  ];

  return (
    <div 
      id="control-center-widget"
      className="w-full max-w-xl bg-zinc-900/95 border border-zinc-800/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden font-sans text-sm text-zinc-300"
    >
      {/* Widget Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-950/60 border-b border-zinc-800/65">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="font-display font-medium text-[13px] tracking-wide text-zinc-100 uppercase">
            状态栏配置控制器 / Controls
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex bg-zinc-950/20 border-b border-zinc-800/40 p-1">
        <button
          onClick={() => setActiveTab('codex')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'codex' 
              ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700/40' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Codex 额度
        </button>
        <button
          onClick={() => setActiveTab('water')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'water' 
              ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700/40' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          喝水健康
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'style' 
              ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700/40' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          外观定制
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all relative ${
            activeTab === 'history' 
              ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700/40' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          打卡记录
          {waterHistory.length > 0 && (
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* Content body */}
      <div className="p-5 min-h-[240px]">
        {/* TAB 1: CODEX */}
        {activeTab === 'codex' && (
          <div className="space-y-4">
            <h3 className="text-zinc-100 font-medium flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              测试模式：自定义 Codex 实时额度
            </h3>
            <p className="text-xs text-zinc-400">
              您可以拖拽下方滑块，实时修改状态栏左侧显示的 Codex 额度变化，观察视觉缩进与色彩呈现。
            </p>

            <div className="space-y-4 pt-1">
              {/* Slider 1 */}
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">5小时额度百分比</span>
                  <span className="font-mono font-bold text-cyan-400">{codexFiveHourPercent}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={codexFiveHourPercent}
                  onChange={(e) => setCodexFiveHourPercent(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>空虚</span>
                  <span>推荐 (62%)</span>
                  <span>饱满</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">每周累计额度百分比</span>
                  <span className="font-mono font-bold text-emerald-400">{codexWeeklyPercent}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={codexWeeklyPercent}
                  onChange={(e) => setCodexWeeklyPercent(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>空虚</span>
                  <span>推荐 (41%)</span>
                  <span>饱满</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WATER */}
        {activeTab === 'water' && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-zinc-100 font-medium flex items-center gap-1.5 text-xs">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  健康喝水计时器状态与模拟控制
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  当前处于：{isWaterDue ? <span className="text-rose-400 font-semibold">【提醒到期状态】</span> : <span className="text-indigo-400">持续计时中 ({progressPercent}%)</span>}
                </p>
              </div>
              
              {/* Reset button inside settings directly */}
              <button 
                onClick={resetWaterTimer}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-md transition-colors"
                title="打卡喝水，归零计时"
              >
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                立即打卡一杯水 💧
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Left Column Controls */}
              <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800 space-y-3.5">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">计时属性</span>
                
                {/* Interval Minutes input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">每次倒计时时长</span>
                    <span className="font-mono text-zinc-200 font-bold">{waterIntervalMinutes} 分钟</span>
                  </div>
                  <input 
                    type="range"
                    min="1"
                    max="120"
                    value={waterIntervalMinutes}
                    onChange={(e) => setWaterIntervalMinutes(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-500">
                    <span>1分(测)</span>
                    <span>30分(默认)</span>
                    <span>120分钟</span>
                  </div>
                </div>

                {/* Speed up checklist toggle */}
                <div className="flex items-center justify-between p-2 rounded bg-zinc-900/40 border border-zinc-800">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-zinc-200">极速调试模式 (1秒=1分钟)</span>
                    <span className="text-[10px] text-zinc-500">
                      让 {waterIntervalMinutes} 分钟计时仅需 {waterIntervalMinutes} 秒便到期！
                    </span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={isTimerSpeedUp}
                    onChange={(e) => setIsTimerSpeedUp(e.target.checked)}
                    className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Right Column Controls */}
              <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">测试用例快速触发</span>
                  <p className="text-[11px] text-zinc-500">
                    无须等待倒计时跑完，一键强制进入“喝水时间到销”的亮起警报状态。
                  </p>
                </div>
                
                <button
                  onClick={triggerManualRemind}
                  disabled={isWaterDue}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold select-none flex items-center justify-center gap-1.5 transition-all text-white ${
                    isWaterDue
                      ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-md active:scale-95'
                  }`}
                >
                  ⚠️ 强制触发：提醒时刻到达 🔊
                </button>

                <p className="text-[10px] text-zinc-500 leading-normal bg-zinc-900/50 p-2 rounded">
                  提醒状态中：状态栏自动滑出、水滴呼吸起跳、边框泛红呼吸、点击水滴自动复原。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STYLE */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            <h3 className="text-zinc-100 font-medium flex items-center gap-1.5 text-xs">
              <Layout className="w-4 h-4 text-purple-400" />
              定制您的桌面环境与状态栏视觉
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Theme Selector */}
              <div className="space-y-2 bg-zinc-950/30 p-3 rounded-xl border border-zinc-800">
                <label className="text-xs font-medium text-zinc-400 block">主题风格适配</label>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setTheme('frosted-dark')}
                    className={`text-left text-xs px-2.5 py-1.5 rounded border transition-all flex items-center justify-between ${
                      theme === 'frosted-dark'
                        ? 'bg-zinc-800 text-sky-400 border-sky-500/30'
                        : 'bg-zinc-900/60 text-zinc-400 border-transparent hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>深色毛玻璃 (Frosted Dark)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-700" />
                  </button>

                  <button
                    onClick={() => setTheme('glass-light')}
                    className={`text-left text-xs px-2.5 py-1.5 rounded border transition-all flex items-center justify-between ${
                      theme === 'glass-light'
                        ? 'bg-zinc-800 text-sky-450 border-zinc-400/40'
                        : 'bg-zinc-900/60 text-zinc-400 border-transparent hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>透亮白毛玻璃 (Glass Light)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-zinc-300" />
                  </button>

                  <button
                    onClick={() => setTheme('midnight-synth')}
                    className={`text-left text-xs px-2.5 py-1.5 rounded border transition-all flex items-center justify-between ${
                      theme === 'midnight-synth'
                        ? 'bg-zinc-800 text-pink-400 border-pink-500/30'
                        : 'bg-zinc-900/60 text-zinc-400 border-transparent hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>赛博霓虹 (Midnight Synth)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500/80 border border-pink-300" />
                  </button>
                </div>
              </div>

              {/* Widget Layout Specs */}
              <div className="space-y-4 bg-zinc-950/30 p-3 rounded-xl border border-zinc-800">
                {/* Opacity slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">毛玻璃不透明度</span>
                    <span className="font-mono text-zinc-200 font-bold">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={Math.round(opacity * 100)}
                    onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>

                {/* Position Select */}
                <div className="space-y-1.5 flex-1 select-none">
                  <span className="text-xs font-medium text-zinc-400 block">状态栏固定位置</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setBarPosition('bottom-left')}
                      className={`flex-1 text-[10px] py-1.5 px-1.5 rounded font-medium border transition-all text-center ${
                        barPosition === 'bottom-left'
                          ? 'bg-zinc-800 text-cyan-405 border-cyan-500/30 font-semibold'
                          : 'bg-zinc-900/50 text-zinc-400 border-zinc-850 hover:bg-zinc-800/20'
                      }`}
                    >
                      左下固定 (默认)
                    </button>
                    <button
                      onClick={() => setBarPosition('top-center')}
                      className={`flex-1 text-[10px] py-1.5 px-1.5 rounded font-medium border transition-all text-center ${
                        barPosition === 'top-center'
                          ? 'bg-zinc-800 text-cyan-405 border-cyan-500/30 font-semibold'
                          : 'bg-zinc-900/50 text-zinc-400 border-zinc-850 hover:bg-zinc-800/20'
                      }`}
                    >
                      顶部中央
                    </button>
                    <button
                      onClick={() => setBarPosition('top-right')}
                      className={`flex-1 text-[10px] py-1.5 px-1.5 rounded font-medium border transition-all text-center ${
                        barPosition === 'top-right'
                          ? 'bg-zinc-800 text-cyan-450 border-cyan-500/30 font-semibold'
                          : 'bg-zinc-900/50 text-zinc-400 border-zinc-850 hover:bg-zinc-800/20'
                      }`}
                    >
                      右上固定
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Background Simulator */}
            <div className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800 space-y-2">
              <span className="text-xs font-medium text-zinc-400 block flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-zinc-300" />
                切换模拟操作系统壁纸 BACKGROUNDS
              </span>
              <div className="grid grid-cols-4 gap-2">
                {bgs.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setDesktopBackground(bg.id)}
                    className={`relative rounded-md py-2 text-[10px] font-semibold text-center border overflow-hidden transition-all ${
                      desktopBackground === bg.id
                        ? 'border-cyan-400 shadow-lg text-white font-bold ring-2 ring-cyan-400/20'
                        : 'border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-white'
                    }`}
                  >
                    {/* Tiny gradient ball indicator */}
                    <div className={`absolute inset-0 bg-opacity-20 ${bg.id === 'aurora' ? 'bg-gradient-to-tr from-indigo-950 to-emerald-950' : bg.id === 'mountain' ? 'bg-gradient-to-tr from-rose-950 to-gray-900' : bg.id === 'cyber' ? 'bg-gradient-to-tr from-neutral-900 to-fuchsia-950' : 'bg-zinc-900'} z-0`} />
                    <span className="relative z-10">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-zinc-100 font-medium flex items-center gap-1.5 text-xs">
                <History className="w-4 h-4 text-cyan-400" />
                饮水打卡统计记录 (实时记录)
              </h3>
              {waterHistory.length > 0 && (
                <button
                  onClick={clearWaterHistory}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  清空日志
                </button>
              )}
            </div>

            {/* Numeric Badge Indicators */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-zinc-950/45 p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">累计饮水</span>
                <span className="font-mono text-base font-bold text-cyan-400">{waterHistory.length} 杯</span>
              </div>
              <div className="bg-zinc-950/45 p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">已摄入总水容量</span>
                <span className="font-mono text-base font-bold text-emerald-400">{waterHistory.length * 200} ml</span>
              </div>
              <div className="bg-zinc-950/45 p-2 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block">达成推荐值</span>
                <span className="font-mono text-base font-bold text-indigo-400">
                  {Math.min(100, Math.round((waterHistory.length / 8) * 100))}%
                </span>
              </div>
            </div>

            {/* History Logs */}
            {waterHistory.length === 0 ? (
              <div className="bg-zinc-950/30 border border-zinc-850 rounded-xl p-8 text-center text-zinc-500 text-xs">
                💤 尚无打卡数据。点击上方状态栏上的饮水水滴 💧 进行第一次打卡。
              </div>
            ) : (
              <div className="bg-zinc-950/40 border border-zinc-800 rounded-xl p-1 max-h-[160px] overflow-y-auto">
                <table className="w-full text-left text-xs text-zinc-400">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] uppercase text-zinc-500 font-mono">
                      <th className="px-3 py-1.5">饮水项</th>
                      <th className="px-3 py-1.5 text-right">打卡时刻</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {waterHistory.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-zinc-900/60">
                        <td className="px-3 py-2 flex items-center gap-1.5 font-sans">
                          <span className="text-sky-400">💧</span> 
                          <span>一杯纯净好水 (200ml)</span>
                          {idx === 0 && (
                            <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] rounded font-bold">最新</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-[11px] text-zinc-500">
                          {formatTimeStr(item.time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <p className="text-[10px] text-zinc-500 text-center leading-normal">
              💡 卫生组织推荐成年人每日摄入 8 杯水（共计 1600ml），保持能量和专注。
            </p>
          </div>
        )}
      </div>

      {/* Widget Footer */}
      <div className="px-5 py-3 bg-zinc-950/40 border-t border-zinc-850/80 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="flex items-center gap-1 font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          双重视觉预览模式（主/微缩）
        </span>
        <span className="text-zinc-600">Created for Windows 10/11</span>
      </div>
    </div>
  );
};
