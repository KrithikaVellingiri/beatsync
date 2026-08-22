import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ScrollView,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

export default function RoleSelection() {
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={isDesktop ? styles.desktopScroll : styles.mobileScroll}>
        <View style={[styles.contentWrapper, isDesktop && styles.desktopWrapper]}>
          
          {/* Left / Top Section */}
          <View style={[styles.leftSection, isDesktop && styles.desktopLeftSection]}>
            <View style={styles.brandRow}>
              <View style={[styles.logoDot, { backgroundColor: colors.primary }]}>
                <Text style={styles.logoDotText}>B</Text>
              </View>
              <Text style={[styles.brand, { color: colors.text }]}>BeatSync</Text>
            </View>

            <MotiView
              from={{ opacity: 0, translateY: 15 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400 }}
            >
              <Text style={[styles.mainHeading, { color: colors.text }]}>
                Welcome to BeatSync
              </Text>
              <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
                Simplify your distribution.
              </Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                Manage beats, deliveries and collections with ease.
              </Text>
            </MotiView>
            
            {/* Lottie Graphic could go here, but omitted for simplicity to match mockups closely without asset issues */}
          </View>

          {/* Right / Bottom Section - Role Selection */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 450, delay: 100 }}
            style={[styles.rightSection, isDesktop && styles.desktopRightSection]}
          >
            <Text style={[styles.chooseRoleTitle, { color: colors.text }]}>
              Choose your account type
            </Text>
            <Text style={[styles.chooseRoleSub, { color: colors.textSecondary }]}>
              Select how you want to continue
            </Text>

            <Pressable
              onPress={() => router.push("/(auth)/distributor-login")}
              style={({ pressed }) => [
                styles.roleCard,
                { borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.roleCardContent}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>Distributor</Text>
                <Text style={[styles.roleDesc, { color: colors.textSecondary }]}>
                  Manage your business, beats, orders, delivery boys and collections.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </Pressable>

            <Pressable
              onPress={() => router.push("/(auth)/delivery-login")}
              style={({ pressed }) => [
                styles.roleCard,
                { borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.roleCardContent}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>Delivery Boy</Text>
                <Text style={[styles.roleDesc, { color: colors.textSecondary }]}>
                  View your assigned beats, deliver orders and manage collections.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </Pressable>

          </MotiView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  desktopScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  mobileScroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  contentWrapper: {
    flex: 1,
  },
  desktopWrapper: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 1100,
    alignSelf: "center",
    padding: 40,
    gap: 60,
  },
  leftSection: {
    marginBottom: 40,
  },
  desktopLeftSection: {
    flex: 1,
    marginBottom: 0,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  logoDot: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoDotText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },
  brand: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },
  rightSection: {
    flex: 1,
  },
  desktopRightSection: {
    flex: 1,
    maxWidth: 450,
  },
  chooseRoleTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  chooseRoleSub: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  roleCardContent: {
    flex: 1,
    paddingRight: 16,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  roleDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});