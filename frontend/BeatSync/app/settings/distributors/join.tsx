import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDistributor } from "../../../context/DistributorContext";
import { useTheme } from "../../../context/ThemeContext";

export default function JoinDistributor() {
  const { colors } = useTheme();
  const { distributors } = useDistributor();
  const insets = useSafeAreaInsets();

  const [teamCode, setTeamCode] = React.useState("");

  const handleContinue = () => {
    const code = teamCode.trim().toUpperCase();

    if (!code) {
      Alert.alert(
        "Team Code Required",
        "Please enter the team code provided by your distributor."
      );
      return;
    }

    /*
     * TEMPORARY FRONTEND FLOW
     *
     * Later:
     *
     * POST /api/team/distributor/preview/:code
     *
     * The backend will return:
     *
     * {
     *   id,
     *   name,
     *   location,
     *   code
     * }
     */

    const existingDistributor = distributors.find(
      (item) => item.code === code
    );

    if (existingDistributor) {
      Alert.alert(
        "Already Joined",
        `You are already connected to ${existingDistributor.name}.`
      );
      return;
    }

    // Temporary demo distributor.
    // REMOVE this when backend is connected.
    const previewDistributor = {
      id: `demo-${code}`,
      name: "Sharma Distributors",
      location: "Chennai",
      code,
    };

    Alert.alert(
      "Join Distributor?",
      `${previewDistributor.name}\n${previewDistributor.location}\n\nTeam Code: ${previewDistributor.code}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm & Join",
          onPress: () => {
            /*
             * Backend step will eventually happen here:
             *
             * POST /api/team/distributor/join
             *
             * After successful response:
             * addDistributor(distributor)
             */
            router.back();
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        {
          backgroundColor: colors.bg,
          paddingTop: insets.top,
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </Pressable>

        <Text
          style={[
            styles.headerTitle,
            { color: colors.text },
          ]}
        >
          Join a Distributor
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* CONTENT */}

      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.surfaceAlt,
            },
          ]}
        >
          <Ionicons
            name="business-outline"
            size={32}
            color={colors.primary}
          />
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          Connect to your distributor
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.textSecondary },
          ]}
        >
          Enter the team code provided by your
          distributor to connect your account.
        </Text>

        {/* INPUT */}

        <View style={styles.inputSection}>
          <Text
            style={[
              styles.label,
              { color: colors.text },
            ]}
          >
            Team Code
          </Text>

          <TextInput
            value={teamCode}
            onChangeText={(value) =>
              setTeamCode(value.toUpperCase())
            }
            placeholder="e.g. SHARMA24"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={20}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />
        </View>

        {/* CONTINUE */}

        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 40,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 45,
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
    maxWidth: 330,
  },

  inputSection: {
    marginTop: 32,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 9,
  },

  input: {
    height: 56,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },

  continueButton: {
    height: 54,
    borderRadius: 16,
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
