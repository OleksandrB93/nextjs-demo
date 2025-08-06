import { gql } from "graphql-tag";

export const typeDefs = gql`
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

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(email: String!, name: String): User!
    createPost(title: String!, content: String, authorId: String!): Post!
    updatePost(
      id: ID!
      title: String
      content: String
      published: Boolean
    ): Post!
    deletePost(id: ID!): Post!
  }
`;
