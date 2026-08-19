// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="beat"
        options={{
          title: t("beat"),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗒️</Text>,
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: t("stores"),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏬</Text>,
        }}
      />
      <Tabs.Screen
        name="day"
        options={{
          title: t("day"),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✅</Text>,
        }}
      />
    </Tabs>
  );
}