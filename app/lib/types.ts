export type Match = {
  id: number;
  result: "win" | "loss" | "pending";
  eloChange: number;
  eloAfter: number | null;
  kills: number;
  assists: number;
  deaths: number;
  map: string | null;
  mode: string | null;
  createdAt: string;
};

export type Badge = {
  id: string;
  label: string;
  tone: "vip" | "dev" | "admin" | "pink" | "purple" | "default";
};

export type Profile = {
  nickname: string;
  gameId: string;
  username: string | null;
  avatarUrl: string | null;
  badges: Badge[];
  elo: number;
  wins: number;
  losses: number;
  winrate: number;
  wlRatio: number;
  kd: number;
  kills: number;
  assists: number;
  deaths: number;
  winStreak: number;
  bestWinStreak: number;
  trustFactor: number;
  warns: number;
  vip: boolean;
  verified: boolean;
  level: number;
  nextLevel: number | null;
  needElo: number;
  calibration: { active: boolean; played: number; required: number };
  privatka: string | null;
  medals: { id: string; rank: string; awardedAt: string }[];
  matches: Match[];
};
