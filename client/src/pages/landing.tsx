import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/baqtest labs_1755480352109.png";

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
    <div className="min-h-screen flex flex-col items-center px-6 relative overflow-hidden bg-[#f0f0f0]">
      {/* Stacked Blocks */}
      <div className="z-10 relative mb-16 space-y-6 max-w-md mt-20">
        {/* Logo Block */}
        <div className="bg-gradient-to-r from-white to-pink-200 rounded-full px-12 py-6 border-2 border-black/20 transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <img 
            src={logoImage} 
            alt="BAQ LABS" 
            className="h-12 w-auto mx-auto"
          />
        </div>
        
        {/* Feature Block 1 - Light Gray/Blue */}
        <div className="bg-gradient-to-r from-gray-300 via-blue-200 to-gray-300 rounded-full px-8 py-6 border-2 border-black/20 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <h3 className="text-gray-800 font-bold text-lg mb-1 text-center">Real-Time Market Data</h3>
          <p className="text-gray-700 text-sm text-center">Live feeds & historical data</p>
        </div>
        
        {/* Feature Block 2 - Blue */}
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 rounded-full px-8 py-6 border-2 border-black/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg mb-1 text-center">Strategy Development</h3>
          <p className="text-blue-50 text-sm text-center">Custom algorithm builder</p>
        </div>
        
        {/* Feature Block 3 - Purple/Pink */}
        <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-full px-8 py-6 border-2 border-black/20 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg mb-1 text-center">Queue-Aware Execution</h3>
          <p className="text-purple-50 text-sm text-center">Realistic order book simulation</p>
        </div>
        
        {/* Feature Block 4 - Teal/Green */}
        <div className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 rounded-full px-8 py-6 border-2 border-black/20 transform rotate-2 hover:rotate-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg mb-1 text-center">Risk Management</h3>
          <p className="text-teal-50 text-sm text-center">Advanced position controls</p>
        </div>
      </div>
      {/* Waitlist Form */}
      <div className="z-10 relative">
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