import AppController from "./controllers/AppController.js"
import Maze from "./core/maze/Maze.js"
import MazeGenerator from "./core/maze/MazeGenerator.js"
import MazeSolver from "./core/maze/MazeSolver.js"
import { CellTerrain } from "./core/types/CellTerrain.js"
import MazeRenderer from "./rendering/MazeRenderer.js"
import SlidersRenderer from "./rendering/SlidersRenderer.js"
import { createCard, eraseStats, fillStats, getCellSize } from "./utils/helpers.js"

const btnGenerate = document.querySelector("#generate-maze")
const btnSolve = document.querySelector("#solve-maze")
const btnNav = document.querySelectorAll(".nav-icon div")
const rangeConteiner = document.querySelectorAll(".range-container")

const slidersRenderer = new SlidersRenderer(rangeConteiner)
slidersRenderer.updateUi()

const controller = new AppController()

let mode
let maze
let rendererList = []
let combinations

// NAVEGATION
btnNav.forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("content-id")
    const settingShowing = document.querySelector(".show")
    
    if (settingShowing.getAttribute("id") === id) return
    
    const btnActiving = document.querySelector(".active")
    const settingId = document.querySelector(`#${id}`)
    
    settingShowing.classList.remove("show")
    btnActiving.classList.remove("active")

    settingId.classList.add("show")
    btn.classList.add("active")
  })
})

// MAZE GENERATE
btnGenerate.addEventListener("click", async () => {
  mode = document.querySelector("#workspace").value

  combinations = createCard(mode)
  
  const rows = Number(document.querySelector("#rows").value)
  const cols = Number(document.querySelector("#cols").value)
  const algorithm = document.querySelector("#generation-algorithm").value
  const enableAnimation = document.querySelector("#animation").checked
  const perfectMaze = document.querySelector("#perfect-maze").checked

  const initPoint = mode === "playground" ? false : true
  maze = new Maze(rows, cols, initPoint)
  rendererList.length = 0;

  const generator = new MazeGenerator().create(algorithm).generate(maze, perfectMaze, [
    {type: CellTerrain.DEFAULT, value: document.querySelector("#normal")},
    {type: CellTerrain.MUD, value: document.querySelector("#mud").value},
    {type: CellTerrain.SAND, value: document.querySelector("#sand").value},
    {type: CellTerrain.WATER, value: document.querySelector("#water").value},
  ])
  const canvases = document.querySelectorAll(".maze-canvas")
  const canvasWrapper = document.querySelector(".canvas-wrapper")
  const cellSize = getCellSize(rows, cols, canvasWrapper)

  canvases.forEach((canvas, index) => {
    eraseStats(index)
    const render = new MazeRenderer(canvas, cellSize)
    render.setup(maze.grid.rows, maze.grid.cols)
    rendererList.push(render)
    controller.handle(generator, render, maze, enableAnimation)
  })

  if (canvases.length === 1) addEventCanvas()
})

// MAZE SOLVE
btnSolve.addEventListener("click", async () => {
  if (!maze || rendererList.length === 0 || !maze.start || !maze.end) return

  const enableAnimation = document.querySelector("#animation").checked

  for (let i = 0; i < combinations.length; i++) {
    const render = rendererList[i]
    const mazeClone = maze.clone()

    let algo
    let heur

    if (mode === "playground") {
      algo = document.querySelector("#solver-algorithm").value
      heur = document.querySelector("#heuristic").value
    } else {
      algo = combinations[i].algo
      heur = combinations[i].heur
    }

    const solver = new MazeSolver().create(algo, heur).solver(mazeClone)
    const stats = await controller.handle(solver, render, mazeClone, enableAnimation)
    fillStats(i, stats)
  }
})

function addEventCanvas() {
  const canvas = document.querySelector("canvas")
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const row = Math.floor(y / rendererList[0].cellSize)
    const col = Math.floor(x / rendererList[0].cellSize)
    
    maze.setPoint(row, col)
    rendererList[0].draw(maze)
  })
}

slidersRenderer.ranges.forEach(r => {
  r.input.addEventListener("input", (event) => {
    slidersRenderer.normalize(event.target)
    slidersRenderer.updateUi()
  })
})