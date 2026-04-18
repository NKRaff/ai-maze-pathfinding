import { Heuristic } from "../algorithms/Heuristic.js";
import AStar from "../algorithms/solver/AStar.js";

export default class MazeSolver {
  create(algorithm, heuristic) {
    const AlgorithmClass = this.algorithms[algorithm]
    const heuristicFn = Heuristic[heuristic]
    return new AlgorithmClass(heuristicFn)
  }

  algorithms = {
    astar: AStar
  }
}