import { getRandomOddIntBetween } from "../../../utils/helpers.js"
import { CellState } from "../../types/CellState.js"
import { CellTerrain } from "../../types/CellTerrain.js"
import { CellType } from "../../types/CellType.js"

export default class Greedy {
  constructor(heuristic) {
    this.heuristic = heuristic
  }

  *solver(maze) {
    const timeStart = performance.now()
    const grid = maze.grid
    const priorityList = []

    let visiting = 0
    let visited = 0
    let maxFrontierSize = 0

    priorityList.push({
      cell: maze.start,
      h: this.heuristic(maze.start, maze.end),
      parent: null
    })

    while (priorityList.length > 0) {
      priorityList.sort((a, b) => a.h - b.h)

      if (priorityList.length > maxFrontierSize) maxFrontierSize = priorityList.length

      const current = priorityList.shift()
      
      if (current.cell.state === CellState.VISITED) continue;

      current.cell.state = CellState.VISITED
      visited += 1

      if (current.cell === maze.end) {
        const timeEnd = performance.now()
        const {pathLength, pathCost} = this.#reconstructPath(current)
        return {
          algorithm: "Greedy",
          heuristic: this.heuristic,
          time: timeEnd - timeStart,
          visiting,
          visited,
          pathCost,
          pathLength,
          maxFrontierSize
        }
      }

      const neighbors = grid.getNeighbors(current.cell, CellType.PATH, 1)
      for (const n of neighbors) {
        if (n.state === CellState.VISITED) continue;
        
        const existingNode = priorityList.find(node => node.cell === n)

        if (!existingNode)  {
          n.state = CellState.VISITING
          visiting += 1
          priorityList.push({
            cell: n,
            h: this.heuristic(n, maze.end),
            parent: current
          })
        }
      }
      
      yield
    }
  }

  #reconstructPath(node) {
    let current = node
    let pathLength = 0
    let pathCost = 0
    while (current && current.parent) {
      current.cell.state = CellState.PATH
      current = current.parent
      pathCost += current.cell.terrain
      pathLength += 1
    }
    return { pathLength, pathCost }
  }
}