import { ComicGenerationRequest } from '../types/comic';

export interface ComicPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  request: ComicGenerationRequest;
}

export const COMIC_PRESETS: ComicPreset[] = [
  {
    id: 'brave-fox',
    name: 'The Enchanted Forest',
    badge: 'Scenario 1',
    description: 'A brave fox exploring glowing runes and mysterious woodland creatures.',
    request: {
      prompt: 'A brave young fox ventures into an ancient enchanted forest seeking the lost crystal of eternal spring, discovering whispering trees and glowing firefly spirits.',
      characterName: 'Kip the Fox',
      setting: 'forest',
      tone: 'dramatic',
      artStyle: 'anime',
    },
  },
  {
    id: 'clumsy-robot',
    name: 'Pancake Pandemonium in Zero-G',
    badge: 'Scenario 2',
    description: 'A cheerful kitchen droid causing delicious chaos in a space station.',
    request: {
      prompt: 'A well-meaning culinary droid attempts to prepare Sunday morning flapjacks in zero gravity, triggering a floating batter disaster across the orbital station.',
      characterName: 'Bleep-9',
      setting: 'space',
      tone: 'funny',
      artStyle: 'comic book',
    },
  },
  {
    id: 'neon-detective',
    name: 'Shadows of Neo-Tokyo',
    badge: 'Cyberpunk Noir',
    description: 'A weary cyber-investigator tracing a stolen neural memory cartridge in the rain.',
    request: {
      prompt: 'A lone detective in a rain-drenched neon metropolis uncovers a glowing memory shard containing the blueprint to the city power grid.',
      characterName: 'Detective Ren Vance',
      setting: 'city',
      tone: 'suspenseful',
      artStyle: 'noir',
    },
  },
  {
    id: 'magic-academy',
    name: 'The Accidental Sorcerer',
    badge: 'School Fantasy',
    description: 'A rookie student casting a levitation charm that goes wonderfully wrong.',
    request: {
      prompt: 'A first-year student at Arcane High attempts an easy levitation spell during exams, accidentally turning the entire classroom library upside down.',
      characterName: 'Aria Thorne',
      setting: 'school',
      tone: 'light-hearted',
      artStyle: 'anime',
    },
  },
];
