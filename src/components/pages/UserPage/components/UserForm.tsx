"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "@/graphql/mutations";
import { GET_USERS } from "@/graphql/queries";
import { Button } from "@/components/ui/button";

export function UserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        variables: { email, name: name || undefined },
      });
      setEmail("");
      setName("");
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create user</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm">Error: {error.message}</div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create user"}
        </Button>
      </form>
    </div>
  );
}
