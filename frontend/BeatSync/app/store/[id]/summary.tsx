import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useBeat } from "../../../context/BeatContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

type DeliveryItem = {
  id: string;
  name: string;
  unit: string;
  quantity: number;
};

export default function Summary() {
  const params = useLocalSearchParams<{
    id: string;
    deliveredItems?: string;
    returnedItems?: string;
  }>();

  const { colors } = useTheme();
  const { lang } = useLanguage();

  const {
    getStore,
    paymentMethod,
    amountCollected,
    completeVisit,
    getNextIncompleteStoreId,
  } = useBeat();

  const store = getStore(params.id);

  const deliveredItems: DeliveryItem[] = useMemo(() => {
    try {
      return params.deliveredItems
        ? JSON.parse(params.deliveredItems)
        : [];
    } catch {
      return [];
    }
  }, [params.deliveredItems]);

  const returnedItems: DeliveryItem[] = useMemo(() => {
    try {
      return params.returnedItems
        ? JSON.parse(params.returnedItems)
        : [];
    } catch {
      return [];
    }
  }, [params.returnedItems]);

  if (!store) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Ionicons
          name="storefront-outline"
          size={42}
          color={colors.textSecondary}
        />

        <Text style={[styles.notFound, { color: colors.text }]}>
          Store not found
        </Text>
      </View>
    );
  }

  const outstandingAfter = Math.max(
    0,
    store.outstanding - amountCollected
  );

  const paymentLabel =
    paymentMethod === "upi"
      ? "UPI"
      : paymentMethod === "credit"
        ? lang === "en"
          ? "Credit"
          : "கடன்"
        : lang === "en"
          ? "Cash"
          : "பணம்";

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
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={10}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </Pressable>

          <View>
            <Text
              style={[styles.headerTitle, { color: colors.text }]}
            >
              {lang === "en"
                ? "Transaction Summary"
                : "பரிவர்த்தனை சுருக்கம்"}
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              {lang === "en"
                ? "Review before completing"
                : "முடிப்பதற்கு முன் சரிபார்க்கவும்"}
            </Text>
          </View>
        </View>

        {/* STORE */}
        <View style={styles.storeHeader}>
          <Text
            style={[styles.storeName, { color: colors.text }]}
          >
            {store.name}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={15}
              color={colors.textSecondary}
            />

            <Text
              style={[
                styles.locationText,
                { color: colors.textSecondary },
              ]}
            >
              {store.area}
            </Text>
          </View>
        </View>

        {/* SUCCESS BANNER */}
        <View
          style={[
            styles.successBanner,
            {
              backgroundColor: colors.successBg,
              borderColor: colors.success,
            },
          ]}
        >
          <View
            style={[
              styles.successIcon,
              { backgroundColor: `${colors.success}18` },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={23}
              color={colors.success}
            />
          </View>

          <View style={styles.successContent}>
            <Text
              style={[
                styles.successTitle,
                { color: colors.success },
              ]}
            >
              {lang === "en"
                ? "Delivery Recorded"
                : "விநியோகம் பதிவு செய்யப்பட்டது"}
            </Text>

            <Text
              style={[
                styles.successSubtitle,
                { color: colors.success },
              ]}
            >
              {new Date().toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Text>
          </View>
        </View>

        {/* TRANSACTION CARD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* DELIVERED */}
          <View style={styles.sectionHeader}>
            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text },
                ]}
              >
                {lang === "en"
                  ? "Delivered"
                  : "விநியோகிக்கப்பட்டது"}
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {deliveredItems.length}{" "}
                {lang === "en"
                  ? "product types"
                  : "பொருட்கள்"}
              </Text>
            </View>

            <View
              style={[
                styles.sectionIcon,
                { backgroundColor: `${colors.primary}12` },
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={18}
                color={colors.primary}
              />
            </View>
          </View>

          {deliveredItems.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text
                style={[
                  styles.emptyText,
                  { color: colors.textSecondary },
                ]}
              >
                {lang === "en"
                  ? "No products recorded"
                  : "பொருட்கள் பதிவு செய்யப்படவில்லை"}
              </Text>
            </View>
          ) : (
            deliveredItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.productRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <View style={styles.productInfo}>
                  <Text
                    style={[
                      styles.productName,
                      { color: colors.text },
                    ]}
                  >
                    {item.name}
                  </Text>

                  {item.unit.length > 0 && (
                    <Text
                      style={[
                        styles.productUnit,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {item.unit}
                    </Text>
                  )}
                </View>

                <View
                  style={[
                    styles.quantityBadge,
                    { backgroundColor: colors.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.quantityText,
                      { color: colors.text },
                    ]}
                  >
                    {item.quantity}
                  </Text>
                </View>
              </View>
            ))
          )}

          {/* DIVIDER */}
          <View
            style={[
              styles.divider,
              { backgroundColor: colors.border },
            ]}
          />

          {/* COLLECTED */}
          <View style={styles.sectionHeader}>
            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text },
                ]}
              >
                {lang === "en"
                  ? "Collected"
                  : "வசூலிக்கப்பட்டது"}
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {paymentLabel}
              </Text>
            </View>

            <View
              style={[
                styles.paymentIcon,
                { backgroundColor: `${colors.primary}12` },
              ]}
            >
              <Ionicons
                name={
                  paymentMethod === "cash"
                    ? "cash-outline"
                    : paymentMethod === "upi"
                      ? "phone-portrait-outline"
                      : "card-outline"
                }
                size={18}
                color={colors.primary}
              />
            </View>
          </View>

          <View style={styles.amountRow}>
            <Text
              style={[
                styles.amountLabel,
                { color: colors.textSecondary },
              ]}
            >
              {lang === "en"
                ? "Amount received"
                : "பெறப்பட்ட தொகை"}
            </Text>

            <Text
              style={[
                styles.collectedAmount,
                { color: colors.text },
              ]}
            >
              ₹{amountCollected.toLocaleString("en-IN")}
            </Text>
          </View>

          {/* RETURNS */}
          {returnedItems.length > 0 && (
            <>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border },
                ]}
              />

              <View style={styles.sectionHeader}>
                <View>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.text },
                    ]}
                  >
                    {lang === "en"
                      ? "Returns"
                      : "திரும்பியவை"}
                  </Text>

                  <Text
                    style={[
                      styles.sectionSubtitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {returnedItems.length}{" "}
                    {lang === "en"
                      ? "items returned"
                      : "பொருட்கள்"}
                  </Text>
                </View>

                <Ionicons
                  name="return-down-back-outline"
                  size={19}
                  color={colors.textSecondary}
                />
              </View>

              {returnedItems.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.productRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View style={styles.productInfo}>
                    <Text
                      style={[
                        styles.productName,
                        { color: colors.text },
                      ]}
                    >
                      {item.name}
                    </Text>

                    {item.unit.length > 0 && (
                      <Text
                        style={[
                          styles.productUnit,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item.unit}
                      </Text>
                    )}
                  </View>

                  <View
                    style={[
                      styles.quantityBadge,
                      { backgroundColor: colors.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.quantityText,
                        { color: colors.text },
                      ]}
                    >
                      {item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* OUTSTANDING */}
          <View
            style={[
              styles.outstandingBox,
              {
                backgroundColor:
                  outstandingAfter > 0
                    ? colors.criticalBg
                    : colors.successBg,
                borderColor:
                  outstandingAfter > 0
                    ? colors.critical
                    : colors.success,
              },
            ]}
          >
            <View style={styles.outstandingLeft}>
              <Ionicons
                name={
                  outstandingAfter > 0
                    ? "alert-circle-outline"
                    : "checkmark-circle-outline"
                }
                size={22}
                color={
                  outstandingAfter > 0
                    ? colors.critical
                    : colors.success
                }
              />

              <View style={styles.outstandingTextContainer}>
                <Text
                  style={[
                    styles.outstandingTitle,
                    {
                      color:
                        outstandingAfter > 0
                          ? colors.critical
                          : colors.success,
                    },
                  ]}
                >
                  {lang === "en"
                    ? "Outstanding After Transaction"
                    : "பரிவர்த்தனைக்குப் பின் நிலுவை"}
                </Text>

                <Text
                  style={[
                    styles.outstandingSubtitle,
                    {
                      color:
                        outstandingAfter > 0
                          ? colors.critical
                          : colors.success,
                    },
                  ]}
                >
                  {outstandingAfter > 0
                    ? lang === "en"
                      ? "Payment is still pending"
                      : "பணம் இன்னும் நிலுவையில் உள்ளது"
                    : lang === "en"
                      ? "Account is clear"
                      : "கணக்கு தெளிவானது"}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.outstandingAmount,
                {
                  color:
                    outstandingAfter > 0
                      ? colors.critical
                      : colors.success,
                },
              ]}
            >
              ₹{outstandingAfter.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* COMPLETE */}
        <Pressable
          onPress={handleComplete}
          style={({ pressed }) => [
            styles.completeButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.82 : 1,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.completeText}>
            {lang === "en"
              ? "Complete & Next Store"
              : "முடித்து அடுத்த கடை"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 45,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  notFound: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
  },

  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  storeHeader: {
    marginBottom: 20,
  },

  storeName: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },

  locationText: {
    fontSize: 13,
  },

  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  successIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  successContent: {
    flex: 1,
    marginLeft: 11,
  },

  successTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  successSubtitle: {
    fontSize: 11.5,
    marginTop: 3,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 17,
    marginBottom: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 11.5,
    marginTop: 3,
  },

  sectionIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
  },

  productInfo: {
    flex: 1,
    paddingRight: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: "700",
  },

  productUnit: {
    fontSize: 11.5,
    marginTop: 3,
  },

  quantityBadge: {
    minWidth: 42,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  quantityText: {
    fontSize: 14,
    fontWeight: "800",
  },

  emptyRow: {
    paddingVertical: 12,
  },

  emptyText: {
    fontSize: 13,
    fontStyle: "italic",
  },

  divider: {
    height: 1,
    marginVertical: 18,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  amountLabel: {
    fontSize: 12.5,
    fontWeight: "600",
  },

  collectedAmount: {
    fontSize: 21,
    fontWeight: "800",
  },

  outstandingBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  outstandingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },

  outstandingTextContainer: {
    flex: 1,
    marginLeft: 9,
  },

  outstandingTitle: {
    fontSize: 12,
    fontWeight: "800",
  },

  outstandingSubtitle: {
    fontSize: 10.5,
    marginTop: 3,
  },

  outstandingAmount: {
    fontSize: 20,
    fontWeight: "800",
  },

  completeButton: {
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  completeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});