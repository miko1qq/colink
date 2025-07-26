import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, User, GraduationCap, Eye, EyeOff } from "lucide-react";
import { authService } from "@/lib/supabaseService";
import { Link } from "react-router-dom";
import CoventryLogo from "@/components/CoventryLogo";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") as 'student' | 'professor' | null;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const { data, error } = await authService.signUp(
        formData.email,
        formData.password,
        role!,
        formData.fullName
      );
      
      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        toast({
          title: "Account Created Successfully",
          description: `Welcome to CoLink! Please check your email to confirm your account.`,
        });
        
        // If the user is immediately confirmed (e.g., in development)
        if (data.session) {
          navigate(`/${role}/dashboard`);
        } else {
          // Redirect to login with a message about email confirmation
          navigate(`/login?role=${role}&message=check-email`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
              Create {role === "student" ? "Student" : "Professor"} Account
            </CardTitle>
            <p className="text-muted-foreground">
              Join CoLink and start your learning journey
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                {role === "student" ? (
                  <User className="h-5 w-5 text-primary" />
                ) : (
                  <GraduationCap className="h-5 w-5 text-primary" />
                )}
                <span className="text-sm font-medium text-primary">
                  Signing up as {role === "student" ? "Student" : "Professor"}
                </span>
              </div>

              <Input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={e => handleInputChange("fullName", e.target.value)}
                className="border-primary/20 focus:border-primary"
                required
              />

              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => handleInputChange("email", e.target.value)}
                className="border-primary/20 focus:border-primary"
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={e => handleInputChange("password", e.target.value)}
                  className="border-primary/20 focus:border-primary pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange("confirmPassword", e.target.value)}
                  className="border-primary/20 focus:border-primary pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to={`/login?role=${role}`} 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;