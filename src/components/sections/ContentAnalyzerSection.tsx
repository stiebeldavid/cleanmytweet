import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessagePanel } from "./analyzer/MessagePanel";
import { InputPanel } from "./analyzer/InputPanel";
import { ResultsPanel } from "./analyzer/ResultsPanel";

interface AnalysisResult {
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

export const ContentAnalyzerSection = () => {
  const [textContent, setTextContent] = useState("");
  const [context, setContext] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!textContent && !context) {
      toast({
        title: "Missing content",
        description: "Please provide text content or context to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: { textContent, context },
      });

      if (error) throw error;
      
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <MessagePanel />
      <InputPanel
        textContent={textContent}
        context={context}
        isAnalyzing={isAnalyzing}
        showWaitlist={showWaitlist}
        onTextContentChange={setTextContent}
        onContextChange={setContext}
        onAnalyze={handleAnalyze}
        onShowWaitlist={() => setShowWaitlist(true)}
      />
      <ResultsPanel analysis={analysis} />
    </div>
  );
};