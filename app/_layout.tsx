import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/utils/useAuth";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { isLoggedIn, hasCompletedProfile, checkSession } = useAuthStore();

  console.log("isLoggedIn:", isLoggedIn);
  console.log("hasCompletedProfile:", hasCompletedProfile);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={isLoggedIn && !hasCompletedProfile}>
          <Stack.Screen
            name="(onboarding)/page"
            options={{ headerShown: false }}
          />
        </Stack.Protected>

        <Stack.Protected guard={isLoggedIn && hasCompletedProfile}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
