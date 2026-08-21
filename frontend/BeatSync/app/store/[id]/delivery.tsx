import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  PaymentMethod,
  useBeat,
} from "../../../context/BeatContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

type DeliveryItem = {
  id: string;
  name: string;
  unit: string;
  quantity: number;
};

export default function DeliveryEntry() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { colors } = useTheme();
  const { lang } = useLanguage();

  const {
    getStore,
    paymentMethod,
    setPaymentMethod,
    amountCollected,
    setAmountCollected,
  } = useBeat();

  const store = getStore(id);

  const [items, setItems] = useState<DeliveryItem[]>([
    {
      id: Date.now().toString(),
      name: "",
      unit: "",
      quantity: 0,
    },
  ]);

  const [returns, setReturns] = useState<DeliveryItem[]>([]);
  const [showReturns, setShowReturns] = useState(false);

  if (!store) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <Ionicons
          name="storefront-outline"
          size={42}
          color={colors.textSecondary}
        />

        <Text
          style={[
            styles.notFoundText,
            { color: colors.text },
          ]}
        >
          {lang === "en"
            ? "Store not found"
            : "கடை கிடைக்கவில்லை"}
        </Text>
      </View>
    );
  }

  const methods: {
    key: PaymentMethod;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      key: "cash",
      label: lang === "en" ? "Cash" : "பணம்",
      icon: "cash-outline",
    },
    {
      key: "upi",
      label: "UPI",
      icon: "phone-portrait-outline",
    },
    {
      key: "credit",
      label: lang === "en" ? "Credit" : "கடன்",
      icon: "card-outline",
    },
  ];

  const updateItem = (
    itemId: string,
    field: keyof DeliveryItem,
    value: string
  ) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;

        if (field === "quantity") {
          return {
            ...item,
            quantity:
              Number(value.replace(/[^0-9]/g, "")) || 0,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        name: "",
        unit: "",
        quantity: 0,
      },
    ]);
  };

  const removeItem = (itemId: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== itemId)
    );
  };

  const updateReturn = (
    itemId: string,
    field: keyof DeliveryItem,
    value: string
  ) => {
    setReturns((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;

        if (field === "quantity") {
          return {
            ...item,
            quantity:
              Number(value.replace(/[^0-9]/g, "")) || 0,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  const addReturn = () => {
    setReturns((current) => [
      ...current,
      {
        id: `${Date.now()}-return-${current.length}`,
        name: "",
        unit: "",
        quantity: 0,
      },
    ]);
  };

  const removeReturn = (itemId: string) => {
    setReturns((current) =>
      current.filter((item) => item.id !== itemId)
    );
  };

  const handleContinue = () => {
  const validItems = items.filter(
    (item) =>
      item.name.trim().length > 0 &&
      item.quantity > 0
  );

  const validReturns = returns.filter(
    (item) =>
      item.name.trim().length > 0 &&
      item.quantity > 0
  );

  router.push({
    pathname: "/store/[id]/summary",
    params: {
      id: store.id,
      deliveredItems: JSON.stringify(validItems),
      returnedItems: JSON.stringify(validReturns),
    },
  });
};

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.bg },
      ]}
    >
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

          <View style={styles.headerTextContainer}>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.text },
              ]}
            >
              {lang === "en"
                ? "Delivery"
                : "விநியோகம்"}
            </Text>

            <Text
              style={[
                styles.headerSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              {lang === "en"
                ? "Record today's delivery"
                : "இன்றைய விநியோகத்தை பதிவு செய்யுங்கள்"}
            </Text>
          </View>
        </View>

        {/* STORE */}
        <View style={styles.storeHeader}>
          <Text
            style={[
              styles.storeName,
              { color: colors.text },
            ]}
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

        {/* PRODUCTS DELIVERED */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* FIXED HEADER */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderContent}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text },
                ]}
              >
                {lang === "en"
                  ? "Products Delivered"
                  : "விநியோகிக்கப்பட்ட பொருட்கள்"}
              </Text>

              <Text
                style={[
                  styles.cardSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {lang === "en"
                  ? "Enter the products delivered at this store."
                  : "இந்த கடையில் வழங்கப்பட்ட பொருட்களை உள்ளிடவும்."}
              </Text>
            </View>

            <View
              style={[
                styles.countBadge,
                {
                  backgroundColor: `${colors.primary}15`,
                },
              ]}
            >
              <Text
                style={[
                  styles.countBadgeText,
                  { color: colors.primary },
                ]}
              >
                {items.length}
              </Text>
            </View>
          </View>

          {/* PRODUCT ITEMS */}
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.productBox,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.bg,
                },
              ]}
            >
              <View style={styles.productBoxHeader}>
                <Text
                  style={[
                    styles.productNumber,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  PRODUCT {index + 1}
                </Text>

                {items.length > 1 && (
                  <Pressable
                    onPress={() =>
                      removeItem(item.id)
                    }
                    hitSlop={8}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={17}
                      color={colors.critical}
                    />
                  </Pressable>
                )}
              </View>

              <TextInput
                value={item.name}
                onChangeText={(value) =>
                  updateItem(
                    item.id,
                    "name",
                    value
                  )
                }
                placeholder={
                  lang === "en"
                    ? "Product name"
                    : "பொருளின் பெயர்"
                }
                placeholderTextColor={
                  colors.textSecondary
                }
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor:
                      colors.surface,
                  },
                ]}
              />

              <View style={styles.inputRow}>
                <TextInput
                  value={item.unit}
                  onChangeText={(value) =>
                    updateItem(
                      item.id,
                      "unit",
                      value
                    )
                  }
                  placeholder={
                    lang === "en"
                      ? "Unit (box)"
                      : "அலகு"
                  }
                  placeholderTextColor={
                    colors.textSecondary
                  }
                  style={[
                    styles.unitInput,
                    {
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor:
                        colors.surface,
                    },
                  ]}
                />

                <TextInput
                  value={
                    item.quantity > 0
                      ? String(item.quantity)
                      : ""
                  }
                  onChangeText={(value) =>
                    updateItem(
                      item.id,
                      "quantity",
                      value
                    )
                  }
                  placeholder="Qty"
                  placeholderTextColor={
                    colors.textSecondary
                  }
                  keyboardType="number-pad"
                  style={[
                    styles.quantityInput,
                    {
                      color: colors.text,
                      borderColor: colors.border,
                      backgroundColor:
                        colors.surface,
                    },
                  ]}
                />
              </View>
            </View>
          ))}

          <Pressable
            onPress={addItem}
            style={[
              styles.addButton,
              {
                borderColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="add-circle-outline"
              size={19}
              color={colors.primary}
            />

            <Text
              style={[
                styles.addButtonText,
                { color: colors.primary },
              ]}
            >
              {lang === "en"
                ? "Add another product"
                : "மற்றொரு பொருளைச் சேர்க்கவும்"}
            </Text>
          </Pressable>
        </View>

        {/* PAYMENT */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            {lang === "en"
              ? "Payment Collected"
              : "பணம் வசூலிக்கப்பட்டது"}
          </Text>

          <Text
            style={[
              styles.cardSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {lang === "en"
              ? "Select how the payment was received."
              : "பணம் பெறப்பட்ட முறையைத் தேர்வு செய்யவும்."}
          </Text>

          <View style={styles.methodGrid}>
            {methods.map((method) => {
              const active =
                paymentMethod === method.key;

              return (
                <Pressable
                  key={method.key}
                  onPress={() =>
                    setPaymentMethod(method.key)
                  }
                  style={[
                    styles.methodButton,
                    {
                      borderColor: active
                        ? colors.primary
                        : colors.border,
                      backgroundColor: active
                        ? `${colors.primary}12`
                        : colors.surface,
                    },
                  ]}
                >
                  <Ionicons
                    name={method.icon}
                    size={19}
                    color={
                      active
                        ? colors.primary
                        : colors.textSecondary
                    }
                  />

                  <Text
                    style={{
                      color: active
                        ? colors.primary
                        : colors.text,
                      fontSize: 13,
                      fontWeight: "700",
                      marginTop: 5,
                    }}
                  >
                    {method.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* UPI */}
          {paymentMethod === "upi" && (
            <View
              style={[
                styles.paymentInfo,
                {
                  backgroundColor:
                    `${colors.primary}0C`,
                  borderColor:
                    `${colors.primary}30`,
                },
              ]}
            >
              <Ionicons
                name="qr-code-outline"
                size={22}
                color={colors.primary}
              />

              <View
                style={styles.paymentInfoContent}
              >
                <Text
                  style={[
                    styles.paymentInfoTitle,
                    { color: colors.text },
                  ]}
                >
                  {lang === "en"
                    ? "UPI payment"
                    : "UPI பணம்"}
                </Text>

                <Text
                  style={[
                    styles.paymentInfoText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {lang === "en"
                    ? "QR payment will be connected when the backend payment service is integrated."
                    : "Backend payment service இணைக்கப்பட்டதும் QR payment செயல்படுத்தப்படும்."}
                </Text>
              </View>
            </View>
          )}

          {/* CREDIT */}
          {paymentMethod === "credit" && (
            <View
              style={[
                styles.paymentInfo,
                {
                  backgroundColor:
                    `${colors.accent}0C`,
                  borderColor:
                    `${colors.accent}30`,
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.accent}
              />

              <View
                style={styles.paymentInfoContent}
              >
                <Text
                  style={[
                    styles.paymentInfoTitle,
                    { color: colors.text },
                  ]}
                >
                  {lang === "en"
                    ? "Credit transaction"
                    : "கடன் பரிவர்த்தனை"}
                </Text>

                <Text
                  style={[
                    styles.paymentInfoText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  {lang === "en"
                    ? "The outstanding balance will be updated after the transaction is completed."
                    : "பரிவர்த்தனை முடிந்ததும் நிலுவைத் தொகை புதுப்பிக்கப்படும்."}
                </Text>
              </View>
            </View>
          )}

          <Text
            style={[
              styles.amountLabel,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {lang === "en"
              ? "Amount received"
              : "பெறப்பட்ட தொகை"}
          </Text>

          <View
            style={[
              styles.amountInputWrapper,
              {
                borderColor: colors.border,
                backgroundColor: colors.bg,
              },
            ]}
          >
            <Text
              style={[
                styles.rupee,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              ₹
            </Text>

            <TextInput
              value={
                amountCollected
                  ? String(amountCollected)
                  : ""
              }
              onChangeText={(value) =>
                setAmountCollected(
                  Number(
                    value.replace(/[^0-9]/g, "")
                  ) || 0
                )
              }
              placeholder="0"
              placeholderTextColor={
                colors.textSecondary
              }
              keyboardType="number-pad"
              style={[
                styles.amountInput,
                { color: colors.text },
              ]}
            />
          </View>
        </View>

        {/* RETURNS */}
        <Pressable
          onPress={() =>
            setShowReturns((value) => !value)
          }
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.returnsHeader}>
            <View>
              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.text },
                ]}
              >
                {lang === "en"
                  ? "Products Returned"
                  : "திரும்பிய பொருட்கள்"}
              </Text>

              <Text
                style={[
                  styles.cardSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {lang === "en"
                  ? "Optional"
                  : "விருப்பத்திற்குரியது"}
              </Text>
            </View>

            <Ionicons
              name={
                showReturns
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={21}
              color={colors.textSecondary}
            />
          </View>

          {showReturns && (
            <View style={styles.returnContent}>
              {returns.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.productBox,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.bg,
                    },
                  ]}
                >
                  <View
                    style={styles.productBoxHeader}
                  >
                    <Text
                      style={[
                        styles.productNumber,
                        {
                          color:
                            colors.textSecondary,
                        },
                      ]}
                    >
                      RETURN {index + 1}
                    </Text>

                    <Pressable
                      onPress={() =>
                        removeReturn(item.id)
                      }
                      hitSlop={8}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color={colors.critical}
                      />
                    </Pressable>
                  </View>

                  <TextInput
                    value={item.name}
                    onChangeText={(value) =>
                      updateReturn(
                        item.id,
                        "name",
                        value
                      )
                    }
                    placeholder="Product name"
                    placeholderTextColor={
                      colors.textSecondary
                    }
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        borderColor: colors.border,
                        backgroundColor:
                          colors.surface,
                      },
                    ]}
                  />

                  <View style={styles.inputRow}>
                    <TextInput
                      value={item.unit}
                      onChangeText={(value) =>
                        updateReturn(
                          item.id,
                          "unit",
                          value
                        )
                      }
                      placeholder="Unit"
                      placeholderTextColor={
                        colors.textSecondary
                      }
                      style={[
                        styles.unitInput,
                        {
                          color: colors.text,
                          borderColor:
                            colors.border,
                          backgroundColor:
                            colors.surface,
                        },
                      ]}
                    />

                    <TextInput
                      value={
                        item.quantity > 0
                          ? String(item.quantity)
                          : ""
                      }
                      onChangeText={(value) =>
                        updateReturn(
                          item.id,
                          "quantity",
                          value
                        )
                      }
                      placeholder="Qty"
                      placeholderTextColor={
                        colors.textSecondary
                      }
                      keyboardType="number-pad"
                      style={[
                        styles.quantityInput,
                        {
                          color: colors.text,
                          borderColor:
                            colors.border,
                          backgroundColor:
                            colors.surface,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}

              <Pressable
                onPress={addReturn}
                style={[
                  styles.addButton,
                  {
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name="add-outline"
                  size={18}
                  color={colors.text}
                />

                <Text
                  style={[
                    styles.addButtonText,
                    { color: colors.text },
                  ]}
                >
                  Add returned product
                </Text>
              </Pressable>
            </View>
          )}
        </Pressable>

        {/* CONTINUE */}
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.82 : 1,
            },
          ]}
        >
          <Text style={styles.continueText}>
            {lang === "en"
              ? "Save & Continue"
              : "சேமித்து தொடரவும்"}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={19}
            color="#FFFFFF"
          />
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

  notFoundText: {
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
  },

  headerTextContainer: {
    marginLeft: 7,
  },

  headerTitle: {
    fontSize: 23,
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
    marginTop: 6,
    gap: 5,
  },

  locationText: {
    fontSize: 13,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 17,
    marginBottom: 16,
  },

  /* ==============================
     FIXED PRODUCTS HEADER
     ============================== */

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  cardHeaderContent: {
    flex: 1,
    paddingRight: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  countBadge: {
    width: 30,
    height: 30,
    minWidth: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  countBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    includeFontPadding: false,
  },

  productBox: {
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    marginBottom: 10,
  },

  productBoxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },

  productNumber: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },

  inputRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 9,
  },

  unitInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
  },

  quantityInput: {
    width: 82,
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    textAlign: "center",
  },

  addButton: {
    minHeight: 44,
    borderWidth: 1.2,
    borderRadius: 11,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 3,
  },

  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },

  methodGrid: {
    flexDirection: "row",
    gap: 9,
    marginTop: 16,
  },

  methodButton: {
    flex: 1,
    minHeight: 70,
    borderWidth: 1.2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentInfo: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 13,
  },

  paymentInfoContent: {
    flex: 1,
    marginLeft: 10,
  },

  paymentInfoTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  paymentInfoText: {
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 3,
  },

  amountLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 17,
    marginBottom: 7,
  },

  amountInputWrapper: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  rupee: {
    fontSize: 18,
    fontWeight: "700",
  },

  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },

  returnsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  returnContent: {
    marginTop: 16,
  },

  continueButton: {
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 4,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});