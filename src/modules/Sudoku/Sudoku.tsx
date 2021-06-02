import * as React from "react";

import { Container, Difficulty, Board } from "./Sudoku.styles";

interface SudokuState {
  difficulty: string;
  board: Cell[][];
}

interface SudokuProps {}

interface Cell {
  x: number;
  y: number;
  id: string;
  value: string;
}

enum DifficultyTypes {
  very_easy,
  easy,
  normal,
  hard,
  very_hard,
}

const difficulties = [
  { key: DifficultyTypes.very_easy, value: "Very easy" },
  { key: DifficultyTypes.easy, value: "Easy" },
  { key: DifficultyTypes.normal, value: "Normal" },
  { key: DifficultyTypes.hard, value: "Hard" },
  { key: DifficultyTypes.very_hard, value: "Very hard" },
];

class Sudoku extends React.Component<SudokuProps, SudokuState> {
  private boardSize = 9;

  private get board(): Cell[][] {
    const boardItems = new Array(this.boardSize);

    for (let i = 0; i < this.boardSize; i++) {
      boardItems[i] = new Array(this.boardSize);

      for (let j = 0; j < this.boardSize; j++) {
        boardItems[i][j] = { x: i, y: j, id: `${i}${j}`, value: "" };
      }
    }

    return boardItems;
  }

  state: SudokuState = {
    difficulty: difficulties[2].value,
    board: this.board,
  };

  componentDidMount() {
    console.log(this.board);
    this.initGame();
  }

  private initGame = (): void => {};

  private handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    this.setState((state) => ({ ...state, difficulty: event.target.value }));
  };

  private handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    cell: Cell
  ): void => {
    const value = event.target.value.charAt(event.target.value.length - 1);
    const isPositiveNumber = /^\d*[1-9]\d*$/.test(value);

    if (value && !isPositiveNumber) {
      return;
    }

    const { board } = this.state;
    const updatedBoard = board.map((rows) =>
      rows.map((item) => ({
        ...item,
        value:
          cell.id === item.id ? value.charAt(value.length - 1) : item.value,
      }))
    );

    this.setState((state) => ({ ...state, board: updatedBoard }));
  };

  render() {
    const { difficulty, board } = this.state;

    return (
      <Container>
        <Difficulty>
          <select value={difficulty} onChange={this.handleSelectChange}>
            {difficulties.map((difficulty) => (
              <option key={difficulty.key}>{difficulty.value}</option>
            ))}
          </select>
        </Difficulty>
        <Board id={`${this.boardSize}`}>
          {board.map((rows, rowIndex) => (
            <div key={rows[rowIndex].id} className="sub-board">
              {rows.map((cell) => (
                <input
                  type="text"
                  className="cell"
                  key={cell.id}
                  value={cell.value}
                  onChange={(event) => this.handleInputChange(event, cell)}
                />
              ))}
            </div>
          ))}
        </Board>
      </Container>
    );
  }
}

export default Sudoku;
