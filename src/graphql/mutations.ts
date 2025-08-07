import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String) {
    createUser(email: $email, name: $name) {
      id
      email
      name
      createdAt
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      published
      createdAt
      author {
        id
        name
        email
        role
      }
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost(
    $id: ID!
    $title: String
    $content: String
    $published: Boolean
  ) {
    updatePost(
      id: $id
      title: $title
      content: $content
      published: $published
    ) {
      id
      title
      content
      published
      updatedAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
      title
    }
  }
`;
