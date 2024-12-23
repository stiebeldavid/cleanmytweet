import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [textContent, setTextContent] = useState("");
  const [context, setContext] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    console.log('Starting analysis');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Content Controversy Detection
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Analyze your content for potential controversy before posting. 
              Prevent PR disasters and maintain brand reputation.
            </p>
            <div className="flex gap-4 justify-center mb-12">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Lock className="h-5 w-5" />
                <span>Secure</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content to Analyze
                </label>
                <Textarea
                  placeholder="Paste your social media post or content here..."
                  className="min-h-[120px]"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context (Optional)
                </label>
                <Input
                  placeholder="Brand/company context or target audience..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <div>
                <Button
                  onClick={() => setShowWaitlist(true)}
                  variant="outline"
                  className="w-full mb-4 bg-gray-50 hover:bg-gray-100"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File (Coming Soon)
                </Button>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!textContent && !context)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Content"
                  )}
                </Button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Analysis Results
              </h2>
              {analysis ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">{analysis}</div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  Analysis results will appear here after you scan your content.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <WaitlistModal open={showWaitlist} onOpenChange={setShowWaitlist} />
    </div>
  );
};

export default Index;