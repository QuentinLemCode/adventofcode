import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
let algorithm: string;
let schema: string[][] = [];
let infiniteValue = '';

function onEachLine(line: string, index: number) {
  if (index === 0) {
    algorithm = line;
    return;
  }
  if (line.length > 1) {
    schema.push(line.split(''));
  }
}

function enhanceImage(input: string[][]) {
  if (!infiniteValue) {
    infiniteValue = '.';
  } else {
    infiniteValue = algorithm[infiniteValue === '#' ? 511 : 0];
  }
  let output: string[][] = [];

  for (let x = -1; x < input.length + 1; x++) {
    let line = input[x];
    if (!line) {
      line = ''.padStart(input[0].length, infiniteValue).split('');
    }
    line = [infiniteValue].concat(line, [infiniteValue]);
    output.push(
      line.map((_pixel, index) => {
        return algorithm[getPixelGroup(x, index - 1, input)];
      })
    );
  }

  return output;
}

function getPixelGroup(x: number, y: number, input: string[][]) {
  let nbr = '';
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      let line = input[i];
      let val;
      if (line) {
        val = line[j];
      }
      if (!val) {
        val = infiniteValue;
      }
      nbr += val;
    }
  }
  nbr = nbr.replaceAll('.', '0').replaceAll('#', '1');
  const digit = parseInt(nbr, 2);
  return digit;
}

function imageToString(input: string[][]) {
  let str = '';
  for (const line of input) {
    str += line.join('') + '\n';
  }
  return str;
}

async function process() {
  await file.applyFunction(onEachLine);

  let output = schema;
  for (let i = 0; i < 2; i++) {
    output = enhanceImage(output);
    console.log(imageToString(output));
  }
  console.log(countLitPixel(output));
}

function countLitPixel(input: string[][]) {
  let count = 0;
  input.forEach(line => {
    line.forEach(char => {
      if (char === '#') {
        count++;
      }
    });
  });
  return count;
}

process()
  .then()
  .catch(err => {
    debugger;
  });
