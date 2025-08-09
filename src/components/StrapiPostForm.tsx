"use client";

import { useState } from "react";
import { strapiClient, CreatePostData } from "@/lib/strapi";

import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AIIcon from "./Icons/AiIcon";

interface StrapiPostFormProps {
  onPostCreated?: () => void;
}

export function StrapiPostForm({ onPostCreated }: StrapiPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData: CreatePostData = {
        title,
        content: content || undefined,
        published,
      };

      await strapiClient.createPost(postData);

      // Reset form
      setTitle("");
      setContent("");
      setPublished(false);

      // Notify parent component
      onPostCreated?.();
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async () => {
    if (!title) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a blog post about the topic: ${title}. Make it informative and engaging.`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await res.json();
      const generatedText =
        data.content?.parts?.[0]?.text || data.content || "";

      setContent(generatedText);
    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate content with AI");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-background/60 px-6 rounded-lg shadow-md border border-border backdrop-blur-sm">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h2 className="text-2xl font-bold">Create Post (Strapi)</h2>
          </AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground"
                >
                  Title *
                </label>
                <Button
                  type="button"
                  onClick={generateWithAI}
                  disabled={!title || generating}
                  variant="secondary"
                  size="sm"
                >
                  <div className="flex items-center gap-2">
                    <AIIcon />
                    {generating ? "Generating..." : "Generate with AI"}
                  </div>
                </Button>
              </div>

              <div>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter post title..."
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-foreground"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Write your post content here..."
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="published"
                  className="text-sm font-medium text-foreground"
                >
                  Publish immediately
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                  Error: {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading || !title}>
                  {loading ? "Creating..." : "Create Post"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setPublished(false);
                    setError(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
