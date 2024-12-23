import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { ValueProps } from "@/components/landing/ValueProps";
import { ContentAnalyzer } from "@/components/landing/ContentAnalyzer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-12 px-4">
        <Hero />
        <Features />
        <ValueProps />
        <ContentAnalyzer />
      </div>
    </div>
  );
};

export default Index;