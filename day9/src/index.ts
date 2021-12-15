import { readFileSync } from "fs";

const lines = readFileSync('input.txt', 'utf-8').split('\n');
const coordinates = lines.map(l => l.split('').map(h => Number.parseInt(h)));

let score = 0;
for (const [rowIndex, row] of coordinates.entries()) {
    for (const [columnIndex, column] of row.entries()) {
        if (isLower(rowIndex, columnIndex)) {
            score += column + 1;
        }
    }
}

console.log(score);


function isLower(x: number, y: number) {
    const depth = coordinates[x][y];
    if (x !== 0) {
        if (coordinates[x - 1][y] <= depth) {
            return false;
        }
    }
    if (y !== 0) {
        if (coordinates[x][y - 1] <= depth) {
            return false;
        }
    }
    if (x < (coordinates[y].length - 1)) {
        if (coordinates[x + 1][y] <= depth) {
            return false;
        }
    }
    if (y < (coordinates.length - 1)) {
        if (coordinates[x][y + 1] <= depth) {
            return false;
        }
    }
    return true;
}
