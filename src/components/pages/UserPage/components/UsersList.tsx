"use client";

import { useQuery } from "@apollo/client";

import { GET_ALL_USERS } from "@/graphql/queries";
import { User, Post } from "@/types/graphql";
import { RoleGuard } from "@/components/RoleGuard";

export function UsersList() {
  return (
    <RoleGuard
      allowedRoles={["ADMIN"]}
      fallback={
        <div className="bg-background p-6 rounded-lg shadow-md border border-border">
          <h2 className="text-2xl font-bold mb-4">Users</h2>
          <p className="text-red-600">
            Access denied: Admin privileges required
          </p>
        </div>
      }
    >
      <AdminUsersList />
    </RoleGuard>
  );
}

function AdminUsersList() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) return <div className="text-center py-4">Loading users...</div>;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MODERATOR":
        return "bg-yellow-100 text-yellow-800";
      case "USER":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-background/60 p-6 rounded-lg shadow-md border border-border backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4">All Users (Admin View)</h2>
      {data?.allUsers?.length === 0 ? (
        <p className="text-muted-foreground">No users found</p>
      ) : (
        <div className="space-y-4">
          {data?.allUsers?.map((user: User) => (
            <div key={user.id} className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  {user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.name || "No name"}
                    </h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Created:{" "}
                      {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background text-foreground">
                      {user.posts?.length || 0} posts
                    </span>
                  </div>
                </div>
              </div>
              {user.posts?.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    Posts:
                  </h4>
                  <div className="space-y-2">
                    {user.posts.map((post: Post) => (
                      <div
                        key={post.id}
                        className="text-sm bg-background p-2 rounded"
                      >
                        <p className="font-medium">{post.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {post.published ? "Published" : "Draft"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
