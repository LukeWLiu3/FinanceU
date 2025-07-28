import React from "react";
import { Text, View } from "react-native";

const Courses = () => {
  const coursesData = [
    {
      title: "Personal Finance Basics",
      duration: "varies",
      thumbnail: "https://img.youtube.com/vi/GtaoP0skPWc/0.jpg",
      url: "https://www.youtube.com/embed/GtaoP0skPWc",
    },
    {
      title: "How to Pay Off Debt in 2025",
      duration: "20-25 min",
      thumbnail: "https://img.youtube.com/vi/t4zfiBw0hwM/0.jpg",
      url: "https://www.youtube.com/embed/t4zfiBw0hwM",
    },
  ];

  return (
    <View className="bg-green-400 border-b border-red-200 pt-16 p-6">
      <Text>Courses</Text>
      {coursesData.map()}
    </View>
  );
};

export default Courses;
