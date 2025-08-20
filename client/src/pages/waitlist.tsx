import { useState, useEffect } from "react";
import { Link } from "wouter";
import baqLogo from "@assets/baqtest labs_1755480352109.png";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    const fetchWaitlistStats = async () => {
      try {
        const response = await fetch('/api/waitlist/stats');
        const data = await response.json();
        setWaitlistCount(data.totalCount);
      } catch (error) {
        console.error('Failed to fetch waitlist stats:', error);
      }
    };

    fetchWaitlistStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/waitlist/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully joined the waitlist!');
        setFormData({ name: '', email: '' });
        // Update the waitlist count
        setWaitlistCount(data.totalCount);
      } else {
        setMessage(data.error || 'Failed to join waitlist');
      }
    } catch (error) {
      setMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="max-w-[450px] mx-auto">
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <img src={baqLogo} alt="BaQ LABS Logo" className="h-16 w-auto" />
          </div>
        </div>
      </header>

      <section className="px-6 py-12 text-center">
        <div className="mb-8">
          <img 
            className="w-32 h-32 mx-auto mb-6 rounded-2xl shadow-sm" 
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/64e4649cd4-e3283cf8f73b31b73312.png" 
            alt="modern minimalist trading chart dashboard interface on mobile screen, clean white background, professional design"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-black mb-4 leading-tight">
          Join the Waitlist
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 leading-relaxed px-2">
          Be the first to access our advanced backtesting platform and unlock powerful trading insights.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/backtesting" className="bg-black text-white py-3 px-8 rounded-xl font-semibold hover:bg-gray-900 transition-colors flex items-center space-x-2 no-underline">
            <span>Try our Demo</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="px-6 mb-12">
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.includes('Successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}
            
            <div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address" 
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                required
              />
            </div>
            
            <div>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name" 
                className="w-full px-4 py-4 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Joining...' : 'Join Waitlist'}</span>
              {!isSubmitting && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </section>

      <section className="px-6 mb-12">
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start space-x-4">
            <div className="bg-black rounded-lg p-2 flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-1">Real-Time Market Data</h3>
              <p className="text-gray-600 text-sm">MBO data via CSV with live market feeds</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start space-x-4">
            <div className="bg-black rounded-lg p-2 flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-1">Strategy Development</h3>
              <p className="text-gray-600 text-sm">Custom algorithm builder with advanced scripting</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start space-x-4">
            <div className="bg-black rounded-lg p-2 flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-1">Queue-Modeling</h3>
              <p className="text-gray-600 text-sm">Realistic order book simulation with depth analysis</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start space-x-4">
            <div className="bg-black rounded-lg p-2 flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-1">ML Model Training</h3>
              <p className="text-gray-600 text-sm">XGBoost integration for predictive analytics</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mb-12">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-black mb-1">{waitlistCount.toLocaleString()}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">On Waitlist</div>
          </div>
          <div className="text-center py-4 border-l border-r border-gray-200">
            <div className="text-2xl font-bold text-black mb-1">15+</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Markets</div>
          </div>
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-black mb-1">99.9%</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Uptime</div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm mb-4">
          We'll notify you when we launch. No spam, ever.
        </p>
      </footer>
      </div>
    </main>
  );
} 