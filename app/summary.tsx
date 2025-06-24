import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Nav from '@/Components/Nav'
import { summaryScore } from '@/api/quizapi'
import { useLocalSearchParams, useRouter } from 'expo-router'

type SummaryData = {
  totalQuestions: number;
  score: number;
  timeSpent: number;
  passed?: boolean;
};

const summary = () => {
  const { sessionId } = useLocalSearchParams();
  const [data, setData] = useState<SummaryData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (sessionId) {
      loadSummary();
    }
  }, [sessionId]);

  const loadSummary = async () => {
    try {
      const res = await summaryScore(sessionId);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}.${secs.toString().padStart(2, '0')}`;
  };

  const getResultLabel = (score: number) => {
    if (score <= 4) return { label: "Fail", color: "text-red-400" };
    if (score <= 7) return { label: "Pass", color: "text-yellow-300" };
    return { label: "Excellent", color: "text-green-400" };
  };

  if (!data) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <Text className="text-white">Loading summary...</Text>
      </View>
    );
  }

  const result = getResultLabel(data.score);

  return (
    <View className="flex-1 bg-slate-900 justify-center items-center">
      <View className="absolute top-0 left-0 mt-20 ml-20">
        <Nav />
        <Text className='text-gray-400 text-2xl p-2 mt-5'>QUIZ ENDING</Text>
      </View>

      <Text className="text-white font-bold text-2xl mb-10">Score is</Text>

      <Text className="text-white font-bold mb-10 text-5xl">
        {data.score} / 10
      </Text>

      <Text className={`font-bold my-5 text-2xl ${result.color}`}>
        Result : {result.label}
      </Text>

      <TouchableOpacity
        className="border bg-slate-500 text-black mx-2 px-20 py-2 rounded-md hover:bg-slate-400"
        onPress={() => router.replace("/")}
      >
        <Text className="text-white text-4xl">CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
}

export default summary