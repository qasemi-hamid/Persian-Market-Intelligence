
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "./types";

export const getMarketAnalysis = async (): Promise<AnalysisResponse> => {
  // ایجاد نمونه جدید در هر بار فراخوانی برای اطمینان از تازگی کلید (مطابق با دستورالعمل‌های Veo/Gemini 3)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    شما یک استراتژیست ارشد بازارهای مالی ایران هستید. 
    وظیفه شما:
    1. با استفاده از ابزار جستجو (Google Search)، دقیقاً قیمت‌های لحظه‌ای را از سایت مرجع "https://www.tgju.org" استخراج کنید.
    2. موارد مورد نیاز: قیمت دلار بازار آزاد، سکه امامی، طلای 18 عیار، تتر (USDT/IRT) و انس جهانی.
    3. تحلیل حباب (Bubble) را بر اساس فرمول‌های متعارف بازار تهران انجام دهید.
    4. حداقل 3 پیشنهاد جابجایی دارایی (Swap) با منطق ریاضی و ریسک مشخص ارائه دهید.
    
    نکته بسیار مهم: خروجی باید حتماً یک JSON معتبر باشد. تمام اعداد قیمت باید به "تومان" باشند.
    نمونه منطق: "با توجه به قیمت انس جهانی و نرخ دلار در tgju.org، حباب سکه مثبت است؛ فروش سکه و خرید طلای آب‌شده پیشنهاد می‌شود."
    
    پاسخ را کاملاً به زبان فارسی و در قالب ساختار JSON زیر برگردانید.
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
            marketOverview: { type: Type.STRING, description: "خلاصه‌ای کوتاه از وضعیت فعلی بازار ایران" },
            strategies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  pair: { type: Type.STRING, description: "مثلا: تتر به طلای ۱۸" },
                  logic: { type: Type.STRING, description: "دلیل و منطق ریاضی برای این پیشنهاد" },
                  technicalAnalysis: { type: Type.STRING },
                  fundamentalAnalysis: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
                  confidence: { type: Type.NUMBER, description: "درصد اطمینان بین 0 تا 100" }
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
    if (!text) throw new Error("پاسخی از مدل دریافت نشد.");
    
    const data = JSON.parse(text);
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'مرجع قیمت (TGJU)',
      uri: chunk.web?.uri || 'https://www.tgju.org'
    })) || [];

    return { ...data, sources };
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    
    // شناسایی خطای محدودیت سهمیه (429)
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error("سهمیه استفاده از هوش مصنوعی برای امروز به پایان رسیده است (خطای 429). لطفاً دقایقی دیگر دوباره تلاش کنید.");
    }
    
    throw new Error(error.message || "خطا در تحلیل بازار. لطفاً اتصال اینترنت خود را چک کنید.");
  }
};
