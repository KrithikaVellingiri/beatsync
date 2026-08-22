import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useBeat } from "../../../context/BeatContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

export default function StoreDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { colors } = useTheme();
  const { lang } = useLanguage();
  const { getStore } = useBeat();

  const store = getStore(id);

  if (!store) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.bg },
        ]}
      >
        <Ionicons
          name="storefront-outline"
          size={42}
          color={colors.textSecondary}
        />

        <Text
          style={[
            styles.notFoundTitle,
            { color: colors.text },
          ]}
        >
          {lang === "en"
            ? "Store not found"
            : "கடை கிடைக்கவில்லை"}
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.backButtonText,
              { color: colors.primary },
            ]}
          >
            {lang === "en" ? "Go Back" : "பின் செல்க"}
          </Text>
        </Pressable>
      </View>
    );
  }

  const isCritical = store.status === "critical";
  const isClear = store.outstanding === 0;
  const isCompleted = store.done;

  const statusColor = isCritical
    ? colors.critical
    : isClear
      ? colors.success
      : colors.accent;

  const statusBackground = isCritical
    ? colors.criticalBg
    : isClear
      ? colors.successBg
      : `${colors.accent}18`;

  const statusTitle = isCritical
    ? lang === "en"
      ? "Critical Account"
      : "முக்கிய கணக்கு"
    : isClear
      ? lang === "en"
        ? "Account Clear"
        : "கணக்கு தெளிவானது"
      : lang === "en"
        ? "Outstanding Payment"
        : "நிலுவைத் தொகை";

  const statusDescription = isCritical
    ? lang === "en"
      ? "Owner approval is required before delivery."
      : "விநியோகத்திற்கு முன் உரிமையாளர் ஒப்புதல் தேவை."
    : isClear
      ? lang === "en"
        ? "No outstanding payment is pending."
        : "நிலுவைத் தொகை எதுவும் இல்லை."
      : lang === "en"
        ? "Payment is currently outstanding for this store."
        : "இந்த கடைக்கான பணம் தற்போது நிலுவையில் உள்ளது.";

  const handleCallOwner = () => {
    if (store.phone) {
      Linking.openURL(`tel:${store.phone}`);
    }
  };

  const handleStartVisit = () => {
    router.push(`/store/${store.id}/delivery`);
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
        {/* HEADER */}
<View style={styles.header}>
  {/* BACK */}
  <Pressable
    onPress={() => router.back()}
    hitSlop={10}
    style={styles.headerBack}
  >
    <Ionicons
      name="arrow-back"
      size={22}
      color={colors.text}
    />
  </Pressable>

  {/* CALL STORE OWNER */}
  <Pressable
    onPress={handleCallOwner}
    hitSlop={10}
    style={[
      styles.headerIconButton,
      {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      },
    ]}
  >
    <Ionicons
      name="call-outline"
      size={19}
      color={colors.primary}
    />
  </Pressable>
</View>

        {/* STORE HEADER */}
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
              size={16}
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

        {/* ACCOUNT STATUS */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: statusBackground,
              borderColor: statusColor,
            },
          ]}
        >
          <View style={styles.statusTopRow}>
            <View
              style={[
                styles.statusIcon,
                {
                  backgroundColor: `${statusColor}20`,
                },
              ]}
            >
              <Ionicons
                name={
                  isCritical
                    ? "warning-outline"
                    : isClear
                      ? "checkmark-circle-outline"
                      : "wallet-outline"
                }
                size={21}
                color={statusColor}
              />
            </View>

            <View style={styles.statusTitleContainer}>
              <Text
                style={[
                  styles.statusTitle,
                  { color: statusColor },
                ]}
              >
                {statusTitle}
              </Text>

              <Text
                style={[
                  styles.statusDescription,
                  { color: statusColor },
                ]}
              >
                {statusDescription}
              </Text>
            </View>
          </View>

          {!isClear && (
            <>
              <View
                style={[
                  styles.statusDivider,
                  {
                    backgroundColor: `${statusColor}30`,
                  },
                ]}
              />

              <Text
                style={[
                  styles.outstandingLabel,
                  { color: statusColor },
                ]}
              >
                {lang === "en"
                  ? "Outstanding amount"
                  : "நிலுவைத் தொகை"}
              </Text>

              <Text
                style={[
                  styles.outstandingAmount,
                  { color: statusColor },
                ]}
              >
                ₹{store.outstanding.toLocaleString("en-IN")}
              </Text>

              {store.daysOverdue > 0 && (
                <View style={styles.overdueContainer}>
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color={statusColor}
                  />

                  <Text
                    style={[
                      styles.overdueText,
                      { color: statusColor },
                    ]}
                  >
                    {store.daysOverdue}{" "}
                    {lang === "en"
                      ? "days overdue"
                      : "நாட்கள் தாமதம்"}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* ACTIONS */}
        <View style={styles.actionSection}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            {lang === "en"
              ? "Store Actions"
              : "கடை செயல்கள்"}
          </Text>

          <View style={styles.actionRow}>
            <Pressable
              onPress={handleCallOwner}
              style={({ pressed }) => [
                styles.callButton,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Ionicons
                name="call-outline"
                size={19}
                color={colors.primary}
              />

              <Text
                style={[
                  styles.callButtonText,
                  { color: colors.primary },
                ]}
              >
                {lang === "en"
                  ? "Call Owner"
                  : "உரிமையாளரை அழை"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleStartVisit}
              style={({ pressed }) => [
                styles.startButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.82 : 1,
                },
              ]}
            >
              <Ionicons
                name="navigate-outline"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.startButtonText}>
                {isCompleted
                  ? lang === "en"
                    ? "Visit Again"
                    : "மீண்டும் வருக"
                  : lang === "en"
                    ? "Start Visit"
                    : "வருகையைத் தொடங்கு"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* CRITICAL NOTICE */}
        {isCritical && (
          <View
            style={[
              styles.noticeCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.noticeIcon,
                {
                  backgroundColor: colors.criticalBg,
                },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.critical}
              />
            </View>

            <View style={styles.noticeContent}>
              <Text
                style={[
                  styles.noticeTitle,
                  { color: colors.text },
                ]}
              >
                {lang === "en"
                  ? "Before starting delivery"
                  : "விநியோகத்தைத் தொடங்கும் முன்"}
              </Text>

              <Text
                style={[
                  styles.noticeText,
                  { color: colors.textSecondary },
                ]}
              >
                {lang === "en"
                  ? "Please confirm with the owner before delivering products because this account has an overdue balance."
                  : "இந்த கணக்கில் நிலுவை இருப்பதால், பொருட்களை விநியோகிப்பதற்கு முன் உரிமையாளரிடம் உறுதிப்படுத்தவும்."}
              </Text>
            </View>
          </View>
        )}

        {/* STORE INSIGHTS */}
        <View
          style={[
            styles.insightCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.insightHeader}>
            <View
              style={[
                styles.insightIcon,
                {
                  backgroundColor: `${colors.primary}15`,
                },
              ]}
            >
              <Ionicons
                name="bulb-outline"
                size={19}
                color={colors.primary}
              />
            </View>

            <Text
              style={[
                styles.insightTitle,
                { color: colors.text },
              ]}
            >
              {lang === "en"
                ? "Store Insights"
                : "கடை தகவல்கள்"}
            </Text>
          </View>

          {store.insights.length > 0 ? (
            store.insights.map((insight, index) => (
              <View
                key={index}
                style={styles.insightRow}
              >
                <View
                  style={[
                    styles.insightDot,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.insightText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {insight}
                </Text>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.noInsightText,
                { color: colors.textSecondary },
              ]}
            >
              {lang === "en"
                ? "No additional insights available."
                : "கூடுதல் தகவல்கள் இல்லை."}
            </Text>
          )}
        </View>

        {/* STORE INFORMATION */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            {lang === "en"
              ? "Store Information"
              : "கடை தகவல்"}
          </Text>

          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIcon,
                {
                  backgroundColor: `${colors.primary}12`,
                },
              ]}
            >
              <Ionicons
                name="storefront-outline"
                size={18}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoTextContainer}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: colors.textSecondary },
                ]}
              >
                {lang === "en" ? "Store" : "கடை"}
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  { color: colors.text },
                ]}
              >
                {store.name}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.infoDivider,
              { backgroundColor: colors.border },
            ]}
          />

          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoIcon,
                {
                  backgroundColor: `${colors.primary}12`,
                },
              ]}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoTextContainer}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: colors.textSecondary },
                ]}
              >
                {lang === "en"
                  ? "Area"
                  : "பகுதி"}
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  { color: colors.text },
                ]}
              >
                {store.area}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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

  container: {
  paddingHorizontal: 20,
  paddingTop: 40,
  paddingBottom: 40,
},

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },

  backButton: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },

  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 22,
},

headerBack: {
  width: 42,
  height: 42,
  alignItems: "center",
  justifyContent: "center",
},

headerIconButton: {
  width: 42,
  height: 42,
  borderRadius: 12,
  borderWidth: 1,
  alignItems: "center",
  justifyContent: "center",
},

  storeHeader: {
    marginBottom: 20,
  },

  storeName: {
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 5,
  },

  locationText: {
    fontSize: 14,
    fontWeight: "500",
  },

  statusCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },

  statusTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  statusTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  statusDescription: {
    fontSize: 12.5,
    fontWeight: "500",
    lineHeight: 18,
    marginTop: 3,
  },

  statusDivider: {
    height: 1,
    marginVertical: 16,
  },

  outstandingLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  outstandingAmount: {
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 3,
  },

  overdueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 5,
  },

  overdueText: {
    fontSize: 12.5,
    fontWeight: "700",
  },

  actionSection: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
  },

  callButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1.5,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  callButtonText: {
    fontSize: 13.5,
    fontWeight: "700",
  },

  startButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },

  noticeCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    marginBottom: 22,
  },

  noticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  noticeContent: {
    flex: 1,
    marginLeft: 11,
  },

  noticeTitle: {
    fontSize: 14,
    fontWeight: "700",
  },

  noticeText: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
  },

  insightCard: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 17,
    marginBottom: 18,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  insightTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 10,
  },

  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 10,
  },

  insightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },

  noInsightText: {
    fontSize: 13,
    lineHeight: 19,
  },

  infoCard: {
    borderWidth: 1,
    borderRadius: 17,
    padding: 17,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  infoTextContainer: {
    flex: 1,
    marginLeft: 11,
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },

  infoDivider: {
    height: 1,
    marginVertical: 14,
  },
});