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

import { useBeat } from "../../context/BeatContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { Store } from "../../constants/mockStores";

const STATUS_LABEL: Record<Store["status"], string> = {
  critical: "CRITICAL",
  clear: "CLEAR",
  collectFirst: "COLLECT FIRST",
};

export default function Beat() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { stores } = useBeat();
  const insets = useSafeAreaInsets();

  const done = stores.filter((store) => store.done).length;
  const total = stores.length;

  const statusColor = (status: Store["status"]) => {
    if (status === "critical") {
      return colors.critical;
    }

    if (status === "collectFirst") {
      return colors.accent;
    }

    return colors.success;
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
      {/* =========================
          HEADER
      ========================== */}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text
            style={[
              styles.greeting,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {t("goodMorning")}
          </Text>

          <Text
            style={[
              styles.name,
              {
                color: colors.text,
              },
            ]}
          >
            Raju 👋
          </Text>
        </View>

        {/* PROFILE */}

        <Pressable
          onPress={() => router.push("/profile")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
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

      {/* =========================
          TODAY'S BEAT
      ========================== */}

      <View
        style={[
          styles.trailCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.trailTopRow}>
          <View>
            <Text
              style={[
                styles.trailTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {t("todaysBeat")}
            </Text>

            <Text
              style={[
                styles.trailSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {done === total
                ? "All stores completed"
                : `${total - done} stores remaining`}
            </Text>
          </View>

          <Text
            style={[
              styles.trailCount,
              {
                color: colors.primary,
              },
            ]}
          >
            {done}/{total}
          </Text>
        </View>

        {/* PROGRESS BAR */}

        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: colors.surfaceAlt,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width:
                  total > 0
                    ? `${(done / total) * 100}%`
                    : "0%",
              },
            ]}
          />
        </View>
      </View>

      {/* =========================
          STORE LIST
      ========================== */}

      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: insets.bottom + 90,
          },
        ]}
        renderItem={({ item }) => {
          const currentStatusColor = item.done
            ? colors.success
            : statusColor(item.status);

          return (
            <Pressable
              onPress={() => router.push(`/store/${item.id}`)}
              style={({ pressed }) => [
                styles.storeCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.82 : 1,
                },
              ]}
            >
              {/* STORE INFORMATION */}

              <View style={styles.storeInfo}>
                <Text
                  style={[
                    styles.storeName,
                    {
                      color: colors.text,
                    },
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
                      styles.storeArea,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.area}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.outstanding,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  ₹{item.outstanding.toLocaleString("en-IN")}

                  <Text
                    style={[
                      styles.outstandingLabel,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {" "}
                    outstanding
                  </Text>
                </Text>
              </View>

              {/* STATUS */}

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: `${currentStatusColor}18`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: currentStatusColor,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.badgeText,
                    {
                      color: currentStatusColor,
                    },
                  ]}
                >
                  {item.done
                    ? "DONE"
                    : STATUS_LABEL[item.status]}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  /* =========================
     HEADER
  ========================== */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  name: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginTop: 4,
  },

  profileButton: {
    width: 48,
    height: 48,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 12,
  },

  /* =========================
     TODAY'S BEAT
  ========================== */

  trailCard: {
    marginHorizontal: 22,
    marginBottom: 20,

    borderRadius: 22,
    borderWidth: 1,

    paddingHorizontal: 20,
    paddingVertical: 19,
  },

  trailTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  trailTitle: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  trailSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },

  trailCount: {
    fontSize: 22,
    fontWeight: "800",
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 19,
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  /* =========================
     LIST
  ========================== */

  list: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 22,
    gap: 14,
  },

  /* =========================
     STORE CARD
  ========================== */

  storeCard: {
    flexDirection: "row",
    alignItems: "center",

    minHeight: 126,

    borderRadius: 20,
    borderWidth: 1,

    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  storeInfo: {
    flex: 1,
    paddingRight: 12,
  },

  storeName: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  storeArea: {
    fontSize: 13,
    fontWeight: "500",
  },

  outstanding: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 13,
  },

  outstandingLabel: {
    fontSize: 13,
    fontWeight: "500",
  },

  /* =========================
     STATUS
  ========================== */

  badge: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 10,
    paddingVertical: 8,

    borderRadius: 10,

    maxWidth: 125,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});