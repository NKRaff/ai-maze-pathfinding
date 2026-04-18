import { getRandomOddIntBetween } from "../../../utils/helpers.js"
import { CellState } from "../../types/CellState.js"
import { CellType } from "../../types/CellType.js"

export default class AStar {
  constructor(heuristic) {
    this.heuristic = heuristic
  }

  *solver(maze) {
    const grid = maze.grid
    const priorityList = []

    priorityList.push({
      cell: maze.start,
      g: 0,
      h: this.heuristic(maze.start, maze.end),
      f: this.heuristic(maze.start, maze.end),
      parent: null
    })

    while (priorityList.length > 0) {
      priorityList.sort((a, b) => a.f - b.f)

      const current = priorityList.shift()
      current.state = CellState.VISITED

      if (current.cell === maze.end) {
        return this.#reconstructPath(current)
      }

      const neighbors = grid.getNeighbors(current.cell, CellType.PATH, 1)
      for (const n of neighbors) {
        if (n.state === CellState.VISITING) continue

        const existingNode = priorityList.find(node => node.cell === n)
        if (!existingNode)  {
          n.state = CellState.VISITING
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
    while (current && current.parent) {
      current.cell.state = CellState.PATH
      current = current.parent
    }
  }
}