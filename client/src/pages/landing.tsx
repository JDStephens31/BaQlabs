import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, CheckCircle, Star, Users, TrendingUp, BarChart3, Brain, Code, Zap, Shield } from "lucide-react";
import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Additional gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AlgoTrader Pro</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <Link href="/signin">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/signin">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 border-purple-500/30">
                AI-Powered Backtesting Engine
              </Badge>
              <h1 className="text-5xl font-bold text-white leading-tight">
                AI copilot that helps you{" "}
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  backtest smarter
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Professional-grade backtesting platform with advanced strategy development, 
                queue-aware market simulation, and comprehensive model training for NQ futures strategies.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/backtesting">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group">
                  Start Backtesting
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-blue-500/10 group">
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">4.9/5</span>
                <span className="text-gray-400">from 2,500+ quants</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">10,000+</span>
                <span className="text-gray-400">active users</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-2xl blur-3xl"></div>
            <Card className="relative bg-gradient-to-br from-black/40 to-blue-900/20 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Backtest Results</span>
                    <Badge className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400 border-green-500/30">
                      +12.4%
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white">NQ Futures Strategy</span>
                      <span className="text-green-400 font-mono">+$4,250</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-white font-bold">156</div>
                        <div className="text-xs text-gray-400">Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold">84.2%</div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold">2.1</div>
                        <div className="text-xs text-gray-400">Sharpe</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Build & Test
            </span>{" "}
            Trading Strategies
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced AI-powered backtesting engine with strategy development, model training, and comprehensive market simulation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "AI Strategy Development",
              description: "Interactive code editor with real-time compilation and queue-aware backtesting logic",
              features: ["Real-time compilation", "Strategy templates", "Parameter optimization"]
            },
            {
              icon: BarChart3,
              title: "Advanced Backtesting",
              description: "Comprehensive backtesting engine with realistic market microstructure simulation",
              features: ["Queue-aware execution", "Historical data replay", "Performance metrics"]
            },
            {
              icon: TrendingUp,
              title: "Model Training & Validation",
              description: "Train and validate trading models with dynamic pricing simulation for NQ futures",
              features: ["Model validation", "Cross-validation", "Out-of-sample testing"]
            },
            {
              icon: Code,
              title: "Strategy Development",
              description: "Professional strategy authoring with syntax highlighting and dynamic parameter modification",
              features: ["Live validation", "Error detection", "Template library"]
            },
            {
              icon: Zap,
              title: "Market Data Replay",
              description: "MBO (Market By Order) replay with queue position tracking and realistic fills",
              features: ["Historical replay", "Queue simulation", "Latency modeling"]
            },
            {
              icon: Shield,
              title: "Risk Analytics",
              description: "Comprehensive risk analysis with drawdown controls and position size optimization",
              features: ["Risk metrics", "Drawdown analysis", "Position sizing"]
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-gradient-to-br from-black/40 to-purple-900/10 border-white/10 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple and Reliable Pricing
          </h2>
          <p className="text-xl text-gray-300">
            Choose the plan that fits your backtesting and model development needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Starter",
              price: "$29",
              period: "/month",
              description: "Perfect for individual quants",
              features: [
                "Basic backtesting engine",
                "5 strategy slots",
                "Historical NQ data access",
                "Email support",
                "Basic performance analytics"
              ],
              popular: false
            },
            {
              name: "Professional",
              price: "$99",
              period: "/month",
              description: "Advanced features for serious researchers",
              features: [
                "Queue-aware backtesting",
                "Unlimited strategies",
                "MBO data replay",
                "Model training tools",
                "Advanced analytics",
                "Risk assessment tools",
                "API access"
              ],
              popular: true
            },
            {
              name: "Enterprise",
              price: "$299",
              period: "/month",
              description: "Complete solution for research teams",
              features: [
                "Everything in Professional",
                "Multi-user workspaces",
                "Custom model integrations",
                "Dedicated support",
                "White-label backtesting",
                "Advanced reporting suite",
                "SLA guarantee"
              ],
              popular: false
            }
          ].map((plan, index) => (
            <Card key={index} className={`relative bg-gradient-to-br from-black/40 to-slate-900/40 border-white/10 backdrop-blur-sm ${plan.popular ? 'border-purple-500/50 scale-105 bg-gradient-to-br from-purple-900/20 to-blue-900/20' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none">Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-gray-400">{plan.description}</p>
                  </div>
                  
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500'}`}>
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">
            Your AI-powered partner for{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              smarter backtesting
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of quantitative researchers using AlgoTrader Pro to build, backtest, and validate 
            profitable trading strategies with advanced queue-aware market simulation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/backtesting">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group">
                Start Backtesting Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-purple-500/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AlgoTrader Pro</span>
              </div>
              <p className="text-gray-400">
                Professional backtesting platform with AI-powered strategy development and model training.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 AlgoTrader Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}