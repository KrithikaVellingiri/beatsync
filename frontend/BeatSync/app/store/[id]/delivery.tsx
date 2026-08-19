// app/store/[id]/delivery.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PaymentMethod, useBeat } from "../../../context/BeatContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

export default function DeliveryEntry() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { lang } = useLanguage();
  const {
    getStore,
    products,
    draftEntries,
    setDelivered,
    setReturned,
    paymentMethod,
    setPaymentMethod,
    amountCollected,
    setAmountCollected,
  } = useBeat();

  const store = getStore(id);
  const [showReturns, setShowReturns] = useState(false);

  if (!store) return null;

  const methods: { key: PaymentMethod; label: string }[] = [
    { key: "cash", label: lang === "en" ? "Cash" : "பணம்" },
    { key: "upi", label: "UPI" },
    { key: "credit", label: lang === "en" ? "Credit" : "கடன்" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 15, fontWeight: "600" }}>← Back</Text>
        </Pressable>
      </View>
      <Text style={[styles.storeName, { color: colors.text }]}>{store.name}</Text>
      <Text style={[styles.storeArea, { color: colors.textSecondary }]}>{store.area}</Text>

      {/* Deliver Products */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {lang === "en" ? "Deliver Products" : "பொருட்களை விநியோகி"}
        </Text>
        {products.map((p) => {
          const qty = draftEntries[p.id]?.delivered ?? 0;
          return (
            <View key={p.id} style={styles.productRow}>
              <View>
                <Text style={[styles.productName, { color: colors.text }]}>{p.name}</Text>
                <Text style={[styles.productUnit, { color: colors.textSecondary }]}>({p.unit})</Text>
              </View>
              <View style={styles.stepper}>
                <Pressable
                  style={[styles.stepBtn, { borderColor: colors.border }]}
                  onPress={() => setDelivered(p.id, qty - 1)}
                >
                  <Text style={[styles.stepBtnText, { color: colors.text }]}>−</Text>
                </Pressable>
                <Text style={[styles.stepValue, { color: colors.text }]}>{qty}</Text>
                <Pressable
                  style={[styles.stepBtn, { borderColor: colors.border }]}
                  onPress={() => setDelivered(p.id, qty + 1)}
                >
                  <Text style={[styles.stepBtnText, { color: colors.text }]}>+</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {/* Payment Collected */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {lang === "en" ? "Payment Collected" : "பணம் வசூலிக்கப்பட்டது"}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {lang === "en" ? "Method" : "முறை"}
        </Text>
        <View style={styles.methodRow}>
          {methods.map((m) => (
            <Pressable
              key={m.key}
              onPress={() => setPaymentMethod(m.key)}
              style={[
                styles.methodPill,
                {
                  borderColor: paymentMethod === m.key ? colors.primary : colors.border,
                  backgroundColor: paymentMethod === m.key ? colors.primary + "18" : "transparent",
                },
              ]}
            >
              <Text
                style={{
                  color: paymentMethod === m.key ? colors.primary : colors.textSecondary,
                  fontWeight: "700",
                  fontSize: 13,
                }}
              >
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
          {lang === "en" ? "Amount Received" : "பெறப்பட்ட தொகை"}
        </Text>
        <TextInput
          value={amountCollected ? String(amountCollected) : ""}
          onChangeText={(v) => setAmountCollected(Number(v.replace(/[^0-9]/g, "")) || 0)}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
      </View>

      {/* Products Returned */}
      <Pressable
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setShowReturns((v) => !v)}
      >
        <View style={styles.returnsHeaderRow}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {lang === "en" ? "Products Returned?" : "பொருட்கள் திரும்பப் பெறப்பட்டதா?"}
          </Text>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>{showReturns ? "−" : "+"}</Text>
        </View>
        {showReturns &&
          products.map((p) => {
            const qty = draftEntries[p.id]?.returned ?? 0;
            return (
              <View key={p.id} style={styles.productRow}>
                <Text style={[styles.productName, { color: colors.text }]}>{p.name}</Text>
                <View style={styles.stepper}>
                  <Pressable
                    style={[styles.stepBtn, { borderColor: colors.border }]}
                    onPress={() => setReturned(p.id, qty - 1)}
                  >
                    <Text style={[styles.stepBtnText, { color: colors.text }]}>−</Text>
                  </Pressable>
                  <Text style={[styles.stepValue, { color: colors.text }]}>{qty}</Text>
                  <Pressable
                    style={[styles.stepBtn, { borderColor: colors.border }]}
                    onPress={() => setReturned(p.id, qty + 1)}
                  >
                    <Text style={[styles.stepBtnText, { color: colors.text }]}>+</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={() => router.push(`/store/${store.id}/summary`)}
      >
        <Text style={styles.saveButtonText}>
          {lang === "en" ? "Save & Continue" : "சேமித்து தொடர்"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  headerRow: { marginBottom: 16 },
  storeName: { fontSize: 22, fontWeight: "800", letterSpacing: -0.4 },
  storeArea: { fontSize: 14, marginTop: 2, marginBottom: 20 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: "700", marginBottom: 14 },
  productRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  productName: { fontSize: 14.5, fontWeight: "600" },
  productUnit: { fontSize: 12, marginTop: 2 },
  stepper: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  stepBtnText: { fontSize: 18, fontWeight: "700" },
  stepValue: { fontSize: 16, fontWeight: "700", minWidth: 24, textAlign: "center" },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  methodRow: { flexDirection: "row", gap: 10 },
  methodPill: { flex: 1, borderWidth: 1.5, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  returnsHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  saveButton: { borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});