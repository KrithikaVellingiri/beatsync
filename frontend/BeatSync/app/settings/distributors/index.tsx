import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "../../../api/client";
import {
  useDistributor,
} from "../../../context/DistributorContext";
import { useTheme } from "../../../context/ThemeContext";

export default function MyDistributors() {
  const { colors } = useTheme();
  const { distributors, fetchDistributors, selectDistributor } = useDistributor();
  const insets = useSafeAreaInsets();

  const [code, setCode] = React.useState("");

  const handleContinue = async () => {
    const teamCode = code.trim().toUpperCase();

    if (!teamCode) {
      Alert.alert(
        "Team Code Required",
        "Please enter your distributor's team code."
      );
      return;
    }

    try {
      const res = await api.post("/team/distributor/join", {
        body: { code: teamCode },
      });

      if (res.success) {
        Alert.alert(
          "Joined Successfully",
          `You have joined ${res.data.membership.distributor.name}.`,
          [
            {
              text: "Go to Home",
              onPress: async () => {
                await fetchDistributors();
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
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Failed to Join",
          res.message || "Invalid team code or you are already a member."
        );
      }
    } catch (error) {
      Alert.alert(
        "Network Error",
        "Could not connect to the server."
      );
    }
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.bg,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color={colors.text}
          />
        </Pressable>

        <Text
          style={[
            styles.headerTitle,
            { color: colors.text },
          ]}
        >
          My Distributors
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={distributors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 30,
          },
        ]}
        ListHeaderComponent={
          <>
            {/* EXISTING DISTRIBUTORS */}

            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textSecondary },
              ]}
            >
              YOUR DISTRIBUTORS
            </Text>

            {distributors.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="business-outline"
                  size={28}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.emptyTitle,
                    { color: colors.text },
                  ]}
                >
                  No distributors yet
                </Text>

                <Text
                  style={[
                    styles.emptyText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Join a distributor using the team
                  code provided by them.
                </Text>
              </View>
            ) : null}

            {/* JOIN */}

            <Text
              style={[
                styles.sectionTitle,
                { color: colors.textSecondary },
              ]}
            >
              JOIN A DISTRIBUTOR
            </Text>

            <View
              style={[
                styles.joinCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.codeIcon,
                  {
                    backgroundColor: colors.surfaceAlt,
                  },
                ]}
              >
                <Ionicons
                  name="key-outline"
                  size={25}
                  color={colors.primary}
                />
              </View>

              <Text
                style={[
                  styles.joinTitle,
                  { color: colors.text },
                ]}
              >
                Enter Team Code
              </Text>

              <Text
                style={[
                  styles.joinDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Ask your distributor for their BeatSync
                team code.
              </Text>

              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Example: SHARMA24"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.surfaceAlt,
                    borderColor: colors.border,
                  },
                ]}
              />

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
                  size={19}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.distributorCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.distributorIcon,
                {
                  backgroundColor: colors.surfaceAlt,
                },
              ]}
            >
              <Ionicons
                name="business-outline"
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.distributorInfo}>
              <Text
                style={[
                  styles.distributorName,
                  { color: colors.text },
                ]}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.location,
                  { color: colors.textSecondary },
                ]}
              >
                {item.location}
              </Text>

              <View style={styles.activeRow}>
                <View
                  style={[
                    styles.activeDot,
                    {
                      backgroundColor: colors.success,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.activeText,
                    {
                      color: colors.success,
                    },
                  ]}
                >
                  Active
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
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
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 21,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 25,
  },

  content: {
    paddingHorizontal: 18,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 9,
  },

  emptyCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
  },

  emptyText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 6,
  },

  joinCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },

  codeIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  joinTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  joinDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 16,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },

  continueButton: {
    height: 52,
    borderRadius: 14,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  distributorCard: {
    minHeight: 95,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  distributorIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  distributorInfo: {
    flex: 1,
  },

  distributorName: {
    fontSize: 16,
    fontWeight: "700",
  },

  location: {
    fontSize: 13,
    marginTop: 3,
  },

  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  activeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});