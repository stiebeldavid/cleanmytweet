import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileIcon, ImageIcon, Video, FileAudio, FileText } from "lucide-react";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await supabase.functions.invoke('send-notification', {
        body: { 
          type: 'waitlist',
          data: { email }
        },
      });

      toast({
        title: "Thanks for joining!",
        description: "We'll notify you when media analysis becomes available.",
      });
      setEmail("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">Join the Waitlist</DialogTitle>
          <DialogDescription className="text-center space-y-4">
            <p className="text-lg">Coming soon: AI-powered media analysis for your tweets!</p>
            <div className="flex justify-center space-x-4 py-4">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <span className="text-sm">Images</span>
              </div>
              <div className="text-center">
                <FileAudio className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <span className="text-sm">Audio</span>
              </div>
              <div className="text-center">
                <Video className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <span className="text-sm">Video</span>
              </div>
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <span className="text-sm">PDFs</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Our AI will analyze your media content within the context of your tweet to:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Identify potential controversy risks</li>
                <li>Detect sensitive or inappropriate content</li>
                <li>Ensure brand safety and consistency</li>
                <li>Suggest improvements for better engagement</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            placeholder="Enter your email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}