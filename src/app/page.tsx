// import { UserForm } from "@/components/UserForm";
import { PostForm } from "@/components/PostForm";
import { UsersList } from "@/components/UsersList";
import { PostsList } from "@/components/PostsList";
import { Header } from "@/components/Header";
import { MainProfile } from "@/components/MainProfile";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* <UserForm /> */}

            <MainProfile />
          </div>

          <div className="space-y-6">
            <PostForm />
            <UsersList />
            <PostsList />
          </div>
        </div>

        <footer className="mt-12 text-center text-muted-foreground">
          <p>
            GraphQL Playground available at:{" "}
            <a
              href="/api/graphql"
              className="text-indigo-600 hover:text-indigo-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              /api/graphql
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
