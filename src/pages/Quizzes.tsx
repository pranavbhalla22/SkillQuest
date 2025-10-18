import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Star, Clock, Trophy } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xp_reward: number;
  time_limit: number | null;
}

interface Profile {
  username: string;
  level: number;
}

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchQuizzes();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("username, level")
      .eq("id", session.user.id)
      .single();

    if (data) setProfile(data);
  };

  const fetchQuizzes = async () => {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQuizzes(data);
    }
    setLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success/20 text-success";
      case "medium":
        return "bg-accent/20 text-accent";
      case "hard":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Available Quizzes
          </h1>
          <p className="text-muted-foreground">Choose a challenge and test your knowledge!</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">Loading quizzes...</div>
          </div>
        ) : quizzes.length === 0 ? (
          <Card className="card-shadow">
            <CardContent className="py-12 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No quizzes available yet</h3>
              <p className="text-muted-foreground">Check back soon for new challenges!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <Card
                key={quiz.id}
                className="card-shadow hover:scale-105 transition-smooth cursor-pointer animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/quiz/${quiz.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-accent font-bold">
                      <Star className="h-4 w-4" />
                      {quiz.xp_reward} XP
                    </div>
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {quiz.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {quiz.time_limit && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {Math.floor(quiz.time_limit / 60)} min
                      </div>
                    )}
                    <Button className="gradient-primary">
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Quizzes;
