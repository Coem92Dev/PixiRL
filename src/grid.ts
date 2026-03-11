import { Container, Sprite } from "pixi.js";


export interface GridTile {
    walkable: boolean;
    sprite: Sprite;
}

export class Grid {

    readonly width: number;
    readonly height: number;
    readonly tileSize: number;
    readonly world: Container;
    readonly tiles: GridTile[];

    constructor(world: Container, width: number, height: number, tileSize: number, tiles?: GridTile[]) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.tiles = tiles ?? [];
        this.world = world;
    }

    setTile(x: number, y: number, tile: GridTile):boolean {
        if (!this.inBounds(x, y)) {
            return false;
        }
        if (this.tiles[y * this.width + x]) {
            this.world.removeChild(this.tiles[y * this.width + x].sprite);
        }
        this.tiles[y * this.width + x] = tile;
        tile.sprite.x = x * this.tileSize;
        tile.sprite.y = y * this.tileSize;
        this.world.addChild(tile.sprite);
        return true;
    }

    inBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isWalkable(x: number, y: number): boolean {
        return this.inBounds(x, y) && this.tiles[y * this.width + x].walkable;
    }

    toWorldX(x: number): number {
        return x * this.tileSize;
    }

    toWorldY(y: number): number {
        return y * this.tileSize;
    }

    toGridX(x: number): number {
        return Math.floor(x / this.tileSize);
    }

    toGridY(y: number): number {
        return Math.floor(y / this.tileSize);
    }
}
