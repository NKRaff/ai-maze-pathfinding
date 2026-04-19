import { getRandomInt, getRandomOddIntBetween } from "../../../utils/helpers.js"
import { CellState } from "../../types/CellState.js"
import { CellType } from "../../types/CellType.js"

export default class Prim {
  *generate(maze, perfectMaze) {
    const loopChance = perfectMaze ? 0 : 0.15
    const grid = maze.grid
    const fronties = []

    const row = getRandomOddIntBetween(1, grid.rows - 2)
    const col = getRandomOddIntBetween(1, grid.cols - 2)
    const start = grid.getCell(row, col)

    start.type = CellType.PATH
    start.state = CellState.GENERATED

    fronties.push(...grid.getNeighbors(start, CellType.WALL, 2))

    while (fronties.length > 0) {
      const current = fronties.splice(getRandomInt(fronties.length), 1)[0]
      const visitedNeighbors = grid.getNeighbors(current, CellType.PATH, 2)

      if (visitedNeighbors.length > 0) {
        const neighbor = visitedNeighbors[getRandomInt(visitedNeighbors.length)]
        const wall = grid.getCellBetween(current, neighbor)
        wall.type = CellType.PATH
        wall.state = CellState.GENERATED

        if (Math.random() < loopChance) {
          const otherNeighbor = visitedNeighbors.filter(n => n !== neighbor)
          if (otherNeighbor.length > 0) {
            const extraNeighbor = otherNeighbor[getRandomInt(otherNeighbor.length)]
            const extraWall = grid.getCellBetween(current, extraNeighbor)
            extraWall.type = CellType.PATH
            extraWall.state = CellState.GENERATED
          }
        }
      }

      current.type = CellType.PATH
      current.state = CellState.GENERATED

      this.#addFrontier(current, maze, fronties)
      
      yield
    }
  }

  #addFrontier(current, maze, frontier) {
    const neighbors = maze.grid.getNeighbors(current, CellType.WALL, 2)
    for (const n of neighbors) {
      if (n.state !== CellState.GENERATING){
        n.state = CellState.GENERATING
        frontier.push(n)
      }
    }
  }
}