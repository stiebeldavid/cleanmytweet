import { AlertCircle } from "lucide-react";

export const MessagePanel = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
      <AlertCircle className="h-16 w-16 text-blue-600" />
      <h2 className="text-2xl font-bold text-gray-900">
        Content Analysis Made Simple
      </h2>
      <p className="text-lg text-gray-600">
        The AI-powered tool that ensures your content is controversy-free, empowering your brand to communicate with confidence.
      </p>
    </div>
  );
};