import { useSession } from "next-auth/react";
import { UserRole } from "@/types/next-auth";

export function useRole() {
  const { data: session } = useSession();

  const userRole = session?.user?.role || "USER";

  const isAdmin = userRole === "ADMIN";
  const isModerator = userRole === "MODERATOR" || isAdmin;
  const isUser = userRole === "USER" || isModerator;

  const hasRole = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return isAdmin;
      case "MODERATOR":
        return isModerator;
      case "USER":
        return isUser;
      default:
        return false;
    }
  };

  const hasAnyRole = (roles: UserRole[]) => {
    return roles.some((role) => hasRole(role));
  };

  return {
    userRole,
    isAdmin,
    isModerator,
    isUser,
    hasRole,
    hasAnyRole,
  };
}
