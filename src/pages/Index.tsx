
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Star, ArrowRight, BookOpen, Handshake, Shield } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (user) {
      const dashboardPath = user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(dashboardPath);
    }
  }, [user, navigate]);

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'admin' ? '/admin' : '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            Share Skills, Learn Together
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            Connect with others to exchange knowledge and skills. Teach what you know, learn what you want, and build meaningful connections in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/browse">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Browse Skills
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={user ? getDashboardPath() : "/login"}>
              <Button variant="outline" size="lg" className="px-8 py-3">
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>List Your Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share what you can teach and what you'd like to learn. From coding to cooking, every skill has value.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Find Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse and search for people who have skills you want to learn and need skills you can offer.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Handshake className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Start Swapping</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Send swap requests, arrange meetings, and start learning from each other in a supportive environment.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Active Learners</div>
            </div>
            <div>
              <BookOpen className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">Skills Available</div>
            </div>
            <div>
              <Star className="h-12 w-12 mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Safe & Trusted Community</h2>
          <p className="text-lg text-gray-600 mb-8">
            Our platform is moderated to ensure a safe, respectful environment for all learners. 
            User ratings and reviews help maintain quality connections.
          </p>
          <Link to={user ? getDashboardPath() : "/browse"}>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              {user ? 'Go to Dashboard' : 'Start Learning Today'}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
