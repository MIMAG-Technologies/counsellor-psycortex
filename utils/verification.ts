import { verify } from './verify/verify';
import { getAuthUrl } from './verify/auth';
import { toast } from 'react-toastify';

export interface VerificationOptions {
  counsellorId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Handles the verification process for a counselor
 */
export const handleVerification = async ({
  counsellorId,
  onSuccess,
  onError
}: VerificationOptions): Promise<void> => {
  try {
    if (!counsellorId) {
      toast.error('Counsellor ID not found');
      return;
    }

    const authUrl = await getAuthUrl(counsellorId);
    
    // Open in a new window
    const authWindow = window.open(
      authUrl,
      'Verify Account',
      'width=600,height=700,left=50,top=50'
    );

    // Check periodically if verification is complete
    const checkVerification = setInterval(async () => {
      try {
        const isVerified = await verify(counsellorId);
        if (isVerified) {
          clearInterval(checkVerification);
          if (authWindow) authWindow.close();
          toast.success('Verification completed successfully');
          onSuccess?.();
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        onError?.(error);
      }
    }, 5000); // Check every 5 seconds

    // Clear interval if window is closed
    const windowCheck = setInterval(() => {
      if (authWindow?.closed) {
        clearInterval(windowCheck);
        clearInterval(checkVerification);
      }
    }, 1000);
  } catch (error) {
    console.error('Error during verification:', error);
    toast.error('Failed to start verification process');
    onError?.(error);
  }
};

/**
 * Checks the verification status of a counselor
 */
export const checkVerificationStatus = async (counsellorId: string): Promise<boolean> => {
  try {
    if (!counsellorId) return false;
    return await verify(counsellorId);
  } catch (error) {
    console.error('Error checking verification status:', error);
    return false;
  }
}; 