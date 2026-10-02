import React from 'react';
import { Sparkles, Image as ImageIcon, Code2, BookOpen, Terminal, Zap } from 'lucide-react';

interface HeaderProps {
  currentView: 'form' | 'preview' | 'success' | 'test-image';
  onNavigate: (view: 'form' | 'preview' | 'success' | 'test-image') => void;
  onOpenApiDocs: () => void;
  onOpenSetupGuide: () => void;
  hasComic: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenApiDocs,
  onOpenSetupGuide,
  hasComic,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b-4 border-amber-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo Brand */}
          <div 
            onClick={() => onNavigate('form')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 bg-amber-400 rounded-lg flex items-center justify-center border-2 border-slate-950 shadow-[3px_3px_0px_#f59e0b] group-hover:rotate-6 transition-transform">
              <Zap className="w-7 h-7 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bangers text-3xl tracking-wide text-amber-400 drop-shadow-[2px_2px_0px_#000]">
                  COMICCRAFT
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/40 hidden sm:inline-block">
                  Gemini Models
                </span>
              </div>
              <p className="text-xs text-slate-400 font-comic -mt-1 hidden sm:block">
                AI Story &amp; Illustration Creator
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('form')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                currentView === 'form'
                  ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_#000]'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Create</span>
            </button>

            {hasComic && (
              <button
                onClick={() => onNavigate('preview')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                  currentView === 'preview'
                    ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_#000]'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Comic Strip</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('test-image')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg border-2 transition-all flex items-center gap-1.5 ${
                currentView === 'test-image'
                  ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[2px_2px_0px_#000]'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Test Image</span>
            </button>

            <button
              onClick={onOpenApiDocs}
              className="px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg border-2 bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-1"
              title="JSON API & Endpoints"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">API</span>
            </button>

            <button
              onClick={onOpenSetupGuide}
              className="px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg border-2 bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20 transition-all flex items-center gap-1"
              title="VS Code Setup, Install & Run Guide"
            >
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">VS Code Setup</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
