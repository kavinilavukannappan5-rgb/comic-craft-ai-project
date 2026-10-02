import React, { useState } from 'react';
import { Terminal, Copy, CheckCircle2, Laptop, PlayCircle, Layers, BookCheck } from 'lucide-react';

interface SetupInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupInstructionsModal: React.FC<SetupInstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Prerequisites & Environment Setup',
      desc: 'Ensure Node.js (v18+ or v20+) and Git are installed on your computer.',
      code: `# Verify Node.js and npm
node -v
npm -v`,
    },
    {
      title: '2. Clone & Open Project in VS Code',
      desc: 'Open the project folder inside Visual Studio Code.',
      code: `# Open the directory in VS Code
cd comiccraft
code .`,
    },
    {
      title: '3. Configure Environment Variables (.env)',
      desc: 'Create a .env file in the root directory and add your Google Gemini API Key.',
      code: `# .env file
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000`,
    },
    {
      title: '4. Install Dependencies',
      desc: 'Install all frontend, backend, and AI SDK packages.',
      code: `npm install`,
    },
    {
      title: '5. Launch the Application',
      desc: 'Start the full-stack server running Express and Vite with Gemini integration.',
      code: `npm run dev

# The app will be running at:
# http://localhost:3000`,
    },
    {
      title: '6. Testing the Application',
      desc: 'Test the application in the browser or via automated CLI commands.',
      code: `# Test Scenario 1 (Kip the Fox in Enchanted Forest)
# Fill the form on http://localhost:3000 or send a cURL request:

curl -X POST http://localhost:3000/api/generate-comic/json \\
  -H "Content-Type: application/json" \\
  -d '{"prompt":"A brave fox exploring an enchanted forest","character_name":"Kip","setting":"forest","tone":"dramatic","art_style":"anime"}'`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b-4 border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 rounded-lg border-2 border-slate-950 shadow-[2px_2px_0px_#000]">
              <Terminal className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="font-bangers text-2xl text-amber-300 tracking-wide">
                VS Code Setup, Install &amp; Run Instructions
              </h2>
              <p className="text-xs text-slate-400 font-comic">
                Step-by-step developer guide for running ComicCraft locally
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

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Overview Card */}
          <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-300 flex items-start gap-3">
            <Laptop className="w-6 h-6 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bangers text-lg text-slate-900">
                ComicCraft Full-Stack Architecture
              </h4>
              <p className="text-xs text-slate-700 font-comic">
                This project features an Express backend (in <code className="bg-amber-200 px-1 rounded font-mono">server.ts</code>) that connects securely to Google Gemini models (<code className="bg-amber-200 px-1 rounded font-mono">@google/genai</code>) without exposing API keys to the browser, paired with a React SPA frontend and a multi-page PDF compiler (<code className="bg-amber-200 px-1 rounded font-mono">jspdf</code>).
              </p>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-300">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bangers text-lg text-slate-900 tracking-wide">
                    {step.title}
                  </h4>
                  <button
                    onClick={() => copyToClipboard(step.code, idx)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-300 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 font-comic mb-2">{step.desc}</p>
                <pre className="bg-slate-900 text-amber-300 p-3 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
                  {step.code}
                </pre>
              </div>
            ))}
          </div>

          {/* Python & FastAPI compatibility notes */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <h4 className="font-bangers text-lg text-indigo-950 mb-1 flex items-center gap-1.5">
              <BookCheck className="w-4 h-4 text-indigo-600" /> Python / FastAPI Reference Note
            </h4>
            <p className="text-xs text-indigo-900 font-comic leading-relaxed">
              If running a standalone Python FastAPI backend alongside the frontend, you can run <code className="bg-indigo-100 px-1 rounded font-mono">uvicorn app.main:app --reload</code> on port 8000 with the exact same route contracts (<code className="font-mono">/generate</code>, <code className="font-mono">/generate-comic/json</code>, <code className="font-mono">/test-image</code>). In this production build, the full-stack server provides zero-configuration instant execution with Google Gemini models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
