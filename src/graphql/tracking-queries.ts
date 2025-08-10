import { gql } from "@apollo/client";

// === QUERIES ===

export const GET_TRACKING_EVENTS = gql`
  query GetTrackingEvents(
    $userId: String
    $sessionToken: String
    $type: TrackingEventType
    $limit: Int
    $offset: Int
  ) {
    trackingEvents(
      userId: $userId
      sessionToken: $sessionToken
      type: $type
      limit: $limit
      offset: $offset
    ) {
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
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_PAGE_ANALYTICS = gql`
  query GetPageAnalytics($path: String, $limit: Int, $offset: Int) {
    pageAnalytics(path: $path, limit: $limit, offset: $offset) {
      id
      path
      title
      viewCount
      uniqueViews
      avgTimeOnPage
      bounceRate
      lastVisited
      createdAt
      updatedAt
    }
  }
`;

export const GET_CLICK_HEATMAP = gql`
  query GetClickHeatmap($path: String!, $limit: Int) {
    clickHeatmap(path: $path, limit: $limit) {
      id
      path
      elementType
      elementId
      elementClass
      x
      y
      clickCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRACKING_STATS = gql`
  query GetTrackingStats($userId: String, $dateFrom: String, $dateTo: String) {
    trackingStats(userId: $userId, dateFrom: $dateFrom, dateTo: $dateTo) {
      totalEvents
      clickEvents
      scrollEvents
      pageViewEvents
      browserStats {
        browser
        count
        percentage
      }
      osStats {
        os
        count
        percentage
      }
      countryStats {
        country
        count
        percentage
      }
      deviceStats {
        device
        count
        percentage
      }
      topPages {
        id
        path
        title
        viewCount
        uniqueViews
        avgTimeOnPage
      }
      recentEvents {
        id
        type
        timestamp
        data
        browser
        os
        country
        device
        user {
          name
          email
        }
      }
    }
  }
`;
