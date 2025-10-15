// src/lib/quizService.ts
import axios from "axios";

/** Quiz question structure */
export interface Question {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

/**
 * Fetch questions from the Open Trivia Database
 * @param amount Number of questions to fetch
 * @param category Category ID (optional)
 * @param difficulty Difficulty level (optional)
 */
export async function fetchQuestions(
  amount: number = 10,
  category?: number,
  difficulty?: "easy" | "medium" | "hard"
): Promise<Question[]> {
  try {
    const url = new URL("https://opentdb.com/api.php");
    url.searchParams.append("amount", amount.toString());
    url.searchParams.append("type", "multiple");
    if (category) url.searchParams.append("category", category.toString());
    if (difficulty) url.searchParams.append("difficulty", difficulty);

    const res = await axios.get(url.toString());
    return res.data.results;
  } catch (error) {
    console.error("Failed to fetch quiz data:", error);
    return [];
  }
}
