import React, { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  accentColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  suffix = '',
  prefix = '',
  change,
  changeType,
  accentColor = 'blue',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  // Animated counter
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplayValue(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const accentColors: Record<string, { bg: string; text: string; shadow: string; border: string; glow: string }> = {
    blue: {
      bg: 'bg-blue-500/12',
      text: 'text-blue-400',
      shadow: 'shadow-blue-500/20',
      border: 'border-blue-500/20',
      glow: 'from-blue-500/15',
    },
    cyan: {
      bg: 'bg-cyan-500/12',
      text: 'text-cyan-400',
      shadow: 'shadow-cyan-500/20',
      border: 'border-cyan-500/20',
      glow: 'from-cyan-500/15',
    },
    violet: {
      bg: 'bg-violet-500/12',
      text: 'text-violet-400',
      shadow: 'shadow-violet-500/20',
      border: 'border-violet-500/20',
      glow: 'from-violet-500/15',
    },
    emerald: {
      bg: 'bg-emerald-500/12',
      text: 'text-emerald-400',
      shadow: 'shadow-emerald-500/20',
      border: 'border-emerald-500/20',
      glow: 'from-emerald-500/15',
    },
  };

  const colors = accentColors[accentColor] || accentColors.blue;

  const changeColor =
    changeType === 'up'
      ? 'text-emerald-400'
      : changeType === 'down'
      ? 'text-red-400'
      : 'text-white/45';

  const changeIcon =
    changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '→';

  const formattedValue = displayValue.toLocaleString();

  return (
    <div className="group relative bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all duration-500 hover:shadow-xl hover:shadow-black/30 overflow-hidden cursor-default">
      {/* Gradient glow accent on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Subtle decorative chart line */}
      <div className="absolute bottom-0 right-0 w-32 h-16 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500">
        <svg viewBox="0 0 128 64" fill="none" className="w-full h-full">
          <path
            d="M0 48 C20 40, 32 56, 48 32 C64 8, 80 24, 96 16 C112 8, 120 20, 128 12"
            stroke="currentColor"
            strokeWidth="2"
            className={colors.text}
          />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Icon Container */}
        <div
          className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}
        >
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>

        {/* Label */}
        <p className="text-sm text-white/50 mb-2 font-medium">{label}</p>

        {/* Value with counter animation */}
        <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
          {prefix}{formattedValue}{suffix}
        </h3>

        {/* Change Indicator */}
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-semibold ${changeColor}`}>
            {changeIcon} {change}
          </span>
          <span className="text-xs text-white/30">vs mes anterior</span>
        </div>
      </div>
    </div>
  );
};
