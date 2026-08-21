// app/(auth)/signup.tsx
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

export default function Signup() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "600" }}>← Back</Text>
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>{t("createAccount")}</Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t("name")}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Raju Kumar"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>{t("phone")}</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="98765 43210"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>{t("password")}</Text>
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
            onPress={() =>
  router.replace("/(tabs)/home")
}
          >
            <Text style={styles.buttonText}>{t("signup")}</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={styles.loginRow}>
          <Text style={{ color: colors.textSecondary }}>{t("haveAccount")} </Text>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>{t("login")}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: "center" },
  backRow: { position: "absolute", top: 20, left: 24 },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center", marginBottom: 28, letterSpacing: -0.5 },
  card: { borderRadius: 20, borderWidth: 1, padding: 20 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  button: { borderRadius: 12, paddingVertical: 15, alignItems: "center", marginTop: 24 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
});