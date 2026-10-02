import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateOutlineAndStory, generateComicImage } from './server/geminiService';
import { ComicPanel, ComicStory } from './src/types/comic';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Middleware for body parsing
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'ComicCraft',
    engine: 'Google Gemini 3.8 Flash + AI Comic Illustration Engine',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Route: /api/generate
 * Generates complete 5-panel comic from form data or JSON
 */
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      characterName = 'Hero',
      setting = 'forest',
      tone = 'dramatic',
      artStyle = 'comic book',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Story prompt is required' });
    }

    console.log(`[ComicCraft] Generating comic for: "${prompt.slice(0, 50)}..." [Character: ${characterName}, Tone: ${tone}, Style: ${artStyle}]`);

    // 1. Generate 5-panel outline & story via Gemini
    const { panels: rawPanels, fullStoryText, title } = await generateOutlineAndStory({
      prompt,
      characterName,
      setting,
      tone,
      artStyle,
    });

    // 2. Generate illustrations for each of the 5 panels
    const comicPanels: ComicPanel[] = await Promise.all(
      rawPanels.map(async (p, idx) => {
        const imageUrl = await generateComicImage(
          p.imagePrompt || `${prompt} - ${p.sceneDescription}`,
          artStyle,
          idx,
          p.title
        );

        return {
          panelNumber: idx + 1,
          title: p.title || `Panel ${idx + 1}`,
          sceneDescription: p.sceneDescription || '',
          caption: p.caption || `PANEL ${idx + 1}`,
          narration: p.narration || '',
          dialogues: p.dialogues || [],
          soundEffect: p.soundEffect,
          imagePrompt: p.imagePrompt || '',
          imageUrl,
        };
      })
    );

    const comicStory: ComicStory = {
      id: `comic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title || `${characterName} in ${setting}`,
      storyPrompt: prompt,
      characterName,
      setting,
      tone,
      artStyle,
      panels: comicPanels,
      fullStoryText,
      createdAt: new Date().toISOString(),
    };

    return res.json({
      status: 'success',
      comic: comicStory,
    });
  } catch (error) {
    console.error('[ComicCraft API] Error during generation:', error);
    return res.status(500).json({
      error: 'Failed to generate comic story',
      details: (error as Error).message,
    });
  }
});

/**
 * Route: /api/generate-comic/json
 * Standard JSON API Route as specified in technical documentation Milestone 2 & 3
 */
app.post('/api/generate-comic/json', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      character_name,
      characterName,
      setting = 'forest',
      tone = 'dramatic',
      art_style,
      artStyle,
    } = req.body;

    const charName = character_name || characterName || 'Hero';
    const style = art_style || artStyle || 'comic book';

    if (!prompt) {
      return res.status(400).json({ error: 'Missing field: prompt' });
    }

    const { panels: rawPanels, fullStoryText, title } = await generateOutlineAndStory({
      prompt,
      characterName: charName,
      setting,
      tone,
      artStyle: style,
    });

    const panelsWithImages: ComicPanel[] = await Promise.all(
      rawPanels.map(async (p, idx) => {
        const imageUrl = await generateComicImage(
          p.imagePrompt,
          style,
          idx,
          p.title
        );
        return {
          panelNumber: idx + 1,
          title: p.title,
          sceneDescription: p.sceneDescription,
          caption: p.caption,
          narration: p.narration,
          dialogues: p.dialogues,
          soundEffect: p.soundEffect,
          imagePrompt: p.imagePrompt,
          imageUrl,
        };
      })
    );

    const comicId = `comic_${Date.now()}`;

    return res.json({
      status: 'success',
      comic_id: comicId,
      meta: {
        story_prompt: prompt,
        character_name: charName,
        setting,
        tone,
        art_style: style,
        created_at: new Date().toISOString(),
      },
      title,
      full_story: fullStoryText,
      layout: panelsWithImages.map((p) => ({
        panel_number: p.panelNumber,
        title: p.title,
        scene_description: p.sceneDescription,
        caption: p.caption,
        narration: p.narration,
        dialogues: p.dialogues,
        sound_effect: p.soundEffect,
        image_prompt: p.imagePrompt,
        image_url: p.imageUrl,
      })),
      pdf_export_url: `/export-pdf/${comicId}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'JSON comic generation failed',
      message: (error as Error).message,
    });
  }
});

/**
 * Route: /api/test-image
 * Developer utility route for testing prompt-to-image separately
 */
app.post('/api/test-image', async (req: Request, res: Response) => {
  try {
    const { prompt, artStyle = 'comic book', art_style } = req.body;
    const style = artStyle || art_style || 'comic book';

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for test-image' });
    }

    const imageUrl = await generateComicImage(prompt, style, 0, 'Test Panel');

    return res.json({
      status: 'success',
      prompt,
      art_style: style,
      image_url: imageUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Image test generation failed',
      message: (error as Error).message,
    });
  }
});

/**
 * Route: /api/regenerate-panel
 * Regenerate a specific panel's art or narrative
 */
app.post('/api/regenerate-panel', async (req: Request, res: Response) => {
  try {
    const { panelNumber, imagePrompt, artStyle = 'comic book', title } = req.body;
    const imageUrl = await generateComicImage(
      imagePrompt || `Action scene for panel ${panelNumber}`,
      artStyle,
      (panelNumber || 1) - 1,
      title || `Panel ${panelNumber}`
    );

    return res.json({
      status: 'success',
      panelNumber,
      imageUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Vite or Static Middleware setup
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ComicCraft] Server listening on port ${PORT}`);
    console.log(`[ComicCraft] Local URL: http://localhost:${PORT}`);
  });
}

startServer();
