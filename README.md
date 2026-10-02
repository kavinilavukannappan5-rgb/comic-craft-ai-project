# ComicCraft: Comic Story Creator using Gemini Models

ComicCraft is an AI-powered full-stack web application that transforms user story prompts into personalized, 5-panel comic book strips complete with character dialogues, captions, vivid illustrations, and high-resolution PDF exports.

---

## 🚀 Key Features

1. **Structured 5-Panel Outline Generation (Gemini 3.8 Flash)**
   - Creates a cohesive narrative arc: Arrival, Discovery, Climax, Breakthrough, and Horizon Resolution.
   - Generates panel titles, scene descriptions, ambient captions, onomatopoeia sound effects (*WHOOSH!*, *CRASH!*), and character speech bubbles.

2. **Personalized Story Narration & Character Direction**
   - Directs character voices across different dialogue modalities (`speech`, `shout`, `thought`, `whisper`).

3. **Comic Book Art & Illustration Engine**
   - Supports 6 distinct visual styles: **Classic Comic Book**, **Cel-Shaded Anime/Manga**, **High-Contrast Noir**, **16-bit Retro Pixel Art**, **Graphic Novel**, and **Cyberpunk Neon**.

4. **Multi-Page PDF Publishing & Export**
   - Exports the 5 panels to a formatted PDF with an issue cover, character metadata, panel frames, speech bubbles, narrative boxes, and timestamped filenames.

5. **Export Confirmation & Success Flow**
   - Concludes generation with a celebration screen, file artifact details, and quick restart options.

6. **REST API & Developer Sandbox**
   - Includes `/api/generate-comic/json` for programmatic access and `/api/test-image` for prompt-to-image testing.

---

## 🛠️ Technical Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend**: Express running server-side with Node.js / tsx.
- **AI Engine**: Google Gemini API via `@google/genai` TypeScript SDK (`gemini-3.8-flash` for outlining and creative writing, with high-fidelity visual generation).
- **PDF Exporter**: `jspdf` multi-page vector & raster layout engine.

---

## 💻 VS Code Setup, Installation & Running

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- A Google Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/))

### 2. Open Project in VS Code
```bash
# Clone or navigate to the project directory
cd comiccraft

# Open in Visual Studio Code
code .
```

### 3. Configure Environment Variables
Create a `.env` file in the root folder (or copy from `.env.example`):
```bash
# .env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```

The application will launch at:
```
http://localhost:3000
```

---

## 🧪 Testing the Application

### Scenario 1: Adventure & Drama (Kip the Fox in Enchanted Forest)
1. In the web interface, click the **Scenario 1** preset chip.
2. Form auto-fills:
   - **Prompt**: *"A brave young fox ventures into an ancient enchanted forest seeking the lost crystal of eternal spring..."*
   - **Hero**: `Kip the Fox`
   - **Setting**: `Enchanted Forest`
   - **Tone**: `Dramatic`
   - **Style**: `Anime / Manga`
3. Click **"Generate 5-Panel Comic Strip"**.
4. Review the 5 panels with captions, dialogues, and sound effect bursts.

### Scenario 2: Comedy & Custom Tone (Zero-G Pancake Chaos)
1. Click **Scenario 2** preset chip:
   - **Prompt**: *"A well-meaning culinary droid attempts to prepare Sunday morning flapjacks in zero gravity..."*
   - **Hero**: `Bleep-9`
   - **Setting**: `Deep Space Station`
   - **Tone**: `Funny`
   - **Art Style**: `Classic Comic`
2. Notice how Gemini re-aligns the narrative voice into light-hearted slapstick.

### Scenario 3: PDF Export & Confirmation
1. On the Comic Preview page, click **"Download Your Comic as PDF"**.
2. The multi-page PDF document compiles and downloads automatically (`ComicCraft_[Title]_[Timestamp].pdf`).
3. You are redirected to the **Comic Export Success Page** with confetti confirmation, download summary, and a **"Go Create Another Comic"** button.

---

## 📡 REST API Reference

### 1. Generate Comic (JSON Payload)
**POST** `/api/generate-comic/json`

**Request Body**:
```json
{
  "prompt": "A brave fox exploring an enchanted forest.",
  "character_name": "Kip the Fox",
  "setting": "forest",
  "tone": "dramatic",
  "art_style": "anime"
}
```

**Response**:
```json
{
  "status": "success",
  "comic_id": "comic_1727850000000",
  "meta": {
    "story_prompt": "A brave fox exploring an enchanted forest.",
    "character_name": "Kip the Fox",
    "setting": "forest",
    "tone": "dramatic",
    "art_style": "anime"
  },
  "title": "The Whispering Woods of Kip",
  "full_story": "Kip stepped quietly into the luminous glow...",
  "layout": [
    {
      "panel_number": 1,
      "title": "Panel 1: Edge of the Canopy",
      "scene_description": "Kip peers into the glowing forest...",
      "caption": "AT SUNRISE...",
      "narration": "The journey had officially begun.",
      "sound_effect": "WHOOSH!",
      "dialogues": [{ "speaker": "Kip", "text": "Here goes nothing.", "type": "speech" }],
      "image_url": "data:image/..."
    }
  ]
}
```

### 2. Test Image Utility
**POST** `/api/test-image`

**Request Body**:
```json
{
  "prompt": "A cybernetic fox on a skyscraper rooftop in the rain",
  "artStyle": "cyberpunk"
}
```
