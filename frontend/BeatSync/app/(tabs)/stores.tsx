// app/(tabs)/stores.tsx
import { View, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function Stores() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: colors.text }}>Stores screen — coming next</Text>
    </View>
  );
}