"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { user, me } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/login" && (!user || !me)) {
      redirect("/login");
    }
  }, [pathname, user, me]);

  return null;
}
