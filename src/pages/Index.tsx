import React, { useEffect, useState } from "react";
import { fetchQuestions, Question } from "../lib/quizService";
import { useUserStore } from "../store/userStore";

const Index: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizOver, setQuizOver] = useState(false);
  const { addXP } = useUserStore();

  // Load questions
  useEffect(() => {
    fetchQuestions(5).then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  const handleAnswer = (answer: string) => {
    setSelected(answer);

    if (answer === questions[current].correct_answer) {
      addXP(10); // +10 XP for correct answer
    }

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
        setSelected(null);
      } else {
        setQuizOver(true);
      }
    }, 1000);
  };

  if (loading) return <div className="p-8 text-lg">Loading questions...</div>;
  if (quizOver)
    return (
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Quiz Completed 🎉</h2>
        <p className="text-lg text-gray-600">You’ve earned XP for correct answers!</p>
        <a
          href="/dashboard"
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          View Dashboard
        </a>
      </div>
    );

  const q = questions[current];
  const answers = [...q.incorrect_answers, q.correct_answer].sort();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl
