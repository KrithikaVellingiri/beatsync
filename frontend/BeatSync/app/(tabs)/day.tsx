// app/(tabs)/day.tsx
import { View, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function Day() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.text }}>Day summary screen — coming next</Text>
    </View>
  );
}