import jsPDF from 'jspdf';
import { ComicStory } from '../types/comic';

/**
 * Converts any image format (SVG, base64 PNG, etc.) to a standard PNG data URL for jsPDF compatibility
 */
function toPngDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl) {
      resolve('');
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png', 0.95));
        } else {
          resolve(dataUrl);
        }
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Exports the full ComicCraft story into a multi-page, professional PDF file
 */
export async function exportComicToPdf(comic: ComicStory): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // ================= PAGE 1: COVER PAGE =================
  // Dark classic comic cover background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Comic Header Banner
  doc.setFillColor(245, 158, 11); // amber-500
  doc.rect(margin, 20, contentWidth, 24, 'F');
  doc.setDrawColor(2, 6, 23);
  doc.setLineWidth(1.2);
  doc.rect(margin, 20, contentWidth, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text('COMICCRAFT PRESENTS', pageWidth / 2, 35, { align: 'center' });

  // Story Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(254, 240, 138); // amber-200
  const titleLines = doc.splitTextToSize(comic.title.toUpperCase(), contentWidth - 10);
  doc.text(titleLines, pageWidth / 2, 62, { align: 'center' });

  // Cover Feature Illustration (Panel 1 or hero illustration)
  if (comic.panels[0]?.imageUrl) {
    try {
      const pngCover = await toPngDataUrl(comic.panels[0].imageUrl);
      const imgHeight = 110;
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(2);
      doc.rect(margin, 82, contentWidth, imgHeight, 'S');
      doc.addImage(pngCover, 'PNG', margin + 1, 83, contentWidth - 2, imgHeight - 2);
    } catch (e) {
      console.warn('Cover image render error:', e);
    }
  }

  // Meta Box (Character, Setting, Tone, Art Style)
  const metaY = 205;
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, metaY, contentWidth, 48, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  doc.rect(margin, metaY, contentWidth, 48, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(245, 158, 11);
  doc.text('ISSUE DETAILS & STORY METADATA', margin + 6, metaY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  doc.text(`Protagonist:  ${comic.characterName}`, margin + 6, metaY + 20);
  doc.text(`Environment:   ${comic.setting}`, margin + 6, metaY + 28);
  doc.text(`Story Tone:    ${comic.tone.toUpperCase()}`, margin + 95, metaY + 20);
  doc.text(`Visual Style:  ${comic.artStyle.toUpperCase()}`, margin + 95, metaY + 28);
  doc.text(`Original Prompt: "${comic.storyPrompt.slice(0, 75)}..."`, margin + 6, metaY + 39);

  // Footer Tagline
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated with ComicCraft AI Engine • Powered by Google Gemini', pageWidth / 2, 275, {
    align: 'center',
  });

  // ================= PAGES 2..6: PANELS =================
  for (let i = 0; i < comic.panels.length; i++) {
    const panel = comic.panels[i];
    doc.addPage();

    // Background paper tint
    doc.setFillColor(254, 252, 232); // amber-50
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Page Border Frame
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');

    // Panel Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(margin, 16, contentWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(`PANEL ${panel.panelNumber} OF ${comic.panels.length}:  ${panel.title.toUpperCase()}`, margin + 6, 27);

    // Panel Illustration Image
    const panelImgY = 36;
    const panelImgHeight = 110;

    if (panel.imageUrl) {
      try {
        const pngData = await toPngDataUrl(panel.imageUrl);
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(1.8);
        doc.rect(margin, panelImgY, contentWidth, panelImgHeight, 'S');
        doc.addImage(pngData, 'PNG', margin + 0.8, panelImgY + 0.8, contentWidth - 1.6, panelImgHeight - 1.6);
      } catch (err) {
        console.warn(`Panel ${i + 1} image render error:`, err);
      }
    }

    // Sound effect stamp overlay on image if present
    if (panel.soundEffect) {
      doc.setFillColor(245, 158, 11);
      doc.rect(contentWidth - 28, panelImgY + 6, 36, 12, 'F');
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(1);
      doc.rect(contentWidth - 28, panelImgY + 6, 36, 12, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(panel.soundEffect, contentWidth - 10, panelImgY + 14.5, { align: 'center' });
    }

    // Caption Box (Classic comic narrative box at top of text section)
    let currentY = panelImgY + panelImgHeight + 8;

    if (panel.caption) {
      doc.setFillColor(254, 240, 138); // vintage yellow
      doc.rect(margin, currentY, contentWidth, 10, 'F');
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.8);
      doc.rect(margin, currentY, contentWidth, 10, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`[CAPTION] ${panel.caption}`, margin + 4, currentY + 7);
      currentY += 14;
    }

    // Scene Description in Italics
    if (panel.sceneDescription) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105); // slate-600
      const descLines = doc.splitTextToSize(`Scene: ${panel.sceneDescription}`, contentWidth);
      doc.text(descLines, margin, currentY);
      currentY += descLines.length * 4.5 + 4;
    }

    // Narration Box
    if (panel.narration) {
      doc.setFillColor(241, 245, 249); // slate-100
      const narrLines = doc.splitTextToSize(panel.narration, contentWidth - 12);
      const boxHeight = narrLines.length * 4.8 + 8;

      doc.rect(margin, currentY, contentWidth, boxHeight, 'F');
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.7);
      doc.rect(margin, currentY, contentWidth, boxHeight, 'S');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(narrLines, margin + 6, currentY + 6);
      currentY += boxHeight + 4;
    }

    // Dialogues / Speech Bubbles
    if (panel.dialogues && panel.dialogues.length > 0) {
      for (const diag of panel.dialogues) {
        doc.setFillColor(255, 255, 255);
        const diagText = `"${diag.text}"`;
        const diagLines = doc.splitTextToSize(diagText, contentWidth - 36);
        const bubbleHeight = diagLines.length * 4.5 + 8;

        // Rounded speech bubble
        doc.roundedRect(margin + 6, currentY, contentWidth - 12, bubbleHeight, 3, 3, 'FD');

        // Speaker tag
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(194, 65, 12); // amber-700
        doc.text(`${diag.speaker.toUpperCase()} (${diag.type}):`, margin + 10, currentY + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(diagLines, margin + 10, currentY + 11);

        currentY += bubbleHeight + 3;
      }
    }

    // Footer with comic title and page numbering
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`ComicCraft • ${comic.title}`, margin, 283);
    doc.text(`Page ${i + 2} of ${comic.panels.length + 1}`, pageWidth - margin, 283, { align: 'right' });
  }

  // Generate safe filename and trigger download
  const safeTitle = comic.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  const filename = `ComicCraft_${safeTitle}_${Date.now()}.pdf`;
  doc.save(filename);

  return filename;
}
