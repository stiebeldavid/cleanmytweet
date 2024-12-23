import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductOverview } from "@/components/sections/ProductOverview";
import { KeyFeatures } from "@/components/sections/KeyFeatures";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { TargetAudience } from "@/components/sections/TargetAudience";
import { Testimonials } from "@/components/sections/Testimonials";
import { KeyMetrics } from "@/components/sections/KeyMetrics";
import { PRDisasters } from "@/components/sections/PRDisasters";

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

const ContentAnalyzer = () => {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
          <div className="space-y-6">
            {/* Key Issues Section */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="key-issues">
                <AccordionTrigger className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Key Issues ({analysis.keyIssues.length})</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {analysis.keyIssues.map((issue, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                        <h4 className={`font-medium ${getSeverityColor(issue.severity)}`}>
                          {issue.title}
                        </h4>
                        <p className="text-gray-600 mt-1">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Suggested Changes Section */}
              <AccordionItem value="suggested-changes">
                <AccordionTrigger className="flex items-center gap-2">
                  <ChevronDown className="h-5 w-5 text-green-500" />
                  <span>Suggested Changes ({analysis.suggestedChanges.length})</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {analysis.suggestedChanges.map((change, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                        <h4 className="font-medium text-green-700">{change.title}</h4>
                        <p className="text-gray-600 mt-1">{change.details}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Detailed Analysis Section */}
              <AccordionItem value="detailed-analysis">
                <AccordionTrigger className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span>Detailed Analysis</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-medium text-blue-700">Component Breakdown</h4>
                      <p className="text-gray-600 mt-1">{analysis.detailedAnalysis.componentBreakdown}</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-medium text-blue-700">Relationships & Gaps</h4>
                      <p className="text-gray-600 mt-1">{analysis.detailedAnalysis.relationshipsAndGaps}</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-medium text-blue-700">Broader Context</h4>
                      <p className="text-gray-600 mt-1">{analysis.detailedAnalysis.broaderContext}</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-medium text-blue-700">Cross-Group Comparisons</h4>
                      <p className="text-gray-600 mt-1">{analysis.detailedAnalysis.crossGroupComparisons}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            Analysis results will appear here after you scan your content.
          </div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeroSection />
      <ProductOverview />
      <div className="container mx-auto py-12 px-4">
        <ContentAnalyzer />
      </div>
      <KeyFeatures />
      <ValueProposition />
      <TargetAudience />
      <Testimonials />
      <KeyMetrics />
      <PRDisasters />
      <WaitlistModal open={false} onOpenChange={() => {}} />
    </div>
  );
};

export default Index;
