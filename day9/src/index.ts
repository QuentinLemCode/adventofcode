import { readFileSync } from "fs";

const lines = readFileSync('input.txt', 'utf-8').split('\n');
const coordinates = lines.map(l => l.split('').map(h => Number.parseInt(h)));
const basins: Basin[] = [];

class Point {
    x: number;
    y: number;
    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }
}

class PointSet<T extends Point> extends Set<T> {
    add(value: T): this {
        if(!this.has(value)) {
            super.add(value);
        }
        return this;
    }
    has(value: T): boolean {
        let found = false;
        this.forEach(item => {
            if(value.x === item.x && value.y === item.y) {
                found = true;
            }
        });
        return found;
    }
}

class Basin {
    private set: PointSet<Point>;
    constructor(lowerPoint: Point) {
        this.set = new PointSet([lowerPoint]);
    }

    get size() {
        return this.set.size;
    }

    exploreBasin() {
        let added = true;
        while(added) {
            console.log(this.size);
            added = false;
            this.set.forEach(point => {
                for(const [vecX, vecY] of [[0,1], [1,0], [0, -1], [-1, 0]]) {
                    const X = point.x + vecX;
                    const Y = point.y + vecY;
                    if(X < 0 || X >= coordinates.length || Y < 0 || Y >= coordinates[X].length) {
                        continue;
                    }
                    if (coordinates[X][Y] !== 9) {
                        const point = new Point(X,Y);
                        added = !this.set.has(point);
                        this.set.add(point);
                    }
                }
            });
        }
    }
}


for (const [rowIndex, row] of coordinates.entries()) {
    for (const [columnIndex, column] of row.entries()) {
        if (isLower(rowIndex, columnIndex)) {
            basins.push(new Basin(new Point(rowIndex, columnIndex)));
        }
    }
}

basins.forEach(basin => basin.exploreBasin());

basins.sort((a, b) => b.size - a.size);

console.log(basins[0].size * basins[1].size * basins[2].size);

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
