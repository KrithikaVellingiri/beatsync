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
  const { distributors, selectDistributor } = useDistributor();
  const insets = useSafeAreaInsets();

  const handleDistributorPress = (id: string) => {
    const distributor = distributors.find((item) => item.id === id);

    if (!distributor) return;

    // Remember which distributor the user selected
    selectDistributor(distributor);

    // For now, open the distributor workspace
    router.push(`/distributor/${id}/beat`);
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
          <Text
            style={[
              styles.greeting,
              { color: colors.textSecondary },
            ]}
          >
            Good morning
          </Text>

          <Text
            style={[
              styles.name,
              { color: colors.text },
            ]}
          >
            Welcome 👋
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/profile")}
          hitSlop={12}
          style={({ pressed }) => [
            styles.profileButton,
            {
              opacity: pressed ? 0.55 : 1,
            },
          ]}
        >
          <Ionicons
            name="person-outline"
            size={27}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* TITLE */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          Your Distributors
        </Text>

        <Text
          style={[
            styles.sectionSubtitle,
            { color: colors.textSecondary },
          ]}
        >
          Manage the distributors you work with
        </Text>
      </View>

      {/* DISTRIBUTOR LIST */}
      {distributors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIcon,
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
            Add a distributor to start managing your
            beats and stores.
          </Text>

          <Pressable
            onPress={() => router.push("/settings/distributors")}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              Add Distributor
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={distributors}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + 30,
            },
          ]}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleDistributorPress(item.id)}
              style={({ pressed }) => [
                styles.distributorCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.82 : 1,
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
                  size={24}
                  color={colors.primary}
                />
              </View>

              <View style={styles.distributorInfo}>
                <Text
                  style={[
                    styles.distributorName,
                    { color: colors.text },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.textSecondary}
                  />

                  <Text
                    style={[
                      styles.location,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {item.location}
                  </Text>
                </View>

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

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        />
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
});