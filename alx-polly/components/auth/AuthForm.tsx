"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Mail, Lock, User, Github, Chrome } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/polls");
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupForm) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        // Auto-login after successful signup
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        router.push("/polls");
        router.refresh();
      } else {
        const error = await response.json();
        setError(error.message || "Something went wrong");
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/polls" });
  };

  if (session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>
            You are signed in as {session.user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => router.push("/polls")}
            className="w-full"
          >
            Go to Polls
          </Button>
          <Button 
            variant="outline" 
            onClick={() => signOut()}
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome to AlxPolly</CardTitle>
        <CardDescription>
          Create and participate in polls with ease
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...loginForm.register("email")}
                  type="email"
                  placeholder="Email"
                  icon={<Mail className="h-4 w-4" />}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  {...loginForm.register("password")}
                  type="password"
                  placeholder="Password"
                  icon={<Lock className="h-4 w-4" />}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...signupForm.register("name")}
                  type="text"
                  placeholder="Full Name"
                  icon={<User className="h-4 w-4" />}
                />
                {signupForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {signupForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  {...signupForm.register("email")}
                  type="email"
                  placeholder="Email"
                  icon={<Mail className="h-4 w-4" />}
                />
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  {...signupForm.register("password")}
                  type="password"
                  placeholder="Password"
                  icon={<Lock className="h-4 w-4" />}
                />
                {signupForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {signupForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  {...signupForm.register("confirmPassword")}
                  type="password"
                  placeholder="Confirm Password"
                  icon={<Lock className="h-4 w-4" />}
                />
                {signupForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {signupForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("github")}
              className="w-full"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              className="w-full"
            >
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
