import { getCellTypePath, getRandomInt, getRandomOddIntBetween, shuffle } from "../../../utils/helpers.js"
import { CellState } from "../../types/CellState.js"
import { CellTerrain } from "../../types/CellTerrain.js"
import { CellType } from "../../types/CellType.js"

export default class Backtracking {
  *generate(maze, perfectMaze, terrains) {
    const grid = maze.grid
    const loopChance = perfectMaze ? 0 : 0.15

    const stack = []
    const generating = []

    const row = getRandomOddIntBetween(1, grid.rows - 2)
    const col = getRandomOddIntBetween(1, grid.cols - 2)
    const start = grid.getCell(row, col)

    start.type = CellType.PATH
    start.state = CellState.GENERATING
    
    generating.push(start)
    stack.push(start)

    while (stack.length > 0) {
      const current = stack[stack.length - 1]
      const neighbors = grid.getNeighbors(current, CellType.WALL, 2)

      if (neighbors.length > 0) {
        const next = neighbors[getRandomInt(neighbors.length)]
        const wall = grid.getCellBetween(current, next)
        
        next.type = CellType.PATH
        next.state = CellState.GENERATING
        generating.push(next)
        
        wall.type = CellType.PATH
        wall.state = CellState.GENERATING
        
        generating.push(wall)
        stack.push(next)
      } else {
        generating.forEach(cell => cell.state = CellState.GENERATED)
        generating.length = 0
        stack.pop()
      }
      
      if (Math.random() < loopChance) {
        generating.push(this.#createLoop(current, maze))
      }
        
      yield
    }
    this.#updateTerrain(maze, terrains)
    generating.forEach(cell => cell.state = CellState.GENERATED)
  }

  #createLoop(current, maze) {
    const neighbors = maze.grid.getNeighbors(current, CellType.PATH, 2)
    if (neighbors <= 0) return

    const neighbor = neighbors[getRandomInt(neighbors.length)]
    const wall = maze.grid.getCellBetween(current, neighbor)

    wall.type = CellType.PATH
    wall.state = CellState.GENERATING

    return wall
  }

  #updateTerrain(maze, terrains) {
    let cellPath = getCellTypePath(maze);
    cellPath = shuffle(cellPath);

    const totalCells = cellPath.length; 

    for (let i = 0; i < terrains.length; i++) {
      const nTerrain = Math.round(totalCells * (terrains[i].value / 100));

      for (let j = 0; j < nTerrain; j++) {
        if (cellPath.length === 0) break; 
        
        const cell = cellPath.pop();
        cell.terrain = terrains[i].type;
      }
    }
  }

}