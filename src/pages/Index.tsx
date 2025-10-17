import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, TrendingUp, Award, Zap, Target } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBanner})`,
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative container mx-auto px-4 py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Trophy className="h-20 w-20 text-accent animate-pulse-glow" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Welcome to <span className="gradient-accent bg-clip-text text-transparent">SkillQuest</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Turn learning into an adventure. Earn XP, unlock levels, and compete on leaderboards
              while mastering new skills!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="gradient-primary text-lg h-14 px-8">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Quest
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-primary bg-clip-text text-transparent">
            Why Choose SkillQuest?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-shadow hover:scale-105 transition-smooth">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full gradient-primary">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Earn XP & Level Up</h3>
                <p className="text-muted-foreground">
                  Complete quizzes to earn experience points and climb through the levels. Watch
                  your progress grow with every challenge!
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:scale-105 transition-smooth">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full gradient-accent">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Compete on Leaderboards</h3>
                <p className="text-muted-foreground">
                  See how you stack up against other learners. Climb the ranks and become a top
                  player in the SkillQuest community!
                </p>
              </CardContent>
            </Card>

            <Card className="card-shadow hover:scale-105 transition-smooth">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full gradient-success">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Unlock Achievements</h3>
                <p className="text-muted-foreground">
                  Earn badges and achievements as you reach milestones. Show off your
                  accomplishments and become a master learner!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-secondary bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up in seconds and start your learning journey. Choose your username and
                  you're ready to go!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Take Quizzes</h3>
                <p className="text-muted-foreground">
                  Choose from various topics and difficulty levels. Answer questions, learn new
                  things, and have fun!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-success flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Level Up & Compete</h3>
                <p className="text-muted-foreground">
                  Earn XP, unlock new levels, and climb the leaderboard. Track your progress and
                  become a SkillQuest champion!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10" />
        <div className="relative container mx-auto px-4 text-center">
          <Target className="h-16 w-16 mx-auto mb-6 text-white animate-float" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Learning Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are leveling up their skills every day!
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg h-14 px-8">
              <Trophy className="mr-2 h-5 w-5" />
              Begin Your Quest Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
