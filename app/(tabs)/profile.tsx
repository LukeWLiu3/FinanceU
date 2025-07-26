import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const Profile = () => {
  const { logOut, profile, user, fetchProfile } = useAuthStore();
  const [budget, setBudget] = useState(
    profile?.monthly_budget?.toString() || ""
  );
  const updateBudget = async () => {
    try {
      const { data, error } = await supabase
        .from("Profiles")
        .update({
          user_id: user?.id,
          monthly_budget: budget,
          full_name: profile?.full_name,
          email: user?.email,
        })
        .eq("user_id", user?.id)
        .select();
      if (error) {
        console.log("Error updating budget:", error);
        alert("Failed to update budget");
      } else {
        alert("Budget updated successfully");
        await fetchProfile();
      }
    } catch (error) {
      console.log("Error updating budget:", error);
      alert("There was an error updating your budget");
      return;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const initial =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center bg-white px-6">
        <View className="w-full max-w-md rounded-xl p-8 items-center">
          <View className="bg-green-600 rounded-full w-20 h-20 justify-center items-center mb-6">
            <Text className="text-white text-4xl font-bold">{initial}</Text>
          </View>

          <Text className="text-2xl font-bold text-center mb-2 text-green-600">
            {profile.full_name || "No Name"}
          </Text>
          <Text className="text-base text-gray-700 mb-1">
            Email:{" "}
            <Text className="font-semibold">
              {profile.email || user?.email || "N/A"}
            </Text>
          </Text>
          <Text className="text-base text-gray-700 mb-6">
            Monthly Budget:{" "}
            <Text className="font-semibold">
              {profile.monthly_budget != null
                ? `$${profile.monthly_budget}`
                : "N/A"}
            </Text>
          </Text>

          <TextInput
            className="bg-white border border-gray-300 p-3 rounded-lg mb-4 text-base w-full"
            value={budget}
            onChangeText={setBudget}
            placeholder="Update your full name"
            autoCapitalize="words"
          />
          <Pressable className="bg-green-400 py-3 rounded-lg w-full mt-4">
            <Text
              className="text-black text-center font-semibold text-lg"
              onPress={updateBudget}
            >
              Update Budget
            </Text>
          </Pressable>

          <Pressable
            className="bg-red-400 py-3 rounded-lg w-full mt-4"
            onPress={logOut}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Profile;
