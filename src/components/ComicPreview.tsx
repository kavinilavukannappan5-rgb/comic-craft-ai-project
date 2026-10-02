import React, { useState } from 'react';
import { 
  Download, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Maximize2, 
  RefreshCw, 
  FileText, 
  MessageSquare, 
  Layers, 
  Info,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { ComicStory, ComicPanel } from '../types/comic';
import { regeneratePanelImage } from '../services/api';

interface ComicPreviewProps {
  comic: ComicStory;
  onDownloadPdf: () => void;
  onBackToEdit: () => void;
  isDownloadingPdf: boolean;
  onUpdateComic: (updated: ComicStory) => void;
}

export const ComicPreview: React.FC<ComicPreviewProps> = ({
  comic,
  onDownloadPdf,
  onBackToEdit,
  isDownloadingPdf,
  onUpdateComic,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPanelZoom, setSelectedPanelZoom] = useState<ComicPanel | null>(null);
  const [regeneratingPanelIndex, setRegeneratingPanelIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPromptRef, setShowPromptRef] = useState(false);

  // Audio Speech Narration using browser SpeechSynthesis
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `${comic.title}. ${comic.panels
      .map(
        (p) =>
          `Panel ${p.panelNumber}: ${p.title}. ${p.caption ? `Caption: ${p.caption}. ` : ''}${p.narration}. ${p.dialogues
            .map((d) => `${d.speaker} says: ${d.text}`)
            .join('. ')}`
      )
      .join('. ')}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  // Re-generate illustration for a single panel
  const handleRegeneratePanel = async (panel: ComicPanel, index: number) => {
    try {
      setRegeneratingPanelIndex(index);
      const newImageUrl = await regeneratePanelImage(
        panel.panelNumber,
        panel.imagePrompt,
        comic.artStyle,
        panel.title
      );

      const updatedPanels = [...comic.panels];
      updatedPanels[index] = {
        ...panel,
        imageUrl: newImageUrl,
      };

      onUpdateComic({
        ...comic,
        panels: updatedPanels,
      });
    } catch (err) {
      alert('Could not regenerate panel: ' + (err as Error).message);
    } finally {
      setRegeneratingPanelIndex(null);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Navigation & Action Bar */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] p-4 sm:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToEdit}
            className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1.5 mb-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Editor</span>
          </button>
          <h2 className="font-bangers text-3xl sm:text-4xl text-slate-900 tracking-wide uppercase leading-tight">
            {comic.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600 font-comic">
            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
              Hero: {comic.characterName}
            </span>
            <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-300">
              World: {comic.setting}
            </span>
            <span className="bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded border border-indigo-300 capitalize">
              Tone: {comic.tone}
            </span>
            <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300 capitalize">
              Style: {comic.artStyle}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Audio narration toggle */}
          <button
            onClick={handleToggleAudio}
            className={`px-3.5 py-2.5 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
              isPlayingAudio
                ? 'bg-rose-500 text-white border-slate-900 shadow-[2px_2px_0px_#000] animate-pulse'
                : 'bg-white text-slate-800 border-slate-800 hover:bg-slate-50 shadow-[2px_2px_0px_#000]'
            }`}
            title="Read Story Aloud"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-indigo-600" />
                <span>Listen Story</span>
              </>
            )}
          </button>

          {/* Toggle Prompt Reference visibility */}
          <button
            onClick={() => setShowPromptRef(!showPromptRef)}
            className="px-3 py-2.5 rounded-xl border-2 border-slate-800 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1.5"
            title="Show image generation prompts"
          >
            <Info className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Prompts</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="px-3 py-2.5 rounded-xl border-2 border-slate-800 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1.5"
            title="Copy URL"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-700" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Primary Action: Download PDF */}
          <button
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className={`px-5 py-2.5 rounded-xl font-bangers text-lg tracking-wider uppercase border-3 border-slate-950 shadow-[4px_4px_0px_#000] transition-all flex items-center gap-2 ${
              isDownloadingPdf
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000]'
            }`}
          >
            <Download className="w-5 h-5" />
            <span>{isDownloadingPdf ? 'Compiling PDF...' : 'Download Comic as PDF'}</span>
          </button>
        </div>
      </div>

      {/* Comic Strip Panel Container */}
      <div className="space-y-10">
        {comic.panels.map((panel, idx) => {
          const isRegenerating = regeneratingPanelIndex === idx;

          return (
            <div
              key={panel.panelNumber}
              className="bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] overflow-hidden transition-all hover:shadow-[10px_10px_0px_#f59e0b]"
            >
              {/* Panel Header Banner */}
              <div className="bg-slate-900 px-6 py-3 flex items-center justify-between border-b-4 border-slate-900">
                <div className="flex items-center gap-3">
                  <span className="font-bangers text-2xl text-amber-400 tracking-wider">
                    PANEL {panel.panelNumber}
                  </span>
                  <span className="text-white font-bangers text-xl hidden sm:inline">
                    • {panel.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRegeneratePanel(panel, idx)}
                    disabled={isRegenerating}
                    className="px-2.5 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 rounded flex items-center gap-1 transition-colors"
                    title="Regenerate this panel's illustration"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>{isRegenerating ? 'Repainting...' : 'Re-roll Art'}</span>
                  </button>
                  <button
                    onClick={() => setSelectedPanelZoom(panel)}
                    className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Zoom Illustration"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panel Content Layout: Responsive 2-Column */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
                {/* Left Side: Artwork Frame with onomatopoeia */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="relative rounded-xl border-3 border-slate-900 overflow-hidden shadow-[4px_4px_0px_#0f172a] bg-slate-950 group">
                    <img
                      src={panel.imageUrl}
                      alt={panel.title}
                      className="w-full h-auto object-cover max-h-[460px] transition-transform duration-300 group-hover:scale-[1.01]"
                    />

                    {/* Sound Effect Sticker */}
                    {panel.soundEffect && (
                      <div className="absolute top-4 right-4 bg-amber-400 border-2 border-slate-950 px-3 py-1 rounded shadow-[3px_3px_0px_#000] rotate-6 transform hover:rotate-0 transition-transform">
                        <span className="font-bangers text-xl tracking-wider text-slate-950">
                          {panel.soundEffect}
                        </span>
                      </div>
                    )}

                    {/* Zoom Overlay Trigger */}
                    <div 
                      onClick={() => setSelectedPanelZoom(panel)}
                      className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <span className="bg-slate-900/90 text-white font-bangers text-sm px-3 py-1.5 rounded-lg border border-amber-400 flex items-center gap-1.5 shadow-lg">
                        <Maximize2 className="w-4 h-4 text-amber-400" />
                        Click to Zoom
                      </span>
                    </div>
                  </div>

                  {/* Optional Image Prompt Reference */}
                  {showPromptRef && (
                    <div className="mt-3 bg-amber-50/80 p-3 rounded-lg border border-amber-300 text-xs font-comic text-slate-700">
                      <span className="font-bold text-slate-900 flex items-center gap-1 mb-0.5">
                        <Info className="w-3.5 h-3.5 text-amber-600" /> Image Prompt Reference:
                      </span>
                      {panel.imagePrompt}
                    </div>
                  )}
                </div>

                {/* Right Side: Narrative, Dialogue & Captions */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  {/* Classic Caption Box */}
                  {panel.caption && (
                    <div className="bg-amber-300 border-2 border-slate-900 px-4 py-2 rounded-lg shadow-[3px_3px_0px_#0f172a]">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block font-bangers">
                        [ SCENE CAPTION ]
                      </span>
                      <p className="font-bangers text-base tracking-wide text-slate-950">
                        {panel.caption}
                      </p>
                    </div>
                  )}

                  {/* Scene Atmosphere Description in Italics */}
                  {panel.sceneDescription && (
                    <div className="px-2">
                      <p className="text-sm text-slate-600 font-comic italic leading-relaxed">
                        "{panel.sceneDescription}"
                      </p>
                    </div>
                  )}

                  {/* Narration Story Box */}
                  {panel.narration && (
                    <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Narration</span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-800 font-comic leading-relaxed">
                        {panel.narration}
                      </p>
                    </div>
                  )}

                  {/* Character Dialogues / Speech Bubbles */}
                  {panel.dialogues && panel.dialogues.length > 0 && (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <MessageSquare className="w-3.5 h-3.5 text-pink-500" />
                        <span>Character Dialogue</span>
                      </div>

                      {panel.dialogues.map((diag, dIdx) => {
                        const isShout = diag.type === 'shout';
                        const isThought = diag.type === 'thought';
                        const isWhisper = diag.type === 'whisper';

                        return (
                          <div
                            key={dIdx}
                            className={`relative p-3.5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_#000] ${
                              isShout
                                ? 'bg-amber-100 border-amber-600'
                                : isThought
                                ? 'bg-sky-50 border-dashed'
                                : isWhisper
                                ? 'bg-slate-100 text-slate-600 italic'
                                : 'bg-white'
                            }`}
                          >
                            {/* Speaker Badge */}
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bangers text-sm text-amber-700 tracking-wide">
                                {diag.speaker}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                {diag.type}
                              </span>
                            </div>

                            {/* Dialogue Text */}
                            <p className="font-comic text-sm text-slate-900 font-medium">
                              "{diag.text}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="mt-12 bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] p-6 text-center">
        <h3 className="font-bangers text-3xl text-slate-900 uppercase mb-2">
          Ready to Save and Share Your Comic?
        </h3>
        <p className="text-slate-600 font-comic max-w-xl mx-auto mb-6">
          Download your 5-panel comic as a formatted PDF complete with cover art, speech bubbles, narrative boxes, and character credits.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className={`py-3.5 px-8 rounded-xl font-bangers text-2xl tracking-wider uppercase border-3 border-slate-950 shadow-[5px_5px_0px_#000] transition-all flex items-center gap-2 ${
              isDownloadingPdf
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:translate-x-0.5 active:translate-y-0.5'
            }`}
          >
            <Download className="w-6 h-6" />
            <span>{isDownloadingPdf ? 'Compiling PDF...' : 'Download Your Comic as PDF'}</span>
          </button>

          <button
            onClick={onBackToEdit}
            className="py-3.5 px-6 rounded-xl font-bangers text-xl tracking-wider uppercase border-3 border-slate-800 bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-[3px_3px_0px_#000] transition-all"
          >
            Create Another Comic
          </button>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {selectedPanelZoom && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPanelZoom(null)}
        >
          <div 
            className="bg-white rounded-2xl border-4 border-slate-900 shadow-2xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 px-6 py-3 flex items-center justify-between">
              <span className="font-bangers text-2xl text-amber-400">
                PANEL {selectedPanelZoom.panelNumber}: {selectedPanelZoom.title}
              </span>
              <button
                onClick={() => setSelectedPanelZoom(null)}
                className="text-white hover:text-amber-400 font-bold text-lg"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4 sm:p-6 bg-slate-950 flex items-center justify-center">
              <img
                src={selectedPanelZoom.imageUrl}
                alt={selectedPanelZoom.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg border-2 border-slate-800"
              />
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-300 font-comic italic">
                "{selectedPanelZoom.sceneDescription}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
