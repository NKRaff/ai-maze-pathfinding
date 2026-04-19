import Backtracking from "../algorithms/generator/Backtracking.js"
import Prim from "../algorithms/generator/Prim.js"

export default class MazeGenerator {
  create(algorithm) {
    return new this.algorithms[algorithm]
  }

  algorithms = {
    ["backtracking"]: Backtracking,
    ["prim"]: Prim
  }
}