import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  FileCheck, 
  Layers, 
  Share2 
} from 'lucide-react';
import { ComicStory } from '../types/comic';

interface ExportSuccessProps {
  comic: ComicStory;
  pdfFilename: string;
  onDownloadAgain: () => void;
  onCreateAnother: () => void;
  onViewComicAgain: () => void;
}

export const ExportSuccess: React.FC<ExportSuccessProps> = ({
  comic,
  pdfFilename,
  onDownloadAgain,
  onCreateAnother,
  onViewComicAgain,
}) => {
  useEffect(() => {
    // Fire confetti celebration on export success
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[10px_10px_0px_#0f172a] overflow-hidden text-center">
        {/* Top Header Strip */}
        <div className="bg-amber-400 border-b-4 border-slate-900 py-6 px-6">
          <div className="w-16 h-16 bg-white rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="font-bangers text-4xl sm:text-5xl text-slate-900 tracking-wide uppercase">
            Comic Exported Successfully!
          </h1>
          <p className="text-sm sm:text-base font-comic text-slate-800 font-bold mt-1">
            Your personalized comic book has been compiled and downloaded
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6">
          {/* File Card */}
          <div className="bg-amber-50/60 rounded-2xl border-2 border-slate-800 p-5 text-left flex items-start gap-4">
            <div className="p-3 bg-amber-400 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#000]">
              <FileCheck className="w-7 h-7 text-slate-900" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block font-bangers">
                DOWNLOADED ARTIFACT
              </span>
              <h3 className="font-bangers text-2xl text-slate-900 tracking-wide">
                {pdfFilename || `ComicCraft_${comic.title}.pdf`}
              </h3>
              <p className="text-xs text-slate-600 font-comic mt-0.5">
                5 Pages • Full High-Resolution Color Panels • Formatted Narrative &amp; Dialogue
              </p>
            </div>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Protagonist
              </span>
              <span className="font-bangers text-lg text-slate-900">
                {comic.characterName}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                World
              </span>
              <span className="font-bangers text-lg text-slate-900 capitalize">
                {comic.setting}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Tone
              </span>
              <span className="font-bangers text-lg text-slate-900 capitalize">
                {comic.tone}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Art Style
              </span>
              <span className="font-bangers text-lg text-slate-900 capitalize">
                {comic.artStyle}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onCreateAnother}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-bangers text-2xl tracking-wider uppercase bg-amber-400 hover:bg-amber-300 text-slate-950 border-3 border-slate-950 shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Go Create Another Comic</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onViewComicAgain}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bangers text-xl tracking-wider uppercase bg-white hover:bg-slate-50 text-slate-800 border-3 border-slate-800 shadow-[3px_3px_0px_#000] transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Review Comic Panels</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={onDownloadAgain}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Need to download the PDF again? Click here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
