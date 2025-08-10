# User Tracking System 🎯

User behavior tracking system for Next.js 15 application.

## Functionality

### Automatic tracking:

- 🖱️ **Clicks** - all clicks on elements with details (coordinates, element type, ID, classes)
- 📜 **Scroll** - page scrolling with direction and percentage
- 🌐 **Page navigation** - automatic tracking of Next.js navigation

### Additional features:

- ⏸️ Enable/disable tracking
- 📊 Store all events in memory
- 🔍 Detailed logging in browser console
- 🎨 Custom events via hook

## Usage

### 1. Basic usage

```tsx
import { useUserTracking } from "@/components/Providers/UserTrackingProvider";

function MyComponent() {
  const { events, isTracking, setIsTracking } = useUserTracking();

  return (
    <div>
      <p>Total events: {events.length}</p>
      <button onClick={() => setIsTracking(!isTracking)}>
        {isTracking ? "Disable" : "Enable"} tracking
      </button>
    </div>
  );
}
```

### 2. Advanced hook

```tsx
import { useUserTracking } from "@/hooks/useUserTracking";

function AdvancedComponent() {
  const { trackCustomEvent, trackFormInteraction, getEventStats } =
    useUserTracking();

  const handleSpecialAction = () => {
    trackCustomEvent("special_button_click", {
      buttonId: "special-btn",
      context: "header",
    });
  };

  const stats = getEventStats();

  return (
    <div>
      <button onClick={handleSpecialAction}>Special action</button>
      <p>Clicks: {stats.clicks}</p>
      <p>Page views: {stats.pageViews}</p>
    </div>
  );
}
```

### 3. Form tracking

```tsx
function FormComponent() {
  const { trackFormInteraction } = useUserTracking();

  return (
    <form id="contact-form">
      <input
        onFocus={() => trackFormInteraction("contact-form", "focus", "email")}
        onBlur={() => trackFormInteraction("contact-form", "blur", "email")}
        onChange={() => trackFormInteraction("contact-form", "change", "email")}
      />
    </form>
  );
}
```

## Event structure

### Click Event

```typescript
{
  type: 'click',
  timestamp: 1699123456789,
  data: {
    element: 'button',
    elementId: 'my-button',
    elementClass: 'btn btn-primary',
    coordinates: { x: 100, y: 200 },
    path: '/dashboard'
  }
}
```

### Scroll Event

```typescript
{
  type: 'scroll',
  timestamp: 1699123456789,
  data: {
    scrollY: 500,
    scrollX: 0,
    direction: 'down',
    percentage: 25,
    path: '/dashboard'
  }
}
```

### Page View Event

```typescript
{
  type: 'pageview',
  timestamp: 1699123456789,
  data: {
    path: '/dashboard',
    previousPath: '/home',
    referrer: 'https://google.com',
    userAgent: 'Mozilla/5.0...',
    timestamp: 1699123456789
  }
}
```

## Configuration

The provider is already integrated in `layout.tsx` and works automatically for the entire application.

### Disabling for specific components

```tsx
function SensitiveComponent() {
  const { setIsTracking } = useUserTracking();

  useEffect(() => {
    setIsTracking(false); // Disable for this component
    return () => setIsTracking(true); // Re-enable on unmount
  }, []);

  return <div>Sensitive content</div>;
}
```

## Optimization

- Scroll events throttled to 10 times per second
- Events stored only in memory (not sent to server)
- Can easily integrate with analytics services (Google Analytics, Mixpanel, etc.)

## Extension

To send events to server, add to `UserTrackingProvider`:

```typescript
const trackEvent = useCallback(
  (event: TrackingEvent) => {
    if (!isTracking) return;

    // Logging
    console.log("🎯 User Tracking Event:", event);

    // Send to server
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    setEvents((prev) => [...prev, event]);
  },
  [isTracking]
);
```
