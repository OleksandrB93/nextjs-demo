"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_POST } from "@/graphql/mutations";
import { GET_POSTS, GET_USERS } from "@/graphql/queries";
import { User } from "@/types/graphql";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function PostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");

  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({
        variables: { title, content: content || undefined, authorId },
      });
      setTitle("");
      setContent("");
      setAuthorId("");
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="bg-white px-6 rounded-lg shadow-md">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h2 className="text-2xl font-bold">Create post</h2>
          </AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700"
                >
                  Author *
                </label>
                <Select value={authorId} onValueChange={setAuthorId} required>
                  <SelectTrigger
                    id="author"
                    className="w-full px-3 py-2 rounded-md shadow-sm"
                  >
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent className=" text-gray-900">
                    {/* <SelectItem value={""}>Select author</SelectItem> */}
                    {usersData?.users?.map((user: User) => (
                      <SelectItem key={user?.id} value={user?.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <div className="text-red-600 text-sm">
                  Error: {error.message}
                </div>
              )}
              <Button type="submit" disabled={loading || usersLoading}>
                {loading ? "Creating..." : "Create post"}
              </Button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
