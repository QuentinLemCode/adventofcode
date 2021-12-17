import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

type Fold = {
  axis: 'x' | 'y';
  value: number;
};
type Dot = {
  x: number;
  y: number;
};
let paper: Set<string> = new Set<string>();
const folds: Fold[] = [];

function fold(fold: Fold) {
  const dots = Array.from(paper).map(getDot);
  let foldedPaper = [];
  if (fold.axis === 'x') {
    dots.forEach(dot => {
      if (dot.x === fold.value) {
        removeDot(dot);
      }
    });
    foldedPaper = dots
      .filter(dot => dot.x > fold.value)
      .map(dot => {
        removeDot(dot);
        dot.x = fold.value - (dot.x - fold.value);
        return dot;
      });
  } else {
    dots.forEach(dot => {
      if (dot.y === fold.value) {
        removeDot(dot);
      }
    });
    foldedPaper = dots
      .filter(dot => dot.y > fold.value)
      .map(dot => {
        removeDot(dot);
        dot.y = fold.value - (dot.y - fold.value);
        return dot;
      });
  }
  foldedPaper.forEach(dot => {
    setDot(dot.x, dot.y);
  });
}

function setDot(x: number, y: number) {
  paper.add(x + '-' + y);
}

function removeDot(dot: Dot) {
  paper.delete(dot.x + '-' + dot.y);
}

function hasDot(x: number, y: number) {
  return paper.has(x + '-' + y);
}

function getDot(strSet: string): Dot {
  const [x, y] = strSet.split('-').map(n => Number.parseInt(n));
  return { x, y };
}

function onEachLine(line: string) {
  if (line.includes('fold')) {
    const equalIndex = line.lastIndexOf('=');
    const axis = line.slice(equalIndex - 1, equalIndex);
    if (axis !== 'x' && axis !== 'y') {
      return;
    }
    const value = Number.parseInt(line.slice(equalIndex + 1));
    folds.push({
      axis,
      value,
    });
  } else {
    const [x, y] = line.split(',').map(n => Number.parseInt(n));
    setDot(x, y);
  }
}

async function process() {
  await file.applyFunction(onEachLine);
  folds.forEach(fold);
  const dots = Array.from(paper).map(getDot);
  const maxX = dots.reduce((max, cur) => (cur.x > max ? cur.x : max), 0);
  const maxY = dots.reduce((max, cur) => (cur.y > max ? cur.y : max), 0);
  let str = '';
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      str += hasDot(x, y) ? '#' : '.';
    }
    str += '\n';
  }

  console.log(str);
}
process().then();
