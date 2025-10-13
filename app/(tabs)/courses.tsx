import React, { useState } from "react";
import { Image, ImageBackground, Modal, Pressable, ScrollView, Text, View } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

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
    title: "Advanced Budgeting Tactics",
    url: "qbaZHZkadfg",
    thumbnail: "https://img.youtube.com/vi/qbaZHZkadfg/hqdefault.jpg",
  },
  {
    id: "vid12",
    title: "Deep Dive: Credit Utilization",
    url: "vJabNEwZIuc",
    thumbnail: "https://img.youtube.com/vi/vJabNEwZIuc/hqdefault.jpg",
  },
  {
    id: "vid13",
    title: "Analyzing Market Trends",
    url: "eynxyoKgpng",
    thumbnail: "https://img.youtube.com/vi/eynxyoKgpng/hqdefault.jpg",
  },
  {
    id: "vid14",
    title: "Understanding Derivatives",
    url: "llslyXPu6wI",
    thumbnail: "https://img.youtube.com/vi/llslyXPu6wI/hqdefault.jpg",
  },
  {
    id: "vid15",
    title: "Wealth Building Frameworks",
    url: "GhApasUpb0U",
    thumbnail: "https://img.youtube.com/vi/GhApasUpb0U/hqdefault.jpg",
  },
];
const Courses = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const renderSection = (title, videos) => (
    <View className="mb-8">
      <Text className="text-lg font-semibold text-gray-800 mb-3 px-6">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        {videos.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setSelectedVideo(item.url)}
            className="w-40 mr-4 rounded-xl bg-green-100"
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
            <View className="bg-green-100 rounded-b-xl py-4 px-2">
              <Text className="text-gray-800 font-semibold text-center text-sm">
                {item.title}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ImageBackground
      source={{
        uri: "https://media.istockphoto.com/id/907639582/vector/dollar-seamless-pattern-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=VHClrbZgRtZUbQ6w7hJe75KDMk8NRELPTTRI67Gu6ic=",
      }}
      resizeMode="repeat"
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        className="flex-1"
      >
        <View className="Flex gap-3">
          <View
            className="px-6 py-6 mt-8 bg-green-200
        rounded-xl"
          >
            <Text className="text-2xl font-bold text-gray-800 mb-4">
              Finance Courses
            </Text>
            <View className="bg-green-200 rounded-xl p-4 mb-6">
              <Text className="text-black font-medium text-center italic">
                “Save 20% of what you earn — your future self will thank you.”
              </Text>
            </View>
          </View>

          <View className="bg-green-50 rounded-xl">
            {renderSection("Beginner", beginnerVideos)}
            {renderSection("Intermediate", intermediateVideos)}
            {renderSection("Advanced", advancedVideos)}

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
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Courses;
