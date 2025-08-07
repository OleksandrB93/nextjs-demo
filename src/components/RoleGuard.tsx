"use client";

import { ReactNode } from "react";
import { useRole } from "@/hooks/useRole";
import { UserRole } from "@/types/next-auth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { hasAnyRole } = useRole();

  if (!hasAnyRole(allowedRoles)) {
    return fallback || null;
  }

  return <>{children}</>;
}
