"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userType, setUserType] = useState("exporter");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true); // Update login status if user is found in localStorage
      const parsedUser = JSON.parse(user);
      if (parsedUser.user_type === "exporter") {
        window.location.href = '/auctions';  // Redirect to auctions if exporter
      } else if (parsedUser.user_type === "importer") {
        window.location.href = '/dashboard';  // Redirect to dashboard if importer
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Construct the login payload dynamically based on the active tab
    const loginPayload = {
      [activeTab]: formData.usernameOrEmail, // Dynamic value based on email/username tab
      password: formData.password,
      userType: userType, // Sending the userType as 'exporter' or 'importer'
    };

    try {
      const response = await fetch("https://zecbay-backend.vercel.app/api/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid username or password.");
        setErrorMessage("");
        setSuccessMessage("");
      } else {
        toast.success("Login successful!");
        setSuccessMessage("");
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update the login status
        setIsLoggedIn(true);

        // Redirect based on userType
        if (data.user.user_type === "exporter") {
          window.location.href = '/auctions';  // Redirect to auctions if exporter
        } else if (data.user.user_type === "importer") {
          window.location.href = '/dashboard';  // Redirect to dashboard if importer
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Error during login: " + error.message);
      setSuccessMessage("");
    }
  };

  const handleSendOtp = async () => {
    if (!otpEmail) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const res = await fetch("https://zecbay-backend.vercel.app/api/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: otpEmail,
          userType: userType,
          sendOtp: true,  // 👈 This tells backend to only send OTP
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        toast.success("OTP sent to your email.");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Error sending OTP: " + error.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpEmail || !enteredOtp) {
      toast.error("Please fill in both email and OTP.");
      return;
    }
  
    try {
      const res = await fetch("https://zecbay-backend.vercel.app/api/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: otpEmail,
          otp: enteredOtp,
          userType: userType,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success("OTP login successful!");
        localStorage.setItem("user", JSON.stringify(data.user));
  
        if (data.user.user_type === "exporter") {
          window.location.href = "/auctions";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        toast.error(data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP.");
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Link href="/" className="flex items-center text-primary hover:underline mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{isOtpLogin ? "Sign in using OTP" : "Login to ZecBay"}</CardTitle>
          <CardDescription className="text-center">Enter your details to proceed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <Label>I am an</Label>
            <RadioGroup defaultValue="exporter" className="grid grid-cols-2 gap-4" onValueChange={setUserType}>
            <div>
                <RadioGroupItem value="exporter" id="exporter" className="peer sr-only" />
                <Label
                  htmlFor="exporter"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 w-full text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <span className="whitespace-nowrap">Indian Exporter</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="importer" id="importer" className="peer sr-only" />
                <Label
                  htmlFor="importer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 w-full text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <span className="whitespace-nowrap">Importer</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {isOtpLogin ? (
            <>
              <div className="space-y-2 mb-4">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                />
              </div>

              {!otpSent ? (
                <Button onClick={handleSendOtp} className="w-full mb-2">Send OTP</Button>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    <Label>Enter OTP</Label>
                    <Input
                      type="text"
                      placeholder="Enter OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleVerifyOtp} className="w-full mb-2">Verify OTP & Login</Button>
                </>
              )}
            </>
          ) : (
            <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="username">Username</TabsTrigger>
            </TabsList>

            {/* Email Tab */}
            <TabsContent value="email">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                />
              </div>
            </TabsContent>

            {/* Username Tab */}
            <TabsContent value="username">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Password Input */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {!isOtpLogin && (
            <Button type="submit" onClick={handleLogin} className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          )}

          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>

          {isOtpLogin ? (
              <div className="text-sm text-center text-muted-foreground">
                <button
                  onClick={() => setIsOtpLogin(false)}
                  className="text-primary hover:underline"
                >
                  Back to password login
                </button>
              </div>
            ) : (
              <div className="text-sm text-center text-muted-foreground mt-1">
                Forgot Password?{' '}
                <button
                  onClick={() => setIsOtpLogin(true)}
                  className="text-primary hover:underline"
                >
                  Sign in using OTP
                </button>
              </div>
            )}
          </CardFooter>
        <ToastContainer/>
      </Card>
    </div>
  );
}
