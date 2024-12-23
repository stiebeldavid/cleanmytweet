import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User } from "lucide-react";

export const TargetAudience = () => {
  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Who Benefits from Clairity?
        </h2>
        <Tabs defaultValue="corporate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="corporate" className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Corporate Marketing Teams
            </TabsTrigger>
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Individual Content Creators
            </TabsTrigger>
          </TabsList>
          <TabsContent value="corporate" className="mt-6 p-6 bg-white rounded-lg">
            <p className="text-lg text-gray-600">
              For global brands managing high-risk, high-visibility campaigns.
            </p>
          </TabsContent>
          <TabsContent value="individual" className="mt-6 p-6 bg-white rounded-lg">
            <p className="text-lg text-gray-600">
              For creators and growing brands seeking a freemium tool for safe, impactful communication.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};