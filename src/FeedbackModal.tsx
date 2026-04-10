import React, { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native"
import * as MailComposer from "expo-mail-composer"
import * as Application from "expo-application"
import * as Device from "expo-device"
import { usePathname } from "expo-router"

interface Props {
  visible: boolean
  screenshotUri: string | null
  email: string
  onClose: () => void
}

const EMOJI_OPTIONS = [
  { emoji: "😍", label: "Elsker det" },
  { emoji: "😊", label: "Bra" },
  { emoji: "😐", label: "Ok" },
  { emoji: "😕", label: "Forvirrende" },
  { emoji: "😢", label: "Frustrerende" },
] as const

export function FeedbackModal({
  visible,
  screenshotUri,
  email,
  onClose,
}: Props) {
  const pathname = usePathname()
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null)
  const [comment, setComment] = useState("")

  function resetAndClose() {
    setSelectedEmoji(null)
    setComment("")
    onClose()
  }

  async function handleSend() {
    if (selectedEmoji === null) return

    const available = await MailComposer.isAvailableAsync()
    if (!available) {
      Alert.alert(
        "No email client",
        "No email client is configured on this device. Copy your feedback and send it manually."
      )
      return
    }

    const { emoji, label } = EMOJI_OPTIONS[selectedEmoji]
    const appVersion = Application.nativeApplicationVersion ?? "unknown"
    const buildNumber = Application.nativeBuildVersion ?? "unknown"
    const deviceModel = Device.modelName ?? "unknown"
    const osVersion = Device.osVersion ?? "unknown"
    const now = new Date().toISOString()

    const body = [
      `Rating: ${emoji} ${label}`,
      "",
      comment || "No comment",
      "",
      "---",
      `Screen: ${pathname}`,
      `Version: ${appVersion} (${buildNumber})`,
      `Device: ${deviceModel}, iOS ${osVersion}`,
      `Date: ${now}`,
    ].join("\n")

    const attachments = screenshotUri ? [screenshotUri] : []

    await MailComposer.composeAsync({
      recipients: [email],
      subject: `[Beta Feedback] ${label} — ${pathname}`,
      body,
      attachments,
    })

    resetAndClose()
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={resetAndClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Send feedback</Text>
          <TouchableOpacity onPress={resetAndClose} hitSlop={8}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          keyboardShouldPersistTaps="handled"
        >
          {screenshotUri && (
            <Image
              source={{ uri: screenshotUri }}
              style={styles.screenshot}
              resizeMode="cover"
            />
          )}

          <Text style={styles.sectionLabel}>How does the app feel?</Text>

          <View style={styles.emojiRow}>
            {EMOJI_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                onPress={() => setSelectedEmoji(index)}
                style={[
                  styles.emojiButton,
                  selectedEmoji === index && styles.emojiButtonSelected,
                ]}
              >
                <Text style={styles.emoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.emojiLabel,
                    selectedEmoji === index && styles.emojiLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Tell us more (optional)"
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={handleSend}
            disabled={selectedEmoji === null}
            style={[
              styles.sendButton,
              selectedEmoji === null && styles.sendButtonDisabled,
            ]}
          >
            <Text style={styles.sendButtonText}>Send feedback</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    fontSize: 20,
    color: "#999",
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  screenshot: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emojiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  emojiButton: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#eee",
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 2,
  },
  emojiButtonSelected: {
    borderColor: "#6C63FF",
    backgroundColor: "rgba(108, 99, 255, 0.08)",
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#999",
  },
  emojiLabelSelected: {
    color: "#6C63FF",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    fontSize: 16,
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
    marginBottom: 24,
  },
  sendButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#6C63FF",
  },
  sendButtonDisabled: {
    backgroundColor: "#ddd",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})
