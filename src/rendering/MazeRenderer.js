import { CellRoleColor, CellStateColor, CellTerrainColor, Colors } from "./Colors.js"

export default class MazeRenderer {
  constructor(canvas, cellSize) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext("2d")
    this.cellSize = cellSize
  }

  setup(rows, cols) {
    this.canvas.width = cols * this.cellSize
    this.canvas.height = rows * this.cellSize
  }

  draw(maze) {
    const grid = maze.grid
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const cell = grid.getCell(r, c)
        const x = cell.col * this.cellSize
        const y = cell.row * this.cellSize

        this.ctx.fillStyle = this.#getColor(cell)
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize)
      }
    }
  }

  #getColor(cell) {
    return CellRoleColor[cell.role] ?? CellStateColor[cell.state] ?? CellTerrainColor[cell.terrain] ?? Colors.DARK
  }
}