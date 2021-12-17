import { cp } from 'fs';
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

    this.traverse(start, []);
    console.log(this.paths.join('\n'));
  }

  private traverse(vertex: Vertex, stack: Edge[]) {
    for (const edge of vertex.getEdges()) {
      const destination = edge.getDestinationVertex(vertex);
      if (
        this.stackToVertices(stack).includes(destination) &&
        !destination.big
      ) {
        continue;
      }
      if (destination.name === 'end') {
        this.paths.push(this.stackToString(stack.concat(edge)));
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
  addEdge(edge: Edge) {
    this.edges.add(edge);
  }

  getEdges() {
    return Array.from(this.edges);
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
