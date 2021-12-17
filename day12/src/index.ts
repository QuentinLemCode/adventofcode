import { ReadFile } from './fileread';

const file = new ReadFile('input.txt');

class Graph {
  edges: Edge[] = [];
  vertices = new Map<string, Vertex>();
  paths: string[] = [];

  addEdge(edgeLine: string) {
    const [from, to] = edgeLine.split('-').map(name => this.getVertex(name));
    const edge = new Edge(from, to);
    this.edges.push(edge);
  }
  getVertex(name: string): Vertex {
    let vertex = this.vertices.get(name);
    if (!vertex) {
      vertex = new Vertex(name);
      this.vertices.set(name, vertex);
    }
    return vertex;
  }

  getAllPath() {
    const start = this.vertices.get('start');
    if (start === undefined) {
      return;
    }

    const smallCaves = Array.from(this.vertices.values()).filter(
      v => !(v.big || v.isStartOrEnd)
    );
    for (const smallCave of smallCaves) {
      smallCaves.forEach(sc => (sc.visitTwice = false));
      smallCave.visitTwice = true;
      this.traverse(start, []);
    }
    console.log(this.paths.length);
  }

  private traverse(vertex: Vertex, stack: Edge[]) {
    for (const edge of vertex.getEdges()) {
      const destination = edge.getDestinationVertex(vertex);
      const destinationOccurence = this.stackToVertices(stack).filter(
        v => v === destination
      ).length;
      if (
        (destinationOccurence > 0 &&
          !destination.big &&
          !destination.visitTwice) ||
        (destination.visitTwice && destinationOccurence > 1)
      ) {
        continue;
      }
      if (destination.name === 'end') {
        const str = this.stackToString(stack.concat(edge));
        if (!this.paths.includes(str)) {
          this.paths.push(str);
        }
        continue;
      }
      stack.push(edge);
      this.traverse(destination, stack);
    }
    stack.pop();
  }

  private stackToString(stack: Edge[]) {
    return this.stackToVertices(stack)
      .map(v => v.name)
      .join(',');
  }

  private stackToVertices(stack: Edge[]) {
    const start = this.vertices.get('start');
    if (start === undefined) return [];
    return stack.reduce(
      (acc, cur) => {
        acc.push(cur.getDestinationVertex(acc[acc.length - 1]));
        return acc;
      },
      [start]
    );
  }
}

class Edge {
  vertices: Vertex[] = [];
  constructor(from: Vertex, to: Vertex) {
    this.vertices.push(from, to);
    from.addEdge(this);
    to.addEdge(this);
  }
  getDestinationVertex(from: Vertex) {
    return this.vertices.filter(v => v !== from)[0];
  }
}

class Vertex {
  name: string;
  edges: Set<Edge> = new Set();
  visitTwice = false;

  addEdge(edge: Edge) {
    this.edges.add(edge);
  }

  getEdges() {
    return Array.from(this.edges);
  }

  get isStartOrEnd(): boolean {
    return this.name === 'start' || this.name === 'end';
  }

  get big(): boolean {
    return !!this.name.match(/[A-Z]/);
  }

  constructor(name: string) {
    this.name = name;
  }
}

async function process() {
  const graph = new Graph();
  const feedGraph = (line: string) => {
    graph.addEdge(line);
  };

  await file.applyFunction(feedGraph);
  graph.getAllPath();
}
process().then();
