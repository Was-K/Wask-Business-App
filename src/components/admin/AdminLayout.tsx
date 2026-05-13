import React from 'react';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Ambient Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left gradient */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float"></div>

        {/* Top-right gradient */}
        <div className="absolute -top-20 -right-40 w-80 h-80 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Bottom-left gradient */}
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Bottom-right gradient */}
        <div className="absolute -bottom-20 -right-32 w-80 h-80 bg-white/5 rounded-full mix-blend-screen blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64 transition-all duration-300">
          {/* Header */}
          <Header title={title} subtitle={subtitle} />

          {/* Content Area */}
          <main className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-black via-black to-black/95 p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
