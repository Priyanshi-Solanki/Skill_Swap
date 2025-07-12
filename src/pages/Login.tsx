import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Shield, Eye, EyeOff, Mail, BookOpen, Handshake, UserPlus, LogIn } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentRole, setCurrentRole] = useState<'user' | 'admin'>('user');
  const { login, signup, socialLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (role: 'user' | 'admin') => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    const success = await login(email, password, role);
    
    if (success) {
      toast({
        title: "Login successful!",
        description: `Welcome back! Redirecting to ${role} dashboard...`,
      });
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError("Invalid credentials for the selected role");
    }
  };

  const handleSignUp = async (role: 'user' | 'admin') => {
    if (!email || !password || !name) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError("");
    const success = await signup(email, password, name, role);
    
    if (success) {
      toast({
        title: "Account created successfully!",
        description: `Welcome to SkillSwap! Redirecting to ${role} dashboard...`,
      });
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError("An account with this email already exists");
    }
  };

  const handleDemoLogin = (role: 'user' | 'admin') => {
    const demoCredentials = role === 'admin' 
      ? { email: 'admin@skillswap.com', password: 'admin123' }
      : { email: 'user@skillswap.com', password: 'user123' };
    
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // Decode the JWT token to get user information
      const response = await fetch('https://oauth2.googleapis.com/tokeninfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id_token=${credentialResponse.credential}`,
      });

      if (!response.ok) {
        throw new Error('Failed to verify Google token');
      }

      const userData = await response.json();
      
      const googleUser = {
        email: userData.email,
        name: userData.name,
        role: currentRole,
        avatar: userData.picture
      };
      
      const success = await socialLogin('google', googleUser);
      
      if (success) {
        toast({
          title: "Google login successful!",
          description: `Welcome! Redirecting to ${currentRole} dashboard...`,
        });
        
        navigate(currentRole === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google login failed",
        description: "Please try again or use email login.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleError = () => {
    toast({
      title: "Google login failed",
      description: "Please try again or use email login.",
      variant: "destructive",
    });
  };

  const handleMicrosoftLogin = async (role: 'user' | 'admin') => {
    try {
      // Simulate Microsoft OAuth flow
      toast({
        title: "Microsoft Login",
        description: "Redirecting to Microsoft for authentication...",
      });
      
      // In a real app, this would redirect to Microsoft OAuth
      // For demo purposes, we'll simulate a successful login
      setTimeout(async () => {
        const mockMicrosoftUser = {
          email: 'demo@outlook.com',
          name: `Microsoft ${role === 'admin' ? 'Admin' : 'User'}`,
          role: role,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        };
        
        const success = await socialLogin('microsoft', mockMicrosoftUser);
        
        if (success) {
          toast({
            title: "Microsoft login successful!",
            description: `Welcome! Redirecting to ${role} dashboard...`,
          });
          
          navigate(role === 'admin' ? '/admin' : '/dashboard');
        }
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Microsoft login failed",
        description: "Please try again or use email login.",
        variant: "destructive",
      });
    }
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
            <div className="relative">
              <BookOpen className="w-10 h-10 text-white" />
              <Handshake className="w-6 h-6 text-white absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            SkillSwap
          </h1>
          <p className="text-gray-600 text-sm">Share Skills, Learn Together</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isSignUp ? "Join SkillSwap to start sharing skills" : "Sign in to access your dashboard"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            <Tabs defaultValue="user" className="w-full" onValueChange={(value) => setCurrentRole(value as 'user' | 'admin')}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="user" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <User className="w-4 h-4" />
                  User {isSignUp ? "Sign Up" : "Login"}
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                  <Shield className="w-4 h-4" />
                  Admin {isSignUp ? "Sign Up" : "Login"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="space-y-6 mt-6">
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      width="100%"
                      locale="en"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => handleMicrosoftLogin('user')}
                    disabled={isLoading}
                  >
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#f25022"
                        d="M1 1h10v10H1z"
                      />
                      <path
                        fill="#7fba00"
                        d="M13 1h10v10H13z"
                      />
                      <path
                        fill="#00a4ef"
                        d="M1 13h10v10H1z"
                      />
                      <path
                        fill="#ffb900"
                        d="M13 13h10v10H13z"
                      />
                    </svg>
                    Continue with Microsoft
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-500 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="user-name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="user-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12 border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Input
                        id="user-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-12 border-2 focus:border-blue-500 transition-colors pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={() => isSignUp ? handleSignUp('user') : handleLogin('user')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isSignUp ? "Creating account..." : "Signing in..."}
                      </>
                    ) : (
                      <>
                        {isSignUp ? <UserPlus className="mr-2 h-4 w-4" /> : <Mail className="mr-2 h-4 w-4" />}
                        {isSignUp ? "Create User Account" : "Login as User"}
                      </>
                    )}
                  </Button>
                  
                  {!isSignUp && (
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => handleDemoLogin('user')}
                      disabled={isLoading}
                    >
                      Try Demo User
                    </Button>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-6 mt-6">
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      width="100%"
                      locale="en"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
                    onClick={() => handleMicrosoftLogin('admin')}
                    disabled={isLoading}
                  >
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#f25022"
                        d="M1 1h10v10H1z"
                      />
                      <path
                        fill="#7fba00"
                        d="M13 1h10v10H13z"
                      />
                      <path
                        fill="#00a4ef"
                        d="M1 13h10v10H1z"
                      />
                      <path
                        fill="#ffb900"
                        d="M13 13h10v10H13z"
                      />
                    </svg>
                    Continue with Microsoft
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-gray-500 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="admin-name" className="text-sm font-medium text-gray-700">Admin Name</Label>
                      <Input
                        id="admin-name"
                        type="text"
                        placeholder="Enter admin name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-12 border-2 focus:border-red-500 transition-colors"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-sm font-medium text-gray-700">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12 border-2 focus:border-red-500 transition-colors"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700">Admin Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={isSignUp ? "Create admin password (min 6 characters)" : "Enter admin password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="h-12 border-2 focus:border-red-500 transition-colors pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={() => isSignUp ? handleSignUp('admin') : handleLogin('admin')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isSignUp ? "Creating account..." : "Signing in..."}
                      </>
                    ) : (
                      <>
                        {isSignUp ? <UserPlus className="mr-2 h-4 w-4" /> : <Shield className="mr-2 h-4 w-4" />}
                        {isSignUp ? "Create Admin Account" : "Login as Admin"}
                      </>
                    )}
                  </Button>
                  
                  {!isSignUp && (
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => handleDemoLogin('admin')}
                      disabled={isLoading}
                    >
                      Try Demo Admin
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Toggle between Login and Sign Up */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  clearForm();
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {isSignUp ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Already have an account? Sign in
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Don't have an account? Sign up
                  </>
                )}
              </Button>
            </div>
            
            {!isSignUp && (
              <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p className="text-xs">
                  User: user@skillswap.com / user123<br />
                  Admin: admin@skillswap.com / admin123
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 