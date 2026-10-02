import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Dices, 
  Compass, 
  Palette, 
  Smile, 
  UserCheck, 
  BookMarked,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ComicGenerationRequest, ArtStyle, StoryTone, SettingType } from '../types/comic';
import { COMIC_PRESETS } from '../data/presets';

interface ComicFormProps {
  onSubmit: (request: ComicGenerationRequest) => void;
  isLoading: boolean;
  loadingStep: string;
}

const SETTING_OPTIONS: Array<{ value: SettingType; label: string; icon: string }> = [
  { value: 'forest', label: 'Enchanted Forest', icon: '🌲' },
  { value: 'space', label: 'Deep Space Station', icon: '🚀' },
  { value: 'city', label: 'Cyberpunk Metropolis', icon: '🏙️' },
  { value: 'school', label: 'Magic Academy', icon: '🏰' },
  { value: 'ancient dungeon', label: 'Ancient Ruins', icon: '🗝️' },
  { value: 'desert wasteland', label: 'Desert Wasteland', icon: '🏜️' },
];

const TONE_OPTIONS: Array<{ value: StoryTone; label: string; desc: string }> = [
  { value: 'dramatic', label: 'Dramatic', desc: 'Epic tension & destiny' },
  { value: 'funny', label: 'Funny', desc: 'Laughs, slapstick & irony' },
  { value: 'light-hearted', label: 'Light-Hearted', desc: 'Warm & wholesome' },
  { value: 'suspenseful', label: 'Suspenseful', desc: 'Mystery & cliffhangers' },
  { value: 'poetic', label: 'Poetic', desc: 'Philosophical & scenic' },
  { value: 'action-packed', label: 'Action-Packed', desc: 'High adrenaline bursts' },
];

const ART_STYLE_OPTIONS: Array<{ value: ArtStyle; label: string; tag: string; bg: string }> = [
  { value: 'comic book', label: 'Classic Comic', tag: 'Vintage Halftone', bg: 'from-amber-500/20 to-red-500/20' },
  { value: 'anime', label: 'Anime / Manga', tag: 'Cel-Shaded Dynamic', bg: 'from-pink-500/20 to-purple-500/20' },
  { value: 'noir', label: 'Graphic Noir', tag: 'High-Contrast Shadows', bg: 'from-slate-700/30 to-slate-950/40' },
  { value: 'pixel art', label: 'Retro Pixel', tag: '16-bit Nostalgia', bg: 'from-emerald-500/20 to-teal-500/20' },
  { value: 'vintage graphic novel', label: 'Graphic Novel', tag: 'Inked Realism', bg: 'from-orange-500/20 to-amber-600/20' },
  { value: 'cyberpunk', label: 'Cyberpunk', tag: 'Neon Hologram', bg: 'from-cyan-500/20 to-fuchsia-500/20' },
];

const RANDOM_STORIES = [
  { prompt: 'A courageous squirrel knight defending the sacred acorn tree from mischievous crow bandits.', hero: 'Sir Acorn', setting: 'forest', tone: 'dramatic' as StoryTone, style: 'comic book' as ArtStyle },
  { prompt: 'A street food vendor in Neo-Kyoto whose ramen cart accidentally travels through time.', hero: 'Master Kenji', setting: 'city', tone: 'funny' as StoryTone, style: 'anime' as ArtStyle },
  { prompt: 'An astronaut botanist discovering an alien flower that sings harmonic lullabies on Mars.', hero: 'Dr. Elena Diaz', setting: 'space', tone: 'poetic' as StoryTone, style: 'vintage graphic novel' as ArtStyle },
  { prompt: 'A teenage gadgeteer building mechanical wings to compete in the sky races of Cloud Haven.', hero: 'Zack Sparks', setting: 'school', tone: 'action-packed' as StoryTone, style: 'comic book' as ArtStyle },
];

export const ComicForm: React.FC<ComicFormProps> = ({ onSubmit, isLoading, loadingStep }) => {
  const [prompt, setPrompt] = useState('A brave young fox ventures into an ancient enchanted forest seeking the lost crystal of eternal spring, discovering whispering trees and glowing firefly spirits.');
  const [characterName, setCharacterName] = useState('Kip the Fox');
  const [setting, setSetting] = useState<string>('forest');
  const [tone, setTone] = useState<StoryTone>('dramatic');
  const [artStyle, setArtStyle] = useState<ArtStyle>('anime');
  const [selectedPreset, setSelectedPreset] = useState<string>('brave-fox');

  const handlePresetSelect = (presetId: string) => {
    const preset = COMIC_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPreset(preset.id);
      setPrompt(preset.request.prompt);
      setCharacterName(preset.request.characterName);
      setSetting(preset.request.setting);
      setTone(preset.request.tone);
      setArtStyle(preset.request.artStyle);
    }
  };

  const handleRandomize = () => {
    const random = RANDOM_STORIES[Math.floor(Math.random() * RANDOM_STORIES.length)];
    setSelectedPreset('');
    setPrompt(random.prompt);
    setCharacterName(random.hero);
    setSetting(random.setting);
    setTone(random.tone);
    setArtStyle(random.style);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({
      prompt: prompt.trim(),
      characterName: characterName.trim() || 'Hero',
      setting,
      tone,
      artStyle,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero Welcome Banner */}
      <div className="relative mb-10 text-center">
        {/* Comic blast background badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] mb-4">
          <Flame className="w-4 h-4 text-slate-950 fill-amber-500" />
          <span className="font-bangers text-base tracking-wider text-slate-950 uppercase">
            Powered by Gemini AI • 5-Panel Story &amp; Art Generation
          </span>
        </div>

        <h1 className="font-bangers text-5xl sm:text-6xl md:text-7xl text-slate-900 tracking-wide uppercase drop-shadow-[3px_3px_0px_#f59e0b] leading-tight">
          Create Your Own Comic Book
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-slate-700 font-comic max-w-2xl mx-auto">
          Type any story idea, select your art style, and let Gemini craft a complete 5-panel comic strip with dialogues, captions, and printable PDF export!
        </p>

        {/* Quick Presets Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mr-1">
            <BookMarked className="w-3.5 h-3.5" /> Presets:
          </span>
          {COMIC_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-slate-900 shadow-[2px_2px_0px_#000] scale-105'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="text-amber-600 font-extrabold text-[10px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                  {preset.badge}
                </span>
                <span>{preset.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={handleRandomize}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border-2 border-dashed border-slate-400 hover:border-slate-800 hover:bg-slate-50 transition-all flex items-center gap-1"
            title="Random idea"
          >
            <Dices className="w-3.5 h-3.5 text-indigo-600" />
            <span>Surprise Me</span>
          </button>
        </div>
      </div>

      {/* Main Creation Card Form */}
      <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_#0f172a] overflow-hidden">
        {/* Card Header Strip */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b-4 border-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-slate-950"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-slate-950"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-slate-950"></div>
            <span className="ml-3 font-bangers text-lg text-amber-300 tracking-wider">
              ISSUE GENERATOR #01
            </span>
          </div>
          <span className="text-xs text-slate-300 font-comic font-medium hidden sm:block">
            Gemini 3.8 Flash • Outline &amp; Narration
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
          {/* Story Prompt Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="prompt" className="font-bangers text-xl text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                1. Story Prompt
              </label>
              <span className="text-xs text-slate-500 font-comic">
                Describe the main conflict or adventure
              </span>
            </div>
            <textarea
              id="prompt"
              rows={3}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setSelectedPreset('');
              }}
              placeholder="E.g., A brave fox ventures into an ancient forest seeking the lost crystal of eternal spring..."
              className="w-full px-4 py-3 text-slate-900 bg-amber-50/40 rounded-xl border-2 border-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-300 font-comic text-base resize-none shadow-inner"
              required
            />
          </div>

          {/* Two-Column: Character Name & Setting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Character Name */}
            <div>
              <label htmlFor="characterName" className="font-bangers text-xl text-slate-900 flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-indigo-500" />
                2. Main Character
              </label>
              <input
                id="characterName"
                type="text"
                value={characterName}
                onChange={(e) => {
                  setCharacterName(e.target.value);
                  setSelectedPreset('');
                }}
                placeholder="E.g., Kip the Fox, Bleep-9, Detective Ren"
                className="w-full px-4 py-3 text-slate-900 bg-amber-50/40 rounded-xl border-2 border-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-300 font-comic text-base shadow-inner"
                required
              />
            </div>

            {/* Setting Dropdown / Selector */}
            <div>
              <label htmlFor="setting" className="font-bangers text-xl text-slate-900 flex items-center gap-2 mb-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                3. Setting / World
              </label>
              <select
                id="setting"
                value={setting}
                onChange={(e) => {
                  setSetting(e.target.value);
                  setSelectedPreset('');
                }}
                className="w-full px-4 py-3 text-slate-900 bg-amber-50/40 rounded-xl border-2 border-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-300 font-comic text-base shadow-inner cursor-pointer"
              >
                {SETTING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Story Tone */}
          <div>
            <label className="font-bangers text-xl text-slate-900 flex items-center gap-2 mb-3">
              <Smile className="w-5 h-5 text-pink-500" />
              4. Story Tone &amp; Mood
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {TONE_OPTIONS.map((t) => {
                const isSelected = tone === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setTone(t.value);
                      setSelectedPreset('');
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-slate-950 shadow-[3px_3px_0px_#000] scale-[1.02]'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bangers text-base tracking-wide capitalize flex items-center justify-between">
                      <span>{t.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                    </div>
                    <div className="text-[11px] font-comic text-slate-600 leading-tight mt-1 line-clamp-1">
                      {t.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Art Style */}
          <div>
            <label className="font-bangers text-xl text-slate-900 flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-cyan-600" />
              5. Visual Art Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {ART_STYLE_OPTIONS.map((style) => {
                const isSelected = artStyle === style.value;
                return (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => {
                      setArtStyle(style.value);
                      setSelectedPreset('');
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all bg-gradient-to-b ${style.bg} ${
                      isSelected
                        ? 'border-slate-950 ring-2 ring-amber-400 shadow-[3px_3px_0px_#000] scale-[1.02]'
                        : 'border-slate-300 hover:border-slate-800 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div className="font-bangers text-base tracking-wide text-slate-900 flex items-center justify-between">
                      <span>{style.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-1">
                      {style.tag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading Progress State */}
          {isLoading && (
            <div className="bg-amber-50 border-3 border-amber-500 rounded-xl p-5 text-center shadow-[4px_4px_0px_#f59e0b] animate-pulse">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Wand2 className="w-6 h-6 text-amber-600 animate-spin" />
                <span className="font-bangers text-2xl text-slate-900">
                  {loadingStep || 'Crafting Your Comic Story...'}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-comic">
                Gemini is scripting panel outlines, generating dialogues, and painting comic panel illustrations. Please hold on!
              </p>
              <div className="w-full bg-amber-200 h-3 rounded-full mt-4 overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full w-3/4 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-bangers text-2xl tracking-wider uppercase border-3 border-slate-950 shadow-[5px_5px_0px_#000] transition-all flex items-center justify-center gap-3 ${
                isLoading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed border-slate-400 shadow-none'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_#000]'
              }`}
            >
              <Sparkles className="w-6 h-6" />
              <span>{isLoading ? 'Generating 5-Panel Comic...' : 'Generate 5-Panel Comic Strip'}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>

      {/* Info Callout Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border-2 border-slate-800 shadow-[3px_3px_0px_#0f172a]">
          <div className="font-bangers text-lg text-amber-600 mb-1">1. Gemini Outline</div>
          <p className="text-xs text-slate-600 font-comic">
            Structured 5-panel arc: Arrival, Discovery, Climax, Breakthrough, and Horizon conclusion.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-slate-800 shadow-[3px_3px_0px_#0f172a]">
          <div className="font-bangers text-lg text-indigo-600 mb-1">2. Dialogue &amp; SFX</div>
          <p className="text-xs text-slate-600 font-comic">
            Authentic comic speech bubbles, character voice direction, and classic sound effect stickers.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border-2 border-slate-800 shadow-[3px_3px_0px_#0f172a]">
          <div className="font-bangers text-lg text-emerald-600 mb-1">3. PDF Publishing</div>
          <p className="text-xs text-slate-600 font-comic">
            Compile into a professional multi-page PDF formatted with cover art, captions, and narrative boxes.
          </p>
        </div>
      </div>
    </div>
  );
};
