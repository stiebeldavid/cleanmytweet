import { AlertCircle } from "lucide-react";

export const MessagePanel = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
      <AlertCircle className="h-16 w-16 text-cyan-600" />
      <h2 className="text-2xl font-bold text-gray-900">
        Tweet Analysis Made Simple
      </h2>
      <p className="text-lg text-gray-600">
        About to post something awesome on X/Twitter? Let our AI check your draft for potential controversies or backlash, ensuring your message stays on-brand and controversy-free.
      </p>
    </div>
  );
};