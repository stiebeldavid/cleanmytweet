import { Globe, Users, AlertCircle, MessageSquare, ArrowRightCircle } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Proactive Controversy Detection",
      description: "AI scans content for risks across 50+ languages"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Tailored Brand Customization",
      description: "Designed to protect your brand's ideal voice"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Sensitivity Awareness",
      description: "Incorporates cultural nuances and sub-audience insights"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Integrated AI Copywriting",
      description: "Provides live feedback and ideation"
    },
    {
      icon: <ArrowRightCircle className="h-6 w-6" />,
      title: "Seamless Integration",
      description: "Works with your existing marketing platforms"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Clairity Stands Out</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
              <div className="text-blue-600">{feature.icon}</div>
              <div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};