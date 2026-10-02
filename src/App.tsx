import React, { useState } from 'react';
import { Header } from './components/Header';
import { ComicForm } from './components/ComicForm';
import { ComicPreview } from './components/ComicPreview';
import { ExportSuccess } from './components/ExportSuccess';
import { TestImagePlayground } from './components/TestImagePlayground';
import { ApiDocsModal } from './components/ApiDocsModal';
import { SetupInstructionsModal } from './components/SetupInstructionsModal';
import { ComicStory, ComicGenerationRequest } from './types/comic';
import { generateComic } from './services/api';
import { exportComicToPdf } from './services/pdfExporter';

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'preview' | 'success' | 'test-image'>('form');
  const [comic, setComic] = useState<ComicStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfFilename, setPdfFilename] = useState('');
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateComic = async (request: ComicGenerationRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Step 1/3: Outlining 5-panel comic strip with Gemini Flash...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Step 2/3: Writing dialogue bubbles, onomatopoeia & captions with Gemini...');
    }, 2400);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Step 3/3: Painting stylized comic illustrations for all panels...');
    }, 5000);

    try {
      const generatedComic = await generateComic(request);
      setComic(generatedComic);
      setCurrentView('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Generation failed:', err);
      setErrorMessage((err as Error).message || 'Failed to generate comic story. Please try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleDownloadPdf = async () => {
    if (!comic) return;
    setIsDownloadingPdf(true);
    try {
      const filename = await exportComicToPdf(comic);
      setPdfFilename(filename);
      // As specified in Scenario 3: After reviewing preview, user clicks download, PDF is saved, then redirected to export success page!
      setCurrentView('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Could not export PDF: ' + (err as Error).message);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f2] comic-dots-pattern flex flex-col font-comic selection:bg-amber-400 selection:text-slate-950">
      {/* Global Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
        hasComic={comic !== null}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-6 w-full">
          <div className="bg-rose-100 border-2 border-rose-500 text-rose-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-[3px_3px_0px_#e11d48]">
            <span className="font-comic font-bold text-sm">
              Error: {errorMessage}
            </span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-900 font-bold px-2 hover:bg-rose-200 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'form' && (
          <ComicForm
            onSubmit={handleGenerateComic}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        )}

        {currentView === 'preview' && comic && (
          <ComicPreview
            comic={comic}
            onDownloadPdf={handleDownloadPdf}
            onBackToEdit={() => setCurrentView('form')}
            isDownloadingPdf={isDownloadingPdf}
            onUpdateComic={setComic}
          />
        )}

        {currentView === 'success' && comic && (
          <ExportSuccess
            comic={comic}
            pdfFilename={pdfFilename}
            onDownloadAgain={handleDownloadPdf}
            onCreateAnother={() => {
              setCurrentView('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewComicAgain={() => {
              setCurrentView('preview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'test-image' && (
          <TestImagePlayground onBack={() => setCurrentView('form')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t-4 border-slate-950 py-8 px-4 text-center mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bangers text-2xl text-amber-400">COMICCRAFT</span>
            <span className="text-xs text-slate-400 font-comic">
              • AI-Powered Comic Book Creation with Google Gemini
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              API Endpoints
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSetupGuideOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              VS Code Instructions
            </button>
            <span>•</span>
            <span className="text-slate-500">Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      <SetupInstructionsModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />
    </div>
  );
}
