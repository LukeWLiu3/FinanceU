import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/utils/useAuth";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const BudgetProgress = () => {
  const { user, profile } = useAuthStore();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from("budget")
        .select("cost")
        .eq("user_id", user?.id);

      if (data) {
        const sum = data.reduce((acc, curr) => acc + curr.cost, 0);
        setTotal(sum);
      }
    };
    fetchExpenses();
  }, [user?.id]);

  const budget = profile?.monthly_budget || 0;
  const percentage = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  return (
    <View className="px-6 mt-6 mb-10">
      <Text className="text-xl font-bold mb-2">Budget & Expenses Tracker</Text>
      <View className="h-4 bg-gray-200 rounded-full">
        <View
          className="bg-green-600 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
      <Text className="mt-2 text-sm text-gray-600">
        ${total.toFixed(2)} spent of ${budget.toFixed(2)}
      </Text>
    </View>
  );
};

export default BudgetProgress;
