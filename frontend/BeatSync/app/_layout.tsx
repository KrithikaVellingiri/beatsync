// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BeatProvider } from "../context/BeatContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function RootStack() {
  const { mode, colors } = useTheme();
  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="store" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BeatProvider>
          <RootStack />
        </BeatProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}