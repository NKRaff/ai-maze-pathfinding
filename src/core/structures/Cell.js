import { CellRole } from "../types/CellRole.js"
import { CellState } from "../types/CellState.js"
import { CellType } from "../types/CellType.js"

export default class Cell {
  constructor(row, col) {
    this.row = row
    this.col = col
    this.type = CellType.WALL
    this.role = CellRole.NONE
    this.state = CellState.DEFAULT
  }
}