export type Dimensions = {
  width: number;
  length: number;
  height: number;
};

export type Position = [number, number, number];

export class Item {
  name: string;
  width: number;
  length: number;
  height: number;
  volume: number;
  position: Position | null;
  rotation: number | null;

  constructor(name: string, dimensions: Dimensions) {
    this.name = name;
    this.width = dimensions.width;
    this.length = dimensions.length;
    this.height = dimensions.height;
    this.volume = this.width * this.length * this.height;
    this.position = null;
    this.rotation = null;
  }

  /**
   * Returns the dimensions of the item after applying one of 6 possible 3D rotations.
   * 0: (w, l, h), 1: (w, h, l), 2: (l, w, h), 3: (l, h, w), 4: (h, w, l), 5: (h, l, w)
   */
  getDimensions(rotation: number = 0): Dimensions {
    const w = this.width,
      l = this.length,
      h = this.height;
    const rotations: Dimensions[] = [
      { width: w, length: l, height: h },
      { width: w, length: h, height: l },
      { width: l, length: w, height: h },
      { width: l, length: h, height: w },
      { width: h, length: w, height: l },
      { width: h, length: l, height: w },
    ];
    return rotations[rotation % 6];
  }
}
