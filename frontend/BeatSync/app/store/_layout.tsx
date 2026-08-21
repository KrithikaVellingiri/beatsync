// app/store/_layout.tsx
import { Stack } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function StoreLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="[id]/index" />
      <Stack.Screen name="[id]/delivery" />
      <Stack.Screen name="[id]/summary" />
    </Stack>
  );
}