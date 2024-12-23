import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, PenTool, ImageIcon, Video, Twitter, Users } from "lucide-react";
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
    <div className="relative space-y-6 bg-gradient-to-br from-white to-cyan-50 p-6 rounded-xl shadow-lg border-2 border-cyan-200 hover:border-cyan-300 transition-all">
      <div className="absolute -top-3 -left-3 transform -rotate-6">
        <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <PenTool className="h-4 w-4" />
          <span className="font-bold">Analyze Your Tweet Here!</span>
        </div>
      </div>

      <div className="mt-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 group">
          <Twitter className="h-4 w-4 text-cyan-500 group-hover:text-cyan-600 transition-colors" />
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-semibold">
            Draft Tweet to Analyze
          </span>
        </label>
        <Textarea
          placeholder="Paste your tweet here..."
          className="min-h-[120px] border-2 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400 bg-white shadow-inner"
          value={textContent}
          onChange={(e) => onTextContentChange(e.target.value)}
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 group">
          <Users className="h-4 w-4 text-cyan-500 group-hover:text-cyan-600 transition-colors" />
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent font-semibold">
            Context (Optional)
          </span>
        </label>
        <Input
          placeholder="Your brand voice, target audience, or campaign context..."
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          className="border-2 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400 bg-white"
        />
      </div>

      <div>
        <Button
          onClick={() => setIsWaitlistOpen(true)}
          variant="outline"
          className="w-full mb-4 h-auto py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full transition-transform group-hover:translate-x-0" />
          <div className="flex items-center justify-center gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <span className="font-semibold">Upload Media</span>
            </div>
            <div className="flex items-center gap-4">
              <ImageIcon className="h-4 w-4" />
              <Video className="h-4 w-4" />
              <span className="text-sm italic">(Coming Soon!)</span>
            </div>
          </div>
        </Button>

        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || (!textContent && !context)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg transform transition-all hover:scale-[1.02] disabled:hover:scale-100"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Clean My Tweet!"
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