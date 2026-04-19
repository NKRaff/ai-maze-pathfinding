import Grid from "../structures/Grid.js";
import { CellRole } from "../types/CellRole.js";
import { CellType } from "../types/CellType.js";

export default class Maze {
  constructor(rows, cols, initPoints = false) {
    this.grid = new Grid(rows, cols)
    this.start = null
    this.end = null
    this.isStartTurn = true

    if (initPoints) this.#initPoints()
  }

  setPoint(row, col) {
    const cell = this.grid.getCell(row, col)
    if (cell.type === CellType.WALL || cell === this.start || cell === this.end) return
    this.isStartTurn ? this.setStart(cell) : this.setEnd(cell) 
  }

  clone() {
    const newMaze = new Maze(this.grid.rows, this.grid.cols, false)
    newMaze.grid = this.grid.clone()

    if (this.start) {
      newMaze.setStart(newMaze.grid.getCell(this.start.row, this.start.col))
    }

    if (this.end) {
      newMaze.setEnd(newMaze.grid.getCell(this.end.row, this.end.col))
    }

    newMaze.isStartTurn = this.isStartTurn

    return newMaze
  }

  #initPoints() {
    const start = this.grid.getCell(1, 1)
    const end = this.grid.getCell(this.grid.rows - 2, this.grid.cols - 2)
    this.setStart(start)
    this.setEnd(end)
  }

  setStart(cell) {
    if (this.start) this.start.role = CellRole.NONE
    cell.role = CellRole.START
    this.start = cell
  }
  
  setEnd(cell) {
    if (this.end) this.end.role = CellRole.NONE
    cell.role = CellRole.END
    this.end = cell
  }
}