import { getRandomOddIntBetween } from "../../../utils/helpers.js"
import { CellState } from "../../types/CellState.js"
import { CellType } from "../../types/CellType.js"

export default class AStar {
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
      g: 0,
      h: this.heuristic(maze.start, maze.end),
      f: this.heuristic(maze.start, maze.end),
      parent: null
    })

    while (priorityList.length > 0) {
      priorityList.sort((a, b) => a.f - b.f)

      if (priorityList.length > maxFrontierSize) maxFrontierSize = priorityList.length

      const current = priorityList.shift()
      current.cell.state = CellState.VISITED
      visited += 1

      if (current.cell === maze.end) {
        const timeEnd = performance.now()
        const pathLength = this.#reconstructPath(current)
        return {
          algorithm: "A*",
          heuristic: this.heuristic,
          time: timeEnd - timeStart,
          visiting,
          visited,
          pathCost: current.g,
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
          priorityList.push(this.#createNode(current, n, maze.end))
        } else if (current.g + 1 < existingNode.g) {
          existingNode.g = current.g + 1
          existingNode.f = current.g + 1 + existingNode.h
          existingNode.parent = current
        }
      }
      
      yield
    }
  }

  #createNode(current, neighbor, end) {
    const g = current.g + 1
    const h = this.heuristic(neighbor, end)
    const f = g + h
    return { cell: neighbor, g, h, f, parent: current }
  }

  #reconstructPath(node) {
    let current = node
    let pathLength = 0
    while (current && current.parent) {
      current.cell.state = CellState.PATH
      current = current.parent
      pathLength += 1
    }
    return pathLength
  }
}