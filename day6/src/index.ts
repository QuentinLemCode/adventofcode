import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const fishMap = new Map<number, number>([
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [5, 0],
  [6, 0],
  [7, 0],
  [8, 0],
]);

function onEachLine(line: string) {
  line
    .split(',')
    .map(a => Number.parseInt(a))
    .forEach(f => addFish(f));
}

function addFish(counter: number) {
  fishMap.set(counter, getFishes(counter) + 1);
}

function getFishes(index: number): number {
  return fishMap.get(index) || 0;
}

async function process() {
  await file.applyFunction(onEachLine);
  for (let i = 0; i < 256; i++) {
    const newFish = getFishes(0);

    for (let j = 1; j <= 8; j++) {
      fishMap.set(j - 1, getFishes(j));
    }

    fishMap.set(6, getFishes(6) + newFish);
    fishMap.set(8, newFish);

    console.log(i);
  }
  console.log(fishMap);
  let total = 0;
  fishMap.forEach(a => (total += a));
  console.log(total);
}
process().then();
