import * as React from "react";

import {
  Container,
  Complexity as ComplexityStyle,
  Board,
} from "./Sudoku.styles";

interface SudokuState {
  complexity: ComplexityTypes;
  board: Cell[][];
}

interface SudokuProps {}

// TODO move to separate model file
interface Cell {
  x: number;
  y: number;
  id: string;
  value: string;
  sectionRowIndex: number;
  sectionColumnIndex: number;
  disabled?: boolean;
}

interface Complexity {
  key: string;
  label: string;
}

// TODO move to separate constant file
enum ComplexityTypes {
  easy = "easy",
  normal = "normal",
  hard = "hard",
}

const complexityLabels: { [key: string]: string } = {
  [ComplexityTypes.easy]: "Easy",
  [ComplexityTypes.normal]: "Normal",
  [ComplexityTypes.hard]: "Hard",
};

const boardSize = 9;

const boardItems = (): Cell[][] => {
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
};

class Sudoku extends React.Component<SudokuProps, SudokuState> {
  private get board(): Cell[][] {
    return boardItems();
  }

  private get complexities(): Complexity[] {
    return Object.keys(complexityLabels).map((key) => ({
      key,
      label: complexityLabels[key],
    }));
  }

  state: SudokuState = {
    complexity: ComplexityTypes.normal,
    board: this.board,
  };

  componentDidMount() {
    this.initGame();
  }

  private initGame = (): void => {
    const { complexity } = this.state;

    switch (complexity) {
      case ComplexityTypes.easy: // 7/9
        this.fillBoard(7);
        break;

      case ComplexityTypes.normal: // 6/9
        this.fillBoard(6);
        break;

      case ComplexityTypes.hard: // 5/9
        this.fillBoard(5);
        break;

      default:
        break;
    }
  };

  private handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const complexity = Object.keys(complexityLabels).find(
      (key) => complexityLabels[key] === event.target.value
    ) as ComplexityTypes;

    this.setState({ ...this.state, complexity }, () => this.initGame());
  };

  private handleInputChange =
    (cell: Cell) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value.charAt(event.target.value.length - 1);
      const isPositiveNumber = /^\d*[1-9]\d*$/.test(value);

      if (value && !isPositiveNumber) {
        return;
      }

      const { board } = this.state;
      const updatedBoard = board.map((rows) =>
        rows.map((item) => ({
          ...item,
          value: cell.id === item.id ? value : item.value,
        }))
      );

      this.setState((state) => ({ ...state, board: updatedBoard }));
    };

  private generateRandomNumber = (
    min: number = 1,
    max: number = 9,
    omitArr: number[] = []
  ): number => {
    const randomNumber =
      Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
      Math.ceil(min);
    const existedRandomNumber = omitArr.some((item) => item === randomNumber);

    if (existedRandomNumber) {
      return this.generateRandomNumber(min, max, omitArr);
    }

    return randomNumber;
  };

  private generateRandomNumbers = (
    quantity: number = 9,
    max: number = 9,
    arr: string[] = []
  ): string[] => {
    while (arr.length < quantity) {
      const randomValue = `${Math.floor(Math.random() * max) + 1}`;

      if (!arr.includes(randomValue)) {
        arr.push(randomValue);
      }
    }

    for (let i = 0; i < 9 - quantity; i++) {
      arr.push("");
    }

    return arr;
  };

  private getHorizontalCells = (board: Cell[][], y: number): Cell[] => {
    return board[y];
  };

  private getVerticalCells = (board: Cell[][], x: number): Cell[] => {
    return board.map((rows) => rows.filter((cell) => cell.x === x)[0]);
  };

  private getSectionCells = (
    board: Cell[][],
    sectionRowIndex: number,
    sectionColumnIndex: number
  ): Cell[] => {
    return board
      .filter(
        (rows, rowIndex) =>
          rowIndex >= sectionRowIndex * 3 && rowIndex <= sectionRowIndex * 3 + 2
      )
      .map((row) =>
        row.filter((cell) => cell.sectionColumnIndex === sectionColumnIndex)
      )
      .reduce((acc, curr) => [...acc, ...curr], []);
  };

  private fillBoard = (complexity = 7) => {
    const { board } = this.state;
    const updatedBoard = board.map((rows, rowIndex, selfBoard) => {
      const randomRow = this.generateRandomNumbers(complexity);
      const randomIndexes: number[] = [];

      return rows.map((cell, cellIndex, selfRow) => {
        const self = JSON.parse(JSON.stringify(selfBoard));
        const randomIndex = this.generateRandomNumber(0, 8, randomIndexes);
        const randomValue = randomRow[randomIndex];
        const horizontal = this.getHorizontalCells(self, cell.y);
        const vertical = this.getVerticalCells(self, cell.x);
        const section = this.getSectionCells(
          self,
          cell.sectionRowIndex,
          cell.sectionColumnIndex
        );
        const availableInHorizaontal = horizontal.some(
          ({ value }) => value === randomValue
        );
        const availableInVertical = vertical.some(
          ({ value }) => value === randomValue
        );
        const availableInSection = section.some(
          ({ value }) => value === randomValue
        );
        const updatedCell =
          availableInHorizaontal || availableInVertical || availableInSection
            ? cell
            : {
                ...cell,
                value: randomValue,
                disabled: !!randomValue,
              };

        randomIndexes.push(randomIndex);
        self[rowIndex][randomIndex] = updatedCell;

        return updatedCell;
      });
    });

    this.setState((state) => ({ ...state, board: updatedBoard }));
    console.log("Updated board: ", updatedBoard);
  };

  render() {
    const { complexity, board } = this.state;
    const complexityLabel = complexityLabels[complexity];

    return (
      <Container>
        <ComplexityStyle>
          <select value={complexityLabel} onChange={this.handleSelectChange}>
            {this.complexities.map((item) => (
              <option key={item.key}>{item.label}</option>
            ))}
          </select>
        </ComplexityStyle>
        <Board id={`${boardSize}`}>
          {board.map((rows) =>
            rows.map((cell) => (
              // TODO move to a separate Cell component
              <input
                type="text"
                autoComplete="off"
                className="cell"
                // TODO move styles to separate method
                style={{
                  borderRight: cell.x % 3 === 2 ? "2px solid #666" : "none",
                  borderBottom: cell.y % 3 === 2 ? "2px solid #666" : "none",
                  color: cell.disabled ? "#666" : "#000",
                  backgroundColor: cell.disabled ? "#eee" : "#fff",
                }}
                id={cell.id}
                key={cell.id}
                value={cell.value}
                disabled={cell.disabled}
                onChange={this.handleInputChange(cell)}
              />
            ))
          )}
        </Board>
      </Container>
    );
  }
}

export default Sudoku;
