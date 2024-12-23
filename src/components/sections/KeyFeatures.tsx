import { AlertTriangle, Fingerprint, Globe, MessageSquare } from "lucide-react";

const features = [
  {
    icon: AlertTriangle,
    title: "Tweet Risk Detection",
    description: "AI scans tweets for potential controversies across 50+ languages."
  },
  {
    icon: Fingerprint,
    title: "Brand Voice Protection",
    description: "Ensures tweets match your brand's ideal tone and values."
  },
  {
    icon: Globe,
    title: "Cultural Context Analysis",
    description: "Considers global sensitivities and audience perspectives."
  },
  {
    icon: MessageSquare,
    title: "Smart Tweet Suggestions",
    description: "Get AI-powered alternatives for flagged content."
  }
];

export const KeyFeatures = () => {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose CleanMyTweet?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <feature.icon className="h-10 w-10 text-cyan-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};