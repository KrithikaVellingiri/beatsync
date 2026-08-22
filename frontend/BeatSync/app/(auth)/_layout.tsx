// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function AuthLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="distributor-login" />
      <Stack.Screen name="distributor-signup" />
      <Stack.Screen name="delivery-login" />
      <Stack.Screen name="delivery-signup" />
    </Stack>
  );
}