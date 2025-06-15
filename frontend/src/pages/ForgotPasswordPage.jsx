import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../lib/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans text-white bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Left Side: Brand & Video - Hidden on mobile, visible on lg+ */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-10">
        {/* Logo + Title */}
        <div className="flex items-center space-x-4 mb-6">
          <img src="/logo.png" alt="PolyChat9 Logo" className="w-16 h-16" style={{background: 'transparent'}} />
          <h1 className="text-5xl font-bold text-gray-200">PolyChat9</h1>
        </div>

        {/* Main tagline */}
        <h2 className="text-4xl font-bold text-white mb-4 text-center">Speak globally, connect locally</h2>

        {/* Feature teaser */}
        <p className="text-gray-200 text-center text-lg mb-6 max-w-md leading-relaxed">
          PolyChat is an all-in-one platform for real-time video calls, instant messaging, and multilingual community engagement. Designed for global communication, it enables seamless conversations across languages through live translation, threaded discussions, and cultural communities. Whether you're connecting with friends, exploring new cultures, or participating in language exchange, PolyChat offers features like group video calls, screen sharing, contextual replies, profile pages, and smart search—making meaningful, organized, and cross-cultural communication easier than ever.
        </p>

        {/* Enhanced Global Network Video */}
        <div className="relative w-full max-w-4xl mx-auto group">
          {/* Gradient Overlay for Better Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 rounded-2xl z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <video
            src="/videos/globalnetwork.mov"
            autoPlay
            loop
            muted
            playsInline
            poster="/images/video-poster.jpg"
            className="w-full h-auto rounded-2xl shadow-2xl border border-white/10 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] animate-fade-in"
            style={{
              aspectRatio: '16/9',
              objectFit: 'cover'
            }}
            aria-label="Global network visualization showing worldwide connectivity"
          />

          {/* Loading Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl flex items-center justify-center opacity-0 animate-pulse">
            <div className="text-white/60 text-sm">Loading video...</div>
          </div>
        </div>
      </div>
      
      {/* Mobile header - Visible only on mobile */}
      <div className="lg:hidden bg-gradient-to-r from-black via-gray-800 to-black p-8 text-center">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <img src="/logo.png" alt="PolyChat9" className="h-16 w-16" style={{background: 'transparent'}} />
          <h1 className="text-3xl font-bold text-white">PolyChat9</h1>
        </div>
        <h2 className="text-xl font-bold text-white mb-3">Speak globally, connect locally</h2>
        <p className="text-base text-gray-300 px-4 leading-relaxed">
          All-in-one platform for video calls, messaging, and multilingual community engagement.
        </p>
      </div>

      {/* Forgot Password form section */}
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center items-center bg-gray-900/80 backdrop-blur-sm p-6 lg:p-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-6 my-auto">
          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-semibold text-center text-white mb-4">Reset Password</h2>
              <p className="text-gray-300 text-center mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {/* ERROR MESSAGE DISPLAY */}
              {error && (
                <div className="alert alert-error mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                  <span className="text-red-200">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-colors duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={isLoading}
                  aria-label="Send reset password email"
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-semibold text-white mb-4">Check Your Email</h2>
                <p className="text-gray-300 mb-6">
                  We've sent a password reset link to <span className="text-green-400">{email}</span>
                </p>
                <p className="text-sm text-gray-400 mb-8">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="text-green-400 hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded transition-colors duration-200"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
