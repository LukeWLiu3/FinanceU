import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Profile = () => {
  const { logOut, profile, user, fetchProfile } = useAuthStore();
  const [budget, setBudget] = useState(
    profile?.monthly_budget?.toString() || ""
  );
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchProfile();
      setLoading(false);
    };
    load();
  }, []);

  const updateBudget = async () => {
    try {
      const { error } = await supabase
        .from("Profiles")
        .update({
          user_id: user?.id,
          monthly_budget: budget,
          full_name: profile?.full_name,
          email: user?.email,
        })
        .eq("user_id", user?.id);

      if (error) {
        alert("Failed to update budget");
      } else {
        alert("Budget updated successfully");
        await fetchProfile();
        setEditing(false);
      }
    } catch {
      alert("There was an error updating your budget");
    }
  };

  const initial =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View className="flex-1 bg-green-50">
          {/* Header Background */}
          <View className="h-40 bg-green-500 justify-end items-center pb-4">
            <View className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
              <View className="w-full h-full bg-gray-200 justify-center items-center">
                <Text className="text-4xl font-bold text-green-600">
                  {initial}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View className="px-6 mt-6 space-y-5">
            <View className="border-b pb-2">
              <Text className="text-xs text-gray-400 mb-1">Name</Text>
              <Text className="text-base font-medium text-gray-800">
                {profile.full_name || "N/A"}
              </Text>
            </View>

            <View className="border-b pb-2">
              <Text className="text-xs text-gray-400 mb-1">Email</Text>
              <Text className="text-base font-medium text-gray-800">
                {profile.email || user?.email || "N/A"}
              </Text>
            </View>

            <View className="border-b pb-2">
              <Text className="text-xs text-gray-400 mb-1">Monthly Budget</Text>
              {!editing ? (
                <Pressable onPress={() => setEditing(true)}>
                  <Text className="text-base font-medium text-gray-800">
                    $
                    {profile.monthly_budget != null
                      ? profile.monthly_budget
                      : "N/A"}
                  </Text>
                </Pressable>
              ) : (
                <TextInput
                  className="bg-gray-50 border border-gray-300 p-4 rounded-xl text-base"
                  value={budget}
                  onChangeText={setBudget}
                  placeholder="$0.00"
                  keyboardType="numeric"
                  onBlur={() => setEditing(false)}
                  autoFocus
                />
              )}
            </View>

            {editing && (
              <Pressable
                className="bg-green-600 py-4 rounded-xl mt-2"
                onPress={updateBudget}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Save Changes
                </Text>
              </Pressable>
            )}

            <Pressable className="bg-red-500 py-4 rounded-xl" onPress={logOut}>
              <Text className="text-white text-center font-bold text-lg">
                Logout
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
export default Profile;
