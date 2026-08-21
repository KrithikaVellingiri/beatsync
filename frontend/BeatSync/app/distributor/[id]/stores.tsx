import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBeat } from "../../../context/BeatContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";
import { Store } from "../../../constants/mockStores";

type Filter = "all" | "critical" | "outstanding" | "clear";

const STATUS_LABEL: Record<Store["status"], string> = {
  critical: "CRITICAL",
  clear: "CLEAR",
  collectFirst: "COLLECT FIRST",
};

export default function Stores() {
  const { colors } = useTheme();
  const { lang } = useLanguage();
  const { stores } = useBeat();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredStores = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stores.filter((store) => {
      const matchesSearch =
        query.length === 0 ||
        store.name.toLowerCase().includes(query) ||
        store.area.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "critical" && store.status === "critical") ||
        (filter === "outstanding" && store.outstanding > 0) ||
        (filter === "clear" && store.outstanding === 0);

      return matchesSearch && matchesFilter;
    });
  }, [stores, search, filter]);

  const getStatusColor = (store: Store) => {
    if (store.status === "critical") return colors.critical;
    if (store.status === "collectFirst") return colors.accent;
    return colors.success;
  };

  const filters: { key: Filter; label: string }[] = [
    {
      key: "all",
      label: lang === "en" ? "All" : "அனைத்தும்",
    },
    {
      key: "critical",
      label: lang === "en" ? "Critical" : "முக்கியம்",
    },
    {
      key: "outstanding",
      label: lang === "en" ? "Outstanding" : "நிலுவை",
    },
    {
      key: "clear",
      label: lang === "en" ? "Clear" : "தெளிவு",
    },
  ];

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
        <Text style={[styles.title, { color: colors.text }]}>
          {lang === "en" ? "Stores" : "கடைகள்"}
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {lang === "en"
            ? `${stores.length} stores`
            : `${stores.length} கடைகள்`}
        </Text>
      </View>

      {/* SEARCH */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={19}
          color={colors.textSecondary}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={
            lang === "en"
              ? "Search stores..."
              : "கடைகளைத் தேடுங்கள்..."
          }
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.text }]}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <Pressable
            onPress={() => setSearch("")}
            hitSlop={8}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {/* FILTERS */}
      {/* FILTERS */}
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.filterScroll}
  contentContainerStyle={styles.filterContent}
>
  {filters.map((item) => {
    const active = filter === item.key;

    return (
      <View key={item.key} style={styles.filterItem}>
        <Pressable
          onPress={() => setFilter(item.key)}
          style={[
            styles.filterPill,
            {
              backgroundColor: active
                ? colors.primary
                : colors.surface,
              borderColor: active
                ? colors.primary
                : colors.border,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            style={[
              styles.filterText,
              {
                color: active ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      </View>
    );
  })}
</ScrollView>
      {/* STORE LIST */}
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: insets.bottom + 90,
          },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="storefront-outline"
              size={42}
              color={colors.textSecondary}
            />

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {lang === "en"
                ? "No stores found"
                : "கடைகள் எதுவும் இல்லை"}
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                { color: colors.textSecondary },
              ]}
            >
              {lang === "en"
                ? "Try changing your search or filter."
                : "தேடல் அல்லது வடிகட்டியை மாற்றிப் பாருங்கள்."}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const statusColor = getStatusColor(item);

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
              <View style={styles.cardTopRow}>
                <View style={styles.storeInfo}>
                  <Text
                    style={[styles.storeName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <View style={styles.areaRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={colors.textSecondary}
                    />

                    <Text
                      style={[
                        styles.areaText,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {item.area}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${statusColor}18`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusColor },
                    ]}
                  />

                  <Text
                    style={[
                      styles.statusText,
                      { color: statusColor },
                    ]}
                  >
                    {item.done
                      ? "DONE"
                      : STATUS_LABEL[item.status]}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBottomRow}>
                <View>
                  {item.outstanding > 0 ? (
                    <>
                      <Text
                        style={[
                          styles.amount,
                          { color: colors.text },
                        ]}
                      >
                        ₹{item.outstanding.toLocaleString("en-IN")}
                      </Text>

                      <Text
                        style={[
                          styles.amountLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {lang === "en"
                          ? "outstanding"
                          : "நிலுவை"}
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.clearText,
                        { color: colors.success },
                      ]}
                    >
                      {lang === "en"
                        ? "Account clear"
                        : "கணக்கு தெளிவானது"}
                    </Text>
                  )}
                </View>

                <View style={styles.arrowContainer}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
              </View>

              {item.daysOverdue > 0 && (
                <View style={styles.overdueRow}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={statusColor}
                  />

                  <Text
                    style={[
                      styles.overdueText,
                      { color: statusColor },
                    ]}
                  >
                    {item.daysOverdue}{" "}
                    {lang === "en"
                      ? "days overdue"
                      : "நாட்கள் தாமதம்"}
                  </Text>
                </View>
              )}
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

  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },

  searchBox: {
    marginHorizontal: 22,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 9,
    paddingVertical: 0,
  },

  filterScroll: {
  marginTop: 14,
  marginBottom: 16,
},

filterContent: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 22,
  paddingRight: 30,
},

filterItem: {
  width: 108,
  height: 42,
  marginRight: 10,
  flexGrow: 0,
  flexShrink: 0,
},

filterPill: {
  width: "100%",
  height: "100%",
  borderWidth: 1,
  borderRadius: 22,
  alignItems: "center",
  justifyContent: "center",
  flexGrow: 0,
  flexShrink: 0,
},

filterText: {
  fontSize: 13,
  fontWeight: "700",
  textAlign: "center",
  includeFontPadding: false,
},

  listContent: {
    paddingHorizontal: 22,
    gap: 12,
  },

  storeCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 17,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  storeInfo: {
    flex: 1,
    paddingRight: 12,
  },

  storeName: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  areaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },

  areaText: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  cardBottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 18,
  },

  amount: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  amountLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 1,
  },

  clearText: {
    fontSize: 14,
    fontWeight: "700",
  },

  arrowContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  overdueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
    gap: 5,
  },

  overdueText: {
    fontSize: 11,
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 14,
  },

  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
    lineHeight: 19,
  },
});