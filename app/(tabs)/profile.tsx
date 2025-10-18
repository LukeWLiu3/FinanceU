import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Profile = () => {
  const { profile, user, fetchProfile, deleteAccount, logOut } = useAuthStore();

  // Keep local input state separate and sync it when profile changes
  const [budget, setBudget] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteStep, setDeleteStep] = useState<"first" | "final">("first");
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchProfile();
      setLoading(false);
    };
    load();
  }, [fetchProfile]);

  // When the profile's monthly_budget changes, reflect it in the input box
  useEffect(() => {
    setBudget(
      profile?.monthly_budget != null ? String(profile.monthly_budget) : "",
    );
  }, [profile?.monthly_budget]);

  const updateBudget = async () => {
    const cleaned = String(budget).replace(/[^\d.]/g, "");
    const amount = parseFloat(cleaned);
    if (Number.isNaN(amount) || amount < 0) {
      Alert.alert(
        "Invalid Budget",
        "Please enter a valid non-negative number for your budget.",
      );
      return;
    }

    try {
      const { error } = await supabase
        .from("Profiles")
        .update({ monthly_budget: amount })
        .eq("user_id", user?.id);

      if (error) {
        console.error(error);
        Alert.alert("Error", `Failed to update budget: ${error.message}`);
        return;
      }

      await fetchProfile();
      setEditing(false);
      Alert.alert("Success", "Budget updated successfully");
    } catch (e: any) {
      console.error(e);
      Alert.alert(
        "Error",
        `There was an error updating your budget: ${e?.message ?? ""}`,
      );
    }
  };

  const handleDeleteAccount = () => {
    setDeleteStep("first");
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteStep === "first") {
      setDeleteStep("final");
    } else {
      executeDeleteAccount();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeleteStep("first");
  };

  const executeDeleteAccount = async () => {
    setDeleting(true);
    try {
      const success = await deleteAccount();
      setShowDeleteDialog(false);
      setDeleteStep("first");

      // Don't show alerts after successful deletion since user will be redirected
      if (!success) {
        Alert.alert(
          "Error",
          "There was an error deleting your account. Please try again or contact support.",
        );
        setDeleting(false);
      }
      // If successful, the user will be automatically logged out and redirected
    } catch (error) {
      console.error("Delete account error:", error);
      setShowDeleteDialog(false);
      setDeleteStep("first");
      Alert.alert(
        "Error",
        "There was an error deleting your account. Please try again or contact support.",
      );
      setDeleting(false);
    }
  };

  const handleSignOut = () => {
    setShowSignOutDialog(true);
  };

  const confirmSignOut = () => {
    setShowSignOutDialog(false);
    logOut();
  };

  const cancelSignOut = () => {
    setShowSignOutDialog(false);
  };

  if (loading || deleting) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
        <Text className="mt-4 text-gray-600 text-center">
          {deleting ? "Deleting account..." : "Loading..."}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-gray-50"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-8 pb-6">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-28 h-28 rounded-full bg-emerald-600 justify-center items-center mb-4">
                <Ionicons name="person" size={36} color="#ffffff" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {profile?.full_name || "User Profile"}
              </Text>
            </View>

            {/* Profile Information Card */}
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
              <View className="flex-row items-center mb-4">
                <Ionicons name="person-circle" size={24} color="#059669" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Profile Information
                </Text>
              </View>

              {/* Name Field */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </Text>
                <View className="bg-gray-50 px-4 py-3 rounded-lg flex-row items-center">
                  <Ionicons name="person" size={18} color="#6b7280" />
                  <Text className="text-gray-900 ml-2">
                    {profile?.full_name || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Email Field */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </Text>
                <View className="bg-gray-50 px-4 py-3 rounded-lg flex-row items-center">
                  <Ionicons name="mail" size={18} color="#6b7280" />
                  <Text className="text-gray-900 ml-2">
                    {profile?.email || user?.email || "N/A"}
                  </Text>
                </View>
              </View>

              {/* Budget Field */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Monthly Budget
                </Text>
                {!editing ? (
                  <Pressable
                    onPress={() => setEditing(true)}
                    className="bg-gray-50 px-4 py-3 rounded-lg flex-row justify-between items-center"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="wallet" size={18} color="#6b7280" />
                      <Text className="text-gray-900 text-base ml-2">
                        $
                        {profile?.monthly_budget != null
                          ? profile.monthly_budget.toLocaleString()
                          : "Not set"}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-emerald-600 text-sm font-medium mr-1">
                        Tap to edit
                      </Text>
                      <Ionicons name="pencil" size={16} color="#059669" />
                    </View>
                  </Pressable>
                ) : (
                  <View>
                    <TextInput
                      className="bg-white border border-gray-200 px-4 py-3 rounded-lg text-base text-gray-900 mb-6"
                      value={budget}
                      onChangeText={setBudget}
                      placeholder="Enter amount"
                      keyboardType="numeric"
                      inputMode="decimal"
                      autoFocus
                    />
                    <View className="flex-row gap-4">
                      <Pressable
                        className="flex-1 bg-emerald-600 py-4 rounded-xl active:bg-emerald-700 flex-row justify-center items-center"
                        onPress={updateBudget}
                      >
                        <Ionicons name="checkmark" size={18} color="#ffffff" />
                        <Text className="text-white font-bold text-base ml-2">
                          Save
                        </Text>
                      </Pressable>
                      <Pressable
                        className="flex-1 bg-gray-300 py-4 rounded-xl active:bg-gray-400 flex-row justify-center items-center"
                        onPress={() => {
                          setEditing(false);
                          setBudget(
                            profile?.monthly_budget != null
                              ? String(profile.monthly_budget)
                              : "",
                          );
                        }}
                      >
                        <Ionicons name="close" size={18} color="#374151" />
                        <Text className="text-gray-700 font-bold text-base ml-2">
                          Cancel
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Actions Card */}
            <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
              <View className="flex-row items-center mb-6">
                <Ionicons name="settings" size={24} color="#059669" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Account Actions
                </Text>
              </View>

              {/* Logout Button */}
              <Pressable
                className="bg-orange-500 py-4 px-6 rounded-xl mb-4 flex-row justify-center items-center active:bg-orange-600"
                onPress={handleSignOut}
              >
                <Ionicons name="log-out" size={22} color="#ffffff" />
                <Text className="text-white font-bold text-lg ml-3">
                  Sign Out
                </Text>
              </Pressable>

              {/* Delete Account Button */}
              <Pressable
                className="bg-red-600 py-4 px-6 rounded-xl flex-row justify-center items-center active:bg-red-700"
                onPress={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text className="text-white font-bold text-lg ml-3">
                      Deleting...
                    </Text>
                  </View>
                ) : (
                  <>
                    <Ionicons name="trash" size={22} color="#ffffff" />
                    <Text className="text-white font-bold text-lg ml-3">
                      Delete Account
                    </Text>
                  </>
                )}
              </Pressable>
            </View>

            <ConfirmDialog
              visible={showSignOutDialog}
              title="Sign Out"
              message="Are you sure you want to sign out of your account?"
              confirmText="Sign Out"
              cancelText="Cancel"
              onConfirm={confirmSignOut}
              onCancel={cancelSignOut}
              destructive={false}
            />

            <ConfirmDialog
              visible={showDeleteDialog}
              title={
                deleteStep === "first" ? "Delete Account" : "Final Confirmation"
              }
              message={
                deleteStep === "first"
                  ? "Are you sure you want to permanently delete your account? This action cannot be undone and will remove all your data including your profile, expenses, and budget information."
                  : "This is your last chance to cancel. Your account and all associated data will be permanently deleted. Are you absolutely sure you want to proceed?"
              }
              confirmText={
                deleteStep === "first" ? "Continue" : "Yes, Delete Forever"
              }
              cancelText="Cancel"
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
              loading={deleting}
              destructive={true}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Profile;
