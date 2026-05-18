import React from 'react';
import type { ReactNode } from 'react';
import { BusinessSidebar } from '@/components/business/BusinessSidebar';
import { BusinessHeader } from '@/components/business/BusinessHeader';

interface BusinessLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const BusinessLayout: React.FC<BusinessLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Atmospheric Background Rendering Pipeline */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary neon blue radial glow - top left */}
        <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-blue-500/[0.08] rounded-full mix-blend-screen blur-[100px] animate-float"></div>

        {/* Secondary cyan glow - top right */}
        <div
          className="absolute -top-24 -right-48 w-[400px] h-[400px] bg-cyan-500/[0.06] rounded-full mix-blend-screen blur-[80px] animate-float"
          style={{ animationDelay: '2s' }}
        ></div>

        {/* Tertiary blue glow - bottom left */}
        <div
          className="absolute -bottom-48 -left-24 w-[500px] h-[500px] bg-blue-600/[0.06] rounded-full mix-blend-screen blur-[100px] animate-float"
          style={{ animationDelay: '4s' }}
        ></div>

        {/* Quaternary indigo glow - bottom right */}
        <div
          className="absolute -bottom-24 -right-40 w-[400px] h-[400px] bg-indigo-500/[0.05] rounded-full mix-blend-screen blur-[80px] animate-float"
          style={{ animationDelay: '1s' }}
        ></div>

        {/* Center ambient neon blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full mix-blend-screen blur-[120px] animate-float"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      {/* Main Layout Grid */}
      <div className="relative z-10 flex">
        {/* Fixed Sidebar Navigation */}
        <BusinessSidebar />

        {/* Main Content Area */}
        <div className="flex-1 ml-64 transition-all duration-300">
          {/* Sticky Header */}
          <BusinessHeader title={title} subtitle={subtitle} />

          {/* Content Rendering Area */}
          <main className="min-h-[calc(100vh-80px)] p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
