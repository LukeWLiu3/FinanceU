import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Expenses = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const { user } = useAuthStore();
  const [expenses, setExpenses] = useState([]);
  const [modelOpen, changeModelOpen] = useState(false);

  const onAddExpense = async () => {
    if (!name || !amount) {
      alert("Please fill in all fields");
      return;
    }
    // Add your expense logic here
    const { error } = await supabase
      .from("budget")
      .insert({ user_id: user?.id, title: name, cost: parseFloat(amount) });
    if (error) {
      console.log("Error adding expense:", error);
      alert("Failed to add expense");
    } else {
      alert("Expense added successfully");
      setName("");
      setAmount("");
      changeModelOpen(false);
      fetchExpenses();
    }
  };

  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("budget").select();
    if (data) {
      console.log("Fetched expenses:", data);
      setExpenses(data || []);
    }
    if (error) {
      console.log("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaProvider>
        <SafeAreaView
          className="flex-1 pt-[env(status-bar-height)]"
          edges={["top"]}
        >
          <ScrollView className="bg-white">
            <View className="flex-1 justify-center items-center bg-white px-6 relative min-h-screen">
              <View className="w-full max-w-md rounded-xl p-8">
                <Text className="text-2xl font-bold text-center mb-6 text-green-600">
                  Expenses
                </Text>

                <Modal visible={modelOpen} animationType="slide">
                  <View className="flex-1 justify-center items-center">
                    <View className="w-11/12 max-w-md bg-white rounded-2xl p-8">
                      <Text className="text-base mb-2 text-gray-700 text-center font-semibold">
                        Expense Name
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-300 p-3 rounded-lg mb-4 text-base"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter expense name"
                      />

                      <Text className="text-base mb-2 text-gray-700 text-center font-semibold">
                        Amount
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-300 p-3 rounded-lg mb-6 text-base"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                      />
                      <View className="flex flex-row w-full space-x-3 gap-3">
                        <Pressable
                          className="bg-green-600 py-3 rounded-lg flex-1 active:bg-green-700"
                          onPress={onAddExpense}
                        >
                          <Text className="text-white text-center font-semibold text-lg">
                            Add
                          </Text>
                        </Pressable>
                        <Pressable
                          className="bg-gray-600 py-3 rounded-lg flex-1 active:bg-gray-700"
                          onPress={() => changeModelOpen(false)}
                        >
                          <Text className="text-white text-center font-semibold text-lg">
                            Cancel
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>

                {expenses.map((expense) => (
                  <View
                    key={expenses.id}
                    className="bg-gray-100 p-4 rounded-lg mt-4 flex justify-between items-center flex-row"
                  >
                    <Text className="text-lg font-semibold">
                      {expense.title}
                    </Text>
                    <Text className="text-red-600">-${expense.cost}</Text>
                  </View>
                ))}
              </View>
              <Pressable
                // style={{ position: "absolute", bottom: 10, right: 20 }}
                className="size-10 bg-green-800  rounded-full mt-4 flex justify-center items-center fixed bottom-4 right-0"
                onPress={() => changeModelOpen(true)}
              >
                <Text className="text-green-300 text-center">+</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </KeyboardAvoidingView>
  );
};

export default Expenses;
