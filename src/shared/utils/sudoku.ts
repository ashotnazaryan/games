import { CellItem } from "modules/Sudoku/models";

export const createEmptyBoard = (boardSize: number): CellItem[][] => {
  const items = new Array(boardSize);

  for (let i = 0; i < boardSize; i++) {
    items[i] = new Array(boardSize);

    for (let j = 0; j < boardSize; j++) {
      items[i][j] = {
        x: j,
        y: i,
        id: `${j}${i}`,
        sectionRowIndex: Math.floor(i / 3),
        sectionColumnIndex: Math.floor(j / 3),
        value: "",
      };
    }
  }

  return items;
}