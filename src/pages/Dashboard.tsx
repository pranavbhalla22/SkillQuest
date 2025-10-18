import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Target, Award, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string;
  total_xp: number;
  level: number;
}

interface QuizAttempt {
  score: number;
  total_questions: number;
  xp_earned: number;
  completed_at: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    fetchProfile(session.user.id);
    fetchRecentAttempts(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchRecentAttempts = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_quiz_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentAttempts(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  const xpToNextLevel = profile ? Math.pow((profile.level), 2) * 100 : 100;
  const xpProgress = profile ? ((profile.total_xp % xpToNextLevel) / xpToNextLevel) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.username}!</h1>
          <p className="text-muted-foreground">Ready to level up your skills?</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Level Card */}
          <Card className="card-shadow animate-slide-in">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Trophy className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                {profile?.level}
              </div>
              <Progress value={xpProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {profile?.total_xp} / {xpToNextLevel} XP
              </p>
            </CardContent>
          </Card>

          {/* Total XP Card */}
          <Card className="card-shadow animate-slide-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total XP</CardTitle>
              <Star className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {profile?.total_xp.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Experience points earned
              </p>
            </CardContent>
          </Card>

          {/* Quizzes Completed */}
          <Card className="card-shadow animate-slide-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
              <Target className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {recentAttempts.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Challenges conquered
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAttempts.length > 0 ? (
                <div className="space-y-4">
                  {recentAttempts.map((attempt, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">
                          Score: {attempt.score}/{attempt.total_questions}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(attempt.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent">+{attempt.xp_earned} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No quizzes completed yet. Start your first challenge!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full gradient-primary justify-start"
                onClick={() => navigate("/quizzes")}
              >
                <Trophy className="mr-2 h-4 w-4" />
                Start New Quiz
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/leaderboard")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Leaderboard
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/profile")}
              >
                <Award className="mr-2 h-4 w-4" />
                View Achievements
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
