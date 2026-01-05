
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "./types";

export const getMarketAnalysis = async (): Promise<AnalysisResponse> => {
  // این نام دقیقاً باید در پنل Vercel در کادر Key وارد شده باشد
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("کلید پیدا نشد: در پنل ورسل، نام را API_KEY بگذارید. (حروف بزرگ)");
  }

  if (!apiKey.startsWith("AIza")) {
    throw new Error("فرمت کلید غلط است: کلید باید با AIza شروع شود. شما احتمالاً چیز دیگری در کادر Value گذاشته‌اید.");
  }

  // ایجاد کلاینت جدید برای هر درخواست جهت اطمینان از تازگی تنظیمات
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    تحلیل حرفه‌ای بازار ایران (طلا، سکه، دلار، تتر).
    قیمت‌های لحظه‌ای را پیدا کن و ۳ استراتژی جابجایی (Swap) پیشنهاد بده.
    پاسخ فقط و فقط در قالب JSON باشد.
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

    if (!response.text) throw new Error("پاسخی از هوش مصنوعی دریافت نشد.");
    
    const data = JSON.parse(response.text);
    return { ...data, sources: [] };
  } catch (error: any) {
    console.error("Detailed API Error:", error);
    
    // تشخیص نوع خطا برای راهنمایی کاربر
    const errorMsg = error.toString();
    if (errorMsg.includes("API key not valid") || errorMsg.includes("403") || errorMsg.includes("401")) {
      throw new Error("گوگل کلید شما را رد کرد! یا کپی/پیست ناقص بوده یا پروژه گوگل شما فعال نیست.");
    }
    
    throw new Error(`خطای سیستمی: ${error.message || "ارتباط با سرور گوگل برقرار نشد"}`);
  }
};
