"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/graphql/mutations";
import { GET_POSTS } from "@/graphql/queries";

import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AIIcon from "./Icons/AiIcon";

export function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [generating, setGenerating] = useState(false);

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({
        variables: { title, content: content || undefined },
      });
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleAiContent = async () => {
    setGenerating(true);

    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Generate a post about the topic: " + title,
        }),
      });

      const data = await res.json();
      const generated = data.content?.split("\n\n");
      if (generated?.length >= 2) {
        setTitle(generated[0].replace(/^#+\s*/, ""));
        setContent(generated.slice(1).join("\n\n"));
      } else {
        setContent(data.content || "");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setGenerating(false);
    }
  };

  const generateWithGemini = async (prompt: string) => {
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      const generatedText = data.content?.parts?.[0]?.text || "";
      setContent(generatedText);

      return generatedText;
    } catch (error) {
      console.log(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-background px-6 rounded-lg shadow-md border border-border">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h2 className="text-2xl font-bold">Create post</h2>
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
                  onClick={() =>
                    generateWithGemini(
                      "Generate a post about the topic: " + title
                    )
                  }
                  disabled={!title || generating}
                  variant="secondary"
                >
                  <div className="flex items-center gap-2">
                    <AIIcon />{" "}
                    {generating ? "Generating..." : "Generate with AI"}
                  </div>
                </Button>
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">
                  Error: {error.message}
                </div>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create post"}
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
