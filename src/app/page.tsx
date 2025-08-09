"use client";

import { useState } from "react";
// import { UserForm } from "@/components/UserForm";
import { PostForm } from "@/components/PostForm";
import { UsersList } from "@/components/UsersList";
import { PostsList } from "@/components/PostsList";
import { StrapiPostForm } from "@/components/StrapiPostForm";
import { StrapiPostsList } from "@/components/StrapiPostsList";
import { Header } from "@/components/Header";
import { MainProfile } from "@/components/MainProfile";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"graphql" | "strapi">("strapi");

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Tab switcher */}
        <div className="mb-8 flex justify-center">
          <div className="relative bg-background/60 p-1 rounded-lg border border-border">
            <Button
              variant={activeTab === "strapi" ? "default" : "ghost"}
              onClick={() => setActiveTab("strapi")}
              className="mr-1"
            >
              Strapi CMS
            </Button>
            {activeTab === "strapi" && (
              <p className="absolute top-full left-1 text-nowrap text-xs text-muted-foreground">
                Strapi works only with http://localhost:1337
              </p>
            )}
            <Button
              variant={activeTab === "graphql" ? "default" : "ghost"}
              onClick={() => setActiveTab("graphql")}
            >
              GraphQ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* <UserForm /> */}
            <MainProfile />
          </div>

          <div className="space-y-6">
            {activeTab === "strapi" ? (
              <>
                <StrapiPostForm onPostCreated={handlePostCreated} />
                <StrapiPostsList refreshTrigger={refreshTrigger} />
              </>
            ) : (
              <>
                <PostForm />
                <PostsList />
              </>
            )}
            <UsersList />
          </div>
        </div>

        <footer className="mt-12 text-center text-muted-foreground">
          <div className="space-y-2">
            <p>
              GraphQL Playground:{" "}
              <a
                href="/api/graphql"
                className="text-indigo-600 hover:text-indigo-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                /api/graphql
              </a>
            </p>
            <p>
              Strapi Admin:{" "}
              <a
                href="http://localhost:1337/admin"
                className="text-indigo-600 hover:text-indigo-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                http://localhost:1337/admin
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
