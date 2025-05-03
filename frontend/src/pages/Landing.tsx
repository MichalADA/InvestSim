
import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, PieChart, TrendingUp, Shield, Zap, BarChartBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-investsim-600 text-white p-1 rounded">
              <PieChart className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl">InvestSim</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="text-sm font-medium hover:underline">Sign In</Link>
            <Link to="/auth/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Master Investing <span className="text-investsim-600">Without Risk</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Build and test your investment strategies with virtual money. Learn by doing in our realistic market simulation.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link to="/auth/register" className="w-full">
              <Button size="lg" className="w-full">Get Started</Button>
            </Link>
            <Link to="/auth/login" className="w-full">
              <Button size="lg" variant="outline" className="w-full">Log In</Button>
            </Link>
          </div>

          <div className="mt-20 flex justify-center">
            <div className="relative mx-auto">
              <div className="z-10 relative bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80" 
                  alt="InvestSim Dashboard" 
                  className="w-full object-cover" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-investsim-500/30 to-accent/30 blur-3xl -z-10 rounded-full transform scale-150 translate-y-1/4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to learn investing in a risk-free environment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Market Data</CardTitle>
                <CardDescription>
                  Access live market data and historical charts to make informed decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Historical price charts
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Market trends
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Real-world market movements
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>
                  Build and manage multiple investment portfolios with detailed analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Multiple portfolio creation
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Asset allocation visualization
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Performance tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track your investment performance with detailed metrics and insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Return on investment tracking
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Profit/loss visualization
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Performance benchmarking
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Risk-Free Learning</CardTitle>
                <CardDescription>
                  Practice investing strategies without risking real money.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Virtual currency
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    No real financial risk
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Safe environment for beginners
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instant Transactions</CardTitle>
                <CardDescription>
                  Execute trades instantly to test time-sensitive strategies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Real-time trade execution
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Complete transaction history
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Buy and sell with ease
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChartBig className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Diverse Asset Classes</CardTitle>
                <CardDescription>
                  Access a wide range of assets including stocks, ETFs, and cryptocurrencies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Stocks and equities
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    ETFs and funds
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary p-1 rounded-full mr-2">✓</span>
                    Cryptocurrencies
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of users who are learning investment strategies without the financial risk.
          </p>
          
          <Link to="/auth/register">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-investsim-600 text-white p-1 rounded">
                <PieChart className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">InvestSim</span>
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Features</a>
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2023 InvestSim. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
