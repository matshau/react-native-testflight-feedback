import React, { useRef, useState, useCallback, type ReactNode } from "react"
import { View, StyleSheet } from "react-native"
import ViewShot, { captureRef } from "react-native-view-shot"
import { isEnabled } from "./isEnabled"
import { FeedbackButton } from "./FeedbackButton"
import { FeedbackModal } from "./FeedbackModal"

interface Props {
  /** Recipient email address for feedback (required) */
  email: string
  /** Override auto-detection. If omitted, shows only when betaBuild is true. */
  enabled?: boolean
  children: ReactNode
}

export function FeedbackProvider({ email, enabled, children }: Props) {
  const show = isEnabled(enabled)
  const viewShotRef = useRef<ViewShot>(null)
  const [feedbackVisible, setFeedbackVisible] = useState(false)
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null)

  const handleFeedbackPress = useCallback(async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 0.8,
      })
      setScreenshotUri(uri)
    } catch {
      setScreenshotUri(null)
    }
    setFeedbackVisible(true)
  }, [])

  if (!show) {
    return <>{children}</>
  }

  return (
    <View style={styles.root}>
      <ViewShot ref={viewShotRef} style={styles.root}>
        {children}
      </ViewShot>
      <FeedbackButton onPress={handleFeedbackPress} />
      <FeedbackModal
        visible={feedbackVisible}
        screenshotUri={screenshotUri}
        email={email}
        onClose={() => setFeedbackVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
