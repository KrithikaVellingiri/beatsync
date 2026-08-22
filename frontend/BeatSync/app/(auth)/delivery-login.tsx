import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function DeliveryLogin() {
  const { colors } = useTheme();
  const router = useRouter();
  const { login } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: googleWebClientId || "not-configured",
    webClientId: googleWebClientId || "not-configured",
  });

  React.useEffect(() => {
    // Print the redirect URI to the console so the user can see it
    console.log("Google Web Client ID exists:", !!process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB);
    console.log("AuthSession Redirect URI:", AuthSession.makeRedirectUri());

    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) {
        handleBackendGoogleLogin(id_token);
      }
    } else if (response?.type === "error") {
      setError(response.error?.message || "Google authentication failed");
    }
  }, [response]);

  const handleBackendGoogleLogin = async (idToken: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken, role: "delivery_boy" }),
      });
      const data = await res.json();
      
      if (data.success) {
        await login(data.data.token, data.data.user.role, data.data.user.distributorId, false);
      } else {
        setError(data.message || "Google authentication failed");
      }
    } catch (err) {
      console.error("Backend Google Login Error:", err);
      setError("Network error communicating with backend.");
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: identifier, password }),
      });
      const data = await res.json();
      
      if (data.success && data.data.user.role === "delivery_boy") {
        await login(data.data.token, data.data.user.role, data.data.user.distributorId, false);
      } else if (data.success) {
        setError("This account is not a delivery boy account.");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    if (!googleWebClientId) {
      setError("Google login is not configured. Use email/password or configure the Google Web Client ID.");
      return;
    }
    if (Platform.OS === "web") {
      promptAsync();
      return;
    }

    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
      });
      
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error("No ID token returned");
      
      await handleBackendGoogleLogin(idToken);
    } catch (err) {
      console.error("Native Google Login Error:", err);
      setError("Google Login failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, isDesktop && styles.desktopCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>Delivery Boy Sign in</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Welcome back! Please sign in to continue.
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Email/Mobile Input */}
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email or Mobile Number"
              placeholderTextColor={colors.textSecondary}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Pressable style={styles.forgotPassword}>
            <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 13 }}>Forgot password?</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <Pressable
            style={({ pressed }) => [styles.googleButton, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            onPress={handleGoogleLogin}
          >
            <Ionicons name="logo-google" size={20} color={colors.text} style={{ marginRight: 10 }} />
            <Text style={[styles.googleButtonText, { color: colors.text }]}>Continue with Google</Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/delivery-signup")}>
              <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 14 }}>Sign up</Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 450,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
  },
  desktopCard: {
    padding: 48,
  },
  backButton: {
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 32,
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 16,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    height: "100%",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
