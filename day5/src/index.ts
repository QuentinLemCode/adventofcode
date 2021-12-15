import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

const map = new Map<string, number>();

function onEachLine(line: string) {
  const [x1, y1, x2, y2] = line
    .split('->')
    .map(t => t.trim().split(','))
    .flat()
    .map(t => Number.parseInt(t));

  const maxX = Math.max(x1, x2);
  const minX = Math.min(x1, x2);
  const maxY = Math.max(y1, y2);
  const minY = Math.min(y1, y2);

  if (x1 !== x2 && y1 !== y2) {
    const vX = x1 > x2 ? -1 : 1;
    const vY = y1 > y2 ? -1 : 1;

    let valX = x1;
    let valY = y1;

    while (valX !== x2 || valY !== y2) {
      addValue(valX, valY);
      valX += vX;
      valY += vY;
    }
    addValue(valX, valY);
  } else if (x1 !== x2) {
    for (let i = minX; i <= maxX; i++) {
      addValue(i, y1);
    }
  } else if (y1 !== y2) {
    for (let i = minY; i <= maxY; i++) {
      addValue(x1, i);
    }
  }
}

function addValue(x: number, y: number): void {
  const curKey = key(x, y);
  const value = (map.get(curKey) || 0) + 1;
  map.set(curKey, value);
}

function key(x: number, y: number): string {
  return x + '/' + y;
}

async function process() {
  await file.applyFunction(onEachLine);

  let result = 0;
  for (const value of map.values()) {
    if (value > 1) {
      result++;
    }
  }
  console.log(result);
}
process().then();
