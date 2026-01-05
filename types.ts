
export interface PriceData {
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export interface TradeStrategy {
  title: string;
  pair: string; // e.g., "تبدیل دلار به طلا"
  logic: string; // The mathematical/hidden formula
  technicalAnalysis: string;
  fundamentalAnalysis: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number; // percentage
  potentialProfit: string; // e.g., "۵-۷٪"
}

export interface AnalysisResponse {
  strategies: TradeStrategy[];
  marketOverview: string;
  prices: PriceData[];
  sources: { title: string; uri: string }[];
}
