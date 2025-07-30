import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { logIn } = useAuthStore();

  const onSignup = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }
      if (data?.user && data?.session) {
        logIn(data.user, data.session);
      }
    } catch (error) {
      alert("There is an error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-white px-6">
        <View className="w-full max-w-md rounded-2xl bg-gray-50 shadow-md p-8">
          <Text className="text-3xl font-extrabold text-center mb-6 text-green-600">
            Create Account
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
              onPress={onSignup}
            >
              <Text className="text-white text-center font-bold text-lg">
                Sign Up
              </Text>
            </Pressable>

            <Text className="text-center text-sm text-gray-600">
              Already have an account?
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text className="text-green-600 font-semibold"> Log In</Text>
              </Pressable>
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
