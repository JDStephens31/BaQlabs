import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome to the waitlist!",
        description: "We'll notify you when BAO LABS launches.",
      });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Logo */}
      <div className="mb-16 z-10 relative">
        <div className="bg-white rounded-3xl px-12 py-6 shadow-sm">
          <div className="flex items-center space-x-1">
            <span className="text-3xl font-bold text-black tracking-tight">BA</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-300 to-pink-400 border-2 border-pink-200"></div>
            <span className="text-3xl font-bold text-black tracking-tight">LABS</span>
          </div>
        </div>
      </div>
      {/* Flowing Gradient Shapes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-80 h-96">
          {/* Top shape - Light gray/blue */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-72 h-20 bg-gradient-to-r from-gray-300 via-blue-200 to-gray-300 rounded-full border-2 border-black/20" 
               style={{ transform: 'translateX(-50%) rotate(-5deg)' }}></div>
          
          {/* Second shape - Blue */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-80 h-24 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 rounded-full border-2 border-black/20"
               style={{ transform: 'translateX(-50%) rotate(8deg)' }}></div>
          
          {/* Third shape - Purple/Pink */}
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-76 h-22 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-full border-2 border-black/20"
               style={{ transform: 'translateX(-50%) rotate(-12deg)' }}></div>
          
          {/* Bottom shape - Teal/Green */}
          <div className="absolute top-44 left-1/2 transform -translate-x-1/2 w-72 h-20 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 rounded-full border-2 border-black/20"
               style={{ transform: 'translateX(-50%) rotate(6deg)' }}></div>
        </div>
      </div>
      {/* Waitlist Form */}
      <div className="z-10 relative mt-16">
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-80 bg-white border-gray-300 text-black placeholder-gray-500 focus:border-pink-400 focus:ring-pink-400"
              required
            />
            <Button 
              type="submit"
              className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-md font-medium transition-colors"
            >
              Join Waitlist
            </Button>
          </div>
          <p className="text-gray-600 text-sm text-center max-w-md">Be the first to know when BAQLABS launches. No spam, just updates.</p>
        </form>
      </div>
    </div>
  );
}