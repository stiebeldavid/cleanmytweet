import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="text-center py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Get Ahead of PR Disasters with Clairity
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        The AI-powered tool that ensures your content is controversy-free, empowering your brand to communicate with confidence.
      </p>
      <Button 
        onClick={scrollToTop}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg"
      >
        <ArrowUp className="mr-2 h-5 w-5" />
        Try it Today for Free
      </Button>
    </div>
  );
};