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

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 30,
        }}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              { color: colors.text },
            ]}
          >
            Profile
          </Text>

          <View style={{ width: 24 }} />
        </View>

        {/* PROFILE */}

        <View style={styles.profileSection}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>R</Text>
          </View>

          <Text
            style={[
              styles.name,
              {
                color: colors.text,
              },
            ]}
          >
            Delivery Partner
          </Text>

          <Text
            style={[
              styles.phone,
              { color: colors.textSecondary },
            ]}
          >
            98765 43210
          </Text>

          <View
            style={[
              styles.roleBadge,
              { backgroundColor: colors.surfaceAlt },
            ]}
          >
            <Text
              style={[
                styles.roleText,
                { color: colors.primary },
              ]}
            >
              Delivery Executive
            </Text>
          </View>
        </View>

        {/* MENU */}

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Pressable
            onPress={() => router.push("/settings")}
            style={styles.menuRow}
          >
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: colors.surfaceAlt },
              ]}
            >
              <Ionicons
                name="settings-outline"
                size={21}
                color={colors.primary}
              />
            </View>

            <View style={styles.menuText}>
              <Text
                style={[
                  styles.menuTitle,
                  { color: colors.text },
                ]}
              >
                Settings
              </Text>

              <Text
                style={[
                  styles.menuSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Preferences and account settings
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        {/* LOGOUT */}

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.critical}
          />

          <Text
            style={[
              styles.logoutText,
              { color: colors.critical },
            ]}
          >
            Log out
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

  header: {
    height: 62,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  profileSection: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 30,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  name: {
    fontSize: 23,
    fontWeight: "800",
    marginTop: 15,
  },

  phone: {
    fontSize: 14,
    marginTop: 4,
  },

  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },

  roleText: {
    fontSize: 12,
    fontWeight: "700",
  },

  card: {
    marginHorizontal: 22,
    borderRadius: 20,
    borderWidth: 1,
  },

  menuRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  menuText: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  menuSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  logoutButton: {
    marginTop: 24,
    marginHorizontal: 22,
    height: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "700",
  },
});