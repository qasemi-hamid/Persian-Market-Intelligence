
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "./types";

export const getMarketAnalysis = async (): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    به عنوان یک استراتژیست ارشد و معامله‌گر حرفه‌ای بازار (بزاری) در ایران، تحلیل دقیقی ارائه بده.
    تمام مبالغ باید به "تومان" باشد. از کلمه ریال استفاده نکن.
    
    ماموریت شما:
    شناسایی بهترین فرصت‌های تبدیل دارایی (Swap) بر اساس فرمول‌های ریاضی مخفی بازار، تحلیل حباب (Bubble Analysis)، آربیتراژ و نسبت‌های تکنیکال.
    
    بسیار مهم: 
    1. فیلد pair باید یک جمله کامل و واضح فارسی باشد که دقیقا بگوید چه چیزی به چه چیزی تبدیل شود.
       مثال: "تبدیل دلار به سکه امامی" یا "تبدیل طلای ۱۸ عیار به تتر".
    2. فیلد potentialProfit باید درصد سود تخمینی این جابجایی در بازه زمانی کوتاه مدت (۱ تا ۲ هفته) باشد.
       مثال: "۴٪ الی ۶٪"
    
    موارد مورد نیاز:
    1. استخراج قیمت‌های لحظه‌ای از tgju.org (دلار، طلای ۱۸، سکه امامی، تتر، انس).
    2. ارائه حداقل ۳ استراتژی معامله حرفه‌ای (Trade Strategies) که شامل منطق ریاضی، تحلیل تکنیکال/فاندامنتال و تخمین سود باشد.
    
    پاسخ را کاملاً به زبان فارسی، حرفه‌ای و در قالب JSON ارائه بده.
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
                  pair: { type: Type.STRING, description: "A clear Persian sentence like 'تبدیل الف به ب'" },
                  logic: { type: Type.STRING },
                  technicalAnalysis: { type: Type.STRING },
                  fundamentalAnalysis: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
                  confidence: { type: Type.NUMBER },
                  potentialProfit: { type: Type.STRING, description: "Estimated profit percentage, e.g. '5%'" }
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

    const data = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'منبع داده',
      uri: chunk.web?.uri || '#'
    })) || [];

    return { ...data, sources };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
