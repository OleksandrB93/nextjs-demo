"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_POSTS, GET_MY_POSTS, GET_ALL_POSTS } from "@/graphql/queries";
import { UPDATE_POST, DELETE_POST } from "@/graphql/mutations";
import { Post } from "@/types/graphql";
import { useRole } from "@/hooks/useRole";
import { RoleGuard } from "./RoleGuard";

export function PostsList() {
  const { isAdmin } = useRole();

  // Use standard posts query - it will return appropriate posts based on role
  const { loading, error, data } = useQuery(GET_POSTS);

  const [updatePost] = useMutation(UPDATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      await updatePost({
        variables: { id, published: !published },
      });
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Do you really want to delete this post?")) {
      try {
        await deletePost({
          variables: { id },
        });
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading posts...</div>;
  if (error) return <div className="text-red-600">Error: {error.message}</div>;

  const posts = data?.posts || [];

  return (
    <div className="bg-background p-6 rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-bold mb-4">
        {isAdmin ? "All Posts (Admin View)" : "My Posts"}
      </h2>
      {posts?.length === 0 ? (
        <p className="text-muted-foreground">No posts found</p>
      ) : (
        <div className="space-y-4">
          {posts?.map((post: Post) => (
            <div
              key={post.id}
              className="border border-border rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  {post.content && (
                    <p className="text-muted-foreground mt-2">{post.content}</p>
                  )}
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>Author: {post.author?.name || post.author?.email}</p>
                    <p>
                      Created:{" "}
                      {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() =>
                      handleTogglePublished(post.id, post.published)
                    }
                    className={`px-3 py-1 text-xs rounded-full ${
                      post.published
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
