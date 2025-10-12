import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const CoursePreview = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const router = useRouter();
  const beginnerVideos = [
    {
      id: "vid1",
      title: "Budgeting Basics",
      url: "d1oVNmTGyGg",
      thumbnail: "https://img.youtube.com/vi/d1oVNmTGyGg/hqdefault.jpg",
    },
    {
      id: "vid2",
      title: "Saving for Beginners",
      url: "XYkwa1D1AC4",
      thumbnail: "https://img.youtube.com/vi/XYkwa1D1AC4/hqdefault.jpg",
    },
    {
      id: "vid3",
      title: "Understanding Credit",
      url: "x6S63406raY",
      thumbnail: "https://img.youtube.com/vi/x6S63406raY/hqdefault.jpg",
    },
    {
      id: "vid4",
      title: "Intro to Finance",
      url: "v-djL7SPw4c",
      thumbnail: "https://img.youtube.com/vi/v-djL7SPw4c/hqdefault.jpg",
    },
    {
      id: "vid5",
      title: "Money Management 101",
      url: "Izw-xaVkO0g",
      thumbnail: "https://img.youtube.com/vi/Izw-xaVkO0g/hqdefault.jpg",
    },
  ];

<<<<<<< HEAD
  const intermediateVideos = [
    {
      id: "vid6",
      title: "Intro to Investing",
      url: "5qFYK4-jwro",
      thumbnail: "https://img.youtube.com/vi/5qFYK4-jwro/hqdefault.jpg",
    },
    {
      id: "vid7",
      title: "Taxes Explained",
      url: "EJHPltmAULA",
      thumbnail: "https://img.youtube.com/vi/EJHPltmAULA/hqdefault.jpg",
    },
    {
      id: "vid8",
      title: "Understanding Debt",
      url: "lmOAvEkG6GM",
      thumbnail: "https://img.youtube.com/vi/lmOAvEkG6GM/hqdefault.jpg",
    },
    {
      id: "vid9",
      title: "401k & Roth IRA",
      url: "qKXwlfOElFw",
      thumbnail: "https://img.youtube.com/vi/qKXwlfOElFw/hqdefault.jpg",
    },
    {
      id: "vid10",
      title: "Credit Scores 101",
      url: "EsOTfVIcdEI",
      thumbnail: "https://img.youtube.com/vi/EsOTfVIcdEI/hqdefault.jpg",
    },
  ];

  const advancedVideos = [
    {
      id: "vid11",
      title: "Stock Market Fundamentals",
      url: "XYkwa1D1AC4",
      thumbnail: "https://img.youtube.com/vi/XYkwa1D1AC4/hqdefault.jpg",
    },
    {
      id: "vid12",
      title: "Intermediate Accounting",
      url: "5qFYK4-jwro",
      thumbnail: "https://img.youtube.com/vi/5qFYK4-jwro/hqdefault.jpg",
    },
    {
      id: "vid13",
      title: "Financial Modeling",
      url: "v-djL7SPw4c",
      thumbnail: "https://img.youtube.com/vi/v-djL7SPw4c/hqdefault.jpg",
    },
    {
      id: "vid14",
      title: "Corporate Finance",
      url: "EJHPltmAULA",
      thumbnail: "https://img.youtube.com/vi/EJHPltmAULA/hqdefault.jpg",
    },
    {
      id: "vid15",
      title: "Advanced Investing",
      url: "lmOAvEkG6GM",
      thumbnail: "https://img.youtube.com/vi/lmOAvEkG6GM/hqdefault.jpg",
    },
  ];

=======
>>>>>>> feature/discount-map
  return (
    <View className="mb-6 px-4">
      <Text className="text-lg font-semibold mb-2">Courses</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[beginnerVideos[0], beginnerVideos[1]].map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setSelectedVideo(item.url)}
            className="mr-4 w-40 rounded-xl bg-white shadow-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <View className="h-24 rounded-t-xl overflow-hidden">
              <Image
                source={{ uri: item.thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="bg-green-100 rounded-b-xl py-2 px-2">
              <Text className="text-gray-800 font-semibold text-center text-sm">
                {item.title}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        onPress={() => router.push("/(tabs)/courses")}
        className="mt-3 bg-green-600 px-4 py-2 rounded-xl self-start"
      >
        <Text className="text-white font-semibold">Go to Courses</Text>
      </Pressable>

      <Modal visible={!!selectedVideo} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-90">
          <View className="w-[90%] aspect-video bg-white rounded-xl overflow-hidden">
            <YoutubePlayer
              height={220}
              play
              videoId={selectedVideo}
              onChangeState={(state) => {
                if (state === "ended") setSelectedVideo(null);
              }}
            />
          </View>
          <Pressable
            onPress={() => setSelectedVideo(null)}
            className="mt-6 px-6 py-3 bg-green-600 rounded-xl"
          >
            <Text className="text-white font-semibold">Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default CoursePreview;
