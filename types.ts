
export enum GameMode {
  MENU = 'MENU',
  CHALLENGE = 'CHALLENGE',
  LIBRARY = 'LIBRARY',
  FINISHED = 'FINISHED'
}

export enum QuestionTier {
  NAME = 'NAME',
  CAPITAL = 'CAPITAL',
  CURRENCY = 'CURRENCY'
}

export interface Country {
  code: string;
  name: string;
  nameKm: string;
  capital: string;
  capitalKm: string;
  currency: string;
  currencyKm: string;
  currencySymbol: string;
  flagUrl: string;
  continent: string;
}

export interface Question {
  country: Country;
  options: string[];
  correctAnswer: string;
  tier: QuestionTier;
}

export interface GameState {
  mode: GameMode;
  level: number;
  score: number;
  questionsAnswered: number;
  questionsInCurrentLevel: number;
}
