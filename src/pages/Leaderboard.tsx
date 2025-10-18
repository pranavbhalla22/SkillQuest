import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  id: string;
  username: string;
  total_xp: number;
  level: number;
  avatar_url: string | null;
}

interface Profile {
  username: string;
  level: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchLeaderboard();
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

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("total_xp", { ascending: false })
      .limit(100);

    if (!error && data) {
      setLeaderboard(data);
    }
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-accent" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 gradient-accent bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">See how you rank against other learners</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">Loading leaderboard...</div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-3">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;

              return (
                <Card
                  key={entry.id}
                  className={`card-shadow transition-smooth hover:scale-[1.02] ${
                    isTopThree ? "glow-primary" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-12 flex justify-center">
                        {getRankIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="gradient-primary text-white">
                          {entry.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* User info */}
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{entry.username}</div>
                        <div className="text-sm text-muted-foreground">
                          Level {entry.level}
                        </div>
                      </div>

                      {/* XP */}
                      <div className="text-right">
                        <div className="font-bold text-xl text-accent">
                          {entry.total_xp.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">XP</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
