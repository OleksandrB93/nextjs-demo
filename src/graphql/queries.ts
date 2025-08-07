import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      name
      role
      image
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

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      id
      email
      name
      role
      image
      createdAt
      updatedAt
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
        role
      }
    }
  }
`;

export const GET_MY_POSTS = gql`
  query GetMyPosts {
    myPosts {
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

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    allPosts {
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

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      role
      image
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
        role
      }
    }
  }
`;
