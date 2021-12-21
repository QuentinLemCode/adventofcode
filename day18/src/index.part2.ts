import { ReadFile } from './fileread';

let id = 0;

const file = new ReadFile('input.txt');
// let tree: TreeNode;

let allLines: string[] = [];

function onEachLine(line: string) {
  allLines.push(line);
}

function lineToTree(line: string) {
  const snailfish = eval(line);
  const newTree = toTree(snailfish);
  return newTree;
}

function findLargestMagnitude(allLines: string[]) {
  let max = 0;
  allLines.forEach((leftLine, index, arr) => {
    arr
      .slice(0, index)
      .concat(arr.slice(index + 1))
      .forEach(rightLine => {
        const tree = addTree(lineToTree(leftLine), lineToTree(rightLine));
        reduceTree(tree);
        const magnitude = calcMagnitude(tree);
        if (magnitude > max) {
          max = magnitude;
        }
      });
  });
  return max;
}

async function process() {
  await file.applyFunction(onEachLine);
  console.log(findLargestMagnitude(allLines));
}

function addTree(tree: TreeNode, newTree: TreeNode) {
  const root = new TreeNode();
  root.left = tree;
  root.left.parent = root;
  root.right = newTree;
  root.right.parent = root;
  return root;
}

function calcMagnitude(tree: TreeNode) {
  let total = 0;
  if (tree.left?.leaf) {
    total += (tree.left.value || 0) * 3;
  } else if (tree.left) {
    total += calcMagnitude(tree.left) * 3;
  }
  if (tree.right?.leaf) {
    total += (tree.right.value || 0) * 2;
  } else if (tree.right) {
    total += calcMagnitude(tree.right) * 2;
  }
  return total;
}

class TreeNode {
  id: number;
  left?: TreeNode;
  right?: TreeNode;
  parent?: TreeNode;
  value?: number;
  get leaf(): boolean {
    return this.value !== undefined;
  }
  constructor(parent?: TreeNode, value?: number) {
    this.id = id++;
    this.parent = parent;
    this.value = value;
  }
}

function toTree(snailfish: Array<any>, parent?: TreeNode): TreeNode {
  const left = snailfish[0];
  const right = snailfish[1];
  const node = new TreeNode(parent);
  if (Array.isArray(left)) {
    node.left = toTree(left, node);
  } else {
    node.left = new TreeNode(node, left);
  }
  if (Array.isArray(right)) {
    node.right = toTree(right, node);
  } else {
    node.right = new TreeNode(node, right);
  }
  return node;
}

function treeToString(tree: TreeNode): string {
  if (tree.left && tree.right) {
    return '[' + treeToString(tree.left) + ',' + treeToString(tree.right) + ']';
  }
  return '' + tree.value;
}

function explodeTree(tree: TreeNode, depth = 0): boolean {
  if (tree.parent && tree.parent?.left !== tree && tree.parent?.right !== tree)
    debugger;
  if (depth >= 4 && !tree.leaf) {
    const leftLeaf = getLeft(tree);
    const rightLeaf = getRight(tree);
    if (leftLeaf && tree.left?.value) {
      const value = (leftLeaf.value ? leftLeaf.value : 0) + tree.left?.value;
      leftLeaf.value = value;
    }
    if (rightLeaf && tree.right?.value) {
      const value = (rightLeaf.value ? rightLeaf.value : 0) + tree.right?.value;
      rightLeaf.value = value;
    }
    if (tree.parent?.right === tree) {
      tree.parent.right = new TreeNode(tree.parent, 0);
    } else if (tree.parent?.left === tree) {
      tree.parent.left = new TreeNode(tree.parent, 0);
    }
    return true;
  }
  if (tree.left && tree.right) {
    let flag = false;
    flag = explodeTree(tree.left, depth + 1);
    if (flag) {
      return flag;
    }
    flag = explodeTree(tree.right, depth + 1);
    if (flag) {
      return flag;
    }
  }
  return false;
}

function reduceTree(tree: TreeNode) {
  let stable = false;
  while (!stable) {
    if (explodeTree(tree)) {
      continue;
    }
    if (splitTree(tree)) {
      continue;
    }
    stable = true;
  }
}

function splitTree(tree: TreeNode): boolean {
  if (tree.leaf && tree.value && tree.value > 9) {
    tree.left = new TreeNode(tree, Math.floor(tree.value / 2));
    tree.right = new TreeNode(tree, Math.ceil(tree.value / 2));
    tree.value = undefined;
    return true;
  }
  if (tree.left && tree.right) {
    let flag = false;
    flag = splitTree(tree.left);
    if (flag) {
      return flag;
    }
    flag = splitTree(tree.right);
    if (flag) {
      return flag;
    }
  }
  return false;
}

function getRight(tree: TreeNode) {
  const upRight = getUpRight(tree);
  if (!upRight) {
    return;
  }
  if (!upRight.right) {
    return;
  }
  return getLeftLeaf(upRight.right);
}

function getLeft(tree: TreeNode) {
  const upLeft = getUpLeft(tree);
  if (!upLeft) {
    return;
  }
  if (!upLeft.left) {
    return;
  }
  return getRightLeaf(upLeft.left);
}

function getRightLeaf(tree: TreeNode): TreeNode {
  if (tree.right) {
    return getRightLeaf(tree.right);
  }
  return tree;
}

function getLeftLeaf(tree: TreeNode): TreeNode {
  if (tree.left) {
    return getLeftLeaf(tree.left);
  }
  return tree;
}

function getUpRight(tree: TreeNode): TreeNode | undefined {
  if (!tree.parent) {
    return;
  }
  if (tree.parent.right === tree) {
    return getUpRight(tree.parent);
  }
  return tree.parent;
}

function getUpLeft(tree: TreeNode): TreeNode | undefined {
  if (!tree.parent) {
    return;
  }
  if (tree.parent.left === tree) {
    return getUpLeft(tree.parent);
  }
  return tree.parent;
}

process().then();
