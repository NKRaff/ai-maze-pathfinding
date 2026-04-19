import AppController from "./controllers/AppController.js"
import Maze from "./core/maze/Maze.js"
import MazeGenerator from "./core/maze/MazeGenerator.js"
import MazeSolver from "./core/maze/MazeSolver.js"
import MazeRenderer from "./rendering/MazeRenderer.js"
import { createCard, eraseStats, fillStats, getCellSize } from "./utils/helpers.js"

//const canvas = document.querySelector("#maze-canvas")
const btnGenerate = document.querySelector("#generate-maze")
const btnAllGenerate = document.querySelector("#generate-all-maze")
const btnSolve = document.querySelector("#solve-maze")
const btnAllSolve = document.querySelector("#solve-all-maze")

const controller = new AppController()

let maze
let renderer
let rendererList = []
const combinations = createCard()

btnGenerate.addEventListener("click", () => {
  const rows = Number(document.querySelector("#rows").value)
  const cols = Number(document.querySelector("#cols").value)
  const cellSize = Number(document.querySelector("#cell-size").value)
  const perfectMaze = document.querySelector("#perfect-maze").checked
  const enableAnimation = document.querySelector("#animation").checked
  
  maze = new Maze(rows, cols)
  renderer = new MazeRenderer(canvas, cellSize)
  
  const mazeGenerator = new MazeGenerator().create("backtraking")
  const generator = mazeGenerator.generate(maze, perfectMaze)
  
  controller.handle(generator, renderer, maze, enableAnimation)
})

btnAllGenerate.addEventListener("click", () => {
  const canvases = document.querySelectorAll(".maze-canvas")
  const canvasWrapper = document.querySelector(".canvas-wrapper")
  const cardWidth = canvasWrapper.clientWidth

  const rows = Number(document.querySelector("#rows").value)
  const cols = Number(document.querySelector("#cols").value)
  const cellSize = getCellSize(rows, cols, cardWidth)

  const perfectMaze = document.querySelector("#perfect-maze").checked
  const enableAnimation = document.querySelector("#animation").checked
  const algorithm = document.querySelector("#generation-algorithm").value

  maze = new Maze(rows, cols, true)
  rendererList.length = 0

  const mazeGenerator = new MazeGenerator().create("backtraking")
  const generator = mazeGenerator.generate(maze, perfectMaze)
  
  canvases.forEach((canvas, index) => {
    eraseStats(index)
    const render = new MazeRenderer(canvas, cellSize)
    render.setup(maze.grid.rows, maze.grid.cols)
    rendererList.push(render)
    controller.handle(generator, render, maze, enableAnimation)
  })

})

btnAllSolve.addEventListener("click", async () => {
  const enableAnimation = document.querySelector("#animation").checked
  
  for (let i = 0; i < combinations.length; i++) {
    const render = rendererList[i]
    if(render) {
      const mazeClone = maze.clone()
      const mazeSolver = new MazeSolver().create(combinations[i].algo, combinations[i].heur)
      const solver = mazeSolver.solver(mazeClone)
      const stats = await controller.handle(solver, render, mazeClone, enableAnimation)
      fillStats(i, stats)
    }
    console.log('terminou')
  }
})

btnSolve.addEventListener("click", () => {
  if (!maze || !renderer || !maze.start || !maze.end) return

  const algorithm = document.querySelector("#solver-algorithm").value
  const heuristic = document.querySelector("#heuristic").value
  const enableAnimation = document.querySelector("#animation").checked

  const mazeSolver = new MazeSolver().create(algorithm, heuristic)
  const solver = mazeSolver.solver(maze)

  controller.handle(solver, renderer, maze, enableAnimation)
})

// canvas.addEventListener("click", (event) => {
//   const rect = canvas.getBoundingClientRect()
  
//   const x = event.clientX - rect.left
//   const y = event.clientY - rect.top

//   const row = Math.floor(y / renderer.cellSize)
//   const col = Math.floor(x / renderer.cellSize)

//   maze.setPoint(row, col)
//   renderer.draw(maze)

//   btnSolve.disabled = false
// })