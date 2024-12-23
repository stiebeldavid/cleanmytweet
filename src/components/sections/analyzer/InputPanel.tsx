import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";

interface InputPanelProps {
  textContent: string;
  context: string;
  isAnalyzing: boolean;
  showWaitlist: boolean;
  onTextContentChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onAnalyze: () => void;
  onShowWaitlist: () => void;
}

export const InputPanel = ({
  textContent,
  context,
  isAnalyzing,
  showWaitlist,
  onTextContentChange,
  onContextChange,
  onAnalyze,
  onShowWaitlist,
}: InputPanelProps) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content to Analyze
        </label>
        <Textarea
          placeholder="Paste your social media post or content here..."
          className="min-h-[120px]"
          value={textContent}
          onChange={(e) => onTextContentChange(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Context (Optional)
        </label>
        <Input
          placeholder="Brand/company context or target audience..."
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
        />
      </div>

      <div>
        <Button
          onClick={onShowWaitlist}
          variant="outline"
          className="w-full mb-4 bg-gray-50 hover:bg-gray-100"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File (Coming Soon)
        </Button>

        <Button
          onClick={onAnalyze}
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
  );
};