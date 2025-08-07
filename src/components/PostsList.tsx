"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_POSTS } from "@/graphql/queries";
import { UPDATE_POST, DELETE_POST } from "@/graphql/mutations";
import { Post } from "@/types/graphql";

export function PostsList() {
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
    if (confirm("Ви впевнені, що хочете видалити цей пост?")) {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      {data?.posts?.length === 0 ? (
        <p className="text-gray-500">No posts found</p>
      ) : (
        <div className="space-y-4">
          {data?.posts?.map((post: Post) => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  {post.content && (
                    <p className="text-gray-600 mt-2">{post.content}</p>
                  )}
                  <div className="mt-3 text-sm text-gray-500">
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
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200"
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
