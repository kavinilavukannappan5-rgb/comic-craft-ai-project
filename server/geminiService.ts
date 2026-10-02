import { GoogleGenAI, Type } from '@google/genai';
import { ComicPanel, StoryTone, ArtStyle } from '../src/types/comic';

// Initialize Gemini client with proper User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
export const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface RawPanelData {
  panelNumber: number;
  title: string;
  sceneDescription: string;
  caption: string;
  narration: string;
  dialogues: Array<{
    speaker: string;
    text: string;
    type: 'speech' | 'shout' | 'thought' | 'whisper';
  }>;
  soundEffect?: string;
  imagePrompt: string;
}

/**
 * Generates a structured 5-panel comic outline using Gemini Flash
 */
export async function generateOutlineAndStory(params: {
  prompt: string;
  characterName: string;
  setting: string;
  tone: StoryTone;
  artStyle: ArtStyle;
}): Promise<{ panels: RawPanelData[]; fullStoryText: string; title: string }> {
  const { prompt, characterName, setting, tone, artStyle } = params;

  const systemInstruction = `You are a master comic book author, director, and storyboard artist.
Your mission is to convert a user's story prompt into an immersive 5-panel comic book strip.
Each comic panel must feature:
1. panelNumber: Integer from 1 to 5.
2. title: An evocative comic episode or panel title (e.g., "Panel 1: The Whispering Grove").
3. sceneDescription: Atmospheric, cinematic visual description of what happens in the scene (written in descriptive prose).
4. caption: Classic comic narrative caption box (e.g., "DEEP IN THE HEART OF ELDERWOOD...", "SECONDS LATER...").
5. narration: Expressive paragraph narrating the protagonist's actions and emotions.
6. dialogues: Array of spoken or thought dialogue bubbles. Include character name ("${characterName}" or other characters) and dialogue type (speech, shout, thought, whisper).
7. soundEffect: Dynamic comic onomatopoeia (e.g., "WHOOSH!", "CRACKLE!", "BZZT!", "BAM!", "CLICK!").
8. imagePrompt: A hyper-detailed visual prompt specifically tailored to art style "${artStyle}", describing character appearance, dramatic lighting, angle, colors, and camera framing without text.

The storyline must have an introduction (Panel 1), rising intrigue (Panel 2), turning point/climax (Panel 3), resolution action (Panel 4), and satisfying cliffhanger or conclusion (Panel 5).
Story Tone: "${tone}". Setting: "${setting}". Main Character: "${characterName}". Art Style: "${artStyle}".`;

  const userPrompt = `Create a 5-panel comic story for this prompt:
"${prompt}"

Main Character: ${characterName}
Setting: ${setting}
Tone: ${tone}
Art Style: ${artStyle}

Return a valid JSON object matching the requested schema with title, panels array (exactly 5 panels), and fullStoryText.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Catchy comic strip title',
            },
            fullStoryText: {
              type: Type.STRING,
              description: 'Complete continuous story narration for the whole strip',
            },
            panels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  panelNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  sceneDescription: { type: Type.STRING },
                  caption: { type: Type.STRING },
                  narration: { type: Type.STRING },
                  soundEffect: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING },
                  dialogues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING },
                        text: { type: Type.STRING },
                        type: {
                          type: Type.STRING,
                          enum: ['speech', 'shout', 'thought', 'whisper'],
                        },
                      },
                      required: ['speaker', 'text', 'type'],
                    },
                  },
                },
                required: [
                  'panelNumber',
                  'title',
                  'sceneDescription',
                  'caption',
                  'narration',
                  'imagePrompt',
                  'dialogues',
                ],
              },
            },
          },
          required: ['title', 'fullStoryText', 'panels'],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return {
      title: parsed.title || `${characterName}'s Adventure in ${setting}`,
      fullStoryText: parsed.fullStoryText || prompt,
      panels: (parsed.panels || []).slice(0, 5),
    };
  } catch (error) {
    console.error('Error generating comic outline with Gemini:', error);
    // Fallback template if Gemini call encountered transient error
    return generateFallbackComicStructure(params);
  }
}

/**
 * Generates an illustration image for a panel using Gemini Image Model with graceful stylized SVG/Canvas visual generation
 */
export async function generateComicImage(
  prompt: string,
  artStyle: ArtStyle,
  panelIndex: number,
  title: string
): Promise<string> {
  const fullImagePrompt = `Comic book art style: ${artStyle}. ${prompt}. High quality graphic novel illustration, vibrant colors, comic ink outlines, dramatic perspective, detailed background, dynamic lighting, no text watermark.`;

  // Attempt generation using Gemini image model
  if (apiKey) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: fullImagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '4:3',
          },
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    } catch (err) {
      console.warn(`Gemini image generation unavailable for panel ${panelIndex + 1}, using artistic comic rendering:`, (err as Error).message);
    }
  }

  // Generate stylized SVG/Vector Comic artwork matching the prompt, palette, and panel
  return generateArtisticComicSvg(prompt, artStyle, panelIndex, title);
}

/**
 * Creates high-fidelity stylized comic art SVG as a reliable data URI
 */
function generateArtisticComicSvg(
  prompt: string,
  artStyle: ArtStyle,
  panelIndex: number,
  title: string
): string {
  const colorPalettes = [
    { bg1: '#1e1b4b', bg2: '#312e81', accent: '#f59e0b', rim: '#38bdf8', mood: 'Mystic Indigo' },
    { bg1: '#0f172a', bg2: '#1e293b', accent: '#ec4899', rim: '#fb7185', mood: 'Cyber Neon' },
    { bg1: '#14532d', bg2: '#166534', accent: '#fbbf24', rim: '#4ade80', mood: 'Emerald Forest' },
    { bg1: '#4c0519', bg2: '#881337', accent: '#fde047', rim: '#f43f5e', mood: 'Crimson Fury' },
    { bg1: '#172554', bg2: '#1e3a8a', accent: '#38bdf8', rim: '#a855f7', mood: 'Cosmic Twilight' },
  ];

  const palette = colorPalettes[panelIndex % colorPalettes.length];
  const soundEffects = ['POW!', 'CRACKLE!', 'WHOOSH!', 'ZAP!', 'SHING!'];
  const soundFx = soundEffects[panelIndex % soundEffects.length];

  // Sanitize title for SVG
  const cleanTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cleanPrompt = prompt.slice(0, 80).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '...';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="skyGrad${panelIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}" />
      <stop offset="60%" stop-color="${palette.bg2}" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <radialGradient id="sunGlow${panelIndex}" cx="70%" cy="30%" r="50%">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.8" />
      <stop offset="50%" stop-color="${palette.rim}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="transparent" stop-opacity="0" />
    </radialGradient>
    <pattern id="halftone${panelIndex}" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="8" r="1.8" fill="${palette.accent}" opacity="0.15" />
    </pattern>
    <filter id="comicShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="#000000" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="800" height="600" fill="url(#skyGrad${panelIndex})" />
  <rect width="800" height="600" fill="url(#sunGlow${panelIndex})" />
  <rect width="800" height="600" fill="url(#halftone${panelIndex})" />

  <!-- Action Speed Lines / Rays -->
  <g stroke="${palette.rim}" stroke-width="1.5" opacity="0.2">
    <line x1="400" y1="300" x2="0" y2="0" />
    <line x1="400" y1="300" x2="800" y2="0" />
    <line x1="400" y1="300" x2="0" y2="600" />
    <line x1="400" y1="300" x2="800" y2="600" />
    <line x1="400" y1="300" x2="400" y2="0" />
    <line x1="400" y1="300" x2="0" y2="300" />
    <line x1="400" y1="300" x2="800" y2="300" />
  </g>

  <!-- Silhouette Landscape / Architecture -->
  <path d="M 0,480 Q 200,420 400,460 T 800,430 L 800,600 L 0,600 Z" fill="#090d16" stroke="#000" stroke-width="3" />
  <path d="M 0,520 Q 300,470 550,510 T 800,490 L 800,600 L 0,600 Z" fill="#020617" stroke="#000" stroke-width="2" />

  <!-- Dramatic Hero Light Aura -->
  <circle cx="400" cy="340" r="140" fill="${palette.accent}" opacity="0.25" filter="blur(20px)" />

  <!-- Stylized Comic Character Silhouette / Hero Pose -->
  <g transform="translate(340, 250)" filter="url(#comicShadow)">
    <!-- Aura rim -->
    <path d="M 60,30 Q 30,10 60,-20 Q 90,10 60,30 Z" fill="${palette.accent}" />
    <!-- Character Head / Helmet -->
    <circle cx="60" cy="20" r="26" fill="#0f172a" stroke="${palette.accent}" stroke-width="3" />
    <!-- Glowing visor / eyes -->
    <rect x="50" y="16" width="22" height="6" rx="3" fill="#ffffff" />
    <!-- Torso and cape / coat -->
    <path d="M 35,45 Q 60,40 85,45 L 98,160 Q 60,175 22,160 Z" fill="#020617" stroke="${palette.rim}" stroke-width="3" />
    <!-- Hero cape fluttering -->
    <path d="M 32,50 Q -10,90 -25,180 Q 20,130 36,95 Z" fill="${palette.accent}" opacity="0.85" stroke="#000" stroke-width="2" />
    <!-- Arms / Action dynamic pose -->
    <path d="M 35,55 L -10,100 L 5,115 L 42,75 Z" fill="#0f172a" stroke="#000" stroke-width="2" />
    <path d="M 85,55 L 130,95 L 120,112 L 78,75 Z" fill="#0f172a" stroke="#000" stroke-width="2" />
  </g>

  <!-- Comic Action Sound FX Burst -->
  <g transform="translate(560, 110)">
    <polygon points="0,20 30,-10 45,15 80,-5 75,35 110,40 85,70 120,95 80,105 75,140 45,115 20,140 25,100 -10,95 15,65 -20,40" fill="${palette.accent}" stroke="#0f172a" stroke-width="4" filter="url(#comicShadow)" />
    <text x="45" y="75" font-family="'Bangers', 'Impact', sans-serif" font-size="34" font-weight="bold" fill="#0f172a" text-anchor="middle" transform="rotate(-6, 45, 75)">${soundFx}</text>
  </g>

  <!-- Panel Style Badge Header -->
  <rect x="24" y="24" width="240" height="42" rx="4" fill="#0f172a" stroke="${palette.accent}" stroke-width="2" filter="url(#comicShadow)" />
  <text x="36" y="52" font-family="'Bangers', sans-serif" font-size="20" fill="#f8fafc" letter-spacing="1">PANEL ${panelIndex + 1} • ${artStyle.toUpperCase()}</text>

  <!-- Scene Subtext Bar -->
  <rect x="24" y="524" width="752" height="52" rx="4" fill="#0f172a" opacity="0.9" stroke="#334155" stroke-width="1.5" />
  <text x="40" y="556" font-family="sans-serif" font-size="14" font-style="italic" fill="#cbd5e1">${cleanPrompt}</text>

  <!-- Classic Comic Border Inset -->
  <rect x="10" y="10" width="780" height="580" fill="none" stroke="#0f172a" stroke-width="8" />
  <rect x="14" y="14" width="772" height="572" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.3" />
</svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Fallback comic structure generator if Gemini has connectivity issues
 */
function generateFallbackComicStructure(params: {
  prompt: string;
  characterName: string;
  setting: string;
  tone: StoryTone;
  artStyle: ArtStyle;
}): { panels: RawPanelData[]; fullStoryText: string; title: string } {
  const { prompt, characterName, setting, tone, artStyle } = params;
  return {
    title: `The Chronicles of ${characterName}: Mystery of the ${setting}`,
    fullStoryText: `${characterName} embarked on an unforgettable journey through the ${setting}. Faced with insurmountable odds and breathtaking wonders, their perseverance uncovered truths hidden for generations.`,
    panels: [
      {
        panelNumber: 1,
        title: `Panel 1: Arrival at the ${setting}`,
        sceneDescription: `${characterName} stands on the threshold of the vast ${setting}, their silhouette framed against the morning horizon.`,
        caption: `AT THE EDGE OF THE UNKNOWN...`,
        narration: `With steady breath, ${characterName} took their first steps forward into the uncharted realm.`,
        soundEffect: 'WHOOSH!',
        imagePrompt: `Wide cinematic shot of ${characterName} arriving at the mysterious ${setting}, ${artStyle} style, detailed lighting`,
        dialogues: [
          {
            speaker: characterName,
            text: `This is where it all begins. No turning back now.`,
            type: 'speech',
          },
        ],
      },
      {
        panelNumber: 2,
        title: `Panel 2: Signs of the Unseen`,
        sceneDescription: `An eerie discovery catches ${characterName}'s attention among the shadows of the ${setting}.`,
        caption: `MOMENTS DEEPER INSIDE...`,
        narration: `A strange vibrational pulse echoed through the air, vibrating the dust beneath their boots.`,
        soundEffect: 'HUMMMM!',
        imagePrompt: `Close-up shot of ${characterName} inspecting glowing artifacts in the ${setting}, ${artStyle} style, rim light`,
        dialogues: [
          {
            speaker: characterName,
            text: `These markings... they're completely fresh!`,
            type: 'whisper',
          },
        ],
      },
      {
        panelNumber: 3,
        title: `Panel 3: The Turning Point`,
        sceneDescription: `An unexpected entity or obstacle surges into view, forcing immediate decisive action.`,
        caption: `SUDDENLY, THE GROUND TREMBLES!`,
        narration: `Without warning, the quietude shattered into radiant chaos.`,
        soundEffect: 'CRASH!',
        imagePrompt: `Dynamic high-action shot of ${characterName} dodging or confronting a giant kinetic anomaly in the ${setting}, ${artStyle} style`,
        dialogues: [
          {
            speaker: characterName,
            text: `Hold your ground! I won't let fear dictate this moment!`,
            type: 'shout',
          },
        ],
      },
      {
        panelNumber: 4,
        title: `Panel 4: The Breakthrough`,
        sceneDescription: `${characterName} harnesses their wits and courage, unlocking the secret pathway through the ${setting}.`,
        caption: `AGAINST ALL ODDS...`,
        narration: `In a flash of brilliant insight, the mechanism responded to their touch.`,
        soundEffect: 'CLICK-CLACK!',
        imagePrompt: `Heroic shot of ${characterName} unlocking glowing ancient sigil or technology in ${setting}, ${artStyle} style, golden radiance`,
        dialogues: [
          {
            speaker: characterName,
            text: `It worked! The pathway is finally clearing!`,
            type: 'speech',
          },
        ],
      },
      {
        panelNumber: 5,
        title: `Panel 5: The Horizon Unfolds`,
        sceneDescription: `${characterName} looks onward as the veil lifts, greeting the dawn of a legendary new chapter.`,
        caption: `AND THUS, A NEW LEGEND DAWNS...`,
        narration: `Though the first trial was survived, the greater mysteries of the world were only just beginning to stir.`,
        soundEffect: 'SHINGGG!',
        imagePrompt: `Majestic wide vista shot of ${characterName} gazing toward a breathtaking sunrise or distant citadel, ${artStyle} style`,
        dialogues: [
          {
            speaker: characterName,
            text: `Whatever lies beyond... I'm ready.`,
            type: 'thought',
          },
        ],
      },
    ],
  };
}
