import * as React from "react";

import { CellItem } from "modules/Sudoku/models";

interface CellProps {
  cell: CellItem;
  onInputChange: (
    cell: CellItem
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const getStyles = (cell: CellItem) => {
  const { x, y, disabled } = cell;

  return {
    borderRight: x % 3 === 2 ? "2px solid #666" : "none",
    borderBottom: y % 3 === 2 ? "2px solid #666" : "none",
    color: disabled ? "#666" : "#000",
    backgroundColor: disabled ? "#eee" : "#fff",
  };
};

export const Cell: React.FC<CellProps> = (props) => {
  const { cell, onInputChange } = props;
  const { id, value, disabled } = cell;

  return (
    <input
      type="text"
      autoComplete="off"
      className="cell"
      style={getStyles(cell)}
      id={id}
      key={id}
      value={value}
      disabled={disabled}
      onChange={(event) => (cell: CellItem) => onInputChange(cell)}
    />
  );
};
