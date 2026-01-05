
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "./types";

/**
 * سرویس دریافت تحلیل عمیق بازار ایران با تمرکز بر سه لایه تکنیکال، فاندامنتال و محاسبات ریاضی
 */
export const getMarketAnalysis = async (): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    به عنوان یک استراتژیست ارشد بازارهای مالی ایران:
    ۱. قیمت لحظه‌ای دلار (بازار آزاد)، تتر، سکه امامی و طلای ۱۸ عیار را استخراج کن.
    ۲. یک تحلیل کلی (Market Overview) از وضعیت فعلی بنویس.
    ۳. سه استراتژی جابجایی دارایی (Swap) پیشنهاد بده. 
    
    برای هر استراتژی موارد زیر الزامی است:
    - تحلیل تکنیکال (بررسی نقاط کلیدی نمودار)
    - تحلیل فاندامنتال (تاثیر اخبار و سیاست‌ها)
    - محاسبات ریاضی (دلیل عددی جابجایی و فرمول بازدهی)
    - تخمین سود احتمالی (بصورت درصد، مثلا ۱۵-۱۸٪)

    نکات حیاتی: 
    - تمام عبارات، عناوین و متون باید کاملاً "فارسی" باشند.
    - در بخش logic، منطق محاسباتی را شفاف بنویس.
    - پاسخ حتما در قالب JSON باشد.
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

    const text = response.text;
    if (!text) throw new Error("پاسخی از هوش مصنوعی دریافت نشد.");

    const parsedData = JSON.parse(text);
    return {
      ...parsedData,
      sources: [] 
    };

  } catch (error: any) {
    console.error("API Error:", error);
    if (error.message?.includes("429") || error.message?.includes("QUOTA")) {
      throw new Error("سهمیه رایگان هوش مصنوعی برای امروز به پایان رسیده است.");
    }
    throw new Error(`خطای سیستمی: ${error.message}`);
  }
};
