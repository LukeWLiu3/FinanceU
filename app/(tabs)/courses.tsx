import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

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
  {
    title: "Pay Off Debt Fast (8 Ways)",
    duration: "15 min",
    thumbnail: "https://img.youtube.com/vi/ks33lMoxst0/0.jpg",
    url: "https://www.youtube.com/embed/ks33lMoxst0",
  },
  {
    title: "Best Way Out of Credit Card Debt",
    duration: "15 min",
    thumbnail: "https://img.youtube.com/vi/4LSktB7Pk_c/0.jpg",
    url: "https://www.youtube.com/embed/4LSktB7Pk_c",
  },
  {
    title: "Emergency Fund or Pay Off Debt?",
    duration: "18 min",
    thumbnail: "https://img.youtube.com/vi/3SgVUlEcOBU/0.jpg",
    url: "https://www.youtube.com/embed/3SgVUlEcOBU",
  },
  {
    title: "Pay Debt or Build Emergency Fund?",
    duration: "10-12 min",
    thumbnail: "https://img.youtube.com/vi/6WCfVjUTTEY/0.jpg",
    url: "https://www.youtube.com/embed/6WCfVjUTTEY",
  },
  {
    title: "How to Build An Emergency Fund",
    duration: "12 min",
    thumbnail: "https://img.youtube.com/vi/mxsYHiDVNlk/0.jpg",
    url: "https://www.youtube.com/embed/mxsYHiDVNlk",
  },
  {
    title: "How Much Emergency Fund Do You Need?",
    duration: "13 min",
    thumbnail: "https://img.youtube.com/vi/U2Nw5T44zvY/0.jpg",
    url: "https://www.youtube.com/embed/U2Nw5T44zvY",
  },
  {
    title: "How to Pay Off Debt With Low Income",
    duration: "14 min",
    thumbnail: "https://img.youtube.com/vi/7rrSuhFC7I0/0.jpg",
    url: "https://www.youtube.com/embed/7rrSuhFC7I0",
  },
  {
    title: "How to Pay Off Debt While Saving Money",
    duration: "15 min",
    thumbnail: "https://img.youtube.com/vi/YL10H_EcB-E/0.jpg",
    url: "https://www.youtube.com/embed/YL10H_EcB-E",
  },
  {
    title: "How to Pay Off Debt With a Budget",
    duration: "16 min",
    thumbnail: "https://img.youtube.com/vi/QA2TBiIsdT0/0.jpg",
    url: "https://www.youtube.com/embed/QA2TBiIsdT0",
  },
  {
    title: "How to Pay Off Debt With Multiple Credit Cards",
    duration: "17 min",
    thumbnail: "https://img.youtube.com/vi/mtL_plJXv3c/0.jpg",
    url: "https://www.youtube.com/embed/mtL_plJXv3c",
  },
  {
    title: "How to Pay Off Debt With Student Loans",
    duration: "18 min",
    thumbnail: "https://img.youtube.com/vi/8IR5LefXVPY/0.jpg",
    url: "https://www.youtube.com/embed/8IR5LefXVPY",
  },
];

const { width } = Dimensions.get("window");

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      {/* Added title at the top */}
      <Text className="text-3xl font-bold text-center mb-4 text-green-700">
        Finance Courses
      </Text>
      <Text className="text-base text-center mb-4 text-gray-700">
        {coursesData.length} courses available
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {coursesData.map((course, idx) => (
          <Pressable
            key={idx}
            className="flex-row items-center bg-gray-50 rounded-xl mb-3 p-3"
            onPress={() => setSelectedCourse(course)}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: course.thumbnail }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 12,
                marginRight: 12,
                backgroundColor: "#eee",
              }}
            />
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {course.title}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                {course.duration}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Modal for video playback */}
      <Modal
        visible={!!selectedCourse}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCourse(null)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-80">
          <View
            style={{
              width: width * 0.95,
              height: width * 0.6 + 80,
              backgroundColor: "#fff",
              borderRadius: 18,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-lg font-bold text-center mt-4 mb-2 text-green-600">
              {selectedCourse?.title}
            </Text>
            <WebView
              source={{ uri: selectedCourse?.url }}
              style={{
                width: width * 0.9,
                height: width * 0.6,
                borderRadius: 12,
                backgroundColor: "#000",
              }}
              allowsFullscreenVideo
            />
            <Pressable
              className="bg-green-600 px-6 py-2 rounded-lg mt-4"
              onPress={() => setSelectedCourse(null)}
            >
              <Text className="text-white font-semibold text-base">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Courses;
