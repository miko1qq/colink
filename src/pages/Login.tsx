import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, User, GraduationCap } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { loginDemoUser } from "../lib/demoData";
import { Link } from "react-router-dom";
import CoventryLogo from "@/components/CoventryLogo";
import DemoDataInitializer from "@/components/DemoDataInitializer";


const Login = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role"); // student or professor
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Переброс, если уже вошел
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate(`/${role}/dashboard`);
      }
    });
  }, []);

  // Переброс, если нет роли
  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate(`/${role}/dashboard`);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    const { error } = await loginDemoUser(role as 'student' | 'professor');
    setLoading(false);

    if (error) {
      setError(error.message || 'Demo login failed');
    } else {
      navigate(`/${role}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
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
        <Card className="w-full max-w-md shadow-primary border-2 border-primary/20">
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
            <div className="bg-gradient-secondary rounded-lg p-4 border border-primary/20">
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
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Or login with your account</p>
              </div>
              
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border-primary/20 focus:border-primary"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border-primary/20 focus:border-primary"
              />
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <Button 
                className="w-full bg-primary hover:bg-primary/90" 
                onClick={handleLogin} 
                disabled={loading}
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
            </div>

            {/* Demo Setup */}
            <div className="border-t pt-4">
              <DemoDataInitializer />
            </div>

            {/* Demo Credentials */}
            <div className="text-center text-xs text-muted-foreground">
              <p className="font-medium">Demo Credentials:</p>
              <p>Student: student@coventry.edu / student123</p>
              <p>Professor: professor@coventry.edu / professor123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;