export enum ComplexityTypes {
  easy = "easy",
  normal = "normal",
  hard = "hard",
}

export const complexityLabels: { [key: string]: string } = {
  [ComplexityTypes.easy]: "Easy",
  [ComplexityTypes.normal]: "Normal",
  [ComplexityTypes.hard]: "Hard",
};

export const boardSize = 9;