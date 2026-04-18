import Backtracking from "../algorithms/generator/Backtracking.js"

export default class MazeGenerator {
  create(algorithm) {
    return new this.algorithms[algorithm]
  }

  algorithms = {
    ["backtraking"]: Backtracking
  }
}