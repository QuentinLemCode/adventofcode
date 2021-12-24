import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
let dice = 1;
let countDice = 0;
let players: Player[] = [];

function onEachLine(line: string) {
  const split = line.split(' ');
  players.push(
    new Player(Number.parseInt(split[4]), Number.parseInt(split[1]))
  );
}

function play() {
  while (true) {
    for (const player of players) {
      player.play();
      if (player.score >= 1000) {
        return;
      }
    }
  }
}

async function process() {
  await file.applyFunction(onEachLine);
  play();
  players.forEach(player => {
    console.log('player ' + player.number + ' score : ' + player.score);
  });
  const loser = players.find(p => p.score < 1000);
  if (!loser) throw new Error();
  console.log('result : ' + countDice * loser.score);
}

function rollDice(): number {
  countDice++;
  if (dice > 100) {
    dice = 1;
  }
  return dice++;
}

class Player {
  score = 0;
  constructor(private _position: number, public number: number) {
    this._position--;
  }

  get position() {
    return this._position + 1;
  }

  play() {
    const moves = rollDice() + rollDice() + rollDice();
    this._position = (this._position + moves) % 10;
    this.score += this.position;
  }
}

process().then();
