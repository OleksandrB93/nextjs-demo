"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/graphql/queries";
import { User, Post } from "@/types/graphql";

export function UsersList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading)
    return <div className="text-center py-4">Завантаження користувачів...</div>;
  if (error)
    return <div className="text-red-600">Помилка: {error.message}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Користувачі</h2>
      {data?.users?.length === 0 ? (
        <p className="text-gray-500">Користувачів не знайдено</p>
      ) : (
        <div className="space-y-4">
          {data?.users?.map((user: User) => (
            <div
              key={user.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {user.name || "Без імені"}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Створено:{" "}
                    {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.posts?.length || 0} постів
                  </span>
                </div>
              </div>
              {user.posts?.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Пости:
                  </h4>
                  <div className="space-y-2">
                    {user.posts.map((post: Post) => (
                      <div
                        key={post.id}
                        className="text-sm bg-gray-50 p-2 rounded"
                      >
                        <p className="font-medium">{post.title}</p>
                        <p className="text-gray-600 text-xs">
                          {post.published ? "Опубліковано" : "Чернетка"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
