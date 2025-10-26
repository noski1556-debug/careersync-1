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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

type AuthStep = "name" | "referral" | "email" | { email: string };

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>("name");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
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
    if (/^\s+$/.test(nameValue)) {
      return "Name cannot be only whitespace";
    }
    return null;
  };

  const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setStep("referral");
  };

  const handleReferralSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStep("email");
  };

  const handleSkipReferral = () => {
    setReferralCode("");
    setStep("email");
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name.trim());
      if (referralCode.trim()) {
        formData.append("referralCode", referralCode.trim());
      }
      
      await signIn("email-otp", formData);
      setStep({ email });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", typeof step === "object" ? step.email : email);
      formData.append("code", otp);
      formData.append("name", name.trim());
      if (referralCode.trim()) {
        formData.append("referralCode", referralCode.trim());
      }
      
      await signIn("email-otp", formData);

      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center h-full flex-col">
          <Card className="min-w-[400px] w-full max-w-md pb-0 border shadow-md relative z-10">
            {step === "name" && (
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
                  <CardTitle className="text-xl">Welcome to CareerSync</CardTitle>
                  <CardDescription>
                    Let's start with your name
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleNameSubmit}>
                  <CardContent>
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
                      <p className="text-xs text-muted-foreground">
                        2-50 characters, letters, spaces, hyphens, and apostrophes only
                      </p>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}

            {step === "referral" && (
              <>
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <img
                      src="https://harmless-tapir-303.convex.cloud/api/storage/89ddb60d-5ce3-4819-b55c-5df04ca68217"
                      alt="CareerSync"
                      className="h-16 w-auto rounded-lg mb-4 mt-4 cursor-pointer"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <CardTitle className="text-xl">Have a Referral Code?</CardTitle>
                  <CardDescription>
                    Enter it to unlock rewards (optional)
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleReferralSubmit}>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="referralCode">Referral Code</Label>
                      <Input
                        id="referralCode"
                        name="referralCode"
                        placeholder="Enter code (optional)"
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        disabled={isLoading}
                        maxLength={8}
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex-col gap-3 pb-6">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleSkipReferral}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Skip
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}

            {step === "email" && (
              <>
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <img
                      src="https://harmless-tapir-303.convex.cloud/api/storage/89ddb60d-5ce3-4819-b55c-5df04ca68217"
                      alt="CareerSync"
                      className="h-16 w-auto rounded-lg mb-4 mt-4 cursor-pointer"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <CardTitle className="text-xl">Enter Your Email</CardTitle>
                  <CardDescription>
                    We'll send you a verification code
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
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
                      <Button
                        type="submit"
                        variant="outline"
                        size="icon"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                    
                    <div className="mt-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-4"
                        onClick={handleGuestLogin}
                        disabled={isLoading}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Continue as Guest
                      </Button>
                    </div>
                  </CardContent>
                </form>
              </>
            )}

            {typeof step === "object" && (
              <>
                <CardHeader className="text-center mt-4">
                  <CardTitle>Check your email</CardTitle>
                  <CardDescription>
                    We've sent a code to {step.email}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleOtpSubmit}>
                  <CardContent className="pb-4">
                    <input type="hidden" name="email" value={step.email} />
                    <input type="hidden" name="code" value={otp} />

                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                            const form = (e.target as HTMLElement).closest("form");
                            if (form) {
                              form.requestSubmit();
                            }
                          }
                        }}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-500 text-center">
                        {error}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Didn't receive a code?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => setStep("email")}
                      >
                        Try again
                      </Button>
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col gap-3 pb-6">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify code
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep("email")}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Use different email
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}

            <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
              Secured by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                vly.ai
              </a>
            </div>
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