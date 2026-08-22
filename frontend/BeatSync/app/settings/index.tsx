import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useDistributor } from "../../context/DistributorContext";

export default function Settings() {
  const { colors, mode, toggleMode } = useTheme();
  const { lang, setLang } = useLanguage();
  const { distributors } = useDistributor();
  const insets = useSafeAreaInsets();

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
        <Pressable
          onPress={() => router.navigate("/(tabs)/home")}
          hitSlop={12}
          style={({ pressed }) => ({
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color={colors.text}
          />
        </Pressable>

        <Text
          style={[
            styles.headerTitle,
            { color: colors.text },
          ]}
        >
          Settings
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 30,
        }}
      >
        {/* ACCOUNT */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textSecondary },
          ]}
        >
          ACCOUNT
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <SettingRow
            icon="person-outline"
            title="Profile"
            subtitle="Manage your personal information"
            colors={colors}
            onPress={() => router.push("/profile")}
          />

          <Divider colors={colors} />

          <SettingRow
            icon="business-outline"
            title="My Distributors"
            subtitle={
              distributors.length === 0
                ? "Join a distributor using a team code"
                : `${distributors.length} distributor${
                    distributors.length > 1 ? "s" : ""
                  }`
            }
            colors={colors}
            onPress={() => router.push("/settings/distributors")}
            showChevron
          />
        </View>

        {/* APPEARANCE */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textSecondary },
          ]}
        >
          APPEARANCE
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <SettingRow
            icon={mode === "dark" ? "moon-outline" : "sunny-outline"}
            title="Theme"
            subtitle={mode === "dark" ? "Dark mode" : "Light mode"}
            colors={colors}
            onPress={toggleMode}
            right={
              <View
                style={[
                  styles.themeBadge,
                  {
                    backgroundColor: colors.surfaceAlt,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.themeBadgeText,
                    { color: colors.text },
                  ]}
                >
                  {mode === "dark" ? "Dark" : "Light"}
                </Text>
              </View>
            }
          />

          <Divider colors={colors} />

          <SettingRow
            icon="language-outline"
            title="Language"
            subtitle={lang === "en" ? "English" : "தமிழ்"}
            colors={colors}
            onPress={() => setLang(lang === "en" ? "ta" : "en")}
            right={
              <View
                style={[
                  styles.languageBadge,
                  {
                    backgroundColor: colors.surfaceAlt,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.languageBadgeText,
                    { color: colors.text },
                  ]}
                >
                  {lang === "en" ? "EN" : "தமிழ்"}
                </Text>
              </View>
            }
          />
        </View>

        {/* INFORMATION */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textSecondary },
          ]}
        >
          INFORMATION
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <SettingRow
            icon="information-circle-outline"
            title="About BeatSync"
            subtitle="Version and app information"
            colors={colors}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  colors,
  onPress,
  showChevron = false,
  right,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  colors: any;
  onPress: () => void;
  showChevron?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          opacity: pressed ? 0.65 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: colors.surfaceAlt,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={colors.primary}
        />
      </View>

      <View style={styles.rowText}>
        <Text
          style={[
            styles.rowTitle,
            { color: colors.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.rowSubtitle,
            { color: colors.textSecondary },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {right}

      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      )}
    </Pressable>
  );
}

function Divider({ colors }: { colors: any }) {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.border },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 21,
    fontWeight: "800",
  },

  headerSpacer: {
    width: 25,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginHorizontal: 22,
    marginTop: 22,
    marginBottom: 9,
  },

  card: {
    marginHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },

  row: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  iconBox: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  rowText: {
    flex: 1,
    paddingRight: 10,
  },

  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  rowSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  divider: {
    height: 1,
    marginLeft: 71,
  },

  themeBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 9,
    marginRight: 8,
  },

  themeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  languageBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 9,
    marginRight: 8,
  },

  languageBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});