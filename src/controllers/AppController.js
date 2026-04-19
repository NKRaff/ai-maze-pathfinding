export default class AppController {
  handle(process, renderer, maze, enableAnimation) {
    if (enableAnimation) {
      return this.#handleAnimate(process, renderer, maze)
    } else {
      let result = process.next()
      while (!result.done) {
        result = process.next()
      }
      renderer.draw(maze)
      return Promise.resolve(result.value)
    }
  }

  #handleAnimate(process, renderer, maze) {
    return new Promise((resolve) => {
      const step = process.next()
      if (!step.done) {
        renderer.draw(maze)
        requestAnimationFrame(() => this.#handleAnimate(process, renderer, maze).then(resolve))
      } else {
        renderer.draw(maze)
        resolve(step.value)
      }
    })
  }
}