export type ArtStyle = 
  | 'comic book'
  | 'anime'
  | 'pixel art'
  | 'realistic'
  | 'noir'
  | 'vintage graphic novel'
  | 'cyberpunk';

export type StoryTone = 
  | 'dramatic'
  | 'funny'
  | 'light-hearted'
  | 'poetic'
  | 'suspenseful'
  | 'action-packed';

export type SettingType = 
  | 'forest'
  | 'school'
  | 'space'
  | 'city'
  | 'cyberpunk metropolis'
  | 'ancient dungeon'
  | 'desert wasteland';

export interface DialogueItem {
  speaker: string;
  text: string;
  type: 'speech' | 'shout' | 'thought' | 'whisper';
}

export interface ComicPanel {
  panelNumber: number;
  title: string;
  sceneDescription: string;
  caption: string;
  narration: string;
  dialogues: DialogueItem[];
  soundEffect?: string;
  imagePrompt: string;
  imageUrl: string;
}

export interface ComicStory {
  id: string;
  title: string;
  storyPrompt: string;
  characterName: string;
  setting: string;
  tone: StoryTone;
  artStyle: ArtStyle;
  panels: ComicPanel[];
  fullStoryText: string;
  createdAt: string;
}

export interface ComicGenerationRequest {
  prompt: string;
  characterName: string;
  setting: string;
  tone: StoryTone;
  artStyle: ArtStyle;
}
