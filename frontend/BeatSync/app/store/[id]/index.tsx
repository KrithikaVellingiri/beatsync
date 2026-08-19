// app/store/[id]/index.tsx
import { router, useLocalSearchParams } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useBeat } from "../../../context/BeatContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

export default function CreditGate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { lang } = useLanguage();
  const { getStore } = useBeat();
  const store = getStore(id);

  if (!store) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.text }}>Store not found</Text>
      </View>
    );
  }

  const isCritical = store.status === "critical";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "600" }}>← Back</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(`tel:${store.phone}`)}>
          <Text style={{ fontSize: 20 }}>📞</Text>
        </Pressable>
      </View>

      <Text style={[styles.storeName, { color: colors.text }]}>{store.name}</Text>
      <Text style={[styles.storeArea, { color: colors.textSecondary }]}>{store.area}</Text>

      {isCritical ? (
        <View style={[styles.warningCard, { backgroundColor: colors.criticalBg, borderColor: colors.critical }]}>
          <Text style={[styles.warningLabel, { color: colors.critical }]}>⚠ CRITICAL</Text>
          <Text style={[styles.warningAmount, { color: colors.critical }]}>
            ₹{store.outstanding.toLocaleString("en-IN")} outstanding
          </Text>
          <Text style={[styles.warningSub, { color: colors.critical }]}>
            {store.daysOverdue} days overdue
          </Text>
          <Text style={[styles.warningNote, { color: colors.critical }]}>
            {lang === "en" ? "Do not deliver without owner approval." : "உரிமையாளர் ஒப்புதல் இல்லாமல் விநியோகிக்க வேண்டாம்."}
          </Text>
        </View>
      ) : (
        <View style={[styles.infoCard, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
          <Text style={[styles.infoLabel, { color: colors.success }]}>
            {store.outstanding === 0
              ? lang === "en" ? "Account Clear" : "கணக்கு தெளிவானது"
              : lang === "en" ? "Outstanding" : "நிலுவை"}
          </Text>
          {store.outstanding > 0 && (
            <Text style={[styles.warningAmount, { color: colors.success }]}>
              ₹{store.outstanding.toLocaleString("en-IN")}
            </Text>
          )}
        </View>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.outlineButton,
            { borderColor: colors.primary, opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => Linking.openURL(`tel:${store.phone}`)}
        >
          <Text style={[styles.outlineButtonText, { color: colors.primary }]}>
            {lang === "en" ? "Call Owner" : "உரிமையாளரை அழை"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.solidButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.push(`/store/${store.id}/delivery`)}
        >
          <Text style={styles.solidButtonText}>
            {lang === "en" ? "View Store" : "கடையைப் பார்"}
          </Text>
        </Pressable>
      </View>

      <View style={[styles.insightCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.insightTitle, { color: colors.text }]}>
          {lang === "en" ? "Store Insight" : "கடை தகவல்"}
        </Text>
        {store.insights.map((insight, i) => (
          <View key={i} style={styles.insightRow}>
            <View style={[styles.insightDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>{insight}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  storeName: { fontSize: 24, fontWeight: "800", letterSpacing: -0.4 },
  storeArea: { fontSize: 14, marginTop: 2, marginBottom: 20 },
  warningCard: { borderRadius: 16, borderWidth: 1.5, padding: 18, marginBottom: 20 },
  warningLabel: { fontSize: 13, fontWeight: "800", marginBottom: 8, letterSpacing: 0.5 },
  warningAmount: { fontSize: 26, fontWeight: "800" },
  warningSub: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  warningNote: { fontSize: 13, fontWeight: "600", marginTop: 12 },
  infoCard: { borderRadius: 16, borderWidth: 1.5, padding: 18, marginBottom: 20 },
  infoLabel: { fontSize: 13, fontWeight: "800", letterSpacing: 0.5 },
  buttonRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  outlineButton: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  outlineButtonText: { fontWeight: "700", fontSize: 14 },
  solidButton: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  solidButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  insightCard: { borderRadius: 16, borderWidth: 1, padding: 18 },
  insightTitle: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  insightRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  insightDot: { width: 6, height: 6, borderRadius: 3, marginTop: 6, marginRight: 10 },
  insightText: { fontSize: 13.5, flex: 1, lineHeight: 19 },
});