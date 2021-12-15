import { readFileSync } from 'fs';

class Board {
  private readonly numbers: number[][] = [[]];

  constructor(numbers: number[][]) {
    this.numbers = numbers;
  }

  checkWin(drawned: number[]) {
    let win = false;
    for (let i = 0; i < 5; i++) {
      win =
        this.getColumn(i).every(number =>
          drawned.some(drawn => drawn === number)
        ) ||
        this.getRow(i).every(number => drawned.some(drawn => drawn === number));
      if (win) break;
    }
    return win;
  }

  calculateUnmarked(drawned: number[]) {
    return this.numbers
      .flat()
      .filter(number => !drawned.includes(number))
      .reduce((acc, cur) => acc + cur, 0);
  }

  private getColumn(index: number) {
    return this.numbers.map(v => v[index]);
  }

  private getRow(index: number) {
    return this.numbers[index];
  }
}

const file = readFileSync('input.txt', 'utf-8');
const lines = file.split('\n');
const drawnedNumbers = lines[0].split(',').map(val => Number.parseInt(val));
let boards: Board[] = [];
for (let i = 2; i < lines.length; i += 6) {
  let numbers: number[][] = [];
  for (let index = i; index < i + 5; index++) {
    const line = lines[index];
    numbers.push(parseLine(line));
  }
  boards.push(new Board(numbers));
  numbers = [];
}

let winnedBoard: Board[] = [];
let lastCall = 0,
  lastIndex = 0;
for (let i = 0; i < drawnedNumbers.length; i++) {
  const drawedNumbers = drawnedNumbers.slice(0, i);
  boards.forEach((board, index) => {
    if (board.checkWin(drawedNumbers)) {
      winnedBoard.push(board);
      boards.splice(index, 1);
      lastCall = drawedNumbers[i - 1];
      lastIndex = i;
    }
  });
}
console.log(
  winnedBoard[winnedBoard.length - 1].calculateUnmarked(
    drawnedNumbers.slice(0, lastIndex)
  ) * lastCall
);

function parseLine(
  line: string,
  numbers: number[] = [],
  currentIndex = 0,
  currentValue = ''
): number[] {
  if (currentIndex >= line.length) {
    numbers.push(Number.parseInt(currentValue));
    return numbers;
  }
  if (line[currentIndex] === ' ') {
    if (currentValue) {
      numbers.push(Number.parseInt(currentValue));
    }
    return parseLine(line, numbers, ++currentIndex);
  }
  currentValue += line[currentIndex];
  return parseLine(line, numbers, ++currentIndex, currentValue);
}
