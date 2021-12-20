import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

function onEachLine(line: string) {
  console.log(line);
}

async function process() {
  await file.applyFunction(onEachLine);
}
process().then();
