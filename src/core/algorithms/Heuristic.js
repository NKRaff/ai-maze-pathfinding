export const Heuristic = {
  manhattan: (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col),
  euclidean: (a, b) => Math.sqrt((a.row - b.row)**2 + (a.col - b.col)**2),
  none: (a, b) => 0
}