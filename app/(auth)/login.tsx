import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { logIn } = useAuthStore();

  const onLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }
      if (data?.user && data?.session) {
        // Check if user's profile exists (not deleted)
        const { error: profileError } = await supabase
          .from("Profiles")
          .select("id")
          .eq("user_id", data.user.id)
          .single();

        if (profileError && profileError.code === "PGRST116") {
          // Profile doesn't exist, account was deleted
          await supabase.auth.signOut();
          alert(
            "❌ Account Not Available\n\nThis email address is no longer available for use and cannot be accessed. Please use a different email address to create your account.",
          );
          return;
        }

        logIn(data.user, data.session);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("There is an error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={{
          uri: "https://media.istockphoto.com/id/907639582/vector/dollar-seamless-pattern-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=VHClrbZgRtZUbQ6w7hJe75KDMk8NRELPTTRI67Gu6ic=",
        }}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center px-6">
          <View className="w-full max-w-md rounded-2xl bg-white/90 shadow-md p-8">
            <Text className="text-3xl font-extrabold text-center mb-6 text-green-600">
              Welcome Back
            </Text>

            <Text className="text-base font-medium mb-2 text-gray-700">
              Email
            </Text>
            <TextInput
              className="bg-white border border-gray-300 p-4 rounded-xl mb-4 text-base"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text className="text-base font-medium mb-2 text-gray-700">
              Password
            </Text>
            <TextInput
              className="bg-white border border-gray-300 p-4 rounded-xl mb-6 text-base"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
            />

            <View className="gap-6">
              <Pressable
                className="bg-green-600 py-4 rounded-xl"
                onPress={onLogin}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Login
                </Text>
              </Pressable>

              <Text className="text-center text-sm text-gray-600">
                Don&apos;t have an account?
                <Pressable onPress={() => router.push("/(auth)/signup")}>
                  <Text className="text-green-600 font-semibold"> Sign Up</Text>
                </Pressable>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Login;
