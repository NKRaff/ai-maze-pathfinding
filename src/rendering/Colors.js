import { CellRole } from "../core/types/CellRole.js"
import { CellState } from "../core/types/CellState.js"

export const Colors = {
  DARK: "#191923",
  LIGHT: "#f4f4f4",
  GREEN: "#32936F",
  RED: "#C14953",
  YELLOW: "#e2d34c",
  BLUE: "#0E79B2",
  DARK_BLUE: "#222261"
}

export const CellRoleColor = {
  [CellRole.START]: Colors.GREEN,
  [CellRole.END]: Colors.RED 
}

export const CellStateColor = {
  [CellState.DEFAULT]: Colors.DARK,
  [CellState.GENERATING]: Colors.BLUE,
  [CellState.GENERATED]: Colors.LIGHT,
  [CellState.VISITING]: Colors.BLUE,
  [CellState.VISITED]: Colors.BLUE,
  [CellState.PATH]: Colors.YELLOW,
}