import { Item, Dimensions, Position } from "./Item";

export class Box {
  width: number;
  length: number;
  height: number;
  volume: number;
  items: Item[];
  space: number[][][]; // 1 = occupied, 0 = free

  constructor(dimensions: Dimensions) {
    this.width = dimensions.width;
    this.length = dimensions.length;
    this.height = dimensions.height;
    this.volume = this.width * this.length * this.height;
    this.items = [];
    // Initialize 3D space array
    this.space = Array.from({ length: this.width }, () =>
      Array.from({ length: this.length }, () => Array(this.height).fill(0))
    );
  }

  isValidPosition(item: Item, x: number, y: number, z: number, rotation: number): boolean {
    const { width: w, length: l, height: h } = item.getDimensions(rotation);
    // Check boundaries
    if (x + w > this.width || y + l > this.length || z + h > this.height) {
      return false;
    }
    // Check for overlap
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + l; j++) {
        for (let k = z; k < z + h; k++) {
          if (this.space[i][j][k] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placeItem(item: Item, x: number, y: number, z: number, rotation: number): boolean {
    if (!this.isValidPosition(item, x, y, z, rotation)) {
      return false;
    }
    const { width: w, length: l, height: h } = item.getDimensions(rotation);
    // Mark space as occupied
    for (let i = x; i < x + w; i++) {
      for (let j = y; j < y + l; j++) {
        for (let k = z; k < z + h; k++) {
          this.space[i][j][k] = 1;
        }
      }
    }
    item.position = [x, y, z];
    item.rotation = rotation;
    this.items.push(item);
    return true;
  }

  getVolumeUtilization(): number {
    if (this.items.length === 0) return 0;
    const usedVolume = this.items.reduce((sum, item) => sum + item.volume, 0);
    return (usedVolume / this.volume) * 100;
  }
}
