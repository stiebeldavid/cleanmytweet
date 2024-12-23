import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessagePanel } from "./analyzer/MessagePanel";
import { InputPanel } from "./analyzer/InputPanel";
import { ResultsPanel } from "./analyzer/ResultsPanel";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [purpose, setPurpose] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-content', {
        body: { textContent, context, purpose },
      });

      if (analysisError) throw analysisError;
      
      const analysisResults = analysisData.analysis;
      setAnalysis(analysisResults);

      // Scroll to results on mobile after a short delay to ensure rendering
      if (isMobile && resultsRef.current) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }

      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'content-analysis',
          data: { 
            content: textContent, 
            context,
            purpose,
            analysis: analysisResults 
          }
        },
      });
      
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
      <div ref={resultsRef}>
        <ResultsPanel analysis={analysis} />
      </div>
    </div>
  );
};