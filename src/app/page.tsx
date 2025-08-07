import { UserForm } from "@/components/UserForm";
import { PostForm } from "@/components/PostForm";
import { UsersList } from "@/components/UsersList";
import { PostsList } from "@/components/PostsList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Next.js GraphQL Demo
          </h1>
          <p className="text-lg text-gray-600">
            App with GraphQL, Prisma and MongoDB
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-lg shadow-[0_8px_32px_0_rgba(200,200,255,0.15),0_1.5px_6px_0_rgba(180,180,255,0.10)]">
          {/* Forms */}
          <div className="space-y-6">
            <UserForm />
            <PostForm />
          </div>

          {/* Lists */}
          <div className="space-y-6">
            <UsersList />
            <PostsList />
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500">
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
