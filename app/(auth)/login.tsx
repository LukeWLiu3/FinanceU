import { supabase } from "@/utils/supabase";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onLogin = async () => {
    console.log("Email:", email, "Password:", password);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
    }
    if (data) {
      console.log("data is:", data);
      console.log("User is", data.user);
        console.log("Session is", data.session);  
    }
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput
        className="bg-gray-200 p-2 rounded"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text>Password:</Text>
      <TextInput
        className="bg-gray-200 p-2 rounded"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />
      <Pressable className="bg-blue-500 p-4 rounded mt-4" onPress={onLogin} />
    </View>
  );
};

export default login;
