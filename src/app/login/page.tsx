"use client";

import { useState } from "react";
import { Trash2, Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/2fa");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-[448px] space-y-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#1E8449] to-[#145A32] flex items-center justify-center shadow-lg">
            <Trash2 className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SmartEco Admin Portal</h1>
            <div className="flex items-center justify-center text-gray-500 mt-1">
              <ShieldCheck className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Secure Operations Dashboard</span>
            </div>
          </div>
        </div>

        <Card className="border shadow-md overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#145A32] text-white py-2 text-center text-xs font-semibold tracking-wide px-4">
            Government of Rwanda • Ministry of Environment
          </div>

          <CardHeader className="space-y-1 pt-6 px-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    placeholder="admin@smarteco.rw" 
                    className="pl-10 bg-gray-50 border-gray-200 focus:ring-[#1E8449] focus:border-[#1E8449]"
                    defaultValue="admin@smarteco.rw"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:ring-[#1E8449] focus:border-[#1E8449]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-gray-300 data-[state=checked]:bg-[#1E8449] data-[state=checked]:border-[#1E8449]" />
                  <Label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer">Remember me</Label>
                </div>
                <Link href="#" className="text-sm font-semibold text-[#1E8449] hover:text-[#145A32]">
                  Forgot password?
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-4">
            <Button 
              onClick={handleSignIn}
              className="w-full bg-[#1E8449] hover:bg-[#145A32] text-white font-bold py-6 rounded-md shadow-sm transition-all duration-200"
            >
              Sign In to Admin Portal
            </Button>
          </CardContent>

          <CardFooter className="px-8 pb-8 pt-0 flex flex-col items-stretch space-y-4">
            {/* Demo Credentials Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-2">
              <div className="flex items-center text-blue-700 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 mr-1.5" />
                Demo Credentials (Development Only)
              </div>
              <div className="grid grid-cols-1 gap-1 text-sm text-blue-600 font-medium">
                <div>Email: <span className="text-blue-800">admin@smarteco.rw</span></div>
                <div>Password: <span className="text-blue-800">admin123</span></div>
                <div>2FA Code: <span className="text-blue-800">123456</span></div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Footer Info */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-gray-500 font-medium">
            SmartEco Admin Portal © 2026 • Government of Rwanda
          </p>
          <div className="flex items-center justify-center space-x-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <div className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Secure connection
            </div>
            <span>•</span>
            <div>All actions are logged and audited</div>
          </div>
        </div>
      </div>
    </div>
  );
}
