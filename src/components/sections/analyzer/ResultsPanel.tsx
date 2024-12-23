import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
}

export const ResultsPanel = ({ analysis }: ResultsPanelProps) => {
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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Analysis Results
      </h2>
      {analysis ? (
        <div className="space-y-6">
          {/* Cleaned Tweet Section */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border-2 border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-cyan-600" />
              <h3 className="font-semibold text-cyan-900">Cleaned Tweet</h3>
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
        <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          Analysis results will appear here after you scan your content.
        </div>
      )}
    </div>
  );
};