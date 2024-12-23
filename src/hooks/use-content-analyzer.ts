import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisResult, AnalyzerState } from "@/types/analyzer";
import { useIsMobile } from "@/hooks/use-mobile";

export const useContentAnalyzer = () => {
  const [state, setState] = useState<AnalyzerState>({
    textContent: "",
    context: "",
    purpose: "",
    analysis: null,
    isAnalyzing: false,
    showWaitlist: false,
  });

  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const setTextContent = (textContent: string) => setState(prev => ({ ...prev, textContent }));
  const setContext = (context: string) => setState(prev => ({ ...prev, context }));
  const setPurpose = (purpose: string) => setState(prev => ({ ...prev, purpose }));
  const setShowWaitlist = (showWaitlist: boolean) => setState(prev => ({ ...prev, showWaitlist }));

  const handleAnalyze = async () => {
    if (!state.textContent && !state.context) {
      toast({
        title: "Missing content",
        description: "Please provide text content or context to analyze",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-content', {
        body: { 
          textContent: state.textContent, 
          context: state.context, 
          purpose: state.purpose 
        },
      });

      if (analysisError) throw analysisError;
      
      const analysisResults = analysisData.analysis;
      setState(prev => ({ ...prev, analysis: analysisResults }));

      if (isMobile && resultsRef.current) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }

      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'content-analysis',
          data: { 
            content: state.textContent, 
            context: state.context,
            purpose: state.purpose,
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
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  return {
    ...state,
    resultsRef,
    setTextContent,
    setContext,
    setPurpose,
    setShowWaitlist,
    handleAnalyze,
  };
};