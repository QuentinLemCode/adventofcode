import { ReadFile } from './fileread';

const allLines: string[] = [];
const file = new ReadFile('input.txt');

function onEachLine(line: string) {
  allLines.push(line);
}

function getColumns(lines: string[]): number[] {
  const columns: number[] = [];
  for (const line of lines) {
    line.split('').forEach((v, k) => {
      columns[k] = (columns[k] || 0) + Number.parseInt(v);
    });
  }
  return columns;
}

function findCandidateFactory(
  number: string,
  position: number
): (line: string) => boolean {
  return (line: string) => {
    if (line[position] === number) {
      return true;
    }
    return false;
  };
}

function findRating(lines: string[], inverse = false, index = 0): string {
  const columns = getColumns(lines);
  const bits = getBits(columns, lines.length, inverse);
  const bit = bits[index];
  lines = lines.filter(findCandidateFactory(bit, index));
  if (lines.length > 1) {
    return findRating(lines, inverse, index + 1);
  }
  return lines[0];
}

function getBits(columns: number[], length: number, inverse = false) {
  return columns.reduce((acc, cur) => {
    if (cur === length / 2) {
      acc += inverse ? '0' : '1';
    }
    if (inverse) {
      acc += cur < length / 2 ? '1' : '0';
    } else {
      acc += cur > length / 2 ? '1' : '0';
    }
    return acc;
  }, '');
}

async function process() {
  await file.applyFunction(onEachLine);

  console.log(findRating(allLines));
  console.log(findRating(allLines, true));
  console.log(Number.parseInt(findRating(allLines), 2));
  console.log(Number.parseInt(findRating(allLines, true), 2));
}
process().then();
