import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Lock } from "lucide-react";

export const Hero = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Get Ahead of PR Disasters with Clairity
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        The AI-powered tool that ensures your content is controversy-free, empowering your brand to communicate with confidence.
      </p>
      <div className="flex gap-6 justify-center mb-8">
        <Button 
          variant="default"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Request a Demo Today
        </Button>
        <Button variant="outline">
          Start with Our Free Version
        </Button>
      </div>
      <div className="flex gap-4 justify-center">
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
  );
};