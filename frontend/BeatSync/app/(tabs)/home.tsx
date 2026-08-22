import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDistributor } from "../../context/DistributorContext";
import { useTheme } from "../../context/ThemeContext";

export default function Home() {
  const { colors } = useTheme();
  const { distributors, selectedDistributor, selectDistributor } = useDistributor();
  const insets = useSafeAreaInsets();
  const [showPicker, setShowPicker] = useState(false);

  const handleDistributorPress = async (id: string) => {
    const distributor = distributors.find((item) => item.id === id);
    if (!distributor) return;
    setShowPicker(false);
    await selectDistributor(distributor);
    router.navigate("/(tabs)/beat");
  };

  const renderContent = () => {
    if (distributors.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="business-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No distributors yet</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Add a distributor to start managing your beats and stores.
          </Text>
          <Pressable
            onPress={() => router.navigate("/settings/distributors")}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Join a Distributor</Text>
          </Pressable>
        </View>
      );
    }

    if (selectedDistributor && !showPicker) {
      return (
        <View style={styles.dashboardContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>Today's Work</Text>

          <Pressable
            onPress={() => {
              if (distributors.length > 1) {
                setShowPicker(true);
              }
            }}
            style={[styles.distributorSelector, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="business-outline" size={20} color={colors.primary} />
            <Text style={[styles.selectorText, { color: colors.text }]}>{selectedDistributor.name}</Text>
            {distributors.length > 1 && <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />}
          </Pressable>

          <View style={[styles.beatCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.beatIconContainer, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name="calendar-outline" size={28} color={colors.primary} />
            </View>
            <View style={styles.beatInfo}>
              <Text style={[styles.beatTitle, { color: colors.text }]}>Today's Beat</Text>
              <Text style={[styles.beatSubtitle, { color: colors.textSecondary }]}>Ready for execution</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.navigate("/(tabs)/beat")}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={styles.actionButtonText}>View Beat</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      );
    }

    // Show distributor picker (either no selection, or user tapped switch)
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Distributor</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Choose a distributor to continue</Text>
        </View>
        <FlatList
          data={distributors}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 30 }]}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleDistributorPress(item.id)}
              style={({ pressed }) => [
                styles.distributorCard,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <View style={[styles.distributorIcon, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name="business-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.distributorInfo}>
                <Text style={[styles.distributorName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.location, { color: colors.textSecondary }]}>{item.location}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        />
      </View>
    );
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
        <View style={styles.headerText}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good morning</Text>
          <Text style={[styles.name, { color: colors.text }]}>Welcome 👋</Text>
        </View>

        <Pressable
          onPress={() => router.navigate("/profile")}
          hitSlop={12}
          style={({ pressed }) => [
            styles.profileButton,
            { opacity: pressed ? 0.55 : 1 },
          ]}
        >
          <Ionicons name="person-outline" size={27} color={colors.text} />
        </Pressable>
      </View>

      {/* DASHBOARD VIEW OR EMPTY STATE */}
      {renderContent()}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 30,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    fontSize: 13,
    fontWeight: "500",
  },

  name: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 2,
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    gap: 12,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 280,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  dashboardContainer: {
    flex: 1,
    paddingHorizontal: 22,
  },

  distributorSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },

  selectorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },

  beatCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
  },

  beatIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  beatInfo: {
    flex: 1,
  },

  beatTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  beatSubtitle: {
    fontSize: 13,
    marginTop: 3,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  sectionHeader: {
    paddingHorizontal: 22,
    paddingBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  sectionSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },

  listContent: {
    paddingHorizontal: 22,
    gap: 12,
  },

  distributorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  distributorIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  distributorInfo: {
    flex: 1,
  },

  distributorName: {
    fontSize: 16,
    fontWeight: "700",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },

  location: {
    fontSize: 12,
  },
});
