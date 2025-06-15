import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLinkedInAuth } from '../hooks/useFirebaseAuth';
import PageLoader from '../components/PageLoader';

const LinkedInCallbackPage = () => {
  const navigate = useNavigate();
  const { handleLinkedInCallback } = useLinkedInAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('LinkedIn OAuth error:', error);
        navigate('/login?error=linkedin_auth_failed');
        return;
      }

      if (code) {
        try {
          await handleLinkedInCallback.mutateAsync(code);
          navigate('/');
        } catch (error) {
          console.error('LinkedIn callback error:', error);
          navigate('/login?error=linkedin_auth_failed');
        }
      } else {
        navigate('/login?error=no_auth_code');
      }
    };

    handleCallback();
  }, [navigate, handleLinkedInCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="text-center">
        <PageLoader />
        <p className="text-white mt-4">Processing LinkedIn authentication...</p>
      </div>
    </div>
  );
};

export default LinkedInCallbackPage;
