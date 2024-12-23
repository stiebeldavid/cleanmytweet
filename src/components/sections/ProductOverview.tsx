import { Shield } from "lucide-react";

export const ProductOverview = () => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-cyan-600" />
          What is CleanMyTweet?
        </h2>
        <p className="text-lg text-gray-600">
          CleanMyTweet is your AI-powered tweet guardian that proactively identifies potential controversies in your tweets before they go live. 
          From casual posts to viral campaigns, CleanMyTweet ensures every tweet aligns with your brand's voice and stays controversy-free.
        </p>
      </div>
    </div>
  );
};