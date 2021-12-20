import { ReadFile } from './fileread';
import Heapify from './heapify';

const file = new ReadFile('input.txt');
type Edge = {
  node: number;
  weight: number;
};

let rawNodes: number[][] = [];
class Graph {
  nodes: number[] = [];
  edges: Edge[][] = [];

  lastId: number = 0;

  addNode(id: number) {
    this.nodes.push(id);
  }

  addEdge(from: number, to: number, value: number) {
    if (!this.edges[from]) {
      this.edges[from] = [];
    }
    this.edges[from].push({ node: to, weight: value });
  }

  shortestPath(startNode: number) {
    let distances: { [key: number]: number } = {};

    let prev: { [key: number]: number | null } = {};
    let pq = new Heapify(this.nodes.length ** 2);

    distances[startNode] = 0;
    pq.push(startNode, 0);

    this.nodes.forEach(node => {
      if (node !== startNode) {
        distances[node] = Infinity;
        prev[node] = null;
      }
    });
    while (!!pq.length) {
      let minNode = pq.pop();
      if (minNode === undefined) {
        return {};
      }
      let currNode = minNode;
      if (!this.edges[currNode]) debugger;
      this.edges[currNode].forEach(neighbor => {
        let alt = distances[currNode] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          prev[neighbor.node] = currNode;
          pq.push(neighbor.node, distances[neighbor.node]);
        }
      });
    }
    return distances;
  }
}

function createGraph(): Graph {
  const graph = new Graph();
  let id = 0;
  for (let i = 0; i < rawNodes.length; i++) {
    for (let j = 0; j < rawNodes[i].length; j++) {
      graph.addNode(id);
      if (j > 0) {
        graph.addEdge(id, id - 1, rawNodes[i][j - 1]);
      }
      if (j < rawNodes[i].length - 1) {
        graph.addEdge(id, id + 1, rawNodes[i][j + 1]);
      }
      if (i > 0) {
        graph.addEdge(id, id - rawNodes[i].length, rawNodes[i - 1][j]);
      }
      if (i < rawNodes.length - 1) {
        graph.addEdge(id, id + rawNodes[i].length, rawNodes[i + 1][j]);
      }
      id++;
    }
  }
  graph.lastId = id;
  return graph;
}

function makeTiles() {
  const width = rawNodes[0].length;
  const heigth = rawNodes.length;

  const newNodes = JSON.parse(JSON.stringify(rawNodes));

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      rawNodes.forEach((line, xIndex) => {
        line.forEach((node, yIndex) => {
          let newValue = node + i + j;
          if (newValue >= 10) {
            newValue -= 9;
          }
          if (!newNodes[heigth * i + xIndex]) {
            newNodes[heigth * i + xIndex] = [];
          }
          newNodes[heigth * i + xIndex][width * j + yIndex] = newValue;
        });
      });
    }
  }
  rawNodes = newNodes;
}

async function process() {
  await file.applyFunction(onEachLine);
  makeTiles();
  const g = createGraph();
  console.log(g.shortestPath(0)[g.lastId - 1]);
}
function onEachLine(line: string) {
  rawNodes.push(line.split('').map(i => Number.parseInt(i)));
}
process().then();
