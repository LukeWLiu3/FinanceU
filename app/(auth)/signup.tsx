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

  console.log("User info:", email, password);

  const onSignup = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
    }
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error);
      }
      if (data) {
        console.log("data is:", data);
      }

      if (data.user && data.session) {
        console.log("data sent to supabase:", data.user, data.session);
        logIn(data.user, data.session);
      }
    } catch (error) {
      alert("There is an error");
      console.log("Error from signup page:", error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-white px-6">
        <View className="w-full max-w-md rounded-xl p-8">
          <Text className="text-2xl font-bold text-center mb-6 text-blue-600">
            Create Account
          </Text>

          <Text className="text-base mb-2 text-gray-700">Email</Text>
          <TextInput
            className="bg-white border border-gray-300 p-3 rounded-lg mb-4 text-base"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="text-base mb-2 text-gray-700">Password</Text>
          <TextInput
            className="bg-white border border-gray-300 p-3 rounded-lg mb-6 text-base"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable className="bg-blue-600 py-3 rounded-lg" onPress={onSignup}>
            <Text className="text-white text-center font-semibold text-lg">
              Sign Up
            </Text>
          </Pressable>
          <Text className="mt-10">
            Already have an
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text className="text-blue-600"> account</Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
