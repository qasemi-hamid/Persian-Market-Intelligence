
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "./types";

export const getMarketAnalysis = async (): Promise<AnalysisResponse> => {
  // استفاده از متغیر محیطی برای امنیت و پایداری کلید API
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    شما یک تحلیل‌گر ارشد و خبره بازار مالی ایران هستید که به داده‌های سایت TGJU.org دسترسی دارید.
    
    ماموریت شما:
    1. استخراج دقیق قیمت‌های لحظه‌ای از سایت "https://www.tgju.org" برای موارد زیر:
       - دلار بازار آزاد
       - سکه امامی
       - طلای ۱۸ عیار
       - تتر (USDT به تومان)
       - انس جهانی طلا
    2. تحلیل وضعیت حباب در بازار طلا و سکه (محاسبه حباب با فرمول‌های دقیق بازار).
    3. شناسایی حداقل ۳ فرصت "جابجایی هوشمند" (Swap) بین دارایی‌ها (مثلاً تبدیل تتر به طلا یا بالعکس).
    
    الزامات پاسخ:
    - تمام قیمت‌ها و مبالغ حتماً به "تومان" (Toman) باشد.
    - تحلیل‌ها باید شامل "منطق ریاضی" (مثلاً نسبت طلا به دلار) باشد.
    - پاسخ باید یک JSON معتبر و دقیق باشد.
    - زبان پاسخ حتماً "فارسی" باشد.
    
    ساختار خروجی را بر اساس فیلدهای درخواستی در Schema تنظیم کنید.
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
            marketOverview: { type: Type.STRING, description: "تحلیل کلی از وضعیت فعلی بازار تهران" },
            strategies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  pair: { type: Type.STRING, description: "مثلاً: دلار به طلا" },
                  logic: { type: Type.STRING, description: "استدلال ریاضی و حباب‌سنجی برای این پیشنهاد" },
                  technicalAnalysis: { type: Type.STRING },
                  fundamentalAnalysis: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
                  confidence: { type: Type.NUMBER }
                },
                required: ['title', 'pair', 'logic', 'technicalAnalysis', 'fundamentalAnalysis', 'riskLevel', 'confidence']
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

    const text = response.text;
    if (!text) throw new Error("مدل پاسخی ارسال نکرد.");
    
    const data = JSON.parse(text);
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'مرجع TGJU',
      uri: chunk.web?.uri || 'https://www.tgju.org'
    })) || [];

    return { ...data, sources };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('429')) {
      throw new Error("سهمیه کلید API تمام شده است (خطای 429). لطفاً دقایقی دیگر تلاش کنید.");
    }
    throw new Error("خطا در برقراری ارتباط با سرور. لطفاً از اتصال اینترنت خود مطمئن شوید.");
  }
};
