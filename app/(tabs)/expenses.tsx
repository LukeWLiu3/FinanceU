import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Expense {
  id: number;
  title: string;
  cost: number;
  created_at?: string;
}

const Expenses = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const { user, profile } = useAuthStore();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [modelOpen, changeModelOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const onAddExpense = async () => {
    if (!name.trim() || !amount.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        // Edit expense
        const { error } = await supabase
          .from("budget")
          .update({ title: name.trim(), cost: parsedAmount })
          .eq("id", editId);

        if (error) {
          Alert.alert("Error", "Failed to update expense");
        } else {
          Alert.alert("Success", "Expense updated successfully");
          setEditId(null);
        }
      } else {
        // Add expense
        const { error } = await supabase.from("budget").insert({
          user_id: user?.id,
          title: name.trim(),
          cost: parsedAmount,
        });

        if (error) {
          Alert.alert("Error", "Failed to add expense");
        } else {
          Alert.alert("Success", "Expense added successfully");
        }
      }

      setName("");
      setAmount("");
      changeModelOpen(false);
      fetchExpenses();
    } catch {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("budget")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (data) setExpenses(data || []);
      if (error) console.log("Error fetching expenses:", error);
    } catch (error) {
      console.log("Error fetching expenses:", error);
    }
  }, [user?.id]);

  const onDeleteExpense = async (id: number) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("budget")
              .delete()
              .eq("id", id);
            if (error) {
              Alert.alert("Error", "Failed to delete expense");
            } else {
              fetchExpenses();
            }
          },
        },
      ]
    );
  };

  const onEditExpense = (expense: Expense) => {
    setEditId(expense.id);
    setName(expense.title);
    setAmount(expense.cost.toString());
    changeModelOpen(true);
  };
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const total = expenses.reduce((acc, expense) => acc + expense.cost, 0);
  const remainingBudget = (profile?.monthly_budget || 0) - total;
  const budgetPercentage = profile?.monthly_budget
    ? Math.min((total / profile.monthly_budget) * 100, 100)
    : 0;

  const getBudgetColor = () => {
    if (budgetPercentage >= 90) return "text-red-600";
    if (budgetPercentage >= 75) return "text-orange-500";
    return "text-green-600";
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View className="bg-white mx-4 mb-3 p-4 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {item.title}
          </Text>
          <Text className="text-red-500 font-bold text-base">
            -${item.cost.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row space-x-2 gap-2">
          <Pressable
            className="bg-blue-50 p-3 rounded-full active:bg-blue-100"
            onPress={() => onEditExpense(item)}
          >
            <AntDesign name="edit" size={18} color="#3b82f6" />
          </Pressable>
          <Pressable
            className="bg-red-50 p-3 rounded-full active:bg-red-100"
            onPress={() => onDeleteExpense(item.id)}
          >
            <Entypo name="trash" size={18} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="bg-white shadow-sm">
            <View className="px-6 py-4">
              <Text className="text-3xl font-bold text-gray-800">Expenses</Text>
            </View>
          </View>

          {/* Budget Overview Card */}
          <View className="mx-4 mt-4 mb-2">
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Budget Overview
              </Text>

              {/* Budget Progress Bar */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-gray-600">Budget Used</Text>
                  <Text className={`text-sm font-semibold ${getBudgetColor()}`}>
                    {budgetPercentage.toFixed(1)}%
                  </Text>
                </View>
                <View className="w-full bg-gray-200 rounded-full h-3">
                  <View
                    className={`h-3 rounded-full ${
                      budgetPercentage >= 90
                        ? "bg-red-500"
                        : budgetPercentage >= 75
                          ? "bg-orange-400"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${budgetPercentage}%` }}
                  />
                </View>
              </View>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Monthly Budget:</Text>
                  <Text className="font-semibold text-gray-800">
                    ${profile?.monthly_budget?.toFixed(2) || "0.00"}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Total Expenses:</Text>
                  <Text className="font-semibold text-red-500">
                    -${total.toFixed(2)}
                  </Text>
                </View>
                <View className="border-t border-gray-200 pt-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-800 font-semibold">
                      Remaining:
                    </Text>
                    <Text
                      className={`font-bold ${remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ${remainingBudget.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Expenses List */}
          <View className="flex-1">
            <View className="px-4 py-2 flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">
                Recent Expenses ({expenses.length})
              </Text>
            </View>

            {expenses.length === 0 ? (
              <View className="flex-1 justify-center items-center px-6">
                <Feather name="inbox" size={64} color="#9ca3af" />
                <Text className="text-xl font-semibold text-gray-500 mt-4 mb-2">
                  No expenses yet
                </Text>
                <Text className="text-gray-400 text-center">
                  Tap the + button below to add your first expense
                </Text>
              </View>
            ) : (
              <FlatList
                data={expenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
            )}
          </View>

          {/* Add/Edit Modal */}
          <Modal
            visible={modelOpen}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => {
              setEditId(null);
              setName("");
              setAmount("");
              changeModelOpen(false);
            }}
          >
            <SafeAreaView className="flex-1 bg-white">
              <View className="flex-1">
                {/* Modal Header */}
                <View className="px-6 py-4 border-b border-gray-200">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold text-gray-800">
                      {editId ? "Edit Expense" : "Add Expense"}
                    </Text>
                    <Pressable
                      onPress={() => {
                        setEditId(null);
                        setName("");
                        setAmount("");
                        changeModelOpen(false);
                      }}
                      className="p-2"
                    >
                      <AntDesign name="close" size={24} color="#6b7280" />
                    </Pressable>
                  </View>
                </View>

                {/* Form */}
                <View className="flex-1 px-6 py-6">
                  <View className="space-y-6">
                    <View>
                      <Text className="text-base font-semibold text-gray-700 mb-2">
                        Expense Name
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-300 p-4 rounded-xl text-base"
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g., Groceries, Coffee, Gas"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="words"
                      />
                    </View>

                    <View>
                      <Text className="text-base font-semibold text-gray-700 mb-2">
                        Amount ($)
                      </Text>
                      <TextInput
                        className="bg-gray-50 border border-gray-300 p-4 rounded-xl text-base"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor="#9ca3af"
                        keyboardType="decimal-pad"
                      />
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="px-6 pb-6">
                  <View className="flex-row space-x-3 gap-4">
                    <Pressable
                      className="flex-1 bg-gray-200 py-4 rounded-xl active:bg-gray-300"
                      onPress={() => {
                        setEditId(null);
                        setName("");
                        setAmount("");
                        changeModelOpen(false);
                      }}
                      disabled={loading}
                    >
                      <Text className="text-gray-700 text-center font-semibold text-lg">
                        Cancel
                      </Text>
                    </Pressable>
                    <Pressable
                      className={`flex-1 py-4 rounded-xl ${
                        loading
                          ? "bg-green-400"
                          : "bg-green-600 active:bg-green-700"
                      }`}
                      onPress={onAddExpense}
                      disabled={loading}
                    >
                      <Text className="text-white text-center font-semibold text-lg">
                        {loading
                          ? "Saving..."
                          : editId
                            ? "Save Changes"
                            : "Add Expense"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Modal>

          {/* Floating Add Button */}
          <Pressable
            className="absolute bottom-28 right-6 w-16 h-16 bg-green-600 rounded-full justify-center items-center active:bg-green-700"
            style={{
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
            onPress={() => {
              setEditId(null);
              setName("");
              setAmount("");
              changeModelOpen(true);
            }}
          >
            <AntDesign name="plus" size={24} color="white" />
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Expenses;
