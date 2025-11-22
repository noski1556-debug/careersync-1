import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import type { FunctionReference } from "convex/server";
import { useEffect, useState } from "react";

import { api as apiGenerated } from "@/convex/_generated/api";
// @ts-ignore
const api: any = apiGenerated;

export function useAuth() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.currentUser as FunctionReference<"query">);
  const { signIn, signOut } = useAuthActions();

  const [isLoading, setIsLoading] = useState(true);

  // This effect updates the loading state once auth is loaded and user data is available
  // It ensures we only show content when both authentication state and user data are ready
  useEffect(() => {
    if (!isAuthLoading && user !== undefined) {
      setIsLoading(false);
    }
  }, [isAuthLoading, user]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}