import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';

const FirebaseSetupChecker = () => {
  const [checks, setChecks] = useState({
    firebaseConfig: false,
    authInitialized: false,
    emailPasswordEnabled: false,
    googleEnabled: false,
    twitterEnabled: false,
  });

  useEffect(() => {
    const runChecks = async () => {
      const newChecks = { ...checks };

      // Check Firebase config
      try {
        newChecks.firebaseConfig = !!auth.app.options.apiKey;
      } catch (error) {
        console.error('Firebase config check failed:', error);
      }

      // Check if auth is initialized
      try {
        newChecks.authInitialized = !!auth;
      } catch (error) {
        console.error('Auth initialization check failed:', error);
      }

      // Check available sign-in methods
      try {
        const methods = await auth.fetchSignInMethodsForEmail('test@example.com').catch(() => []);
        newChecks.emailPasswordEnabled = true; // If no error, email/password is enabled
      } catch (error) {
        if (error.code === 'auth/operation-not-allowed') {
          newChecks.emailPasswordEnabled = false;
        } else {
          newChecks.emailPasswordEnabled = true; // Other errors mean it's enabled but something else is wrong
        }
      }

      setChecks(newChecks);
    };

    runChecks();
  }, []);

  const CheckItem = ({ label, status, description, action }) => (
    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-medium">{label}</span>
        </div>
        {description && (
          <p className="text-sm text-gray-400 mt-1 ml-6">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        🔧 Firebase Setup Status
      </h2>
      
      <div className="space-y-3">
        <CheckItem
          label="Firebase Configuration"
          status={checks.firebaseConfig}
          description={checks.firebaseConfig ? 
            "Firebase is properly configured" : 
            "Check your Firebase config in .env file"
          }
        />
        
        <CheckItem
          label="Authentication Initialized"
          status={checks.authInitialized}
          description={checks.authInitialized ? 
            "Firebase Auth is ready" : 
            "Firebase Auth failed to initialize"
          }
        />
        
        <CheckItem
          label="Email/Password Sign-in"
          status={checks.emailPasswordEnabled}
          description={checks.emailPasswordEnabled ? 
            "Email/Password authentication is enabled" : 
            "Enable Email/Password in Firebase Console"
          }
          action={!checks.emailPasswordEnabled ? {
            label: "Enable",
            onClick: () => window.open('https://console.firebase.google.com/project/polychat9/authentication/providers', '_blank')
          } : null}
        />
        
        <CheckItem
          label="Google Sign-in"
          status={checks.googleEnabled}
          description="Enable Google sign-in in Firebase Console"
          action={{
            label: "Enable",
            onClick: () => window.open('https://console.firebase.google.com/project/polychat9/authentication/providers', '_blank')
          }}
        />
        
        <CheckItem
          label="Twitter Sign-in"
          status={checks.twitterEnabled}
          description="Enable Twitter sign-in in Firebase Console"
          action={{
            label: "Enable",
            onClick: () => window.open('https://console.firebase.google.com/project/polychat9/authentication/providers', '_blank')
          }}
        />
      </div>

      <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
        <h3 className="font-medium text-blue-400 mb-2">Quick Setup Steps:</h3>
        <ol className="text-sm space-y-1 text-blue-200">
          <li>1. Go to <a href="https://console.firebase.google.com/project/polychat9/authentication/providers" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
          <li>2. Click on each sign-in method you want to enable</li>
          <li>3. Toggle "Enable" and save</li>
          <li>4. For Google: Select your support email</li>
          <li>5. For Twitter: Add your API credentials</li>
        </ol>
      </div>

      <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-600 rounded-lg">
        <h3 className="font-medium text-yellow-400 mb-2">Current Firebase Config:</h3>
        <div className="text-sm text-yellow-200 font-mono">
          <div>Project ID: {auth.app.options.projectId || 'Not set'}</div>
          <div>Auth Domain: {auth.app.options.authDomain || 'Not set'}</div>
          <div>API Key: {auth.app.options.apiKey ? '✓ Set' : '❌ Not set'}</div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupChecker;
