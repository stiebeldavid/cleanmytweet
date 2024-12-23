import { Shield } from "lucide-react";

export const ProductOverview = () => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          What is Clairity?
        </h2>
        <p className="text-lg text-gray-600">
          Clairity is the AI-driven marketing tool that proactively identifies potential controversies in content. 
          From text to multimedia, Clairity ensures every piece of communication aligns with your brand's voice and audience sensitivities.
        </p>
      </div>
    </div>
  );
};