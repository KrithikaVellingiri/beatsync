import { Ionicons } from "@expo/vector-icons";
import { Tabs, router, usePathname } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

type IoniconsName = keyof typeof Ionicons.glyphMap;

type NavItem = {
  label: string;
  icon: IoniconsName;
  route: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home",     icon: "home-outline",             route: "/(tabs)/home"   },
  { label: "My Beat",  icon: "document-text-outline",    route: "/(tabs)/beat"   },
  { label: "Stores",   icon: "storefront-outline",       route: "/(tabs)/stores" },
  { label: "My Day",   icon: "checkmark-circle-outline", route: "/(tabs)/day"    },
  { label: "Settings", icon: "settings-outline",         route: "/settings"      },
  { label: "Profile",  icon: "person-outline",           route: "/profile"       },
];

function DesktopSidebar() {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (route: string) => {
    // Normalize route for comparison
    const normalized = route.replace("/(tabs)", "");
    return pathname === normalized || pathname.startsWith(normalized + "/");
  };

  return (
    <View style={[styles.sidebar, { backgroundColor: colors.surface, borderRightColor: colors.border }]}>
      {/* Logo */}
      <View style={[styles.sidebarLogo, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <View style={[styles.logoDot, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoDotText}>B</Text>
        </View>
        <Text style={[styles.logoText, { color: colors.text }]}>BeatSync</Text>
      </View>

      {/* Nav Items */}
      <View style={styles.navItems}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.route);
          return (
            <Pressable
              key={item.route}
              onPress={() => router.navigate(item.route as any)}
              style={({ pressed }) => [
                styles.navItem,
                active && { backgroundColor: colors.primary + "18" },
                pressed && !active && { backgroundColor: colors.surfaceAlt },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.navLabel,
                  { color: active ? colors.primary : colors.textSecondary },
                  active && styles.navLabelActive,
                ]}
              >
                {item.label}
              </Text>
              {active && <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />}
            </Pressable>
          );
        })}
      </View>

      {/* Logout */}
      <Pressable
        onPress={logout}
        style={({ pressed }) => [styles.logoutItem, { opacity: pressed ? 0.6 : 1, borderTopColor: colors.border }]}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.critical} />
        <Text style={[styles.navLabel, { color: colors.critical }]}>Logout</Text>
      </Pressable>
    </View>
  );
}

export default function HomeTabsLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width > 768;

  if (isDesktop) {
    return (
      <View style={styles.desktopRoot}>
        <DesktopSidebar />
        <View style={styles.desktopContent}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: { display: "none" },  // hide tab bar on desktop
            }}
          >
            <Tabs.Screen name="home"   options={{ title: "Home"              }} />
            <Tabs.Screen name="beat"   options={{ title: "My Beat"           }} />
            <Tabs.Screen name="stores" options={{ title: "My Stores"         }} />
            <Tabs.Screen name="day"    options={{ title: "My Day"            }} />
          </Tabs>
        </View>
      </View>
    );
  }

  // Mobile — standard bottom tabs
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="beat"
        options={{
          title: t("beat") || "Beat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="stores"
        options={{
          title: t("stores") || "Stores",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="day"
        options={{
          title: t("day") || "My Day",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  desktopRoot: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 260,
    borderRightWidth: 1,
    flexDirection: "column",
  },
  sidebarLogo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
    borderBottomWidth: 1,
  },
  logoDot: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoDotText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 17,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  desktopContent: {
    flex: 1,
    overflow: "hidden",
  },
  navItems: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 10,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    marginBottom: 4,
    gap: 12,
    position: "relative",
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  navLabelActive: {
    fontWeight: "700",
  },
  activeBar: {
    width: 3,
    height: 20,
    borderRadius: 2,
    position: "absolute",
    right: 0,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});