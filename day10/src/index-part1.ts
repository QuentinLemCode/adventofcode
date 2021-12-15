import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
const opening = ['(', '[', '{', '<'];
const closing = [')', ']', '}', '>'];
const scores = [3, 57, 1197, 25137];
let score = 0;

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
  for (const char of chars) {
    if (isOpening(char)) {
      stack.push(char);
    } else {
      const closeChar = getClosing(stack.pop() || '');
      if (char !== closeChar) {
        console.log('expected ' + closeChar + ' received ' + char);
        score += scores[closing.findIndex(a => a === char)];
        return;
      }
    }
  }
}

async function process() {
  await file.applyFunction(onEachLine);
  console.log(score);
}
process().then();
