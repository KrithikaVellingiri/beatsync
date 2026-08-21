import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useBeat } from "../../../context/BeatContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTheme } from "../../../context/ThemeContext";

export default function Day() {
  const { colors } = useTheme();
  const { lang } = useLanguage();

  const {
    stores,
    products,
    completedTransactions,
  } = useBeat();

  const totalStores = stores.length;

  const completedStores = stores.filter(
    (store) => store.done
  ).length;

  const pendingStores =
    totalStores - completedStores;

  const progress =
    totalStores > 0
      ? completedStores / totalStores
      : 0;

  const totalCollected =
    completedTransactions.reduce(
      (total, transaction) =>
        total + transaction.amountCollected,
      0
    );

  const cashCollected =
    completedTransactions
      .filter(
        (transaction) =>
          transaction.paymentMethod === "cash"
      )
      .reduce(
        (total, transaction) =>
          total +
          transaction.amountCollected,
        0
      );

  const upiCollected =
    completedTransactions
      .filter(
        (transaction) =>
          transaction.paymentMethod === "upi"
      )
      .reduce(
        (total, transaction) =>
          total +
          transaction.amountCollected,
        0
      );

  const creditCollected =
    completedTransactions
      .filter(
        (transaction) =>
          transaction.paymentMethod ===
          "credit"
      )
      .reduce(
        (total, transaction) =>
          total +
          transaction.amountCollected,
        0
      );

  const totalDelivered =
    completedTransactions.reduce(
      (total, transaction) => {
        const delivered =
          Object.values(
            transaction.entries
          ).reduce(
            (sum, entry) =>
              sum + entry.delivered,
            0
          );

        return total + delivered;
      },
      0
    );

  const totalReturned =
    completedTransactions.reduce(
      (total, transaction) => {
        const returned =
          Object.values(
            transaction.entries
          ).reduce(
            (sum, entry) =>
              sum + entry.returned,
            0
          );

        return total + returned;
      },
      0
    );

  const formatAmount = (
    amount: number
  ) => {
    return amount.toLocaleString("en-IN");
  };

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    }
  );

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.bg,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
            {lang === "en"
              ? "My Day"
              : "என் நாள்"}
          </Text>

          <Text
            style={[
              styles.date,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {today}
          </Text>
        </View>

        {/* PROGRESS CARD */}

        <View
          style={[
            styles.progressCard,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View
            style={
              styles.progressHeader
            }
          >
            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {lang === "en"
                  ? "Today's Progress"
                  : "இன்றைய முன்னேற்றம்"}
              </Text>

              <Text
                style={[
                  styles.progressText,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {completedStores} /{" "}
                {totalStores}{" "}
                {lang === "en"
                  ? "stores completed"
                  : "கடைகள் முடிக்கப்பட்டன"}
              </Text>
            </View>

            <View
              style={[
                styles.progressNumber,
                {
                  backgroundColor:
                    `${colors.primary}15`,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                {Math.round(
                  progress * 100
                )}
                %
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor:
                    colors.primary,

                  width: `${
                    progress * 100
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        {/* STORE STATS */}

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={23}
              color={colors.primary}
            />

            <Text
              style={[
                styles.statNumber,
                {
                  color: colors.text,
                },
              ]}
            >
              {completedStores}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {lang === "en"
                ? "Completed"
                : "முடிந்தது"}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={23}
              color={colors.accent}
            />

            <Text
              style={[
                styles.statNumber,
                {
                  color: colors.text,
                },
              ]}
            >
              {pendingStores}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {lang === "en"
                ? "Pending"
                : "நிலுவையில்"}
            </Text>
          </View>
        </View>

        {/* COLLECTION */}

        <Text
          style={[
            styles.heading,
            { color: colors.text },
          ]}
        >
          {lang === "en"
            ? "Today's Collection"
            : "இன்றைய வசூல்"}
        </Text>

        <View
          style={[
            styles.collectionCard,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          <View
            style={
              styles.collectionHeader
            }
          >
            <View
              style={[
                styles.collectionIcon,
                {
                  backgroundColor:
                    `${colors.primary}15`,
                },
              ]}
            >
              <Ionicons
                name="wallet-outline"
                size={23}
                color={colors.primary}
              />
            </View>

            <View>
              <Text
                style={[
                  styles.collectionAmount,
                  {
                    color: colors.text,
                  },
                ]}
              >
                ₹ {formatAmount(totalCollected)}
              </Text>

              <Text
                style={[
                  styles.collectionLabel,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {lang === "en"
                  ? "Total collected today"
                  : "இன்று மொத்தமாக வசூலிக்கப்பட்டது"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  colors.border,
              },
            ]}
          />

          <View
            style={
              styles.paymentBreakdown
            }
          >
            <View
              style={
                styles.paymentItem
              }
            >
              <Text
                style={[
                  styles.paymentLabel,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                Cash
              </Text>

              <Text
                style={[
                  styles.paymentAmount,
                  {
                    color: colors.text,
                  },
                ]}
              >
                ₹ {formatAmount(cashCollected)}
              </Text>
            </View>

            <View
              style={
                styles.paymentItem
              }
            >
              <Text
                style={[
                  styles.paymentLabel,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                UPI
              </Text>

              <Text
                style={[
                  styles.paymentAmount,
                  {
                    color: colors.text,
                  },
                ]}
              >
                ₹ {formatAmount(upiCollected)}
              </Text>
            </View>

            <View
              style={
                styles.paymentItem
              }
            >
              <Text
                style={[
                  styles.paymentLabel,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                Credit
              </Text>

              <Text
                style={[
                  styles.paymentAmount,
                  {
                    color: colors.text,
                  },
                ]}
              >
                ₹ {formatAmount(
                  creditCollected
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* PRODUCT SUMMARY */}

        <Text
          style={[
            styles.heading,
            { color: colors.text },
          ]}
        >
          {lang === "en"
            ? "Product Summary"
            : "பொருட்களின் சுருக்கம்"}
        </Text>

        <View style={styles.statsRow}>
          <View
            style={[
              styles.productStatCard,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="cube-outline"
              size={22}
              color={colors.primary}
            />

            <Text
              style={[
                styles.statNumber,
                {
                  color: colors.text,
                },
              ]}
            >
              {totalDelivered}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {lang === "en"
                ? "Delivered"
                : "வழங்கப்பட்டது"}
            </Text>
          </View>

          <View
            style={[
              styles.productStatCard,
              {
                backgroundColor:
                  colors.surface,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Ionicons
              name="return-down-back-outline"
              size={22}
              color={colors.accent}
            />

            <Text
              style={[
                styles.statNumber,
                {
                  color: colors.text,
                },
              ]}
            >
              {totalReturned}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color:
                    colors.textSecondary,
                },
              ]}
            >
              {lang === "en"
                ? "Returned"
                : "திரும்பியது"}
            </Text>
          </View>
        </View>

        {/* TODAY'S ACTIVITY */}

        <Text
          style={[
            styles.heading,
            { color: colors.text },
          ]}
        >
          {lang === "en"
            ? "Today's Activity"
            : "இன்றைய செயல்பாடு"}
        </Text>

        <View
          style={[
            styles.activityCard,
            {
              backgroundColor:
                colors.surface,
              borderColor:
                colors.border,
            },
          ]}
        >
          {completedTransactions.length ===
          0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-outline"
                size={30}
                color={
                  colors.textSecondary
                }
              />

              <Text
                style={[
                  styles.emptyText,
                  {
                    color:
                      colors.textSecondary,
                  },
                ]}
              >
                {lang === "en"
                  ? "No stores completed yet"
                  : "இதுவரை கடைகள் முடிக்கப்படவில்லை"}
              </Text>
            </View>
          ) : (
            completedTransactions
              .slice()
              .reverse()
              .map((transaction) => {
                const store =
                  stores.find(
                    (item) =>
                      item.id ===
                      transaction.storeId
                  );

                const time =
                  new Date(
                    transaction.timestamp
                  ).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  );

                return (
                  <View
                    key={
                      transaction.timestamp
                    }
                    style={
                      styles.activityItem
                    }
                  >
                    <View
                      style={[
                        styles.activityIcon,
                        {
                          backgroundColor:
                            `${colors.primary}15`,
                        },
                      ]}
                    >
                      <Ionicons
                        name="checkmark"
                        size={17}
                        color={
                          colors.primary
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.activityContent
                      }
                    >
                      <Text
                        style={[
                          styles.activityStore,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {store?.name ??
                          "Store"}
                      </Text>

                      <Text
                        style={[
                          styles.activityTime,
                          {
                            color:
                              colors.textSecondary,
                          },
                        ]}
                      >
                        {time}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.activityAmount,
                        {
                          color:
                            colors.text,
                        },
                      ]}
                    >
                      ₹{" "}
                      {formatAmount(
                        transaction.amountCollected
                      )}
                    </Text>
                  </View>
                );
              })
          )}
        </View>

        {/* REMAINING */}

        {pendingStores > 0 && (
          <>
            <Text
              style={[
                styles.heading,
                { color: colors.text },
              ]}
            >
              {lang === "en"
                ? "Remaining Stores"
                : "மீதமுள்ள கடைகள்"}
            </Text>

            <View
              style={[
                styles.activityCard,
                {
                  backgroundColor:
                    colors.surface,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              {stores
                .filter(
                  (store) =>
                    !store.done
                )
                .map((store) => (
                  <View
                    key={store.id}
                    style={
                      styles.activityItem
                    }
                  >
                    <View
                      style={[
                        styles.pendingIcon,
                        {
                          backgroundColor:
                            `${colors.accent}15`,
                        },
                      ]}
                    >
                      <Ionicons
                        name="time-outline"
                        size={17}
                        color={
                          colors.accent
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.activityContent
                      }
                    >
                      <Text
                        style={[
                          styles.activityStore,
                          {
                            color:
                              colors.text,
                          },
                        ]}
                      >
                        {store.name}
                      </Text>

                      <Text
                        style={[
                          styles.activityTime,
                          {
                            color:
                              colors.textSecondary,
                          },
                        ]}
                      >
                        {store.area}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={
                        colors.textSecondary
                      }
                    />
                  </View>
                ))}
            </View>
          </>
        )}
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
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  date: {
    fontSize: 13,
    marginTop: 5,
  },

  progressCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 17,
    marginBottom: 16,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  progressText: {
    fontSize: 12,
    marginTop: 5,
  },

  progressNumber: {
    width: 54,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  progressTrack: {
    height: 8,
    borderRadius: 10,
    marginTop: 18,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  productStatCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 13,
  },

  statLabel: {
    fontSize: 12,
    marginTop: 3,
  },

  heading: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 11,
  },

  collectionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 17,
    marginBottom: 24,
  },

  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  collectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  collectionAmount: {
    fontSize: 23,
    fontWeight: "800",
  },

  collectionLabel: {
    fontSize: 12,
    marginTop: 3,
  },

  divider: {
    height: 1,
    marginVertical: 17,
  },

  paymentBreakdown: {
    flexDirection: "row",
  },

  paymentItem: {
    flex: 1,
  },

  paymentLabel: {
    fontSize: 11,
  },

  paymentAmount: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },

  activityCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 24,
    overflow: "hidden",
  },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 70,
  },

  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  pendingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityStore: {
    fontSize: 14,
    fontWeight: "700",
  },

  activityTime: {
    fontSize: 11,
    marginTop: 3,
  },

  activityAmount: {
    fontSize: 14,
    fontWeight: "800",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },

  emptyText: {
    fontSize: 13,
    marginTop: 10,
  },
});