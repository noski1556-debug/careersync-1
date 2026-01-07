import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthProps {
  redirectAfterAuth?: string;
}

type AuthMode = "signin" | "signup";

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const validateName = (nameValue: string): string | null => {
    if (!nameValue.trim()) {
      return "Name is required";
    }
    if (nameValue.length < 2 || nameValue.length > 50) {
      return "Name must be between 2 and 50 characters";
    }
    if (!/^[a-zA-Z\s'-]+$/.test(nameValue)) {
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    }
    return null;
  };

  const validatePassword = (passwordValue: string): string | null => {
    if (passwordValue.length < 8) {
      return "Password must be at least 8 characters";
    }
    return null;
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", "signIn");

      await signIn("password", formData);

      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("name", name.trim());
      formData.append("flow", "signUp");

      await signIn("password", formData);

      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("Sign up error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Animated background blur circles */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-accent/30 to-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl"></div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="flex items-center justify-center h-full flex-col">
          <Card className="min-w-[400px] w-full max-w-md pb-0 border-2 shadow-2xl relative z-10 bg-background/90 backdrop-blur-2xl">
            {mode === "signin" ? (
              <>
                <CardHeader className="text-center">
                  <div className="flex justify-center pointer-events-auto">
                    <img
                      src="https://harmless-tapir-303.convex.cloud/api/storage/89ddb60d-5ce3-4819-b55c-5df04ca68217"
                      alt="CareerSync"
                      className="h-16 w-auto rounded-lg mb-4 mt-4 cursor-pointer pointer-events-auto"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <CardTitle className="text-xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          className="pl-9"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          className="pl-9 pr-9"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col gap-3 pb-6 pt-6">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      Don't have an account?{" "}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => {
                          setMode("signup");
                          setError(null);
                        }}
                      >
                        Sign up
                      </Button>
                    </p>
                  </CardFooter>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="text-center">
                  <div className="flex justify-center pointer-events-auto">
                    <img
                      src="https://harmless-tapir-303.convex.cloud/api/storage/89ddb60d-5ce3-4819-b55c-5df04ca68217"
                      alt="CareerSync"
                      className="h-16 w-auto rounded-lg mb-4 mt-4 cursor-pointer pointer-events-auto"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <CardTitle className="text-xl">Create Account</CardTitle>
                  <CardDescription>
                    Get started with CareerSync
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          className="pl-9"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          name="password"
                          placeholder="Create a password (min 8 characters)"
                          type={showPassword ? "text" : "password"}
                          className="pl-9 pr-9"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum 8 characters
                      </p>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col gap-3 pb-6 pt-6">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      Already have an account?{" "}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => {
                          setMode("signin");
                          setError(null);
                        }}
                      >
                        Sign in
                      </Button>
                    </p>
                  </CardFooter>
                </form>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
