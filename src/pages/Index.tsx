import React, { useEffect, useState } from "react";
import { fetchQuestions, Question } from "../lib/quizService";

const Index: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchQuestions(5).then((data) => setQuestions(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">SkillQuest 🎮</h1>
      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <ul className="space-y-2">
          {questions.map((q, i) => (
            <li key={i} className="border p-3 rounded-md">
              <strong dangerouslySetInnerHTML={{ __html: q.question }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Index;
