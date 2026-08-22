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

export default function DistributorSignup() {
  const { colors } = useTheme();
  const router = useRouter();
  const { login } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!email || !phone) {
      setError("Email and Phone are required");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/register-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distributorName: businessName,
          ownerName: ownerName,
          email: email,
          phone: phone,
          password: password,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        await login(data.data.token, data.data.user.role, data.data.user.distributorId, true);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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

          <Text style={[styles.title, { color: colors.text }]}>Distributor Sign up</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Create your distributor account
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Business Name */}
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="business-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Business Name"
              placeholderTextColor={colors.textSecondary}
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>

          {/* Owner Name */}
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Owner Name"
              placeholderTextColor={colors.textSecondary}
              value={ownerName}
              onChangeText={setOwnerName}
            />
          </View>

          {/* Email Input */}
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email Address"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Phone Input */}
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Phone Number"
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
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

          {/* Confirm Password Input */}
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/distributor-login")}>
              <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 14 }}>Sign in</Text>
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
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
