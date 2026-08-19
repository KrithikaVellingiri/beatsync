// app/(auth)/login.tsx
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

export default function Login() {
  const { colors } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Brand */}
        <View style={styles.brandRow}>
          <View style={[styles.logoDot, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoDotText}>B</Text>
          </View>
          <Text style={[styles.brand, { color: colors.text }]}>BeatSync</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{t("login")}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {lang === "en" ? "Log in to start today's beat" : "இன்றைய பயணத்தைத் தொடங்க உள்நுழையவும்"}
        </Text>

        {/* Form */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t("phone")}</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="98765 43210"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
            {t("password")}
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.replace("/(tabs)/beat")}
          >
            <Text style={styles.buttonText}>{t("login")}</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push("/(auth)/signup")} style={styles.signupRow}>
          <Text style={{ color: colors.textSecondary }}>{t("noAccount")} </Text>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>{t("createAccount")}</Text>
        </Pressable>

        {/* Language toggle */}
        <View style={styles.langRow}>
          <Pressable onPress={() => setLang("en")}>
            <Text style={[styles.langText, { color: lang === "en" ? colors.primary : colors.textSecondary, fontWeight: lang === "en" ? "800" : "500" }]}>
              English
            </Text>
          </Pressable>
          <Text style={{ color: colors.border, marginHorizontal: 10 }}>|</Text>
          <Pressable onPress={() => setLang("ta")}>
            <Text style={[styles.langText, { color: lang === "ta" ? colors.primary : colors.textSecondary, fontWeight: lang === "ta" ? "800" : "500" }]}>
              தமிழ்
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 28, alignSelf: "center" },
  logoDot: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 10 },
  logoDotText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  brand: { fontSize: 20, fontWeight: "800", letterSpacing: -0.3 },
  title: { fontSize: 28, fontWeight: "800", textAlign: "center", letterSpacing: -0.5 },
  subtitle: { fontSize: 14, textAlign: "center", marginTop: 6, marginBottom: 28 },
  card: { borderRadius: 20, borderWidth: 1, padding: 20 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  button: { borderRadius: 12, paddingVertical: 15, alignItems: "center", marginTop: 24 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  signupRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  langRow: { flexDirection: "row", justifyContent: "center", marginTop: 32 },
  langText: { fontSize: 14 },
});