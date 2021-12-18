import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
let baseTemplate: string;
const rules = new Map<string, string>();
const optimisationMap = new Map<string, Occurences>();

type Occurences = { [key: string]: number };

const limit = 40;
const optimOffset = 5;

function onEachLine(line: string) {
  const [rule, add] = line.split(' -> ');
  if (!add && rule) {
    baseTemplate = rule;
  } else if (add) {
    rules.set(rule, add);
  }
}

function applyRules(template: string[]) {
  const occurences: Occurences = {};
  template.reduce((prev, cur) => {
    testCharacters(prev, cur, 0, occurences);
    return cur;
  });
  incrementOccurence(occurences, template[template.length - 1]);
  return occurences;
}

function testCharacters(
  a: string,
  b: string,
  count: number,
  occurences: Occurences
) {
  if (count >= limit) {
    incrementOccurence(occurences, a);
    return;
  }
  if (count <= limit - optimOffset) {
    const foundOptim = optimisationMap.get(a + b + count);
    if (foundOptim) {
      addOccurence(occurences, foundOptim);
      console.log('optim');
      return;
    }
  }
  const foundRule = rules.get(a + b);
  if (foundRule) {
    const newOccurences: Occurences = {};
    testCharacters(a, foundRule, count + 1, newOccurences);
    testCharacters(foundRule, b, count + 1, newOccurences);
    optimisationMap.set(a + b + count, newOccurences);
    addOccurence(occurences, newOccurences);
  }
}

function addOccurence(occurences: Occurences, addedOccurences: Occurences) {
  Object.entries(addedOccurences).forEach(occ => {
    const [key, value] = occ;
    incrementOccurence(occurences, key, value);
  });
}

function incrementOccurence(occurences: Occurences, key: string, value = 1) {
  occurences[key] = occurences[key] ? occurences[key] + value : value;
}

async function process() {
  await file.applyFunction(onEachLine);
  let template: string[] = baseTemplate.split('');
  const occurences = applyRules(template);
  const sorted = Object.values(occurences).sort((a, b) => a - b);
  console.log(sorted.reduce((acc, cur) => acc + cur, 0));
  console.log(sorted[sorted.length - 1] - sorted[0]);
}
process().then();
