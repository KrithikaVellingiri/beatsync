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
import { api } from "../../../api/client";

export default function JoinDistributor() {
  const { colors } = useTheme();
  const { distributors, fetchDistributors, selectDistributor } = useDistributor();
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
     * POST /api/team/distributor/join
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

    Alert.alert(
      "Join Distributor?",
      `Are you sure you want to join this team code: ${code}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm & Join",
          onPress: async () => {
            try {
               const res = await api.post("/team/distributor/join", {
                 body: { teamCode: code },
               });
               if (res.success) {
                 Alert.alert("Success", "You have joined the distributor.");

                 // Fetch latest distributors
                 if (fetchDistributors) await fetchDistributors();

                 // Set it as selected
                 const newDistributor = {
                    id: res.data.membership.distributor.id.toString(),
                    name: res.data.membership.distributor.name,
                    location: "Location not provided",
                    code: res.data.membership.distributor.code,
                 };
                 if (selectDistributor) {
                    await selectDistributor(newDistributor);
                 }

                 router.navigate("/(tabs)/home");
               } else {
                 Alert.alert("Failed", res.message || "Invalid team code.");
               }
            } catch (err) {
               Alert.alert("Network Error", "Could not connect to the server.");
            }
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
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
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
