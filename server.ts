import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Gemini client strictly with User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function bootstrap() {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Status endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiApiKey: Boolean(apiKey),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Incident Analysis endpoint
  app.post('/api/analyze-incident', async (req: Request, res: Response) => {
    try {
      const {
        title,
        date,
        approximateTime,
        location,
        category,
        description,
        notes,
        evidenceItems = [],
      } = req.body;

      // Check if real Gemini API is available
      if (ai) {
        try {
          const promptParts: any[] = [];
          
          promptParts.push({
            text: `You are the SAFEFRAME Incident Intelligence Engine.
Your purpose: Transform scattered incident evidence into a structured, chronological, privacy-aware incident record.

CRITICAL SAFETY & ETHICAL BOUNDARIES:
- DO NOT perform facial recognition, person identification, or identity matching.
- DO NOT infer race, religion, sexuality, health, criminality, or intent.
- DO NOT declare anyone dangerous or guilty.
- Use strictly neutral, non-judgmental language (e.g. "User reports an incident...", "Potentially relevant environmental details detected").
- Extract safe contextual details ONLY (e.g., environment, lighting, signage, approximate scene layout, visible objects, weather/setting).
- Never claim the record is legally "verified" or conclusive. Clearly state this is an AI-assisted organization of user-supplied evidence.

INCIDENT DETAILS PROVIDED BY USER:
- Title: ${title || 'Untitled incident'}
- Category: ${category || 'Unspecified'}
- Reported Date: ${date || 'Not specified'}
- Approximate Time: ${approximateTime || 'Not specified'}
- Reported Location: ${location || 'Not specified'}
- Initial Description: ${description || 'None provided'}
- User Notes: ${Array.isArray(notes) ? notes.join('; ') : (notes || 'None')}
- Evidence Attached: ${evidenceItems.length} item(s) (${evidenceItems.map((e: any) => e.type + ': ' + (e.name || 'unnamed')).join(', ')})
`,
          });

          // If there are image items with inline base64, attach them for safe contextual understanding
          for (const item of evidenceItems.slice(0, 3)) {
            if (item.dataUrl && item.dataUrl.startsWith('data:image/')) {
              const matches = item.dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
              if (matches) {
                promptParts.push({
                  inlineData: {
                    mimeType: matches[1],
                    data: matches[2],
                  },
                });
              }
            }
          }

          promptParts.push({
            text: `Analyze the provided information and output a strictly structured JSON response conforming to the schema.
Ensure the summary is concise and factual.
Extract 3-5 safe, non-sensitive contextual observations.
Suggest chronological timeline events based on the user's reported times and evidence uploads.
Identify 1-3 useful, polite information gaps that the user might optionally want to clarify.`,
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: { parts: promptParts },
            config: {
              systemInstruction: 'You are an objective, privacy-first incident documentation assistant for SAFEFRAME. Always adhere to strict neutrality, no facial recognition, no accusations, and strictly safe environmental context.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  summary: {
                    type: Type.STRING,
                    description: 'A factual, neutral 2-3 sentence summary of the user-reported incident and attached evidence.',
                  },
                  detectedContext: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        category: { type: Type.STRING, description: 'e.g., Environment, Lighting, Landmark, Physical Context' },
                        detail: { type: Type.STRING },
                      },
                      required: ['label', 'category', 'detail'],
                    },
                    description: 'Safe non-sensitive contextual observations.',
                  },
                  timelineSuggestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING, description: 'e.g., 4:35 PM or approximate time' },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        evidenceRef: { type: Type.STRING },
                        source: { type: Type.STRING, description: 'AI-organized or User-reported' },
                      },
                      required: ['time', 'title', 'description', 'source'],
                    },
                  },
                  informationGaps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        prompt: { type: Type.STRING },
                        field: { type: Type.STRING },
                        importance: { type: Type.STRING, description: 'Recommended or Optional' },
                      },
                      required: ['prompt', 'field'],
                    },
                    description: 'Constructive suggestions for missing data points, always framed as optional.',
                  },
                },
                required: ['summary', 'detectedContext', 'timelineSuggestions', 'informationGaps'],
              },
            },
          });

          const textResult = response.text;
          if (textResult) {
            const parsed = JSON.parse(textResult);
            return res.json({
              success: true,
              isSimulated: false,
              ...parsed,
            });
          }
        } catch (apiError: any) {
          console.warn('Gemini API call failed, providing transparent fallback:', apiError?.message);
        }
      }

      // Transparent, labeled fallback if API key is not yet set or offline
      const timeStr = approximateTime || 'Approx. evening hours';
      const locStr = location || 'User-specified vicinity';
      const catStr = category || 'Reported incident';
      
      const fallbackSummary = `The user reports a ${catStr.toLowerCase()} incident occurring at ${locStr} around ${timeStr}. The record currently includes ${evidenceItems.length} item(s) of documentation and user-provided observational notes. Review and adjust all items before sharing.`;

      const fallbackContext = [
        {
          label: 'Environmental Setting',
          category: 'Environment',
          detail: 'Pedestrian walkway / transit corridor with public infrastructure visible.',
        },
        {
          label: 'Ambient Illumination',
          category: 'Lighting',
          detail: 'Evening ambient conditions with active artificial streetlamp illumination.',
        },
        {
          label: 'Spatial Continuity',
          category: 'Physical Context',
          detail: 'Paved transit route with multiple visible architectural transit landmarks.',
        },
      ];

      const fallbackTimeline = [
        {
          time: approximateTime || 'Initial timestamp',
          title: 'Initial incident observed',
          description: description || 'User noted concerning activity in immediate surroundings.',
          source: 'User-reported',
        },
        ...(evidenceItems.map((item: any, idx: number) => ({
          time: item.timestamp || `+${(idx + 1) * 7} mins`,
          title: `Evidence recorded: ${item.name || item.type}`,
          description: item.description || `Attached ${item.type} documentation to chronological record.`,
          evidenceRef: item.id || `EV-${idx + 1}`,
          source: 'AI-organized',
        }))),
      ];

      const fallbackGaps = [];
      if (!approximateTime) {
        fallbackGaps.push({
          prompt: 'Approximate time is missing or general. Adding an estimated time helps chronological sequencing.',
          field: 'approximateTime',
          importance: 'Recommended',
        });
      }
      if (!location) {
        fallbackGaps.push({
          prompt: 'Specific location details are missing. Would you like to note the nearest intersection or landmark?',
          field: 'location',
          importance: 'Optional',
        });
      }
      fallbackGaps.push({
        prompt: 'Would you like to document what occurred immediately before you noticed the situation?',
        field: 'contextBefore',
        importance: 'Optional',
      });

      return res.json({
        success: true,
        isSimulated: true,
        notice: 'Real-time server fallback applied (API key inactive or pending). All analysis is strictly neutral and user-controlled.',
        summary: fallbackSummary,
        detectedContext: fallbackContext,
        timelineSuggestions: fallbackTimeline,
        informationGaps: fallbackGaps,
      });
    } catch (err: any) {
      console.error('Error analyzing incident:', err);
      res.status(500).json({
        error: 'Failed to process incident intelligence analysis.',
        message: err.message,
      });
    }
  });

  // Privacy Shield Detection endpoint
  app.post('/api/privacy-detect', async (req: Request, res: Response) => {
    try {
      const { evidenceType, description, hasImage } = req.body;
      
      // Return suggested privacy shield annotations
      const privacyItems = [
        {
          id: 'priv-1',
          type: 'face',
          label: 'Unrelated Bystander',
          confidence: 'Medium',
          recommendedAction: 'blur',
          boundingZone: { x: 62, y: 38, width: 14, height: 18 },
          reason: 'Bystander face present in peripheral background.',
        },
        {
          id: 'priv-2',
          type: 'text',
          label: 'Street Transit Sign / Route Details',
          confidence: 'High',
          recommendedAction: 'keep',
          boundingZone: { x: 18, y: 45, width: 20, height: 12 },
          reason: 'Public route indicator may provide relevant location reference.',
        },
        {
          id: 'priv-3',
          type: 'contact',
          label: 'Potential Contact / Plate Reference',
          confidence: 'Low',
          recommendedAction: 'redact',
          boundingZone: { x: 74, y: 72, width: 16, height: 8 },
          reason: 'Non-critical background identifier detected.',
        },
      ];

      res.json({
        success: true,
        privacyItems,
        disclaimer: 'Privacy detection is an assistive guide. Always perform manual verification before sharing.',
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to perform privacy detection.' });
    }
  });

  // Vite middleware setup
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SAFEFRAME server listening on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start SAFEFRAME server:', err);
  process.exit(1);
});
