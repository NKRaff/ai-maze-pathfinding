export function getRandomOddIntBetween(min, max) {
  if (min % 2 === 0) min += 1
  if (max % 2 === 0) max -= 1
  const range = (max - min) / 2 + 1
  return min + 2 * Math.floor(Math.random() * range)
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export function getCellSize(rows, cols, wrapperElement) {
  const availableWidth = wrapperElement.clientWidth
  const availableHeight = wrapperElement.clientHeight 
  
  const maxCellWidth = availableWidth / cols
  const maxCellHeight = availableHeight / rows

  return Math.floor(Math.min(maxCellWidth, maxCellHeight))
}

export function createCard(mode) {
  const mazeContainer = document.querySelector(".maze-container");
  mazeContainer.innerHTML = "";
  const combinations = [];

  if (mode === "benchmark") {
    const solverAlgorithms = document.querySelector("#solver-algorithm").options
    const solverHeuristics = document.querySelector("#heuristic").options
    mazeContainer.style.gridTemplateColumns = "repeat(3, minmax(28rem, 1fr))"
    mazeContainer.classList.remove("playground-mode");

    for (let a = 0; a < solverAlgorithms.length; a++) {
      for (let h = 0; h < solverHeuristics.length; h++) {
        combinations.push({
          algo: solverAlgorithms[a].value,
          heur: solverHeuristics[h].value
        })
      }
    }
  } else {
    mazeContainer.classList.add("playground-mode");
    mazeContainer.style.gridTemplateColumns = "minmax(28rem, 1fr)"
    combinations.push({ algo: 'custom', heur: 'custom' });
  }

  combinations.forEach((combo, index) => {
    const algo = combo.algo.charAt(0).toUpperCase() + combo.algo.slice(1)
    const heur = combo.heur.charAt(0).toUpperCase() + combo.heur.slice(1)
    
    const mazeContainer = document.querySelector(".maze-container")
    const card = document.createElement("div")
    
    const title = mode === "benchmark" ? `<h3>${algo} (${heur})</h3>` : ""

    card.innerHTML = `
      <div class="maze-card">
        ${title}
        <div class="canvas-container">
          <div class="canvas-wrapper">
            <canvas class="maze-canvas" width="0" height="0"></canvas>
          </div>
        </div>
        <div class="stats">
          <p>Latency: <span class="latency"></span></p>
          <p>Visited Nodes: <span class="visited-nodes"></span></p>
          <p>Explored Nodes: <span class="explored-nodes"></span></p>
          <p>Path Cost: <span class="path-cost"></span></p>
          <p>Path Length: <span class="path-length"></span></p>
          <p>Max Frontier Size: <span class="max-frontier-size"></span></p>
        </div>
      </div>
    `

    mazeContainer.appendChild(card)
  })

  return combinations
}

export function oldcreateCard() {
  const combinations = []

  combinations.forEach((combo, index) => {
    const algo = combo.algo.charAt(0).toUpperCase() + combo.algo.slice(1)
    const heur = combo.heur.charAt(0).toUpperCase() + combo.heur.slice(1)
    
    const mazeContainer = document.querySelector(".maze-container")
    const card = document.createElement("div")
    
    card.innerHTML = `
      <div class="maze-card">
        <h3>${algo} (${heur})</h3>
        <div class="canvas-container">
          <div class="canvas-wrapper">
            <canvas class="maze-canvas" width="0" height="0"></canvas>
          </div>
        </div>
        <div class="stats">
          <p>Latency: <span class="latency"></span></p>
          <p>Visited Nodes: <span class="visited-nodes"></span></p>
          <p>Explored Nodes: <span class="explored-nodes"></span></p>
          <p>Path Cost: <span class="path-cost"></span></p>
          <p>Path Length: <span class="path-length"></span></p>
          <p>Max Frontier Size: <span class="max-frontier-size"></span></p>
        </div>
      </div>
    `

    mazeContainer.appendChild(card)
  })

  return combinations
}

export function fillStats(index, stats) {
  const latency = document.querySelectorAll(".latency")[index].textContent = stats.time + "ms"
  const visitedNodes = document.querySelectorAll(".visited-nodes")[index].textContent = stats.visited
  const exploredNodes = document.querySelectorAll(".explored-nodes")[index].textContent = stats.visiting
  const pathCost = document.querySelectorAll(".path-cost")[index].textContent = stats.pathCost
  const pathLength = document.querySelectorAll(".path-length")[index].textContent = stats.pathLength
  const maxFrontierSize = document.querySelectorAll(".max-frontier-size")[index].textContent = stats.maxFrontierSize
}

export function eraseStats(index) {
  const latency = document.querySelectorAll(".latency")[index].textContent = null
  const visitedNodes = document.querySelectorAll(".visited-nodes")[index].textContent = null
  const exploredNodes = document.querySelectorAll(".explored-nodes")[index].textContent = null
  const pathCost = document.querySelectorAll(".path-cost")[index].textContent = null
  const pathLength = document.querySelectorAll(".path-length")[index].textContent = null
  const maxFrontierSize = document.querySelectorAll(".max-frontier-size")[index].textContent = null
}