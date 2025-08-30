import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from "lucide-react";

export const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/user/signup",
        {
          username: name,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      toast.success(data.message || "User registered successfully");
      localStorage.setItem("token", data.token);
      navigate("/login");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.errors || "User registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1929] to-[#0C0B10] text-[#E0E0E0] flex items-center justify-center p-4 font-sans overflow-hidden">
        {/* Back to Home Button */}
        <button
            onClick={handleBackToHome}
            className="fixed top-6 left-6 z-50 group flex items-center gap-2 px-4 py-2 bg-[#1C1C23]/80 backdrop-blur-lg rounded-lg border border-white/10 text-gray-300 hover:text-white transition-all duration-200 hover:bg-white/20"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Home</span>
        </button>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div
        className={`relative z-10 w-full max-w-md transform transition-all ease-in-out duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-[#1C1C23]/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-3">
              Create your account
            </h2>
            <p className="text-gray-400">
              Start building with our services
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#A0A0F0] transition-colors" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A0A0F0] focus:border-[#A0A0F0] transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#A0A0F0] transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A0A0F0] focus:border-[#A0A0F0] transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#A0A0F0] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#2A2A2A] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A0A0F0] focus:border-[#A0A0F0] transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#A0A0F0] transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#2A2A2A] border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A0A0F0] focus:border-[#A0A0F0] transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#D9D9F3] text-black font-semibold rounded-lg shadow-lg transition-all duration-300 hover:bg-white hover:shadow-[#D9D9F3]/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#A0A0F0] focus:ring-offset-2 focus:ring-offset-[#1C1C23] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-[#A0A0F0] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
