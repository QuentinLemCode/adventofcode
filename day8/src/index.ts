import { ReadFile } from './fileread';
import { difference, intersection } from 'underscore';

const file = new ReadFile('input.txt');
const displays: Display[] = [];

enum Segment {
  TOP,
  TOP_LEFT,
  TOP_RIGHT,
  MIDDLE,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  BOTTOM,
}

class Display {
  private outputs: string[];
  private mapping: SegmentMapping;

  constructor(line: string) {
    const [inputs, outputs] = line.split('|');
    const sort = (text: string) =>
      text
        .split('')
        .sort()
        .join('');
    this.mapping = new SegmentMapping(inputs.trim().split(' '));
    this.outputs = outputs
      .trim()
      .split(' ')
      .map(sort);
  }

  countDigits1478() {
    let count = 0;
    for (const output of this.outputs) {
      switch (output.length) {
        case 2:
        case 3:
        case 4:
        case 7:
          count++;
      }
    }
    return count;
  }

  getOutputValue() {
    return Number.parseInt(
      this.outputs.map(out => this.mapping.mapNumber(out)).join('')
    );
  }
}

class SegmentMapping {
  private mapping = new Map<Segment, string>();
  private readonly letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  private reverseMapping = new Map<string, number>();

  constructor(private inputs: string[]) {
    const counts = this.letters.map(letter => {
      return this.inputs.reduce(
        (acc, cur) => acc + (cur.includes(letter) ? 1 : 0),
        0
      );
    });
    const getLettersForCount = (count: number) =>
      counts.reduce<string[]>((acc, cur, index) => {
        if (cur === count) {
          acc.push(this.letters[index]);
        }
        return acc;
      }, []);

    this.mapping.set(Segment.BOTTOM_LEFT, getLettersForCount(4)[0]);
    this.mapping.set(Segment.BOTTOM_RIGHT, getLettersForCount(9)[0]);
    this.mapping.set(Segment.TOP_LEFT, getLettersForCount(6)[0]);

    const topRight = this.difference(
      this.one,
      this.mapping.get(Segment.BOTTOM_RIGHT) || ''
    );
    this.mapping.set(Segment.TOP_RIGHT, topRight[0]);

    const top = this.difference(getLettersForCount(8).join(''), topRight[0]);
    this.mapping.set(Segment.TOP, top[0]);

    const middle = this.difference(
      this.four,
      this.mapping.get(Segment.TOP_RIGHT),
      this.mapping.get(Segment.TOP_LEFT),
      this.mapping.get(Segment.BOTTOM_RIGHT)
    );
    this.mapping.set(Segment.MIDDLE, middle[0]);

    let remainingLetters = this.letters;
    for (const val of this.mapping.values()) {
      remainingLetters.splice(
        remainingLetters.findIndex(v => v === val),
        1
      );
    }
    this.mapping.set(Segment.BOTTOM, remainingLetters[0]);

    type StringKeys<T> = {
      [k in keyof T]: T[k] extends string ? k : never;
    }[keyof T];
    const digits: Array<StringKeys<SegmentMapping>> = [
      'zero',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
    ];
    for (const [value, digit] of digits.entries()) {
      this[digit];
      this.reverseMapping.set(this[digit], value);
    }
  }

  public mapNumber(signal: string) {
    return this.reverseMapping.get(signal);
  }

  private difference(candidate: string, ...strings: Array<string | undefined>) {
    return difference<string>(
      candidate.split(''),
      ...strings.map(str => (str || '').split(''))
    );
  }

  private getMappings(...segments: Segment[]) {
    return segments
      .map(seg => this.mapping.get(seg) || '')
      .sort()
      .join('');
  }

  get zero() {
    return this.getMappings(
      Segment.BOTTOM,
      Segment.BOTTOM_LEFT,
      Segment.BOTTOM_RIGHT,
      Segment.TOP,
      Segment.TOP_LEFT,
      Segment.TOP_RIGHT
    );
  }

  get one() {
    return this.getNumber(2);
  }

  get two() {
    return this.getMappings(
      Segment.BOTTOM,
      Segment.BOTTOM_LEFT,
      Segment.MIDDLE,
      Segment.TOP_RIGHT,
      Segment.TOP
    );
  }

  get three() {
    return this.getMappings(
      Segment.BOTTOM,
      Segment.BOTTOM_RIGHT,
      Segment.MIDDLE,
      Segment.TOP_RIGHT,
      Segment.TOP
    );
  }

  get four() {
    return this.getNumber(4);
  }

  get five() {
    return this.getMappings(
      Segment.TOP,
      Segment.TOP_LEFT,
      Segment.MIDDLE,
      Segment.BOTTOM_RIGHT,
      Segment.BOTTOM
    );
  }

  get six() {
    return this.getMappings(
      Segment.TOP,
      Segment.TOP_LEFT,
      Segment.BOTTOM_LEFT,
      Segment.MIDDLE,
      Segment.BOTTOM_RIGHT,
      Segment.BOTTOM
    );
  }

  get seven() {
    return this.getNumber(3);
  }

  get eight() {
    return this.getNumber(7);
  }

  get nine() {
    return this.getMappings(
      Segment.TOP,
      Segment.TOP_LEFT,
      Segment.TOP_RIGHT,
      Segment.MIDDLE,
      Segment.BOTTOM_RIGHT,
      Segment.BOTTOM
    );
  }

  private getNumber(len: number) {
    return this.inputs
      .filter(a => a.length === len)[0]
      .split('')
      .sort()
      .join('');
  }
}

function onEachLine(line: string) {
  displays.push(new Display(line));
}

async function process() {
  await file.applyFunction(onEachLine);
  console.log(displays.reduce((acc, cur) => (acc += cur.getOutputValue()), 0));
}
process().then();
