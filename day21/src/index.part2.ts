import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
let players: Player[] = [];

const rollMap: { [K in string]: number } = {
  '3': 1,
  '4': 3,
  '5': 6,
  '6': 7,
  '7': 6,
  '8': 3,
  '9': 1,
};

function onEachLine(line: string) {
  const split = line.split(' ');
  players.push(
    new Player(Number.parseInt(split[4]), Number.parseInt(split[1]))
  );
}

function play(
  p1position: number,
  p2position: number,
  p1score = 0,
  p2score = 0,
  p1turn = true
): number[] {
  if (p1score >= 21) {
    return [1, 0];
  }
  if (p2score >= 21) {
    return [0, 1];
  }

  let result = [0, 0];
  if (p1turn) {
    for (let i = 3; i <= 9; i++) {
      const thisUniversePosition = ((p1position - 1 + i) % 10) + 1;
      const thisUniverseScore = p1score + thisUniversePosition;
      const playResult = play(
        thisUniversePosition,
        p2position,
        thisUniverseScore,
        p2score,
        false
      );
      result[0] += playResult[0] * rollMap[i];
      result[1] += playResult[1] * rollMap[i];
    }
  } else {
    for (let i = 3; i <= 9; i++) {
      const thisUniversePosition = ((p2position - 1 + i) % 10) + 1;
      const thisUniverseScore = p2score + thisUniversePosition;
      const playResult = play(
        p1position,
        thisUniversePosition,
        p1score,
        thisUniverseScore,
        true
      );
      result[0] += playResult[0] * rollMap[i];
      result[1] += playResult[1] * rollMap[i];
    }
  }
  return result;
}

async function process() {
  await file.applyFunction(onEachLine);
  const player1 = players[0];
  const player2 = players[1];
  const results = play(player1.position, player2.position);
  console.log(Math.max(...results));
}

class Player {
  score = 0;
  constructor(private _position: number, public number: number) {
    this._position--;
  }

  get position() {
    return this._position + 1;
  }
}

process().then();
