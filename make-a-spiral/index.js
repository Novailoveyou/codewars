const CELL_VALUES = [0, 1]
const DIRECTIONS = ['top', 'right', 'bottom', 'left']

const createSnakeGame = size => {
  let currentDirectionIndex = 0
  let rotationCount = 0

  const matrix = new Array(size).fill(0).map(_ => new Array(size).fill(0))
  const snakeHead = [0, 0]
  const sight = []

  const getCurrentDirection = () => DIRECTIONS[currentDirectionIndex]

  const getCell = (offsetY = 0, offsetX = 0) =>
    matrix[snakeHead[0] + offsetY]?.[snakeHead[1] + offsetX]

  const updateCell = (newValue, offsetY, offsetX) => {
    if (!CELL_VALUES.includes(newValue)) {
      console.error(
        `Invalid argument value for updateCell: ${newValue}, it must be one of the following: ${CELL_VALUES.join(
          ', ',
        )}`,
      )
      return
    }

    matrix[snakeHead[0] + (offsetY || 0)][snakeHead[1] + (offsetX || 0)] =
      newValue
  }

  /**
   *   @description
   *   slice of matrix 1x2
   *
   *   snakeHead (facing currentDirection) -> [x, x]
   */
  const setSight = () => {
    const currentDirection = getCurrentDirection()

    if (currentDirection === 'top') {
      sight[0] = getCell(-1, 0)
      sight[1] = getCell(-2, 0)
    }

    if (currentDirection === 'right') {
      sight[0] = getCell(0, 1)
      sight[1] = getCell(0, 2)
    }

    if (currentDirection === 'bottom') {
      sight[0] = getCell(1, 0)
      sight[1] = getCell(2, 0)
    }

    if (currentDirection === 'left') {
      sight[0] = getCell(0, -1)
      sight[1] = getCell(0, -2)
    }

    const isDeadend = !(sight[0] === 0 && sight[1] !== 1)

    return { isDeadend }
  }

  const rotateClockwise = () => {
    rotationCount++

    const isFinished = rotationCount === DIRECTIONS.length

    const output = { isFinished }

    if (!DIRECTIONS[currentDirectionIndex + 1]) {
      currentDirectionIndex = 0
      return output
    }

    currentDirectionIndex++
    return output
  }

  const move = () => {
    if (getCell() === 0) updateCell(1)

    const { isDeadend } = setSight()

    if (isDeadend) {
      const { isFinished } = rotateClockwise()

      if (isFinished) {
        if (size % 2 === 0) updateCell(0)
        return
      }

      return move()
    }

    const currentDirection = getCurrentDirection()

    if (currentDirection === 'top') {
      snakeHead[0] -= 1
    }
    if (currentDirection === 'right') {
      snakeHead[1] += 1
    }
    if (currentDirection === 'bottom') {
      snakeHead[0] += 1
    }
    if (currentDirection === 'left') {
      snakeHead[1] -= 1
    }

    updateCell(1)

    rotationCount = 0

    move()
  }

  return {
    matrix,
    move,
  }
}

const spiralize = size => {
  const { matrix, move } = createSnakeGame(size)

  move()

  return matrix
}

console.log(spiralize(5))
console.log(spiralize(8))
