# react-native-testflight-feedback

A floating feedback button for TestFlight builds in React Native / Expo apps. Captures a screenshot, lets testers rate with emoji + optional text, and sends it via email.

**Only visible in TestFlight builds** — automatically hidden in development and production App Store builds.

## Install

```bash
npx expo install react-native-testflight-feedback
```

## Setup

### 1. Add the provider

Wrap your root layout with `FeedbackProvider`:

```tsx
import { FeedbackProvider } from 'react-native-testflight-feedback';

export default function RootLayout() {
  return (
    <FeedbackProvider email="feedback@yourapp.com">
      <Stack>
        {/* your screens */}
      </Stack>
    </FeedbackProvider>
  );
}
```

### 2. Set the build flag

In your `app.config.ts` (or `app.config.js`):

```ts
export default {
  // ...your config
  extra: {
    betaBuild: process.env.BETA_BUILD === "true",
  },
};
```

In your `eas.json`, add a beta profile with the env var:

```json
{
  "build": {
    "beta": {
      "env": {
        "BETA_BUILD": "true"
      }
    },
    "production": {}
  }
}
```

Build with `eas build --profile beta` and the feedback button appears. Build with `--profile production` and it's gone.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `email` | `string` | Yes | Recipient email for feedback |
| `enabled` | `boolean` | No | Override auto-detection. `true` forces the button on (useful for testing). |
| `children` | `ReactNode` | Yes | Your app content |

## How it works

1. A floating button appears in the bottom-right corner
2. Tapping it captures a screenshot of the current screen
3. A modal slides up with the screenshot, 5 emoji choices, and an optional text field
4. "Send" opens the device mail client with a pre-filled email containing the feedback + screenshot

## Peer dependencies

- `react` >= 18
- `react-native` >= 0.72
- `expo-constants` >= 14
- `expo-mail-composer` >= 12
- `expo-application` >= 5
- `expo-device` >= 5
- `expo-router` >= 3
- `react-native-view-shot` >= 3

## License

MIT
