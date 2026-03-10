"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Step = "details" | "otp";

interface PasswordCheck {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_CHECKS: PasswordCheck[] = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  {
    label: "One special character",
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

function PasswordStrengthIndicator({ password }: { password: string }) {
  const results = useMemo(
    () =>
      PASSWORD_CHECKS.map((check) => ({
        ...check,
        passed: check.test(password),
      })),
    [password],
  );

  if (!password) return null;

  return (
    <ul className="mt-1 space-y-1 text-xs">
      {results.map((r) => (
        <li key={r.label} className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex size-3.5 items-center justify-center rounded-full text-[10px] font-bold leading-none",
              r.passed
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/15 text-destructive",
            )}
          >
            {r.passed ? "✓" : "✗"}
          </span>
          <span
            className={
              r.passed
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }
          >
            {r.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<Step>("details");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isPasswordValid = useMemo(
    () => PASSWORD_CHECKS.every((check) => check.test(password)),
    [password],
  );

  const passwordsMatch = password === confirmPassword;

  // Start cooldown timer for resend
  function startResendCooldown() {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleSendOtp() {
    setError("");

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password does not meet all requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "signup",
          name,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP.");
        toast.error(data.error || "Failed to send OTP.");
        return;
      }

      toast.success("Verification code sent! 📧", {
        description: "Check your email inbox.",
      });
      setStep("otp");
      startResendCooldown();
    } catch {
      setError("Something went wrong. Try again.");
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyAndSignup() {
    setError("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Verify the OTP
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otp.trim(),
          type: "signup",
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.error || "Invalid verification code.");
        toast.error(verifyData.error || "Invalid verification code.");
        return;
      }

      // Step 2: Create the account
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          otp: otp.trim(),
        }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        setError(signupData.error || "Signup failed.");
        toast.error(signupData.error || "Signup failed.");
        return;
      }

      toast.success("Account created! 🎉", {
        description: "Welcome aboard!",
      });
      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Try again.");
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return;

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "signup",
          name,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend OTP.");
        toast.error(data.error || "Failed to resend OTP.");
        return;
      }

      toast.success("New code sent! 📧");
      startResendCooldown();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {step === "details" ? "Create an account" : "Verify your email"}
          </CardTitle>
          <CardDescription>
            {step === "details"
              ? "Enter your information below to create your account"
              : `We've sent a 6-digit code to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* ── Step 1: Details ── */}
          {step === "details" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOtp();
              }}
            >
              <FieldGroup>
                {error && (
                  <div className="text-destructive text-sm text-center">
                    {error}
                  </div>
                )}
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <FieldDescription>
                    We&apos;ll send a verification code to this email.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <PasswordStrengthIndicator password={password} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-destructive text-xs mt-0.5">
                      Passwords do not match.
                    </p>
                  )}
                </Field>
                <Field>
                  <Button
                    type="submit"
                    disabled={loading || !isPasswordValid || !passwordsMatch}
                  >
                    {loading ? "Sending code..." : "Continue"}
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <a href="/login">Sign in</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}

          {/* ── Step 2: OTP Verification ── */}
          {step === "otp" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyAndSignup();
              }}
            >
              <FieldGroup>
                {error && (
                  <div className="text-destructive text-sm text-center">
                    {error}
                  </div>
                )}
                <Field>
                  <FieldLabel htmlFor="otp">Verification Code</FieldLabel>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setOtp(value);
                    }}
                    autoComplete="one-time-code"
                    required
                    className="text-center text-lg tracking-[0.3em] font-mono"
                  />
                  <FieldDescription>
                    Enter the 6-digit code we sent to your email. The code
                    expires in 10 minutes.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" disabled={loading || otp.length !== 6}>
                    {loading ? "Verifying..." : "Verify & Create Account"}
                  </Button>
                </Field>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
                    onClick={() => {
                      setStep("details");
                      setOtp("");
                      setError("");
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    className={cn(
                      "underline-offset-4 hover:underline transition-colors",
                      resendCooldown > 0
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:text-primary/80",
                    )}
                    onClick={handleResendOtp}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </div>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
