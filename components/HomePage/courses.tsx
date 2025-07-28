import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

const demoCourses = [
  {
    title: "Retirement Fund & Plan",
    image: "https://img.youtube.com/vi/GtaoP0skPWc/0.jpg",
  },
  {
    title: "Stock Market Literacy",
    image: "https://img.youtube.com/vi/t4zfiBw0hwM/0.jpg",
  },
];

const CoursePreview = () => {
  return (
    <View className="px-6 mt-6">
      <Text className="text-xl font-bold mb-4">Continue Learning</Text>
      <View className="flex-row space-x-4 gap-2">
        {demoCourses.map((course, idx) => (
          <View key={idx} className="flex-1 bg-green-200 rounded-xl overflow-hidden">
            <Image
              source={{ uri: course.image }}
              style={{ height: 100, width: "100%" }}
              resizeMode="cover"
            />
            <View className="p-3">
              <Text className="font-semibold text-sm text-black">{course.title}</Text>
             
            </View>
          </View>
        ))}
      </View>
      <Pressable
        onPress={() => router.push("/courses")}
        className="mt-4 bg-green-600 py-3 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">Go to Courses</Text>
      </Pressable>
    </View>
  );
};

export default CoursePreview;
