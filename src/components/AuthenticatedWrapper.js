"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../lib/store/useAuthStore";

export default function AuthenticatedWrapper({ children }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner if you prefer
  }

  return <>{children}</>;
}
