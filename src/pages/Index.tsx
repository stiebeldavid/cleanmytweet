import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [textContent, setTextContent] = useState("");
  const [context, setContext] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or image file",
        variant: "destructive",
      });
      return;
    }

    setFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(`[Image uploaded: ${file.name}]`);
      };
      reader.readAsDataURL(file);
    } else {
      setFileContent(`[PDF uploaded: ${file.name}]`);
    }
  };

  const handleAnalyze = async () => {
    if (!textContent && !context && !file) {
      toast({
        title: "Missing content",
        description: "Please provide at least one input (text, context, or file)",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: {
          textContent,
          context,
          fileContent,
        },
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Controversy Detection
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (Optional)
              </label>
              <Input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
              />
              {file && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {file.name}
                </p>
              )}
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!textContent && !context && !file)}
              className="w-full"
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

          {/* Results Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Analysis Results
            </h2>
            {analysis ? (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{analysis}</div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-12">
                Analysis results will appear here after you scan your content.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;