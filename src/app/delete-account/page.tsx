"use client";

import React, { useState } from 'react';
import { 
  Trash2, 
  Info, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  Mail, 
  Phone, 
  User, 
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function DeleteAccountPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.smarteco.rw/api/v1';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!agreed) {
      setError('You must agree to the data deletion terms before proceeding.');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.phone) {
      setError('Please fill in all required fields (First Name, Last Name, and Registered Phone Number).');
      return;
    }

    // Basic phone validation check (must start with +)
    if (!formData.phone.startsWith('+')) {
      setError('Phone number must start with a "+" followed by your country code (e.g. +250788123456).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/delete-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          reason: '',
        });
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setError('Unable to connect to our servers. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-emerald-900">SmartEco</h1>
            <p className="text-xs text-gray-500 font-medium">Smart Waste Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            Developer: SmartEco Engineering
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Information Panel */}
        <section className="lg:col-span-7 flex flex-col justify-between gap-10">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Account & Data <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
                Deletion Request
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              We value your privacy at SmartEco. Under Google Play policies and local privacy regulations, you have the right to request the permanent deletion of your account and all associated personal data.
            </p>

            {/* Path 1: Recommended In-App Deletion */}
            <div className="mt-8 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm relative overflow-hidden group hover:border-emerald-100 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-12 -translate-y-12 opacity-60 group-hover:scale-110 transition-transform"></div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="relative">
                  <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                    Method 1: Instant In-App Deletion (Recommended)
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Instant
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    If you still have the SmartEco mobile application installed, you can delete your account immediately:
                  </p>
                  <ol className="mt-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Open the <strong>SmartEco</strong> app on your mobile device.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Navigate to <strong>Profile</strong> (bottom navigation).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Select <strong>Settings</strong> &gt; <strong>Delete Account</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Confirm your password/OTP to finalize deletion.</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Policy & Data Specification */}
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                What happens to your data?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-red-50/50 border border-red-100">
                  <h4 className="font-bold text-red-950 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Permanently Deleted Data
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-red-900/80">
                    <li>• Personal profile information (Name, Avatar, Bio)</li>
                    <li>• Contact details (Phone number, Email address)</li>
                    <li>• Account credentials and login sessions</li>
                    <li>• Accumulated EcoPoints & tier progress</li>
                    <li>• IoT Smart Bin connections and history</li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-100">
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Retained / Legal Data
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-amber-900/80">
                    <li>• Payment receipts & transaction histories</li>
                    <li>• Invoiced billing metadata</li>
                    <li>• Audit logs for system actions</li>
                    <li className="font-semibold mt-2 text-amber-950">
                      * Retained for 2 years as required by Rwandan financial regulations & PCI DSS compliance guidelines.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <footer className="border-t border-gray-100 pt-6 text-xs text-gray-400">
            <p>© {new Date().getFullYear()} SmartEco Engineering. All rights reserved.</p>
            <p className="mt-1">
              For security reasons, all web-submitted deletion requests require manual validation and identity verification. Our compliance team will reach out to you within 48-72 hours.
            </p>
          </footer>
        </section>

        {/* Right Side: The Deletion Request Form */}
        <section className="lg:col-span-5">
          <div className="sticky top-28 bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Method 2: Web Deletion Request</h3>
                <p className="text-xs text-gray-500">If you no longer have access to the app</p>
              </div>
            </div>

            {success ? (
              <div className="py-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">Request Received!</h4>
                <p className="text-sm text-gray-500 mt-2 px-4 leading-relaxed">
                  Thank you. We have logged your request. For your security, our compliance support agent will contact you on your registered phone/email to verify your identity before performing any data wipe.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-800 flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Registered Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+250788123456"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">Include country code prefix (e.g. +250 for Rwanda)</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Registered Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Reason for Deletion (Optional)
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Tell us why you would like to delete your account..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 accent-emerald-600"
                    />
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors leading-relaxed">
                      I understand that requesting account deletion will permanently wipe my profile and rewards. I acknowledge that financial and transaction records will be retained for legal compliance as detailed in the policy.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-100 hover:shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Request...</span>
                    </>
                  ) : (
                    <span>Submit Deletion Request</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
