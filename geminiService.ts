
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "./types";

/**
 * Service to fetch market analysis and pricing for the Iranian market
 * using Gemini 3 and Google Search grounding.
 */
export const getMarketAnalysis = async (): Promise<AnalysisResponse> => {
  // Always use process.env.API_KEY directly as required.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    به عنوان یک تحلیلگر خبره بازار ایران:
    ۱. قیمت لحظه‌ای دلار (بازار آزاد)، تتر، سکه امامی و طلای ۱۸ عیار را پیدا کن.
    ۲. وضعیت فعلی بازار را در ۳ خط بسیار کوتاه تحلیل کن.
    ۳. سه استراتژی جابجایی هوشمند پیشنهاد بده.
    پاسخ حتما در قالب JSON باشد.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketOverview: { type: Type.STRING },
            strategies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  pair: { type: Type.STRING },
                  logic: { type: Type.STRING },
                  technicalAnalysis: { type: Type.STRING },
                  fundamentalAnalysis: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
                  confidence: { type: Type.NUMBER },
                  potentialProfit: { type: Type.STRING }
                },
                required: ['title', 'pair', 'logic', 'technicalAnalysis', 'fundamentalAnalysis', 'riskLevel', 'confidence', 'potentialProfit']
              }
            },
            prices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  symbol: { type: Type.STRING },
                  price: { type: Type.STRING },
                  change: { type: Type.STRING },
                  isPositive: { type: Type.BOOLEAN }
                },
                required: ['name', 'symbol', 'price', 'change', 'isPositive']
              }
            }
          },
          required: ['marketOverview', 'strategies', 'prices']
        }
      }
    });

    // Access the .text property directly as per guidelines
    const text = response.text;
    if (!text) throw new Error("پاسخی از هوش مصنوعی دریافت نشد.");

    // Extract grounding source URLs for the UI as required when using search tools
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "منبع خبر",
        uri: chunk.web.uri
      }));

    const parsedData = JSON.parse(text);
    return {
      ...parsedData,
      sources: sources.slice(0, 4) // Include search references
    };

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Graceful handling for quota errors
    if (error.message?.includes("429") || error.message?.includes("QUOTA") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("سهمیه رایگان هوش مصنوعی برای امروز به پایان رسیده است. لطفا دقایقی دیگر دوباره تلاش کنید.");
    }
    
    throw new Error(`خطای سیستمی در دریافت داده‌ها: ${error.message}`);
  }
};
