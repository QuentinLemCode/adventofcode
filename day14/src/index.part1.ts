import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
let baseTemplate: string;
const rules: { rule: string; add: string }[] = [];

function onEachLine(line: string) {
  const [rule, add] = line.split(' -> ');
  if (!add && rule) {
    baseTemplate = rule;
  } else if (add) {
    rules.push({ rule, add });
  }
}

function applyRules(template: string[]) {
  const newTemplate = Array.from(template);
  let offset = 0;

  template.reduce((prev, cur, curIndex) => {
    const foundRule = rules.find(rule => rule.rule === prev + cur);
    if (foundRule) {
      newTemplate.splice(curIndex + offset, 0, foundRule.add);
      offset++;
    }
    return cur;
  });

  return newTemplate;
}

async function process() {
  await file.applyFunction(onEachLine);
  let template: string[] = baseTemplate.split('');
  for (let i = 0; i < 10; i++) {
    template = applyRules(template);
  }
  const occurences = template.reduce<{ [key: string]: number }>((acc, cur) => {
    return acc[cur] ? ++acc[cur] : (acc[cur] = 1), acc;
  }, {});
  const sorted = Object.values(occurences).sort((a, b) => a - b);
  console.log(sorted[sorted.length - 1] - sorted[0]);
}
process().then();
