import * as React from "react";

import {
  Container,
  Complexity as ComplexityStyle,
  Board,
} from "./Sudoku.styles";
import { CellItem, Complexity } from "./models";
import { ComplexityTypes, complexityLabels, boardSize } from "./constants";
import { createEmptyBoard } from "../../shared/utils";
import { Cell } from "./components/Cell";

interface SudokuState {
  complexity: ComplexityTypes;
  board: CellItem[][];
}

interface SudokuProps {}

const boardItems = (): CellItem[][] => {
  return createEmptyBoard(boardSize);
};

class Sudoku extends React.Component<SudokuProps, SudokuState> {
  private get board(): CellItem[][] {
    return boardItems();
  }

  private get complexities(): Complexity[] {
    return Object.keys(complexityLabels).map((key) => ({
      key,
      label: complexityLabels[key],
    }));
  }

  private counter = 0;

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
    (cell: CellItem) =>
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

  private generateRandomUniqueNumber = (
    min: number = 1,
    max: number = 9,
    omitArr: number[] = []
  ): number => {
    this.counter++;
    const randomNumber =
      Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
      Math.ceil(min);
    const existedRandomNumber = omitArr.some((item) => item === randomNumber);

    if (existedRandomNumber && this.counter < 3000) {
      return this.generateRandomUniqueNumber(min, max, omitArr);
    }

    return randomNumber;
  };

  private generateRandomNumbers = (
    quantity: number = 9,
    max: number = 9,
    arr: string[] = []
  ): string[] => {
    while (arr.length < quantity) {
      const randomNumber = `${Math.floor(Math.random() * max) + 1}`;

      if (!arr.includes(randomNumber)) {
        arr.push(randomNumber);
      }
    }

    for (let i = 0; i < 9 - quantity; i++) {
      arr.push("");
    }

    return arr;
  };

  private getHorizontalCells = (board: CellItem[][], y: number): CellItem[] => {
    return board[y];
  };

  private getVerticalCells = (board: CellItem[][], x: number): CellItem[] => {
    return board.map((rows) => rows.filter((cell) => cell.x === x)[0]);
  };

  private getSectionCells = (
    board: CellItem[][],
    sectionRowIndex: number,
    sectionColumnIndex: number
  ): CellItem[] => {
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
    const self: CellItem[][] = JSON.parse(JSON.stringify(board));
    const emptyBoard = board.map((rows) =>
      rows.map((cell) => ({
        ...cell,
        value: "",
      }))
    );
    // FIXME wrong algorithm
    const updatedBoard = emptyBoard.map((rows, rowIndex) => {
      return rows.map((cell, cellIndex) => {
        const horizontal = this.getHorizontalCells(self, cell.y).map(
          ({ value }) => Number(value)
        );
        const vertical = this.getVerticalCells(self, cell.x).map(({ value }) =>
          Number(value)
        );
        const section = this.getSectionCells(
          self,
          cell.sectionRowIndex,
          cell.sectionColumnIndex
        ).map(({ value }) => Number(value));
        const randomValue = `${this.generateRandomUniqueNumber(1, 9, [
          ...horizontal,
          ...vertical,
          ...section,
        ])}`;
        const updatedCell = {
          ...cell,
          value: randomValue,
          disabled: !!randomValue,
        };

        self[rowIndex][cellIndex] = updatedCell;

        return updatedCell;
      });
    });

    this.setState((state) => ({ ...state, board: updatedBoard }));
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
              <Cell
                key={cell.id}
                cell={cell}
                onInputChange={this.handleInputChange}
              />
            ))
          )}
        </Board>
      </Container>
    );
  }
}

export default Sudoku;
