import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum UserRole {
    USER
    MODERATOR
    ADMIN
  }

  type User {
    id: ID!
    email: String!
    name: String
    role: UserRole!
    image: String
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

  type Query {
    users: [User!]!
    allUsers: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    myPosts: [Post!]!
    allPosts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(email: String!, name: String): User!
    createPost(title: String!, content: String): Post!
    changeUserRole(id: ID!, role: UserRole!): User!
    updatePost(
      id: ID!
      title: String
      content: String
      published: Boolean
    ): Post!
    deletePost(id: ID!): Post!
  }
`;
