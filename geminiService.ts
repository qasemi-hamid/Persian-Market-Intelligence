
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "./types";

export const getMarketAnalysis = async (): Promise<AnalysisResponse> => {
  const apiKey = process.env.API_KEY;
  
  // بررسی دقیق برای راهنمایی کاربر
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    throw new Error("تنظیمات ناقص: نام متغیر در ورسل باید API_KEY باشد و مقدار آن کد گوگل شما. پس از ذخیره حتما Redeploy کنید.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    به عنوان یک استراتژیست ارشد بازار در ایران، تحلیل دقیقی ارائه بده.
    تمامی قیمت‌ها به تومان باشد.
    
    ماموریت:
    تحلیل حباب، آربیتراژ و پیشنهاد ۳ استراتژی جابجایی (Swap) بین طلا، دلار، تتر و سکه.
    
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

    const data = JSON.parse(response.text);
    return { ...data, sources: [] };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes('API key not valid')) {
      throw new Error("کد API وارد شده در ورسل معتبر نیست. لطفاً کد جدیدی از Google AI Studio دریافت کنید.");
    }
    throw error;
  }
};
