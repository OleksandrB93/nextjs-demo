# Next.js GraphQL Demo

Додаток-приклад з використанням Next.js, GraphQL, Prisma та MongoDB.

## Технології

- **Next.js 15** - React фреймворк
- **GraphQL** - API query language
- **Apollo Client/Server** - GraphQL клієнт та сервер
- **Prisma** - ORM для роботи з базою даних
- **MongoDB** - NoSQL база даних
- **TypeScript** - типізований JavaScript
- **Tailwind CSS** - CSS фреймворк

## Структура проекту

```
src/
├── app/
│   ├── api/graphql/route.ts    # GraphQL API endpoint
│   ├── layout.tsx              # Root layout з Apollo Provider
│   └── page.tsx                # Головна сторінка
├── components/
│   ├── ApolloWrapper.tsx       # Apollo Client wrapper
│   ├── UserForm.tsx            # Форма створення користувача
│   ├── PostForm.tsx            # Форма створення поста
│   ├── UsersList.tsx           # Список користувачів
│   └── PostsList.tsx           # Список постів
├── graphql/
│   ├── schema.ts               # GraphQL схема
│   ├── resolvers.ts            # GraphQL резолвери
│   ├── queries.ts              # GraphQL запити
│   └── mutations.ts            # GraphQL мутації
└── lib/
    ├── prisma.ts               # Prisma Client утиліта
    └── apollo-client.ts        # Apollo Client конфігурація
```

## Налаштування

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Налаштування MongoDB

Встановіть MongoDB локально або використовуйте MongoDB Atlas.

Для локальної MongoDB:

```bash
# Запуск MongoDB (залежить від вашої ОС)
mongod
```

### 3. Налаштування змінних середовища

Створіть файл `.env` в корені проекту:

```env
DATABASE_URL="mongodb://localhost:27017/nextjs-graphql-demo"
```

### 4. Генерація Prisma Client

```bash
npx prisma generate
```

### 5. Запуск додатку

```bash
npm run dev
```

Додаток буде доступний за адресою: http://localhost:3000

## Функціональність

### Користувачі

- ✅ Створення користувачів
- ✅ Перегляд списку користувачів
- ✅ Відображення постів користувача

### Пости

- ✅ Створення постів
- ✅ Перегляд списку постів
- ✅ Оновлення статусу публікації
- ✅ Видалення постів

### GraphQL

- ✅ GraphQL API endpoint: `/api/graphql`
- ✅ GraphQL Playground для тестування
- ✅ Типізовані запити та мутації

## GraphQL Схема

### Типи

```graphql
type User {
  id: ID!
  email: String!
  name: String
  posts: [Post!]!
  createdAt: String!
  updatedAt: String!
}

type Post {
  id: ID!
  title: String!
  content: String
  published: Boolean!
  author: User!
  authorId: String!
  createdAt: String!
  updatedAt: String!
}
```

### Запити

```graphql
query GetUsers {
  users {
    id
    email
    name
    posts {
      id
      title
    }
  }
}

query GetPosts {
  posts {
    id
    title
    content
    author {
      name
      email
    }
  }
}
```

### Мутації

```graphql
mutation CreateUser($email: String!, $name: String) {
  createUser(email: $email, name: $name) {
    id
    email
    name
  }
}

mutation CreatePost($title: String!, $content: String, $authorId: String!) {
  createPost(title: $title, content: $content, authorId: $authorId) {
    id
    title
    author {
      name
    }
  }
}
```

## Розробка

### Додавання нових типів

1. Оновіть `prisma/schema.prisma`
2. Додайте типи в `src/graphql/schema.ts`
3. Створіть резолвери в `src/graphql/resolvers.ts`
4. Генеруйте Prisma Client: `npx prisma generate`

### Створення нових компонентів

1. Створіть компонент в `src/components/`
2. Додайте GraphQL запити/мутації в `src/graphql/`
3. Використовуйте `useQuery` та `useMutation` hooks

## Полезні команди

```bash
# Генерація Prisma Client
npx prisma generate

# Перегляд бази даних
npx prisma studio

# Скидання бази даних
npx prisma db push --force-reset

# Лінт коду
npm run lint

# Білд проекту
npm run build
```

## Ліцензія

MIT
