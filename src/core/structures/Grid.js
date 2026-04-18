import Cell from "./Cell.js"

export default class Grid {
  constructor(rows, cols) {
    this.rows = rows % 2 === 0 ? ++rows : rows
    this.cols = cols % 2 === 0 ? ++cols : cols
    this.cells = this.#createGrid()
  }

  #createGrid() {
    const grid = []
    for (let r = 0; r < this.rows; r++) {
      const row = []
      for (let c = 0; c < this.cols; c++) {
        row.push(new Cell(r, c))
      }
      grid.push(row)
    }
    return grid
  }

  getCell(row, col) {
    return this.cells[row][col]
  }

  getCellBetween(current, neighbor) {
    const row = (current.row + neighbor.row) / 2
    const col = (current.col + neighbor.col) / 2
    return this.getCell(row, col)
  }

  getNeighbors(current, type, distance) {
    const neighbors = []
    const positions = [
      [+distance, 0],
      [-distance, 0],
      [0, +distance],
      [0, -distance],
    ]

    for (const [r, c] of positions) {
      const nr = current.row + r
      const nc = current.col + c
      
      if (nr > 0 && nr < this.rows && nc > 0 && nc < this.cols) {
        const neighbor = this.getCell(nr, nc)
        if (neighbor.type === type) {
          neighbors.push(neighbor)
        }
      }
    }

    return neighbors
  }
}