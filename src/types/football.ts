
export interface Player {
  id: number;
  name: string;
}

export interface Square {
  row: number;
  col: number;
  player?: string;
}

export interface LiveScores {
  chiefs: number;
  eagles: number;
}

export interface Scores {
  chiefs: string;
  eagles: string;
}

export interface QuarterWinners {
  [key: string]: string;
}
