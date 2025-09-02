"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signUp(email, password, name);
    
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Sign up failed");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-white absolute top-0 left-0 z-50">
      <div className="hidden md:block align-middle my-auto">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Welcome to Folo<span className="text-indigo-600">Up</span>
            </CardTitle>
            <CardDescription className="text-center">
              Create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Registration is not available in demo mode.</p>
              <p>Please use existing credentials to sign in.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="block md:hidden px-3 h-[60%] my-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome to Folo<span className="text-indigo-600">Up</span>
        </h1>
        <h1 className="text-md my-3 text-center text-gray-800">
          Mobile version is currently under construction. 🚧
        </h1>
        <p className="text-center text-gray-600 mt-3">
          Please sign in using a PC for the best experience. Sorry for the
          inconvenience.
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
