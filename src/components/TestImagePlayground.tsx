import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Wand2, Download, Dices, Layers, ArrowLeft } from 'lucide-react';
import { ArtStyle } from '../types/comic';
import { testImagePrompt } from '../services/api';

interface TestImagePlaygroundProps {
  onBack: () => void;
}

const SAMPLE_IMAGE_PROMPTS = [
  { prompt: 'A heroic cybernetic fox crouching on a neon-lit skyscraper roof in the rain', style: 'cyberpunk' as ArtStyle },
  { prompt: 'A magical spellbook floating in an ancient library with glowing golden runes swirling around it', style: 'anime' as ArtStyle },
  { prompt: 'A classic 1960s comic book superhero breaking through a brick wall with an action burst', style: 'comic book' as ArtStyle },
  { prompt: 'A moody detective smoking in the alley under a flickering street lamp, harsh shadows', style: 'noir' as ArtStyle },
];

export const TestImagePlayground: React.FC<TestImagePlaygroundProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('A heroic cybernetic fox crouching on a neon-lit skyscraper roof in the rain');
  const [artStyle, setArtStyle] = useState<ArtStyle>('cyberpunk');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await testImagePrompt(prompt.trim(), artStyle);
      setGeneratedImage(result.image_url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSample = (sample: typeof SAMPLE_IMAGE_PROMPTS[0]) => {
    setPrompt(sample.prompt);
    setArtStyle(sample.style);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Comic Generator</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-sky-400 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <ImageIcon className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="font-bangers text-3xl sm:text-4xl text-slate-900 uppercase tracking-wide">
              Test-Image Utility Route
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-comic">
              Developer sandbox for testing individual panel illustration prompts (/test-image endpoint)
            </p>
          </div>
        </div>

        {/* Quick Sample Prompts */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Samples:</span>
          {SAMPLE_IMAGE_PROMPTS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSample(s)}
              className="text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors"
            >
              Sample {idx + 1} ({s.style})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Card */}
        <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] p-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label htmlFor="testPrompt" className="font-bangers text-xl text-slate-900 block mb-2">
                Image Generation Prompt
              </label>
              <textarea
                id="testPrompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter scene prompt to test..."
                className="w-full px-4 py-3 bg-amber-50/40 rounded-xl border-2 border-slate-800 font-comic text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label htmlFor="testStyle" className="font-bangers text-xl text-slate-900 block mb-2">
                Art Style
              </label>
              <select
                id="testStyle"
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                className="w-full px-4 py-2.5 bg-amber-50/40 rounded-xl border-2 border-slate-800 font-comic text-sm cursor-pointer"
              >
                <option value="comic book">Classic Comic Book</option>
                <option value="anime">Anime / Manga Style</option>
                <option value="noir">Graphic Noir</option>
                <option value="pixel art">Retro Pixel Art</option>
                <option value="vintage graphic novel">Vintage Graphic Novel</option>
                <option value="cyberpunk">Cyberpunk Neon</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border-2 border-rose-400 text-rose-700 text-xs rounded-lg font-comic">
                Error: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-xl font-bangers text-xl tracking-wider uppercase border-3 border-slate-950 shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 transition-all ${
                isLoading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-sky-400 hover:bg-sky-300 text-slate-950 active:translate-x-0.5 active:translate-y-0.5'
              }`}
            >
              <Wand2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Painting Illustration...' : 'Test Generate Image'}</span>
            </button>
          </form>
        </div>

        {/* Output Preview Card */}
        <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_#0f172a] p-6 flex flex-col justify-between">
          <div>
            <div className="font-bangers text-xl text-slate-900 uppercase mb-3 flex items-center justify-between">
              <span>Result Output</span>
              {generatedImage && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  Ready
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="h-64 rounded-xl border-2 border-dashed border-slate-400 flex flex-col items-center justify-center bg-slate-50">
                <Wand2 className="w-8 h-8 text-sky-500 animate-spin mb-2" />
                <span className="font-bangers text-lg text-slate-700">Rendering Scene...</span>
              </div>
            ) : generatedImage ? (
              <div className="rounded-xl border-3 border-slate-900 overflow-hidden shadow-[4px_4px_0px_#000] bg-slate-950">
                <img src={generatedImage} alt="Generated test" className="w-full h-auto object-cover max-h-[380px]" />
              </div>
            ) : (
              <div className="h-64 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-6 text-center">
                <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                <p className="font-comic text-sm">
                  Click "Test Generate Image" to see the AI comic illustration output.
                </p>
              </div>
            )}
          </div>

          {generatedImage && (
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-comic">Style: {artStyle}</span>
              <a
                href={generatedImage}
                download="comic_test_panel.png"
                className="px-3 py-1.5 bg-slate-900 text-white font-bangers text-sm rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Save Image</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
