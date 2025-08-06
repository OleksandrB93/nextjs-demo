import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      name
      createdAt
      posts {
        id
        title
        content
        published
      }
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      published
      createdAt
      author {
        id
        name
        email
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      createdAt
      posts {
        id
        title
        content
        published
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      published
      createdAt
      author {
        id
        name
        email
      }
    }
  }
`;
