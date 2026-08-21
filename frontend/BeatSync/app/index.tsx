import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function Welcome() {
  const { colors } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();

  const [animationFinished, setAnimationFinished] = useState(false);
  useEffect(() => {
  const timer = setTimeout(() => {
    setAnimationFinished(true);
  }, 2200);

  return () => clearTimeout(timer);
}, []);
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg },
      ]}
    >
      {/* =========================
          LOTTIE INTRO
      ========================== */}

      {!animationFinished && (
        <View style={styles.animationScreen}>
          <LottieView
            source={require("../assets/lottie/welcome.json")}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </View>
      )}

      {/* =========================
          WELCOME CONTENT
      ========================== */}

      {animationFinished && (
        <MotiView
          style={styles.content}
          from={{
            opacity: 0,
            translateY: 25,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          transition={{
            type: "timing",
            duration: 450,
          }}
        >
          {/* Decorative color circle */}

          <View
            style={[
              styles.colorCircle,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />

          {/* Brand */}

          <MotiView
  from={{
    opacity: 0,
    scale: 1.35,
  }}
  animate={{
    opacity: 1,
    scale: 1,
  }}
  transition={{
    type: "timing",
    duration: 450,
  }}
>
            <Text
              style={[
                styles.brand,
                { color: colors.text },
              ]}
            >
              BeatSync
            </Text>
          </MotiView>

          {/* Tagline */}

          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            Make life easier
          </Text>

          {/* Small colorful accent */}

          <View style={styles.dotsRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: colors.primary },
              ]}
            />

            <View
              style={[
                styles.dot,
                styles.dotMiddle,
                { backgroundColor: colors.text },
              ]}
            />

            <View
              style={[
                styles.dot,
                { backgroundColor: colors.primary },
              ]}
            />
          </View>

          {/* =========================
              BUTTONS
          ========================== */}

          <View style={styles.buttonsContainer}>

            {/* LOGIN */}

            <Pressable
              onPress={() => router.push("/login")}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {t("login")}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>

            {/* SIGN UP */}

            <Pressable
              onPress={() => router.push("/signup")}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: colors.primary },
                ]}
              >
                {t("signup")}
              </Text>
            </Pressable>
          </View>

          {/* =========================
              LANGUAGE
          ========================== */}

          <View style={styles.languageContainer}>
            <Pressable
              onPress={() => setLang("en")}
              style={[
                styles.languageButton,
                lang === "en" && {
                  backgroundColor: colors.surfaceAlt,
                },
              ]}
            >
              <Ionicons
                name="globe-outline"
                size={16}
                color={
                  lang === "en"
                    ? colors.primary
                    : colors.textSecondary
                }
              />

              <Text
                style={[
                  styles.languageText,
                  {
                    color:
                      lang === "en"
                        ? colors.primary
                        : colors.textSecondary,
                    fontWeight:
                      lang === "en" ? "700" : "500",
                  },
                ]}
              >
                English
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setLang("ta")}
              style={[
                styles.languageButton,
                lang === "ta" && {
                  backgroundColor: colors.surfaceAlt,
                },
              ]}
            >
              <Ionicons
                name="language-outline"
                size={16}
                color={
                  lang === "ta"
                    ? colors.primary
                    : colors.textSecondary
                }
              />

              <Text
                style={[
                  styles.languageText,
                  {
                    color:
                      lang === "ta"
                        ? colors.primary
                        : colors.textSecondary,
                    fontWeight:
                      lang === "ta" ? "700" : "500",
                  },
                ]}
              >
                தமிழ்
              </Text>
            </Pressable>
          </View>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* =========================
     LOTTIE
  ========================== */

  animationScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  lottie: {
    width: "85%",
    height: "55%",
  },

  /* =========================
     MAIN CONTENT
  ========================== */

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    position: "relative",
  },

  colorCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    opacity: 0.08,
    position: "absolute",
    top: 80,
    right: -50,
  },

  brand: {
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 8,
    letterSpacing: 0.2,
  },

  /* =========================
     DECORATION
  ========================== */

  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 45,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  dotMiddle: {
    width: 18,
    marginHorizontal: 6,
  },

  /* =========================
     BUTTONS
  ========================== */

  buttonsContainer: {
    width: "100%",
    gap: 14,
  },

  primaryButton: {
    height: 58,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },

  /* =========================
     LANGUAGE
  ========================== */

  languageContainer: {
    flexDirection: "row",
    marginTop: 28,
    gap: 10,
  },

  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },

  languageText: {
    fontSize: 13,
  },
});