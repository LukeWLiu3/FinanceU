import { useAuthStore } from "@/utils/useAuth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const Onboarding = () => {
  const [budget, setBudget] = useState("");
  const [fullName, setFullName] = useState("");
  const { user, saveProfile } = useAuthStore();
  const onSave = async () => {
    if (!fullName || !budget) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const success = await saveProfile({
        full_name: fullName,
        monthly_budget: parseFloat(budget),
        email: user?.email,
      });
      if (success) {
        alert("Profile saved successfully");
      } else {
        alert("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("There was an error saving your profile");
      return;
    }
  };
  // Replace with your save logic
  console.log("Budget:", budget, "Full Name:", fullName);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-white px-6">
        <View className="w-full max-w-md rounded-xl p-8">
          <Text className="text-2xl font-bold text-center mb-6 text-green-600">
            Onboarding
          </Text>

          <Text className="text-base mb-2 text-gray-700">Full Name</Text>
          <TextInput
            className="bg-white border border-gray-300 p-3 rounded-lg mb-4 text-base"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

          <Text className="text-base mb-2 text-gray-700">Monthly Budget</Text>
          <TextInput
            className="bg-white border border-gray-300 p-3 rounded-lg mb-6 text-base"
            value={budget}
            onChangeText={setBudget}
            placeholder="Enter your monthly budget"
            keyboardType="numeric"
            autoCapitalize="none"
          />

          <Pressable className="bg-green-600 py-3 rounded-lg" onPress={onSave}>
            <Text className="text-white text-center font-semibold text-lg">
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default Onboarding;
