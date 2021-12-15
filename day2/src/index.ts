import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

let horizontal = 0;
let depth = 0;
let aim = 0;

function onEachLine(line: string) {
  const [direction, rawValue] = line.split(' ');
  const val = Number.parseInt(rawValue);
  switch (direction) {
    case 'forward':
      horizontal += val;
      depth += aim * val;
      break;
    case 'down':
      aim += val;
      break;
    case 'up':
      aim -= val;
      break;
  }
}

async function process() {
  await file.applyFunction(onEachLine);
  console.log(horizontal * depth);
}
process().then();
