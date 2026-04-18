import Grid from "../structures/Grid.js";
import { CellRole } from "../types/CellRole.js";
import { CellType } from "../types/CellType.js";

export default class Maze {
  constructor(rows, cols) {
    this.grid = new Grid(rows, cols)
    this.start = null
    this.end = null
    this.isStartTurn = true
  }

  setPoint(row, col) {
    const cell = this.grid.getCell(row, col)

    if (cell.type === CellType.WALL || cell === this.start || cell === this.end) return
    
    if (this.isStartTurn) {
      if (this.start) this.start.role = CellRole.NONE
      cell.role = CellRole.START
      this.start = cell
    } else {
      if (this.end) this.end.role = CellRole.NONE
      cell.role = CellRole.END
      this.end = cell
    }
    
    this.isStartTurn = !this.isStartTurn
  }

}