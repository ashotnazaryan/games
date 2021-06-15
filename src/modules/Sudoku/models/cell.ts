export interface CellItem {
  x: number;
  y: number;
  id: string;
  value: string;
  sectionRowIndex: number;
  sectionColumnIndex: number;
  disabled?: boolean;
}