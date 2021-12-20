import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');
type Packet = {
  version: number;
  type: number;
  literalValue?: number;
  lengthType?: number;
  totalLength?: number;
  subPacketNumber?: number;
  subPackets?: Packet[];
};

let packet: Packet | undefined;

function onEachLine(line: string) {
  const binArray = hex2bin(line).split('');
  packet = parsePackets(binArray);
  if (!packet) return;
  console.log(calcVersionSum(packet));
  console.log(decodePacket(packet));
}

function hex2bin(hex: string) {
  hex = hex.replace('0x', '').toLowerCase();
  var out = '';
  for (var c of hex) {
    switch (c) {
      case '0':
        out += '0000';
        break;
      case '1':
        out += '0001';
        break;
      case '2':
        out += '0010';
        break;
      case '3':
        out += '0011';
        break;
      case '4':
        out += '0100';
        break;
      case '5':
        out += '0101';
        break;
      case '6':
        out += '0110';
        break;
      case '7':
        out += '0111';
        break;
      case '8':
        out += '1000';
        break;
      case '9':
        out += '1001';
        break;
      case 'a':
        out += '1010';
        break;
      case 'b':
        out += '1011';
        break;
      case 'c':
        out += '1100';
        break;
      case 'd':
        out += '1101';
        break;
      case 'e':
        out += '1110';
        break;
      case 'f':
        out += '1111';
        break;
      default:
        return '';
    }
  }

  return out;
}

function parsePackets(binArray: string[]): Packet | undefined {
  if (binArray.length < 11) {
    if (binArray.length > 0) throw new Error('bad length of array');
    return;
  }
  const packet: Packet = {
    version: parseBinary(binArray.splice(0, 3)),
    type: parseBinary(binArray.splice(0, 3)),
  };

  if (packet.type !== 4) {
    packet.lengthType = parseBinary(binArray.splice(0, 1));
    packet.subPackets = [];
    if (packet.lengthType === 1) {
      packet.subPacketNumber = parseBinary(binArray.splice(0, 11));
      for (let i = 0; i < packet.subPacketNumber; i++) {
        const subpacket = parsePackets(binArray);
        if (subpacket) {
          packet.subPackets.push(subpacket);
        }
      }
    } else {
      packet.totalLength = parseBinary(binArray.splice(0, 15));
      const subpackets = binArray.splice(0, packet.totalLength);
      for (
        let subpack = parsePackets(subpackets);
        !!subpack;
        subpack = parsePackets(subpackets)
      ) {
        packet.subPackets.push(subpack);
      }
    }
  } else {
    const groups = [];
    let endFlag: string;
    do {
      if (binArray.length < 5) throw new Error('bad length');
      endFlag = binArray.splice(0, 1)[0];
      groups.push(binArray.splice(0, 4));
    } while (endFlag !== '0');
    packet.literalValue = parseBinary(groups.flat());
  }
  return packet;
}

function parseBinary(binArray: string[]): number {
  return Number.parseInt(binArray.join(''), 2);
}

function calcVersionSum(packet: Packet): number {
  let sum = 0;
  if (packet.subPackets && packet.subPackets.length > 0) {
    sum += packet.subPackets
      .map(calcVersionSum)
      .reduce((acc, cur) => (acc += cur), 0);
  }
  return sum + packet.version;
}

function decodePacket(packet: Packet): number {
  if (packet.type === 4) {
    if (!packet.literalValue) throw new Error('no value');
    return packet.literalValue;
  }
  if (!packet.subPackets || packet.subPackets.length < 0)
    throw new Error('no sub');
  const decodedSubpackets = packet.subPackets.map(decodePacket);
  switch (packet.type) {
    case 0:
      return decodedSubpackets.reduce((acc, cur) => acc + cur);
    case 1:
      return decodedSubpackets.reduce((acc, cur) => acc * cur);
    case 2:
      return decodedSubpackets.sort((a, b) => a - b)[0];
    case 3:
      return decodedSubpackets.sort((a, b) => b - a)[0];
    case 5:
      if (
        (packet.subPacketNumber && packet.subPacketNumber > 2) ||
        packet.subPackets.length > 2
      )
        throw new Error('invalid subpackets');
      return decodedSubpackets[0] > decodedSubpackets[1] ? 1 : 0;
    case 6:
      if (
        (packet.subPacketNumber && packet.subPacketNumber > 2) ||
        packet.subPackets.length > 2
      )
        throw new Error('invalid subpackets');
      return decodedSubpackets[0] < decodedSubpackets[1] ? 1 : 0;
    case 7:
      if (
        (packet.subPacketNumber && packet.subPacketNumber > 2) ||
        packet.subPackets.length > 2
      )
        throw new Error('invalid subpackets');
      return decodedSubpackets[0] === decodedSubpackets[1] ? 1 : 0;
  }
  throw new Error('invalid case');
}

async function process() {
  await file.applyFunction(onEachLine);
}
process().then();
