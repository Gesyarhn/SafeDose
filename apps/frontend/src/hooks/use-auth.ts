import { authClient } from '../lib/auth-client';

export const useSession = authClient.useSession;

export function useAuth() {
  const session = useSession();
  return {
    user: session.data?.user ?? null,
    session: session.data?.session ?? null,
    isLoading: session.isPending,
    isAuthenticated: !!session.data?.user,
    signIn: authClient.signIn,
    signUp: authClient.signUp,
    signOut: authClient.signOut,
  };
}
