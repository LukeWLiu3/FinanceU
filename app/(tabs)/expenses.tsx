import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
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
  const { user, profile } = useAuthStore();
  const [expenses, setExpenses] = useState([]);
  const [modelOpen, changeModelOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const onAddExpense = async () => {
    if (!name || !amount) {
      alert("Please fill in all fields");
      return;
    }
    if (editId) {
      // Edit expense
      const { error } = await supabase
        .from("budget")
        .update({ title: name, cost: parseFloat(amount) })
        .eq("id", editId);
      if (error) {
        alert("Failed to edit expense");
      } else {
        alert("Expense updated");
        setEditId(null);
      }
    } else {
      // Add expense
      const { error } = await supabase
        .from("budget")
        .insert({ user_id: user?.id, title: name, cost: parseFloat(amount) });
      if (error) {
        alert("Failed to add expense");
      } else {
        alert("Expense added successfully");
      }
    }
    setName("");
    setAmount("");
    changeModelOpen(false);
    fetchExpenses();
  };

  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("budget").select();
    if (data) setExpenses(data || []);
    if (error) console.log("Error fetching expenses:", error);
  };

  const onDeleteExpense = async (id: number) => {
    const { error } = await supabase.from("budget").delete().eq("id", id);
    if (error) {
      alert("Failed to delete expense");
    } else {
      fetchExpenses();
    }
  };

  const onEditExpense = (expense: any) => {
    setEditId(expense.id);
    setName(expense.title);
    setAmount(expense.cost.toString());
    changeModelOpen(true);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpenses = (accumulator, currentValue) => {
    const totalExpenses = accumulator + currentValue.cost;
    return totalExpenses;
  };

  const total = expenses.reduce(totalExpenses, 0);
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
          <View className="flex-1 bg-white">
            <Text className="text-2xl font-bold p-6 mb-6 text-green-600">
              Expenses
            </Text>
            <View className="flex flex-col justify-between px-6 py-4 bg-gray-100">
              <View>
                <Text>Monthly Budget: {profile?.monthly_budget}</Text>
              </View>
              <View>
                <Text>Total Expenses: {total}</Text>
              </View>
              <View>
                <Text>Remaning Budget:{profile?.monthly_budget - total}</Text>
              </View>
            </View>
            <ScrollView className="bg-white">
              <View className="flex-1 justify-center items-center bg-white px-6 relative min-h-screen">
                <View className="w-full max-w-md rounded-xl p-8">
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
                              {editId ? "Save" : "Add"}
                            </Text>
                          </Pressable>
                          <Pressable
                            className="bg-gray-600 py-3 rounded-lg flex-1 active:bg-gray-700"
                            onPress={() => {
                              setEditId(null);
                              setName("");
                              setAmount("");
                              changeModelOpen(false);
                            }}
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
                      key={expense.id}
                      className="bg-gray-100 p-4 rounded-lg mt-4 flex justify-between items-center flex-row"
                    >
                      <View>
                        <Text className="text-lg font-semibold">
                          {expense.title}
                        </Text>
                        <Text className="text-red-600">-${expense.cost}</Text>
                      </View>
                      <View className="flex flex-row space-x-2">
                        <Pressable
                          className="bg-blue-100 px-2 py-1 rounded-full flex items-center justify-center"
                          onPress={() => onEditExpense(expense)}
                        >
                          <AntDesign name="edit" size={20} color="black" />
                        </Pressable>
                        <Pressable
                          className="bg-red-100 px-2 py-1 rounded-full flex items-center justify-center"
                          onPress={() => onDeleteExpense(expense.id)}
                        >
                          <Entypo name="trash" size={20} color="black" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
            {/* Floating "+" button */}
            <Pressable
              className="absolute bottom-28 right-6 w-16 h-16 bg-green-700 rounded-full flex justify-center items-center shadow-lg"
              style={{
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
              onPress={() => {
                setEditId(null);
                setName("");
                setAmount("");
                changeModelOpen(true);
              }}
            >
              <Text className="text-white text-3xl font-bold">+</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </KeyboardAvoidingView>
  );
};

export default Expenses;
