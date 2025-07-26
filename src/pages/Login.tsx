import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, User, GraduationCap } from "lucide-react";
import { authService } from "@/lib/supabaseService";
import { Link } from "react-router-dom";
import CoventryLogo from "@/components/CoventryLogo";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") as 'student' | 'professor' | null;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await authService.getCurrentSession();
      if (session && role) {
        navigate(`/${role}/dashboard`);
      }
    };
    checkAuth();
  }, [role, navigate]);

  // Redirect if no role specified
  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Get user profile to determine correct redirect
        const { profile } = await authService.getCurrentUser();
        
        const redirectPath = profile?.role === 'student' 
          ? '/student/dashboard' 
          : '/professor/dashboard';
          
        toast({
          title: "Login Successful",
          description: `Welcome back to CoLink!`,
        });
        
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const demoCredentials = {
        student: { email: 'student@coventry.edu', password: 'student123' },
        professor: { email: 'professor@coventry.edu', password: 'professor123' }
      };

      const { email: demoEmail, password: demoPassword } = demoCredentials[role!];
      const { data, error } = await authService.signIn(demoEmail, demoPassword);

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Get user profile to determine correct redirect
        const { profile } = await authService.getCurrentUser();
        
        const redirectPath = profile?.role === 'student' 
          ? '/student/dashboard' 
          : '/professor/dashboard';
          
        toast({
          title: "Demo Login Successful",
          description: `Welcome to CoLink demo!`,
        });
        
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <Link to="/">
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-2 border-primary/20">
          <CardHeader className="text-center">
            <CoventryLogo size="md" className="mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-primary">
              {role === "student" ? "Student Login" : "Professor Login"}
            </CardTitle>
            <p className="text-muted-foreground">
              Enter your credentials to access CoLink
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo Login Section */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
              <h3 className="text-sm font-semibold text-primary mb-2">
                🚀 Quick Demo Access
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Try the platform instantly with our demo account
              </p>
              <Button 
                onClick={handleDemoLogin} 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white"
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    {role === "student" ? <User className="h-4 w-4 mr-2" /> : <GraduationCap className="h-4 w-4 mr-2" />}
                    Login as Demo {role === "student" ? "Student" : "Professor"}
                  </>
                )}
              </Button>
            </div>

            {/* Regular Login */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Or login with your account</p>
              </div>
              
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border-primary/20 focus:border-primary"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border-primary/20 focus:border-primary"
                required
              />
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading || !email || !password}
                variant="outline"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Logging in...
                  </span>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="text-center text-xs text-muted-foreground">
              <p className="font-medium">Demo Credentials:</p>
              <p>Student: student@coventry.edu / student123</p>
              <p>Professor: professor@coventry.edu / professor123</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  to={`/signup?role=${role}`} 
                  className="text-primary hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;