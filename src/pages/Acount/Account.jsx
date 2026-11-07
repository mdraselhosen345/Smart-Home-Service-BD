import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../../Firebase/Firebase"; // শুধু auth এবং googleProvider আসবে
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut,
  onAuthStateChanged,
  signInWithPopup 
} from "firebase/auth"; // বাকি সব firebase/auth থেকে আসবে

export default function Account() {
  const [view, setView] = useState("login"); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ইউজারের লগইন স্টেট ট্র্যাক রাখা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // মেসেজ ক্লিয়ার করার হেল্পার
  const clearAlerts = () => {
    setError("");
    setMessage("");
  };

  // ১. সাইন আপ / অ্যাকাউন্ট তৈরি
  const handleSignUp = async (e) => {
    e.preventDefault();
    clearAlerts();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
    } catch (err) {
      setError(err.message);
    }
  };

  // ২. লগইন
  const handleLogin = async (e) => {
    e.preventDefault();
    clearAlerts();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("সফলভাবে লগইন হয়েছে!");
    } catch (err) {
      setError(err.message);
    }
  };

  // ৩. পাসওয়ার্ড ভুলে গেলে (Forget Password)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    clearAlerts();
    if (!email) {
      setError("দয়া করে ইমেইলটি লিখুন!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে!");
    } catch (err) {
      setError(err.message);
    }
  };

  // ৪. গুগল দিয়ে লগইন
  const handleGoogleLogin = async () => {
    clearAlerts();
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage("Google দিয়ে সফলভাবে লগইন হয়েছে!");
    } catch (err) {
      setError(err.message);
    }
  };

  // ৫. লগআউট
  const handleLogout = async () => {
    clearAlerts();
    try {
      await signOut(auth);
      setMessage("লগআউট করা হয়েছে!");
    } catch (err) {
      setError(err.message);
    }
  };

  // ইউজার লগইন থাকলে অ্যাকাউন্ট ড্যাশবোর্ড দেখাবে
  if (user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Account</h2>
        <p className="text-gray-600 mb-6">{user.email}</p>
        <button 
          onClick={handleLogout} 
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  // ইউজার লগইন না থাকলে ফর্মগুলো দেখাবে
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* নোটিফিকেশন মেসেজ */}
      {message && <p className="p-2 mb-4 bg-green-100 text-green-700 text-sm rounded">{message}</p>}
      {error && <p className="p-2 mb-4 bg-red-100 text-red-700 text-sm rounded">{error}</p>}

      {/* ১. লগইন ফর্ম */}
      {view === "login" && (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
            Login
          </button>

          <div className="flex justify-between text-sm mt-1">
            <button type="button" onClick={() => { setView("forgot"); clearAlerts(); }} className="text-blue-600 hover:underline">
              Forgot Password?
            </button>
            <button type="button" onClick={() => { setView("signup"); clearAlerts(); }} className="text-blue-600 hover:underline">
              Create Account
            </button>
          </div>
        </form>
      )}

      {/* ২. অ্যাকাউন্ট তৈরি ফর্ম */}
      {view === "signup" && (
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <button type="submit" className="bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
            Sign Up
          </button>

          <div className="text-sm text-center mt-1">
            Already have an account?{" "}
            <button type="button" onClick={() => { setView("login"); clearAlerts(); }} className="text-blue-600 hover:underline font-semibold">
              Login
            </button>
          </div>
        </form>
      )}

      {/* ৩. পাসওয়ার্ড রিসেট ফর্ম */}
      {view === "forgot" && (
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
          <p className="text-xs text-gray-500 text-center">আপনার রেজিস্টার্ড ইমেইলটি লিখুন, আমরা পাসওয়ার্ড রিসেট করার লিংক পাঠিয়ে দেবো।</p>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <button type="submit" className="bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition">
            Send Reset Email
          </button>

          <div className="text-sm text-center mt-1">
            Back to{" "}
            <button type="button" onClick={() => { setView("login"); clearAlerts(); }} className="text-blue-600 hover:underline font-semibold">
              Login
            </button>
          </div>
        </form>
      )}

      {/* সোশ্যাল লগইন বা গুগল অপশন */}
      <div className="mt-6 border-t pt-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>
      </div>
    </div>
  );
}