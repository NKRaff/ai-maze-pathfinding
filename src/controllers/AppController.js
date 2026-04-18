export default class AppController {
  handle(process, renderer, maze, enableAnimation) {
    if (enableAnimation) {
      return this.#handleAnimate(process, renderer, maze)
    } else {
      for (const _ of process) {}
      renderer.draw(maze)
    }
  }

  #handleAnimate(process, renderer, maze) {
    const step = process.next()
    if (!step.done) {
      renderer.draw(maze)
      requestAnimationFrame(() => this.#handleAnimate(process, renderer, maze))
    } else {
      renderer.draw(maze)
    }
  }
}