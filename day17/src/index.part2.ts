import { ReadFile } from './fileread';
type Objective = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

function getObjectiveCoordinates(objective: string): Objective {
  const posEqual = objective.indexOf('=');
  const lastPosEqual = objective.lastIndexOf('=');
  const [minX, maxX] = objective
    .slice(posEqual + 1, objective.indexOf(','))
    .split('..')
    .map(n => Number.parseInt(n));
  const [minY, maxY] = objective
    .slice(lastPosEqual + 1, objective.length)
    .split('..')
    .map(n => Number.parseInt(n));
  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}

async function process() {
  let objective: Objective;
  const file = new ReadFile('input.txt');
  const onEachLine = (line: string) => {
    objective = getObjectiveCoordinates(line);
  };
  await file.applyFunction(onEachLine);
  //@ts-ignore
  //findHighestPosition(objective);
  console.log(findAllInitialVelocity(objective).length);
}

function findHighestPosition(objective: Objective) {
  let bestY = 0;
  let vecX = 1;

  for (let vecY = 1; vecY < 10000; vecY++) {
    let touchFlag = false;
    while (!touchFlag) {
      const report = launch(objective, vecX, vecY);
      // console.log(vecY, vecX, report);
      if (!report.target) {
        // vecX too low
        if (report.x < objective.minX) {
          const deviation = objective.minX - report.x;
          vecX += Math.ceil(deviation / report.stepCount);
        } else if (report.x > objective.maxX) {
          // vecX too high
          const deviation = report.x - objective.maxX;
          vecX -= Math.ceil(deviation / report.stepCount);
        } else if (report.y < objective.minY) {
          // vecY to fix
          touchFlag = true;
        } else {
          console.error('why');
        }
      } else {
        bestY = report.bestY;
        touchFlag = true;
      }
    }
  }

  console.log(bestY);
}

function findAllInitialVelocity(objective: Objective) {
  const initialVelocities = [];
  for (let vecX = 1; vecX < 10000; vecX++) {
    for (let vecY = -10000; vecY < 10000; vecY++) {
      if (launch(objective, vecX, vecY).target) {
        initialVelocities.push(vecX + ',' + vecY);
      }
    }
  }
  return initialVelocities;
}

type Report = {
  target: boolean;
  bestY: number;
  x: number;
  y: number;
  stepCount: number;
};

function launch(objective: Objective, vecX: number, vecY: number): Report {
  let x = 0;
  let y = 0;
  let bestY = 0;
  let stepCount = 0;
  let target = false;

  while (x <= objective.maxX && y >= objective.minY) {
    x = x + vecX;
    y = y + vecY;
    vecX = vecX < 0 ? vecX + 1 : vecX > 0 ? vecX - 1 : vecX;
    vecY = vecY - 1;

    if (y > bestY) {
      bestY = y;
    }

    if (
      x >= objective.minX &&
      x <= objective.maxX &&
      y >= objective.minY &&
      y <= objective.maxY
    ) {
      target = true;
    }
    stepCount++;
  }
  return {
    target,
    bestY,
    x,
    y,
    stepCount,
  };
}

process().then();
