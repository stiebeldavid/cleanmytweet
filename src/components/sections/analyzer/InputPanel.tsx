import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, PenTool, FileIcon, ImageIcon, Video, FileAudio, FileText } from "lucide-react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useState } from "react";

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
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="relative space-y-6 bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all">
      <div className="absolute -top-3 -left-3 transform -rotate-6">
        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <PenTool className="h-4 w-4" />
          <span className="font-bold">Analyze Your Content Here!</span>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content to Analyze
        </label>
        <Textarea
          placeholder="Paste your social media post or content here..."
          className="min-h-[120px] border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white shadow-inner"
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
          className="border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white"
        />
      </div>

      <div>
        <Button
          onClick={() => setIsWaitlistOpen(true)}
          variant="outline"
          className="w-full mb-4 h-auto py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-none relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full transition-transform group-hover:translate-x-0" />
          <div className="flex flex-col items-center justify-center relative z-10 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Upload className="h-5 w-5" />
              <span className="font-semibold text-base">Upload Images & Media</span>
            </div>
            <div className="flex items-center justify-center space-x-4 py-1">
              <div className="flex flex-col items-center">
                <ImageIcon className="h-4 w-4 mb-1" />
                <span className="text-xs">Images</span>
              </div>
              <div className="flex flex-col items-center">
                <FileAudio className="h-4 w-4 mb-1" />
                <span className="text-xs">Audio</span>
              </div>
              <div className="flex flex-col items-center">
                <Video className="h-4 w-4 mb-1" />
                <span className="text-xs">Video</span>
              </div>
              <div className="flex flex-col items-center">
                <FileText className="h-4 w-4 mb-1" />
                <span className="text-xs">PDFs</span>
              </div>
            </div>
            <span className="text-sm italic">Coming Soon!</span>
          </div>
        </Button>

        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || (!textContent && !context)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transform transition-all hover:scale-[1.02] disabled:hover:scale-100"
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

      <WaitlistModal 
        open={isWaitlistOpen} 
        onOpenChange={setIsWaitlistOpen} 
      />
    </div>
  );
};