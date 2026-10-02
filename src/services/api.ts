import { ComicGenerationRequest, ComicStory } from '../types/comic';

export async function generateComic(request: ComicGenerationRequest): Promise<ComicStory> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
    throw new Error(errorData.error || errorData.details || `Server responded with ${response.status}`);
  }

  const data = await response.json();
  return data.comic;
}

export async function testImagePrompt(prompt: string, artStyle: string): Promise<{ image_url: string; prompt: string }> {
  const response = await fetch('/api/test-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, artStyle }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Failed to test image' }));
    throw new Error(err.error || err.message || 'Image test failed');
  }

  return response.json();
}

export async function regeneratePanelImage(
  panelNumber: number,
  imagePrompt: string,
  artStyle: string,
  title: string
): Promise<string> {
  const response = await fetch('/api/regenerate-panel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ panelNumber, imagePrompt, artStyle, title }),
  });

  if (!response.ok) {
    throw new Error('Failed to regenerate panel image');
  }

  const data = await response.json();
  return data.imageUrl;
}
