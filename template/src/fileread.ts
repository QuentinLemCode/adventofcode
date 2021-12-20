import { createReadStream } from 'fs';
import { createInterface, Interface } from 'readline';

export class ReadFile {
  private readonly readLine: Interface;

  constructor(filepath: string) {
    const stream = createReadStream(filepath);
    this.readLine = createInterface({
      input: stream,
      crlfDelay: Infinity,
    });
  }

  async applyFunction(callback: (value: string, index: number) => void) {
    let index = 0;
    for await (const line of this.readLine) {
      callback(line,index);
      index++;
    }
  }
}
