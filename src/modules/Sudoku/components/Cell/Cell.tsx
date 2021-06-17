import * as React from "react";
import { CellItem } from "../../models";

interface CellProps {
  cell: CellItem;
  onInputChange: (
    cell: CellItem
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Cell: React.FC<CellProps> = (props) => {
  const { cell, onInputChange } = props;

  const getStyles = (cell: CellItem) => {
    return {
      borderRight: cell.x % 3 === 2 ? "2px solid #666" : "none",
      borderBottom: cell.y % 3 === 2 ? "2px solid #666" : "none",
      color: cell.disabled ? "#666" : "#000",
      backgroundColor: cell.disabled ? "#eee" : "#fff",
    };
  };

  return (
    <input
      type="text"
      autoComplete="off"
      className="cell"
      style={getStyles(cell)}
      id={cell.id}
      key={cell.id}
      value={cell.value}
      disabled={cell.disabled}
      onChange={(event) => (cell: CellItem) => onInputChange(cell)}
    />
  );
};
