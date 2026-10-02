import React, { useState } from 'react';
import { Code2, Play, Copy, CheckCircle2, FileJson, ArrowRight } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'generate-json' | 'test-image'>('generate-json');
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(
      {
        prompt: 'A brave fox exploring an ancient enchanted forest looking for a crystal.',
        character_name: 'Kip the Fox',
        setting: 'forest',
        tone: 'dramatic',
        art_style: 'anime',
      },
      null,
      2
    )
  );

  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setIsExecuting(true);
    setApiResponse(null);
    try {
      const parsedBody = JSON.parse(jsonInput);
      const endpoint = activeTab === 'generate-json' ? '/api/generate-comic/json' : '/api/test-image';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody),
      });

      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setApiResponse(JSON.stringify({ error: (err as Error).message }, null, 2));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    if (apiResponse) {
      navigator.clipboard?.writeText(apiResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b-4 border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-400 rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_#000]">
              <Code2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-bangers text-2xl text-amber-300 tracking-wide">
                ComicCraft JSON API Explorer
              </h2>
              <p className="text-xs text-slate-400 font-comic">
                Live Interactive API Testing (Milestone 2 &amp; Milestone 3)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-lg px-2"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-300 flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('generate-json');
              setJsonInput(
                JSON.stringify(
                  {
                    prompt: 'A brave fox exploring an enchanted forest.',
                    character_name: 'Kip the Fox',
                    setting: 'forest',
                    tone: 'dramatic',
                    art_style: 'anime',
                  },
                  null,
                  2
                )
              );
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'generate-json'
                ? 'bg-amber-400 text-slate-950 border border-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            POST /api/generate-comic/json
          </button>

          <button
            onClick={() => {
              setActiveTab('test-image');
              setJsonInput(
                JSON.stringify(
                  {
                    prompt: 'A superhero fox casting a spell in glowing woods',
                    artStyle: 'comic book',
                  },
                  null,
                  2
                )
              );
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'test-image'
                ? 'bg-amber-400 text-slate-950 border border-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            POST /api/test-image
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Request Payload Editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <FileJson className="w-3.5 h-3.5 text-indigo-600" /> Request Payload (JSON):
                </span>
                <span className="text-[10px] text-slate-500 font-mono">application/json</span>
              </div>
              <textarea
                rows={9}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border-2 border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="mt-3 w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bangers text-lg tracking-wider rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5"
              >
                <Play className={`w-4 h-4 fill-slate-950 ${isExecuting ? 'animate-spin' : ''}`} />
                <span>{isExecuting ? 'Sending Request...' : 'Send API Request'}</span>
              </button>
            </div>

            {/* Response Viewer */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Live JSON Response:
                </span>
                {apiResponse && (
                  <button
                    onClick={handleCopy}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1"
                  >
                    {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Response'}</span>
                  </button>
                )}
              </div>
              <div className="h-64 overflow-y-auto p-3 font-mono text-xs bg-slate-950 text-slate-200 rounded-xl border-2 border-slate-800 shadow-inner">
                {isExecuting ? (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    Executing Gemini pipeline...
                  </div>
                ) : apiResponse ? (
                  <pre className="whitespace-pre-wrap">{apiResponse}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-center px-4 font-comic">
                    Click "Send API Request" to test the endpoint and inspect the live JSON layout.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* cURL Example Snippet */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Sample cURL Command:
            </span>
            <pre className="p-2.5 bg-slate-900 text-amber-300 rounded-lg text-xs font-mono overflow-x-auto">
{`curl -X POST http://localhost:3000/api/generate-comic/json \\
  -H "Content-Type: application/json" \\
  -d '${jsonInput.replace(/\n/g, '').replace(/\s+/g, ' ')}'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
