import { AlertTriangle, CheckCircle2, Copy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface AnalysisResult {
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

interface ResultsPanelProps {
  analysis: AnalysisResult | null;
  isAnalyzing?: boolean;
}

export const ResultsPanel = ({ analysis, isAnalyzing = false }: ResultsPanelProps) => {
  const { toast } = useToast();
  const [loadingMessage, setLoadingMessage] = useState("");
  const loadingMessages = [
    "Analyzing tweet...",
    "Considering context...",
    "Simulating audience responses...",
    "Evaluating potential issues...",
    "Preparing recommendations..."
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      setLoadingMessage("");
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(loadingMessages[currentIndex]);
      currentIndex = (currentIndex + 1) % loadingMessages.length;
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

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

  const handleCopyTweet = async () => {
    if (analysis?.cleanedTweet) {
      await navigator.clipboard.writeText(analysis.cleanedTweet);
      toast({
        title: "Tweet Copied",
        description: "The cleaned tweet has been copied to your clipboard",
        duration: 2000,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Your Cleaned Tweet
      </h2>
      {isAnalyzing ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
            </div>
            <p className="text-gray-600 animate-fade-in">
              {loadingMessage}
            </p>
          </div>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Cleaned Tweet Section */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-cyan-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                <h3 className="font-semibold text-cyan-900">Cleaned Tweet</h3>
              </div>
              <button
                onClick={handleCopyTweet}
                className="p-2 hover:bg-cyan-100 rounded-full transition-colors"
                title="Copy tweet"
              >
                <Copy className="h-4 w-4 text-cyan-600" />
              </button>
            </div>
            <p className="text-gray-800 font-medium">{analysis.cleanedTweet}</p>
          </div>

          <Accordion type="single" collapsible defaultValue="key-issues" className="w-full">
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

            <AccordionItem value="suggested-changes">
              <AccordionTrigger>
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

            <AccordionItem value="detailed-analysis">
              <AccordionTrigger>
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
        <div className="text-gray-500 space-y-4 py-8 px-4 bg-gray-50 rounded-lg text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-medium text-lg text-gray-700">Ready to Analyze Your Tweet</h3>
          <p className="text-gray-600">
            After scanning your content, you'll see:
          </p>
          <ul className="space-y-2 text-sm text-left list-disc pl-6">
            <li>A cleaned version of your tweet that avoids potential controversies</li>
            <li>Key issues identified in your content</li>
            <li>Suggested improvements and alternatives</li>
            <li>Detailed analysis of potential impacts and considerations</li>
          </ul>
        </div>
      )}
    </div>
  );
};