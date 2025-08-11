"use client";

import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CHANGE_USER_ROLE } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { RoleGuard } from "@/components/RoleGuard";

export function MainProfile() {
  const { data: session, status, update } = useSession({ required: true });
  const [changeUserRole] = useMutation(CHANGE_USER_ROLE);

  // Function to change user role (demo purposes)
  const changeRole = async (newRole: string) => {
    if (!session?.user?.id) return;

    try {
      await changeUserRole({
        variables: {
          id: session.user.id,
          role: newRole,
        },
      });

      await update({
        user: {
          ...session?.user,
          role: newRole,
        },
      });
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate time since registration
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
  };

  // Get role display properties
  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return {
          text: "Administrator",
          color: "bg-red-100 text-red-800",
          iconColor: "text-red-600",
        };
      case "MODERATOR":
        return {
          text: "Moderator",
          color: "bg-yellow-100 text-yellow-800",
          iconColor: "text-yellow-600",
        };
      case "USER":
      default:
        return {
          text: "User",
          color: "bg-blue-100 text-blue-800",
          iconColor: "text-blue-600",
        };
    }
  };

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse mb-6" />
          <div className="h-8 w-48 bg-gray-200 animate-pulse mb-3 rounded-lg" />
          <div className="h-5 w-64 bg-gray-200 animate-pulse mb-8 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="h-16 bg-gray-200 animate-pulse rounded-xl" />
            <div className="h-16 bg-gray-200 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
            <UserIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome!</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile and start exploring.
          </p>
          <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium">
            Sign in to continue
          </div>
        </div>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="max-w-2xl mx-auto bg-background/60 border border-border rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Header with gradient background */}
      <div className="bg-background/60 px-8 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-background p-1 shadow-lg">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-bold text-muted-foreground">
                    {user.name ? user.name[0].toUpperCase() : "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-300 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Name and Email */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {user.name || "Welcome User"}
          </h1>
          <p className="text-muted-foreground text-lg font-medium mb-3">
            {user.email}
          </p>

          {/* Role Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-[2] font-semibold ${
              getRoleDisplay(user.role).color
            }`}
          >
            <ShieldCheckIcon
              className={`w-4 h-4 mr-2 ${getRoleDisplay(user.role).iconColor}`}
            />
            {getRoleDisplay(user.role).text}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User ID Card */}
          <div className="bg-background/60 rounded-xl p-6 shadow-md border border-border backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">User ID</h3>
                <p className="text-sm text-muted-foreground">
                  Unique identifier
                </p>
              </div>
            </div>
            <p className="text-sm font-mono text-muted-foreground bg-gray-50 px-3 py-2 rounded-lg">
              {user.id || "Not available"}
            </p>
          </div>

          {/* Role Card */}
          <div className="bg-background/60 rounded-xl p-6 shadow-md border border-border backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <div
                className={`w-10 h-10 ${getRoleDisplay(user.role)
                  .color.replace("text-", "bg-")
                  .replace(
                    "-800",
                    "-100"
                  )} rounded-lg flex items-center justify-center mr-3`}
              >
                <ShieldCheckIcon
                  className={`w-5 h-5 ${getRoleDisplay(user.role).iconColor}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">User Role</h3>
                <p className="text-sm text-muted-foreground">
                  Account permissions
                </p>
              </div>
            </div>
            <div
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold ${
                getRoleDisplay(user.role).color
              }`}
            >
              {getRoleDisplay(user.role).text}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-background/60 rounded-xl p-6 shadow-md border border-border backdrop-blur-sm">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 text-purple-600 mr-2" />
            Account Information
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium text-foreground">
                {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Last updated</span>
              <span className="font-medium text-foreground">
                {user.updatedAt ? formatDate(user.updatedAt) : "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-muted-foreground">Time since joining</span>
              <span className="font-medium text-foreground">
                {user.createdAt ? getTimeSince(user.createdAt) : "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-muted-foreground">Account status</span>
              <span className="px-3 py-1  text-green-800 rounded-full text-sm font-medium bg-green-500">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-background/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">1</div>
            <div className="text-sm text-blue-700">Active Sessions</div>
          </div>

          <div className="bg-background/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {user.createdAt
                ? Math.max(
                    1,
                    Math.floor(
                      (Date.now() - new Date(user.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )
                  )
                : "?"}
            </div>
            <div className="text-sm text-purple-700">Months Active</div>
          </div>

          <div className="bg-background/60 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">✓</div>
            <div className="text-sm text-green-700">Verified</div>
          </div>
        </div>

        {/* Admin Panel - Only visible to Admins */}
        <RoleGuard allowedRoles={["ADMIN"]}>
          <div className="bg-background/60 rounded-xl p-6 shadow-md border border-red-200 mt-6">
            <div className="flex flex-col items-start bg-rose-200 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-red-800 mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                🔒 Admin Panel
              </h3>
              <p className="text-sm text-red-700 mb-4">
                This section is only visible to administrators.
              </p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Admin-only features would go here, such as user management,
                system settings, etc.
              </p>
            </div>
          </div>
        </RoleGuard>

        {/* Moderator Panel - Only visible to Moderators and Admins */}
        <RoleGuard allowedRoles={["MODERATOR", "ADMIN"]}>
          <div className="bg-background/60 rounded-xl p-6 shadow-md border border-yellow-200 mt-6">
            <div className="flex flex-col items-start bg-yellow-100 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                🛡️ Moderator Panel
              </h3>
              <p className="text-sm text-yellow-700 mb-4">
                This section is visible to moderators and administrators.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Moderation tools would go here, such as content management, user
                warnings, etc.
              </p>
            </div>
          </div>
        </RoleGuard>

        {/* Demo: Role Change Buttons */}
        <div className="bg-background/60 rounded-xl p-6 shadow-md border border-gray-100 mt-6">
          <div className="flex flex-col items-start bg-sky-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-800 mb-4">
              🚀 Demo: Change Role
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the buttons below to test different user roles and see how
              the interface changes:
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => changeRole("USER")}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              Set as User
            </button>
            <button
              onClick={() => changeRole("MODERATOR")}
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
            >
              Set as Moderator
            </button>
            <button
              onClick={() => changeRole("ADMIN")}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
            >
              Set as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
