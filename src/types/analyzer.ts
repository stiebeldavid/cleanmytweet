export interface AnalysisResult {
  cleanedTweet: string;
  keyIssues: {
    title: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
  suggestedChanges: {
    title: string;
    details: string;
  }[];
  detailedAnalysis: {
    componentBreakdown: string;
    relationshipsAndGaps: string;
    broaderContext: string;
    crossGroupComparisons: string;
  };
}

export interface AnalyzerState {
  textContent: string;
  context: string;
  purpose: string;
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  showWaitlist: boolean;
}