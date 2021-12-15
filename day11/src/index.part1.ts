import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const adjacentVectors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
const octopuses: Octopus[] = [];
let flashCount = 0;

class Octopus {
  energy: number;
  x: number;
  y: number;
  hasFlashed = false;
  constructor(x: number, y: number, energy: number) {
    this.energy = energy;
    this.x = x;
    this.y = y;
  }

  isPosition(x: number, y: number) {
    return this.x === x && this.y === y;
  }

  newStep() {
    this.hasFlashed = false;
    this.energy++;
  }

  doStep() {
    if (this.energy > 9 && !this.hasFlashed) {
      this.flash();
    }
  }

  receiveFlash() {
    if (!this.hasFlashed) {
      this.energy++;
      if (this.energy > 9) {
        this.flash();
      }
    }
  }

  flash() {
    this.hasFlashed = true;
    this.energy = 0;
    flashCount++;
    for (const [vecX, vecY] of adjacentVectors) {
      const flashedOctopus = getOctopusAt(this.x + vecX, this.y + vecY);
      if (!flashedOctopus) {
        continue;
      }
      flashedOctopus.receiveFlash();
    }
  }
}

function getOctopusAt(x: number, y: number) {
  return octopuses.find(octopuse => {
    return octopuse.isPosition(x, y);
  });
}

function onEachLine(line: string, lineIndex: number) {
  octopuses.push(
    ...line
      .split('')
      .map(
        (energy, colIndex) =>
          new Octopus(lineIndex, colIndex, Number.parseInt(energy))
      )
  );
}

function step() {
  octopuses.forEach(octopus => octopus.newStep());
  octopuses.forEach(octopus => octopus.doStep());
}

async function process() {
  await file.applyFunctionIndex(onEachLine);
  for (let i = 0; i < 100; i++) {
    step();
  }
  console.log(flashCount);
}
process().then();
