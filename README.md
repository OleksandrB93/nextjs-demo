# Next.js GraphQL Demo

A sample application using Next.js, GraphQL, Prisma, and MongoDB.

## Technologies

- **Next.js 15** - React framework
- **GraphQL** - API query language
- **Apollo Client/Server** - GraphQL client and server
- **Prisma** - ORM for database operations
- **MongoDB** - NoSQL database
- **TypeScript** - typed JavaScript
- **Tailwind CSS** - CSS framework

## Project Structure

```
src/
├── app/
│   ├── api/graphql/route.ts    # GraphQL API endpoint
│   ├── layout.tsx              # Root layout with Apollo Provider
│   └── page.tsx                # Main page
├── components/
│   ├── ApolloWrapper.tsx       # Apollo Client wrapper
│   ├── UserForm.tsx            # User creation form
│   ├── PostForm.tsx            # Post creation form
│   ├── UsersList.tsx           # Users list
│   └── PostsList.tsx           # Posts list
├── graphql/
│   ├── schema.ts               # GraphQL schema
│   ├── resolvers.ts            # GraphQL resolvers
│   ├── queries.ts              # GraphQL queries
│   └── mutations.ts            # GraphQL mutations
└── lib/
    ├── prisma.ts               # Prisma Client utility
    └── apollo-client.ts        # Apollo Client configuration
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. MongoDB Setup

Install MongoDB locally or use MongoDB Atlas.

For local MongoDB:

```bash
# Start MongoDB (depends on your OS)
mongod
```

### 3. Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="mongodb://localhost:27017/nextjs-graphql-demo"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Features

### Users

- ✅ Create users
- ✅ View users list
- ✅ Display user posts

### Posts

- ✅ Create posts
- ✅ View posts list
- ✅ Update publication status
- ✅ Delete posts

### GraphQL

- ✅ GraphQL API endpoint: `/api/graphql`
- ✅ GraphQL Playground for testing
- ✅ Typed queries and mutations

## GraphQL Schema

### Types

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

### Queries

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

### Mutations

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

## Development

### Adding New Types

1. Update `prisma/schema.prisma`
2. Add types in `src/graphql/schema.ts`
3. Create resolvers in `src/graphql/resolvers.ts`
4. Generate Prisma Client: `npx prisma generate`

### Creating New Components

1. Create a component in `src/components/`
2. Add GraphQL queries/mutations in `src/graphql/`
3. Use `useQuery` and `useMutation` hooks

## Useful Commands

```bash
# Generate Prisma Client
npx prisma generate

# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Lint code
npm run lint

# Build project
npm run build
```

## License

MIT
