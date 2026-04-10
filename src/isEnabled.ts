import { Platform } from "react-native"
import Constants from "expo-constants"

/**
 * Determines if the feedback button should be visible.
 *
 * If `override` is provided, uses that value directly.
 * Otherwise, auto-detects based on:
 * - Returns false in __DEV__ mode
 * - Returns false on non-iOS platforms
 * - Returns true if Constants.expoConfig.extra.betaBuild is true
 *   (set via BETA_BUILD=true environment variable in app.config.ts)
 */
export function isEnabled(override?: boolean): boolean {
  if (override !== undefined) return override

  if (__DEV__) return false
  if (Platform.OS !== "ios") return false

  return Constants.expoConfig?.extra?.betaBuild === true
}
