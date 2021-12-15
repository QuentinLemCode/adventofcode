import { createReadStream } from 'fs';
import { createInterface } from 'readline';


let index = 0;
let map = new Map<number, number>();

function addToMap(number: number, index: number) {
  if (index > 1) {
    const val = map.get(index - 2) || 0;
    map.set(index - 2, val + number);
  }
  if (index > 0) {
    const val = map.get(index - 1) || 0;
    map.set(index - 1, val + number);
  }
  map.set(index, number);
}

function processMap(map: Map<number, number>): number {
  let count = 0;
  let lastNumber: number = 0;
  map.forEach((value) => {
    if (!lastNumber) {
      lastNumber = value;
      return;
    }
    if (value > lastNumber) {
      count++;
    }
    lastNumber = value;
  });
  return count;
}

async function process() {
  const stream = createReadStream('input.txt');

  const rl = createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const nbr = Number.parseInt(line);
    addToMap(nbr, index);
    index++;
  }
  console.log(processMap(map));
}
process().then();