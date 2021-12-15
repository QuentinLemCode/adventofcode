import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
let positions: number[];

function onEachLine(line: string) {
  positions = line.split(',').map(a => Number.parseInt(a));
}

async function process() {
  await file.applyFunction(onEachLine);

  let best = Infinity;
  let bestPosition = 0;
  for (let i = 0; i < positions.sort()[positions.length - 1]; i++) {
    const result = positions.reduce(
      (acc, cur) => acc + serie(Math.abs(cur - i)),
      0
    );
    if (result < best) {
      best = result;
      bestPosition = i;
    }
  }
  console.log(best, bestPosition);
}

function serie(number: number) {
  return 0.5 * number * (number + 1);
}

process().then();
