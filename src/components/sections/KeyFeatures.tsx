import { Shield, Zap, Target, MessageCircle, Users, TrendingUp, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const KeyFeatures = () => {
  const scrollToAnalyzer = () => {
    const analyzerSection = document.querySelector('.content-analyzer-section');
    if (analyzerSection) {
      analyzerSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Why Use CleanMyTweet?
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Your tweets deserve a second look. Our AI-powered platform helps ensure your message hits the mark every time.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reputation Protection</h3>
            <p className="text-gray-600">
              Prevent PR disasters before they happen with our advanced content analysis.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Analysis</h3>
            <p className="text-gray-600">
              Get immediate feedback on your tweets with our real-time AI analysis.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Context Awareness</h3>
            <p className="text-gray-600">
              Our AI understands cultural context and helps avoid unintended interpretations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tone Optimization</h3>
            <p className="text-gray-600">
              Ensure your message strikes the right tone for your audience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Audience Impact</h3>
            <p className="text-gray-600">
              Understand how your tweets will resonate with different audience segments.
            </p>
          </div>

          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer group"
            onClick={scrollToAnalyzer}
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors">
              <ArrowUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Try It Now!</h3>
            <p className="text-white/90">
              Ready to clean your tweet? Jump back to our analyzer and give it a try!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};