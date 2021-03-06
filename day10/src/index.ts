import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const opening = ['(', '[', '{', '<'];
const closing = [')', ']', '}', '>'];
const scores = [1, 2, 3, 4];
const allScores: number[] = [];

function getClosing(char: string) {
  const idx = opening.findIndex(a => a === char);
  return closing[idx];
}

function isOpening(char: string) {
  return opening.find(a => a === char);
}

function onEachLine(line: string) {
  const stack: string[] = [];
  const chars = line.split('');
  let corrupted = false;
  for (const char of chars) {
    if (isOpening(char)) {
      stack.push(char);
    } else {
      const closeChar = getClosing(stack.pop() || '');
      if (char !== closeChar) {
        corrupted = true;
        return;
      }
    }
  }

  if (!corrupted && stack.length > 0) {
    let lineScore = 0;
    for (let char = stack.pop(); char !== undefined; char = stack.pop()) {
      lineScore *= 5;
      lineScore += scores[opening.findIndex(a => a === char)];
    }
    allScores.push(lineScore);
  }
}

async function process() {
  await file.applyFunction(onEachLine);
  console.log(allScores.sort()[Math.floor(allScores.length / 2)]);
}
process().then();
