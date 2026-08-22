import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { BeatProvider } from "../context/BeatContext";
import { DistributorProvider } from "../context/DistributorContext";
import { LanguageProvider } from "../context/LanguageContext";
import {
  ThemeProvider,
  useTheme,
} from "../context/ThemeContext";

function RootStack() {
  const { mode, colors } = useTheme();

  return (
    <>
      <StatusBar
        style={mode === "dark" ? "light" : "dark"}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.bg,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="store" />
      </Stack>
    </>
  );
}

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DistributorProvider>
            <BeatProvider>
              <RootStack />
            </BeatProvider>
          </DistributorProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}