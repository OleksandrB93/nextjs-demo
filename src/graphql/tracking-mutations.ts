import { gql } from "@apollo/client";

export const CREATE_TRACKING_EVENT = gql`
  mutation CreateTrackingEvent($input: TrackingEventInput!) {
    createTrackingEvent(input: $input) {
      id
      type
      timestamp
      data
      userId
      sessionToken
      userAgent
      ipAddress
      browser
      browserVersion
      os
      osVersion
      device
      country
      city
      region
      timezone
      createdAt
    }
  }
`;

export const UPDATE_PAGE_ANALYTICS = gql`
  mutation UpdatePageAnalytics($path: String!, $title: String) {
    updatePageAnalytics(path: $path, title: $title) {
      id
      path
      title
      viewCount
      uniqueViews
      lastVisited
      updatedAt
    }
  }
`;

export const UPDATE_CLICK_HEATMAP = gql`
  mutation UpdateClickHeatmap(
    $path: String!
    $elementType: String!
    $elementId: String
    $elementClass: String
    $x: Int!
    $y: Int!
  ) {
    updateClickHeatmap(
      path: $path
      elementType: $elementType
      elementId: $elementId
      elementClass: $elementClass
      x: $x
      y: $y
    ) {
      id
      path
      elementType
      elementId
      elementClass
      x
      y
      clickCount
      updatedAt
    }
  }
`;
