// app/store/[id]/summary.tsx
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useBeat } from "../../../context/BeatContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

export default function Summary() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { lang } = useLanguage();
  const { getStore, products, draftEntries, paymentMethod, amountCollected, completeVisit, getNextIncompleteStoreId } =
    useBeat();

  const store = getStore(id);
  if (!store) return null;

  const outstandingAfter = Math.max(0, store.outstanding - amountCollected);
  const deliveredItems = products.filter((p) => (draftEntries[p.id]?.delivered ?? 0) > 0);
  const returnedItems = products.filter((p) => (draftEntries[p.id]?.returned ?? 0) > 0);

  const handleComplete = () => {
    completeVisit(store.id);
    const nextId = getNextIncompleteStoreId(store.id);
    if (nextId) {
      router.replace(`/store/${nextId}`);
    } else {
      router.replace("/(tabs)/beat");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "600" }}>← Back</Text>
        </Pressable>
      </View>
      <Text style={[styles.storeName, { color: colors.text }]}>{store.name}</Text>
      <Text style={[styles.storeArea, { color: colors.textSecondary, marginBottom: 20 }]}>{store.area}</Text>

      <View style={[styles.confirmBanner, { backgroundColor: colors.successBg, borderColor: colors.success }]}>
        <Text style={{ fontSize: 18 }}>✅</Text>
        <View style={{ marginLeft: 10 }}>
          <Text style={[styles.confirmTitle, { color: colors.success }]}>
            {lang === "en" ? "Delivery Recorded" : "விநியோகம் பதிவு செய்யப்பட்டது"}
          </Text>
          <Text style={[styles.confirmSub, { color: colors.success }]}>
            {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {lang === "en" ? "Delivered" : "விநியோகிக்கப்பட்டது"}
        </Text>
        {deliveredItems.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {lang === "en" ? "No items delivered" : "பொருட்கள் இல்லை"}
          </Text>
        ) : (
          deliveredItems.map((p) => (
            <View key={p.id} style={styles.rowBetween}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                {p.name} ({p.unit})
              </Text>
              <Text style={[styles.rowValue, { color: colors.text }]}>{draftEntries[p.id]?.delivered}</Text>
            </View>
          ))
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          {lang === "en" ? "Collected" : "வசூலிக்கப்பட்டது"}
        </Text>
        <View style={styles.rowBetween}>
          <Text style={[styles.rowValue, { color: colors.text, fontSize: 18 }]}>
            ₹{amountCollected.toLocaleString("en-IN")}
          </Text>
          <Text style={[styles.methodTag, { color: colors.primary, borderColor: colors.primary }]}>
            {paymentMethod.toUpperCase()}
          </Text>
        </View>

        {returnedItems.length > 0 && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              {lang === "en" ? "Returns" : "திரும்பியவை"}
            </Text>
            {returnedItems.map((p) => (
              <View key={p.id} style={styles.rowBetween}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  {p.name} ({p.unit})
                </Text>
                <Text style={[styles.rowValue, { color: colors.text }]}>{draftEntries[p.id]?.returned}</Text>
              </View>
            ))}
          </>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.rowBetween}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginBottom: 0 }]}>
            {lang === "en" ? "Outstanding After Transaction" : "பரிவர்த்தனைக்குப் பின் நிலுவை"}
          </Text>
          <Text style={[styles.outstandingValue, { color: outstandingAfter > 0 ? colors.critical : colors.success }]}>
            ₹{outstandingAfter.toLocaleString("en-IN")}
          </Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.completeButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>
          {lang === "en" ? "Complete & Next Store" : "முடித்து அடுத்த கடை"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 16 },
  storeName: { fontSize: 22, fontWeight: "800", letterSpacing: -0.4 },
  storeArea: { fontSize: 14, marginTop: 2 },
  confirmBanner: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16 },
  confirmTitle: { fontSize: 15, fontWeight: "700" },
  confirmSub: { fontSize: 12, marginTop: 2 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18 },
  sectionLabel: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  emptyText: { fontSize: 13, fontStyle: "italic" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  rowLabel: { fontSize: 14, fontWeight: "600" },
  rowValue: { fontSize: 15, fontWeight: "700" },
  divider: { height: 1, marginVertical: 14 },
  methodTag: { fontSize: 11, fontWeight: "800", borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  outstandingValue: { fontSize: 20, fontWeight: "800" },
  completeButton: { borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 20 },
  completeButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});