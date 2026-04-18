import AppController from "./controllers/AppController.js"
import Maze from "./core/maze/Maze.js"
import MazeGenerator from "./core/maze/MazeGenerator.js"
import MazeSolver from "./core/maze/MazeSolver.js"
import MazeRenderer from "./rendering/MazeRenderer.js"

const canvas = document.querySelector("#maze-canvas")
const btnGenerate = document.querySelector("#generate-maze")
const btnSolve = document.querySelector("#solve-maze")

const controller = new AppController()

let maze
let renderer

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

btnSolve.addEventListener("click", () => {
  if (!maze || !renderer || !maze.start || !maze.end) return

  const algorithm = document.querySelector("#solver-algorithm").value
  const heuristic = document.querySelector("#heuristic").value
  const enableAnimation = document.querySelector("#animation").checked

  const mazeSolver = new MazeSolver().create(algorithm, heuristic)
  const solver = mazeSolver.solver(maze)

  controller.handle(solver, renderer, maze, enableAnimation)
})

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect()
  
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const row = Math.floor(y / renderer.cellSize)
  const col = Math.floor(x / renderer.cellSize)

  maze.setPoint(row, col)
  renderer.draw(maze)

  btnSolve.disabled = false
})