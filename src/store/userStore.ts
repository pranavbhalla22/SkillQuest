// src/store/userStore.ts
import { create } from "zustand";

interface Badge {
  id: string;
  name: string;
  description: string;
}

interface UserState {
  xp: number;
  badges: Badge[];
  addXP: (points: number) => void;
  addBadge: (badge: Badge) => void;
  resetProgress: () => void;
}

// XP thresholds for different badges
const BADGES: Badge[] = [
  { id: "rookie", name: "Rookie Learner", description: "Earn your first 50 XP!" },
  { id: "scholar", name: "Rising Scholar", description: "Reach 150 XP!" },
  { id: "master", name: "Knowledge Master", description: "Reach 300 XP!" },
];

export const useUserStore = create<UserState>((set, get) => ({
  xp: Number(localStorage.getItem("xp")) || 0,
  badges: JSON.parse(localStorage.getItem("badges") || "[]"),

  addXP: (points) => {
    const newXP = get().xp + points;
    localStorage.setItem("xp", newXP.toString());
    set({ xp: newXP });

    // Check for badge unlocks
    BADGES.forEach((badge) => {
      const alreadyHasBadge = get().badges.find((b) => b.id === badge.id);
      if (!alreadyHasBadge && newXP >= parseInt(badge.id === "rookie" ? "50" : badge.id === "scholar" ? "150" : "300")) {
        get().addBadge(badge);
      }
    });
  },

  addBadge: (badge) => {
    const updatedBadges = [...get().badges, badge];
    localStorage.setItem("badges", JSON.stringify(updatedBadges));
    set({ badges: updatedBadges });
  },

  resetProgress: () => {
    localStorage.removeItem("xp");
    localStorage.removeItem("badges");
    set({ xp: 0, badges: [] });
  },
}));
