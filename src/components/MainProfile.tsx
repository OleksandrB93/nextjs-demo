"use client";

import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  EnvelopeIcon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export function MainProfile() {
  const { data: session, status } = useSession();

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
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {user.name ? user.name[0].toUpperCase() : "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Name and Email */}
          <h1 className="text-3xl font-bold text-white mb-2">
            {user.name || "Welcome User"}
          </h1>
          <p className="text-blue-100 text-lg font-medium">{user.email}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          {/* User ID Card */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">User ID</h3>
                <p className="text-sm text-gray-500">Unique identifier</p>
              </div>
            </div>
            <p className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              {user.id || "Not available"}
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <EnvelopeIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Email Address</h3>
                <p className="text-sm text-gray-500">Primary contact</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 break-all">{user.email}</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="w-5 h-5 text-purple-600 mr-2" />
            Account Information
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Member since</span>
              <span className="font-medium text-gray-800">
                {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Last updated</span>
              <span className="font-medium text-gray-800">
                {user.updatedAt ? formatDate(user.updatedAt) : "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Time since joining</span>
              <span className="font-medium text-gray-800">
                {user.createdAt ? getTimeSince(user.createdAt) : "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Account status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">1</div>
            <div className="text-sm text-blue-700">Active Sessions</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
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

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">✓</div>
            <div className="text-sm text-green-700">Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}
