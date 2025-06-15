import { useState } from 'react';
import { 
  useEmailAuth, 
  useGoogleAuth, 
  useTwitterAuth, 
  useLinkedInAuth, 
  useFirebaseLogout,
  useFirebaseAuth 
} from '../hooks/useFirebaseAuth';
import SocialAuthButtons from '../components/SocialAuthButtons';
import FirebaseSetupChecker from '../components/FirebaseSetupChecker';

const AuthTestPage = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Test User');

  const { firebaseUser, isLoading: authLoading } = useFirebaseAuth();
  const { loginMutation, signupMutation, isLoading: emailLoading, error: emailError } = useEmailAuth();
  const { googleSignInMutation, isLoading: googleLoading, error: googleError } = useGoogleAuth();
  const { twitterSignInMutation, isLoading: twitterLoading, error: twitterError } = useTwitterAuth();
  const { linkedInSignInMutation, isLoading: linkedInLoading, error: linkedInError } = useLinkedInAuth();
  const { logoutMutation, isLoading: logoutLoading } = useFirebaseLogout();

  const handleEmailLogin = () => {
    loginMutation.mutate({ email, password });
  };

  const handleEmailSignup = () => {
    signupMutation.mutate({ email, password, fullName });
  };

  const handleGoogleSignIn = () => {
    googleSignInMutation.mutate();
  };

  const handleTwitterSignIn = () => {
    twitterSignInMutation.mutate();
  };

  const handleLinkedInSignIn = () => {
    linkedInSignInMutation.mutate();
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isAnyLoading = authLoading || emailLoading || googleLoading || twitterLoading || linkedInLoading || logoutLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">🔥 Firebase Authentication Test</h1>

        {/* Firebase Setup Checker */}
        <FirebaseSetupChecker />

        {/* Current User Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current User Status</h2>
          {authLoading ? (
            <p className="text-yellow-400">Loading authentication state...</p>
          ) : firebaseUser ? (
            <div className="space-y-2">
              <p className="text-green-400">✅ Authenticated</p>
              <p><strong>Email:</strong> {firebaseUser.email}</p>
              <p><strong>Name:</strong> {firebaseUser.displayName || 'Not set'}</p>
              <p><strong>UID:</strong> {firebaseUser.uid}</p>
              <p><strong>Provider:</strong> {firebaseUser.providerData?.[0]?.providerId || 'email'}</p>
              {firebaseUser.photoURL && (
                <img src={firebaseUser.photoURL} alt="Profile" className="w-16 h-16 rounded-full" />
              )}
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {logoutLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <p className="text-red-400">❌ Not authenticated</p>
          )}
        </div>

        {/* Email/Password Authentication */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📧 Email/Password Authentication</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Login</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                <button
                  onClick={handleEmailLogin}
                  disabled={isAnyLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg disabled:opacity-50"
                >
                  {emailLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Sign Up</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                <button
                  onClick={handleEmailSignup}
                  disabled={isAnyLoading}
                  className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg disabled:opacity-50"
                >
                  {emailLoading ? 'Creating account...' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>
          
          {emailError && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-600 rounded-lg">
              <p className="text-red-400">Error: {emailError.message}</p>
            </div>
          )}
        </div>

        {/* Social Authentication */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">🌐 Social Authentication</h2>
          
          {/* Individual Social Buttons for Testing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isAnyLoading}
              className="flex items-center justify-center p-3 bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
            >
              {googleLoading ? 'Connecting...' : '🔴 Google'}
            </button>
            
            <button
              onClick={handleTwitterSignIn}
              disabled={isAnyLoading}
              className="flex items-center justify-center p-3 bg-blue-500 hover:bg-blue-600 rounded-lg disabled:opacity-50"
            >
              {twitterLoading ? 'Connecting...' : '🐦 Twitter/X'}
            </button>
            
            <button
              onClick={handleLinkedInSignIn}
              disabled={isAnyLoading}
              className="flex items-center justify-center p-3 bg-blue-700 hover:bg-blue-800 rounded-lg disabled:opacity-50"
            >
              {linkedInLoading ? 'Connecting...' : '💼 LinkedIn'}
            </button>
          </div>

          {/* Integrated Social Auth Component */}
          <div>
            <h3 className="text-lg font-medium mb-3">Integrated Social Auth Component</h3>
            <SocialAuthButtons />
          </div>

          {/* Error Display */}
          {(googleError || twitterError || linkedInError) && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-600 rounded-lg">
              {googleError && <p className="text-red-400">Google Error: {googleError.message}</p>}
              {twitterError && <p className="text-red-400">Twitter Error: {twitterError.message}</p>}
              {linkedInError && <p className="text-red-400">LinkedIn Error: {linkedInError.message}</p>}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📋 Setup Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-green-400">✅ Firebase Setup (Already Done)</h3>
              <p>Firebase SDK is configured and ready to use.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-yellow-400">⚠️ Environment Variables Needed</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Copy <code>frontend/.env.example</code> to <code>frontend/.env</code></li>
                <li>Copy <code>backend/.env.example</code> to <code>backend/.env</code></li>
                <li>Fill in your Firebase and LinkedIn credentials</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-400">🔧 Provider Setup Required</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Google:</strong> Enable in Firebase Console > Authentication > Sign-in method</li>
                <li><strong>Twitter:</strong> Enable in Firebase Console + Twitter Developer Account</li>
                <li><strong>LinkedIn:</strong> Create LinkedIn App + Backend integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
