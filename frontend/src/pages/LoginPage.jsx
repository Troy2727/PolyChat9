import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { useEmailAuth } from "../hooks/useFirebaseAuth";
import SocialAuthButtons from "../components/SocialAuthButtons";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Firebase authentication hooks
  const { loginMutation: firebaseLoginMutation, isLoading: firebaseLoading, error: firebaseError } = useEmailAuth();

  // Fallback to original backend authentication
  const { isPending: backendLoading, error: backendError, loginMutation: backendLoginMutation } = useLogin();

  // Determine which auth system to use (Firebase first, then fallback)
  const isLoading = firebaseLoading || backendLoading;
  const error = firebaseError || backendError;

  const handleLogin = (e) => {
    e.preventDefault();

    // Try Firebase authentication first
    firebaseLoginMutation.mutate(loginData, {
      onError: (firebaseErr) => {
        console.log('Firebase auth failed, trying backend:', firebaseErr);
        // Fallback to backend authentication
        backendLoginMutation(loginData);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans text-white bg-gradient-to-br from-black via-gray-900 to-black">
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
        <div className="max-w-lg mb-6">
          <p className="text-gray-200 text-left text-base leading-relaxed">
            PolyChat is an all-in-one platform for real-time video calls, instant messaging, and multilingual community engagement. Designed for global communication, it enables seamless conversations across languages through live translation, threaded discussions, and cultural communities.
          </p>
          <p className="text-gray-200 text-left text-base leading-relaxed mt-4">
            Whether you're connecting with friends, exploring new cultures, or participating in language exchange, PolyChat offers features like group video calls, screen sharing, contextual replies, profile pages, and smart search—making meaningful, organized, and cross-cultural communication easier than ever.
          </p>
        </div>

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
      <div className="lg:hidden bg-gradient-to-r from-black via-gray-800 to-black p-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <img src="/logo.png" alt="PolyChat9" className="h-10 w-10" style={{background: 'transparent'}} />
          <h1 className="text-xl font-bold text-white">PolyChat9</h1>
        </div>
        <h2 className="text-base font-bold text-white mb-2">Speak globally, connect locally</h2>

        {/* Complete Product Description */}
        <div className="mb-3 px-2">
          <p className="text-xs text-gray-300 mb-2 leading-relaxed">
            PolyChat is an all-in-one platform for real-time video calls, instant messaging, and multilingual community engagement. Designed for global communication, it enables seamless conversations across languages through live translation, threaded discussions, and cultural communities.
          </p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Whether you're connecting with friends, exploring new cultures, or participating in language exchange, PolyChat offers features like group video calls, screen sharing, contextual replies, profile pages, and smart search—making meaningful, organized, and cross-cultural communication easier than ever.
          </p>
        </div>

        {/* Enhanced Mobile Video */}
        <div className="mb-4 relative">
          <div className="relative w-full group">
            {/* Mobile Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5 rounded-xl z-10 pointer-events-none"></div>

            <video
              src="/videos/globalnetwork.mov"
              autoPlay
              loop
              muted
              playsInline
              poster="/images/video-poster.jpg"
              className="w-full h-36 object-cover rounded-xl shadow-xl border border-white/10 transition-all duration-300 hover:shadow-2xl animate-fade-in"
              aria-label="Global network visualization"
            />

            {/* Mobile Loading State */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/15 to-purple-900/15 rounded-xl flex items-center justify-center opacity-0">
              <div className="text-white/50 text-xs">Loading...</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Sign In Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center items-center bg-gray-900/80 backdrop-blur-sm p-4 lg:p-12 min-h-0 lg:min-h-screen">
        <div className="w-full max-w-md space-y-4 lg:space-y-6">
          <h2 className="text-2xl lg:text-3xl font-semibold text-center text-white mb-4 lg:mb-8">Sign In</h2>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-3 lg:mb-4">
              <span>{error.response?.data?.message || error.message || error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 lg:space-y-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-colors duration-200"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
              aria-label="Email address"
            />

            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-colors duration-200"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                aria-label="Password"
              />
              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-400 hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded transition-colors duration-200"
                  aria-label="Reset your password"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={isLoading}
              aria-label="Sign in to your account"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Social Sign-In Section */}
          <div className="my-4 lg:my-6 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-3 lg:px-4 text-sm text-gray-400">or continue with</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Firebase Social Authentication Buttons */}
          <SocialAuthButtons />

          <p className="text-sm text-center text-gray-200 mt-4 lg:mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-400 underline hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded transition-colors duration-200">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
