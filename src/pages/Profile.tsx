import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Award as AwardIcon } from "lucide-react";

interface Profile {
  username: string;
  total_xp: number;
  level: number;
  avatar_url: string | null;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    fetchAchievements(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchAchievements = async (userId: string) => {
    const { data } = await supabase
      .from("user_achievements")
      .select(`
        achievement_id,
        achievements (
          id,
          name,
          description,
          icon
        )
      `)
      .eq("user_id", userId);

    if (data) {
      const achievementsList = data
        .map((item: any) => item.achievements)
        .filter(Boolean);
      setAchievements(achievementsList);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">Loading profile...</div>
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
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="gradient-primary text-white text-3xl">
                    {profile?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{profile?.username}</h1>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge className="gradient-primary text-white">
                      <Trophy className="h-3 w-3 mr-1" />
                      Level {profile?.level}
                    </Badge>
                    <Badge variant="outline">
                      <Star className="h-3 w-3 mr-1 text-accent" />
                      {profile?.total_xp.toLocaleString()} XP
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress to Level {(profile?.level || 0) + 1}</span>
                      <span className="font-medium">{Math.round(xpProgress)}%</span>
                    </div>
                    <Progress value={xpProgress} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AwardIcon className="h-5 w-5 text-accent" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border border-border bg-card hover:bg-accent/10 transition-smooth"
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AwardIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No achievements yet. Complete quizzes to earn them!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
