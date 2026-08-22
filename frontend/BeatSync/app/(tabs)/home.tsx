import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

  const handleDistributorPress = async (id: string) => {
    const distributor = distributors.find((item) => item.id === id);
    if (!distributor) return;
    await selectDistributor(distributor);
    router.push("/(tabs)/beat");
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
      {distributors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="business-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No distributors yet</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Add a distributor to start managing your beats and stores.
          </Text>
          <Pressable
            onPress={() => router.push("/settings/distributors")}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Join a Distributor</Text>
          </Pressable>
        </View>
      ) : selectedDistributor ? (
        <View style={styles.dashboardContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>Today's Work</Text>
          
          <Pressable
            onPress={() => {
              // Option to change distributor if there are multiple
              if (distributors.length > 1) {
                // In a real app, open a modal. For now, clear selection to show list.
                selectDistributor(null as any);
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
            onPress={() => router.push("/beat")}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={styles.actionButtonText}>View Beat</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : (
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
      )}
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
    fontSize: 15,
    fontWeight: "600",
  },

  name: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.8,
  },

  profileButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeader: {
    paddingHorizontal: 22,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  sectionSubtitle: {
    fontSize: 13,
    marginTop: 5,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 60,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 16,
    marginTop: 24,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  listContent: {
    paddingHorizontal: 22,
    gap: 14,
  },

  distributorCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
  },

  distributorIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  distributorInfo: {
    flex: 1,
  },

  distributorName: {
    fontSize: 17,
    fontWeight: "700",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },

  location: {
    fontSize: 13,
  },

  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  activeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  dashboardContainer: {
    flex: 1,
    paddingHorizontal: 22,
  },

  distributorSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    marginBottom: 24,
  },

  selectorText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },

  beatCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },

  beatIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  beatInfo: {
    flex: 1,
  },

  beatTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  beatSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 16,
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});