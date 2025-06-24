import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Nav from "@/Components/Nav";
import { questions, submitAnswer } from "@/api/quizapi";
import { useLocalSearchParams, useRouter } from "expo-router";

type Choice = {
  choiceId: string;
  title: string;
  questionId: string;
};

  type Question = {
  questionId: string;
  title: string;
  choices: Choice[];
};


const quiz = () => {

  const { sessionId } = useLocalSearchParams();
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const questionStartTime = useRef(Date.now());

  useEffect(() => {
    if (sessionId) {
      loadQuestion();
    }
  }, [sessionId]);

  async function loadQuestion() {
    try {
      const res = await questions(sessionId);
      setQuestion(res.data);
      setSelectedChoice(null);
      setFeedback("");
      questionStartTime.current = Date.now();
    } catch (error) {
      console.error("Failed to load question:", error);
    }
  }

  async function handleChoiceSelect(choice:Choice) {
    if (!question) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);
    setSelectedChoice(choice.choiceId);

    try {
      const res = await submitAnswer({
        sessionId,
        questionId: question.questionId,
        choiceId: choice.choiceId,
        timeSpent,
      });

      console.log("API response:", res);

      const isCorrect = res.data?.isCorrect ?? false;
      setFeedback(isCorrect ? "correct" : "incorrect");

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setFeedback("incorrect");
    }
  }

  const handleNext = async () => {
    try {
      const res = await questions(sessionId);
      if (res.data) {
        setQuestion(res.data);
        setSelectedChoice(null);
        setFeedback("");
        questionStartTime.current = Date.now();
      } else {
        router.push(`/summary?sessionId=${sessionId}&score=${score}`);
      }
    } catch (error) {
      console.error("Failed to load next question:", error);
    }
  };

  if (!question) {
  return (
    <View className="flex-1 justify-center items-center bg-slate-900">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white mt-4">Loading question...</Text>
    </View>
  );
}

  return (
    <View className="flex-1 bg-slate-900 justify-center items-center p-4">
      <Text className="w-80 text-5xl mb-5 text-white">{question.title}</Text>
      {question.choices.map((choice) => (
        <TouchableOpacity
          key={choice.choiceId}
          onPress={() => handleChoiceSelect(choice)}
          className={`w-80 border m-2 px-4 py-2 rounded-md text-center h-20 border rounded-md justify-center items-center ${
            selectedChoice === choice.choiceId
              ? feedback === "correct"
                ? "bg-green-500"
                : "bg-red-500"
              : "bg-slate-500 hover:bg-slate-400"
          }`}
          disabled={!!selectedChoice}
        >
          <Text className="text-black text-4xl">{choice.title}</Text>
        </TouchableOpacity>
      ))}

      {feedback ? (
        <View className="mt-4 items-center">
          <Text className="text-white text-3xl mb-4">
            Your Answer Is {feedback === "correct" ? "Correct" : "Incorrect"}
          </Text>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-blue-600 px-6 py-3 rounded-md"
          >
            <Text className="text-white text-xl">Next Question</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default quiz;