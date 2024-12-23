import { WaitlistModal } from "@/components/WaitlistModal";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProductOverview } from "@/components/sections/ProductOverview";
import { KeyFeatures } from "@/components/sections/KeyFeatures";
import { ValueProposition } from "@/components/sections/ValueProposition";
import { TargetAudience } from "@/components/sections/TargetAudience";
import { Testimonials } from "@/components/sections/Testimonials";
import { KeyMetrics } from "@/components/sections/KeyMetrics";
import { PRDisasters } from "@/components/sections/PRDisasters";
import { ContentAnalyzerSection } from "@/components/sections/ContentAnalyzerSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeroSection />
      <div className="container mx-auto py-12 px-4">
        <ContentAnalyzerSection />
      </div>
      <KeyFeatures />
      <ValueProposition />
      <TargetAudience />
      <ProductOverview />
      <Testimonials />
      <KeyMetrics />
      <PRDisasters />
      <WaitlistModal open={false} onOpenChange={() => {}} />
    </div>
  );
};

export default Index;