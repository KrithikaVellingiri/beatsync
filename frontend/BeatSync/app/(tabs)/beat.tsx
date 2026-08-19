// app/(tabs)/beat.tsx
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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
  const { t, lang } = useLanguage();
  const { stores } = useBeat();

  const done = stores.filter((s) => s.done).length;
  const total = stores.length;

  const statusColor = (status: Store["status"]) => {
    if (status === "critical") return colors.critical;
    if (status === "collectFirst") return colors.accent;
    return colors.success;
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>{t("goodMorning")}</Text>
        <Text style={[styles.name, { color: colors.text }]}>Raju 👋</Text>
      </View>

      <View style={[styles.trailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.trailTopRow}>
          <Text style={[styles.trailTitle, { color: colors.text }]}>{t("todaysBeat")}</Text>
          <Text style={[styles.trailCount, { color: colors.primary }]}>
            {done} / {total}
          </Text>
        </View>
        <View style={styles.dotsRow}>
          {stores.map((s, i) => (
            <View key={s.id} style={styles.dotWrap}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: s.done ? colors.success : colors.surfaceAlt,
                    borderColor: s.done ? colors.success : colors.border,
                  },
                ]}
              />
              {i < stores.length - 1 && (
                <View style={[styles.dotConnector, { backgroundColor: s.done ? colors.success : colors.border }]} />
              )}
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/store/${item.id}`)}
            style={({ pressed }) => [
              styles.storeCard,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: item.done ? 0.5 : pressed ? 0.85 : 1 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.storeName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.storeArea, { color: colors.textSecondary }]}>{item.area}</Text>
              <Text style={[styles.outstanding, { color: colors.text }]}>
                ₹{item.outstanding.toLocaleString("en-IN")} outstanding
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: (item.done ? colors.success : statusColor(item.status)) + "22" }]}>
              <Text style={[styles.badgeText, { color: item.done ? colors.success : statusColor(item.status) }]}>
                {item.done ? "DONE" : STATUS_LABEL[item.status]}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  greeting: { fontSize: 14, fontWeight: "600" },
  name: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginTop: 2 },
  trailCard: { marginHorizontal: 20, marginBottom: 16, borderRadius: 18, borderWidth: 1, padding: 16 },
  trailTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  trailTitle: { fontSize: 16, fontWeight: "700" },
  trailCount: { fontSize: 16, fontWeight: "800" },
  dotsRow: { flexDirection: "row", alignItems: "center" },
  dotWrap: { flexDirection: "row", alignItems: "center", flex: 1 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
  dotConnector: { flex: 1, height: 2, marginHorizontal: 2 },
  storeCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 16 },
  storeName: { fontSize: 16, fontWeight: "700" },
  storeArea: { fontSize: 13, marginTop: 2 },
  outstanding: { fontSize: 14, fontWeight: "700", marginTop: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: "800" },
});