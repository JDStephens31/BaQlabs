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
    <div className="min-h-screen bg-gray-200 flex flex-col items-center px-6 relative overflow-hidden">
      {/* Logo */}
      <div className="mt-20 mb-8 z-10 relative">
        <div className="bg-white rounded-3xl px-8 py-6 shadow-sm">
          <img 
            src={logoImage} 
            alt="BAQ LABS" 
            className="h-12 w-auto"
          />
        </div>
      </div>
      {/* Feature Blocks */}
      <div className="z-10 relative mb-16 space-y-8 max-w-4xl">
        {/* First Row */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 rounded-3xl border-2 border-black/20 px-8 py-6 transform rotate-2 hover:rotate-0 transition-transform duration-300 max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">Real-Time Market Data</h3>
            <p className="text-blue-50 text-sm">Access live market feeds and historical data for accurate backtesting with real market conditions.</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-3xl border-2 border-black/20 px-8 py-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300 max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">Strategy Development</h3>
            <p className="text-purple-50 text-sm">Build and test custom trading algorithms with our intuitive code editor and validation tools.</p>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 rounded-3xl border-2 border-black/20 px-8 py-6 transform rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">Risk Management</h3>
            <p className="text-teal-50 text-sm">Advanced position sizing and risk controls to protect your capital and optimize returns.</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 rounded-3xl border-2 border-black/20 px-8 py-6 transform -rotate-2 hover:rotate-0 transition-transform duration-300 max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">Performance Analytics</h3>
            <p className="text-orange-50 text-sm">Comprehensive metrics and visualizations to analyze strategy performance and optimize results.</p>
          </div>
        </div>

        {/* Third Row */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-3xl border-2 border-black/20 px-8 py-6 transform rotate-3 hover:rotate-0 transition-transform duration-300 max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">Queue-Aware Execution</h3>
            <p className="text-indigo-50 text-sm">Realistic order book simulation with queue position tracking for accurate fill modeling.</p>
          </div>
          
          <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 rounded-3xl border-2 border-black/20 px-8 py-6 transform -rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm">
            <h3 className="text-white font-bold text-lg mb-2">Multi-Asset Support</h3>
            <p className="text-rose-50 text-sm">Test strategies across stocks, futures, options, and crypto with unified backtesting framework.</p>
          </div>
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
          <p className="text-gray-600 text-sm text-center max-w-md">Be the first to know when BAQ LABS launches. No spam, just updates.</p>
        </form>
      </div>
    </div>
  );
}