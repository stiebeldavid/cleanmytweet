import { Shield, Clock, Check } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Prevent Tweet Disasters",
    description: "Stop controversial tweets before they go live."
  },
  {
    icon: Clock,
    title: "Quick Tweet Analysis",
    description: "Get instant feedback on your tweets' potential impact."
  },
  {
    icon: Check,
    title: "Tweet with Confidence",
    description: "Know your tweets are safe and on-brand before posting."
  }
];

export const ValueProposition = () => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose CleanMyTweet?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <value.icon className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};