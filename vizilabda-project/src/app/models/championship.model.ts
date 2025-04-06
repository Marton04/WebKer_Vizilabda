export interface Team {
  id: number;
  name: string;
  points: number;
}

export interface Match {
  team1: Team;
  team2: Team;
  date: string;
  score1: number | null;
  score2: number | null;
  resultSaved?: boolean; 
}

export interface Matchday {
  date: string;
  matches: Match[];
}

export interface Championship {
  name: string;
  teams: Team[];
  matchdays: Matchday[];
}
