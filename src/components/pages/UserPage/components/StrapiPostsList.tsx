"use client";

import { useState, useEffect } from "react";

import { strapiClient, StrapiPost } from "@/lib/strapi";
import { Button } from "@/components/ui/button";

interface StrapiPostsListProps {
  refreshTrigger?: number;
}

export function StrapiPostsList({ refreshTrigger }: StrapiPostsListProps) {
  const [posts, setPosts] = useState<StrapiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await strapiClient.getPosts();
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await strapiClient.deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  const togglePublished = async (post: StrapiPost) => {
    try {
      const updatedPost = post.published
        ? await strapiClient.unpublishPost(post.id)
        : await strapiClient.publishPost(post.id);

      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? {
                ...p,
                published: updatedPost.data.published,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-background/60 p-6 rounded-lg shadow-md border border-border backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background/60 p-6 rounded-lg shadow-md border border-border backdrop-blur-sm">
        <div className="text-red-600 text-center">
          <p>Error loading posts: {error}</p>
          <Button onClick={fetchPosts} className="mt-2" variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/60 p-6 rounded-lg shadow-md border border-border backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Posts from Strapi ({posts.length})
        </h2>
        <Button onClick={fetchPosts} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No posts found. Create your first post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts
            .map((post) => {
              if (!post?.title) return null;

              return (
                <div
                  key={post.id}
                  className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {post.title || "Untitled"}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {post.content && (
                    <p className="text-foreground/80 mb-3 line-clamp-3">
                      {post.content.length > 200
                        ? `${post.content.substring(0, 200)}...`
                        : post.content}
                    </p>
                  )}

                  <div className="flex justify-between items-center text-sm text-foreground/60">
                    <div>
                      <p>
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      {post.author?.data && (
                        <p>Author: {post.author.data.attributes.username}</p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => togglePublished(post)}
                        variant="outline"
                        size="sm"
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>

                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
            .filter(Boolean)}
        </div>
      )}
    </div>
  );
}
