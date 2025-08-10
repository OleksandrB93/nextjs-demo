# 🎯 User Tracking System Setup Guide

Complete guide for setting up a user behavior tracking system in Next.js 15 with Prisma and GraphQL.

## 📋 What was created

### 1. **Prisma Schema** (`prisma/schema.prisma`)

- ✅ `UserTrackingEvent` - storing tracking events
- ✅ `PageAnalytics` - page analytics
- ✅ `ClickHeatmap` - click heatmap
- ✅ `TrackingEventType` enum - event types

### 2. **GraphQL Schema & Resolvers**

- ✅ `src/graphql/schema.ts` - updated schema with tracking types
- ✅ `src/graphql/resolvers.ts` - resolvers for all operations
- ✅ `src/graphql/tracking-queries.ts` - tracking queries
- ✅ `src/graphql/tracking-mutations.ts` - tracking mutations

### 3. **React Components & Hooks**

- ✅ `src/components/Providers/UserTrackingProvider.tsx` - provider with GraphQL integration
- ✅ `src/hooks/useTrackingGraphQL.ts` - hook for working with GraphQL
- ✅ `src/components/TrackingDashboard.tsx` - dashboard with statistics
- ✅ `src/components/ScrollTestComponent.tsx` - scroll testing component

## 🚀 Step-by-step setup

### Step 1: Update the database

```bash
# Generate Prisma client with new models
npx prisma generate

# Apply changes to the database
npx prisma db push

# (Optional) View the database
npx prisma studio
```

### Step 2: Verify GraphQL integration

Make sure that updated resolvers are imported in `src/app/api/graphql/route.ts`:

```typescript
import { resolvers } from "@/graphql/resolvers";
import { typeDefs } from "@/graphql/schema";
```

### Step 3: Start the application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Step 4: Testing functionality

1. **Open http://localhost:3000**
2. **Open Developer Console (F12)**
3. **Test various actions:**
   - Button clicks
   - Page scrolling
   - Navigation between pages
   - "Show Server Dashboard" button to view server data

## 🔧 Provider setup

In `src/app/layout.tsx` the provider is already integrated:

```tsx
<UserTrackingProvider saveToServer={true}>
  {/* your content */}
</UserTrackingProvider>
```

**Options:**

- `saveToServer={true}` - save events to server via GraphQL
- `saveToServer={false}` - local tracking only

## 📊 Usage in components

### Basic tracking

```tsx
import { useUserTracking } from "@/components/Providers/UserTrackingProvider";

function MyComponent() {
  const { events, isTracking, setIsTracking } = useUserTracking();

  return (
    <div>
      <p>Events: {events.length}</p>
      <button onClick={() => setIsTracking(!isTracking)}>
        Toggle Tracking
      </button>
    </div>
  );
}
```

### GraphQL statistics

```tsx
import { useTrackingStats } from "@/hooks/useTrackingGraphQL";

function StatsComponent() {
  const { stats, loading, error } = useTrackingStats();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading stats</div>;

  return (
    <div>
      <p>Total Events: {stats.totalEvents}</p>
      <p>Clicks: {stats.clickEvents}</p>
      <p>Scrolls: {stats.scrollEvents}</p>
      <p>Page Views: {stats.pageViewEvents}</p>
    </div>
  );
}
```

### Custom events

```tsx
import { useUserTracking } from "@/hooks/useUserTracking";

function CustomTrackingComponent() {
  const { trackCustomEvent } = useUserTracking();

  const handleSpecialAction = () => {
    trackCustomEvent("button_click", {
      buttonId: "special-button",
      context: "header",
      timestamp: Date.now(),
    });
  };

  return <button onClick={handleSpecialAction}>Special Action</button>;
}
```

## 🗃️ Data structure

### TrackingEvent

```typescript
{
  type: 'click' | 'scroll' | 'pageview',
  timestamp: number,
  data: {
    // For click:
    element: string,
    elementId?: string,
    elementClass?: string,
    coordinates: { x: number, y: number },
    path: string,

    // For scroll:
    scrollY: number,
    scrollX: number,
    direction: 'up' | 'down' | 'left' | 'right',
    percentage: number,
    path: string,

    // For pageview:
    path: string,
    previousPath?: string,
    referrer?: string,
    userAgent: string,
    timestamp: number
  }
}
```

## 🔍 GraphQL Queries

### Get tracking events

```graphql
query GetTrackingEvents($limit: Int, $type: TrackingEventType) {
  trackingEvents(limit: $limit, type: $type) {
    id
    type
    timestamp
    data
    user {
      name
      email
    }
  }
}
```

### Get statistics

```graphql
query GetTrackingStats {
  trackingStats {
    totalEvents
    clickEvents
    scrollEvents
    pageViewEvents
    topPages {
      path
      viewCount
      avgTimeOnPage
    }
  }
}
```

### Create event

```graphql
mutation CreateTrackingEvent($input: TrackingEventInput!) {
  createTrackingEvent(input: $input) {
    id
    type
    timestamp
    data
  }
}
```

## 🎛️ Production setup

### 1. Save optimization

```typescript
// Batch event saving
const BATCH_SIZE = 10;
const BATCH_INTERVAL = 5000; // 5 seconds

// Throttling for scroll events
const SCROLL_THROTTLE = 200; // 200ms
```

### 2. Filtering sensitive data

```typescript
// Don't track certain pages
const EXCLUDED_PATHS = ["/admin", "/private"];

// Don't track certain elements
const EXCLUDED_ELEMENTS = ["password", "credit-card"];
```

### 3. Analytics integrations

```typescript
// Google Analytics integration
const sendToGA = (event) => {
  gtag("event", event.type, {
    event_category: "user_interaction",
    event_label: event.data.path,
  });
};

// Mixpanel integration
const sendToMixpanel = (event) => {
  mixpanel.track(event.type, event.data);
};
```

## 🐛 Debugging

### Console messages:

- 🔧 `UserTrackingProvider initialized` - provider started
- 🖱️ `User Tracking Event [CLICK]` - click event
- 📜 `User Tracking Event [SCROLL]` - scroll event
- 🌐 `User Tracking Event [PAGEVIEW]` - page view event
- ✅ `Event saved to server` - event saved to server
- ❌ `Failed to save event` - save error

### Common issues:

1. **Events not tracking** - check `isTracking` state
2. **Not saving to server** - check GraphQL connection
3. **Slow performance** - increase throttling intervals

## 📈 Metrics and analytics

The system collects:

- 📊 **General statistics** - event count by type
- 🔥 **Popular pages** - most visited URLs
- 🖱️ **Click heatmap** - click coordinates on elements
- ⏱️ **Time on page** - duration of stay
- 👥 **Unique users** - session count

Ready! 🎉 The system is fully configured and ready to use.
