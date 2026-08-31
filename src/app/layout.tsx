import React from 'react';
import './globals.css';
import { ProjectProvider } from '../context/ProjectContext';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { CommandPalette } from '../components/layout/CommandPalette';
import { ToastContainer } from '../components/ui/ToastContainer';

export const metadata = {
  title: 'DataStream — Production Data Streaming & Pipeline Platform',
  description: 'Local-first data streaming, pipeline orchestration, schema registry, quality checks, and ML feature platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        <ProjectProvider>
          <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6 bg-slate-950 text-slate-100">
                {children}
              </main>
            </div>
          </div>
          <CommandPalette />
          <ToastContainer />
        </ProjectProvider>
      </body>
    </html>
  );
}
