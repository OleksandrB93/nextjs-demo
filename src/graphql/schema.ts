import { gql } from "graphql-tag";

export const typeDefs = gql`
  enum UserRole {
    USER
    MODERATOR
    ADMIN
  }

  enum TrackingEventType {
    CLICK
    SCROLL
    PAGEVIEW
  }

  type User {
    id: ID!
    email: String!
    name: String
    role: UserRole!
    image: String
    posts: [Post!]!
    trackingEvents: [UserTrackingEvent!]!
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

  # === TRACKING TYPES ===

  input TrackingEventInput {
    type: TrackingEventType!
    timestamp: String!
    data: String! # JSON string
    sessionToken: String
    userAgent: String
    ipAddress: String
    browser: String
    browserVersion: String
    os: String
    osVersion: String
    device: String
    country: String
    city: String
    region: String
    timezone: String
  }

  type UserTrackingEvent {
    id: ID!
    type: TrackingEventType!
    timestamp: String!
    data: String! # JSON string
    userId: String
    user: User
    sessionToken: String
    userAgent: String
    ipAddress: String
    browser: String
    browserVersion: String
    os: String
    osVersion: String
    device: String
    country: String
    city: String
    region: String
    timezone: String
    createdAt: String!
  }

  type PageAnalytics {
    id: ID!
    path: String!
    title: String
    viewCount: Int!
    uniqueViews: Int!
    avgTimeOnPage: Float
    bounceRate: Float
    lastVisited: String!
    createdAt: String!
    updatedAt: String!
  }

  type ClickHeatmap {
    id: ID!
    path: String!
    elementType: String!
    elementId: String
    elementClass: String
    x: Int!
    y: Int!
    clickCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  type BrowserStats {
    browser: String!
    count: Int!
    percentage: Float!
  }

  type OSStats {
    os: String!
    count: Int!
    percentage: Float!
  }

  type CountryStats {
    country: String!
    count: Int!
    percentage: Float!
  }

  type DeviceStats {
    device: String!
    count: Int!
    percentage: Float!
  }

  type TrackingStats {
    totalEvents: Int!
    clickEvents: Int!
    scrollEvents: Int!
    pageViewEvents: Int!
    browserStats: [BrowserStats!]!
    osStats: [OSStats!]!
    countryStats: [CountryStats!]!
    deviceStats: [DeviceStats!]!
    topPages: [PageAnalytics!]!
    recentEvents: [UserTrackingEvent!]!
  }

  type Query {
    # === USER & POST QUERIES ===
    users: [User!]!
    allUsers: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    myPosts: [Post!]!
    allPosts: [Post!]!
    post(id: ID!): Post

    # === TRACKING QUERIES ===
    trackingEvents(
      userId: String
      sessionToken: String
      type: TrackingEventType
      limit: Int
      offset: Int
    ): [UserTrackingEvent!]!

    pageAnalytics(path: String, limit: Int, offset: Int): [PageAnalytics!]!

    clickHeatmap(path: String!, limit: Int): [ClickHeatmap!]!

    trackingStats(
      userId: String
      dateFrom: String
      dateTo: String
    ): TrackingStats!
  }

  type Mutation {
    # === USER & POST MUTATIONS ===
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

    # === TRACKING MUTATIONS ===
    createTrackingEvent(input: TrackingEventInput!): UserTrackingEvent!

    updatePageAnalytics(path: String!, title: String): PageAnalytics!

    updateClickHeatmap(
      path: String!
      elementType: String!
      elementId: String
      elementClass: String
      x: Int!
      y: Int!
    ): ClickHeatmap!
  }
`;
