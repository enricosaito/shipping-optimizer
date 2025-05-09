import { Item, Dimensions } from "./Item";
import { Box } from "./Box";
import { BoxDefinition, ProductDefinition } from "./medidasLoader";
import { OrderItem } from "./mockOrder";

export type PackedBox = {
  boxName: string;
  dimensions: Dimensions;
  utilization: number;
  items: {
    name: string;
    position: [number, number, number];
    rotation: number;
    dimensions: Dimensions;
  }[];
};

export type PackingResult = {
  packedBoxes: PackedBox[];
  unpackedItems: string[];
};

function cloneItems(items: Item[]): Item[] {
  // Deep clone items for packing attempts
  return items.map((item) => new Item(item.name, { width: item.width, length: item.length, height: item.height }));
}

export class BinPackingSolver {
  boxes: BoxDefinition[];
  products: ProductDefinition[];

  constructor(boxes: BoxDefinition[], products: ProductDefinition[]) {
    // Sort boxes by volume ascending (smallest first)
    this.boxes = boxes
      .slice()
      .sort(
        (a, b) =>
          a.dimensions.width * a.dimensions.length * a.dimensions.height -
          b.dimensions.width * b.dimensions.length * b.dimensions.height
      );
    this.products = products;
  }

  createItemsFromOrder(order: OrderItem[]): Item[] {
    const items: Item[] = [];
    for (const orderItem of order) {
      const prod = this.products.find((p) => p.name === orderItem.name);
      if (!prod) continue;
      for (let i = 0; i < orderItem.quantity; i++) {
        items.push(new Item(prod.name, prod.dimensions));
      }
    }
    return items;
  }

  pack(order: OrderItem[]): PackingResult {
    let itemsToPack = this.createItemsFromOrder(order);
    const packedBoxes: PackedBox[] = [];
    let attempts = 0;
    const maxAttempts = 100;

    while (itemsToPack.length > 0 && attempts < maxAttempts) {
      // Try to fit as many items as possible in each box, preferring larger boxes if it reduces box count
      let bestFit = null;
      let bestFitBoxIdx = -1;
      let bestFitPacked: Item[] = [];
      let bestFitUnpacked: Item[] = itemsToPack;

      for (let boxIdx = 0; boxIdx < this.boxes.length; boxIdx++) {
        const boxDef = this.boxes[boxIdx];
        const box = new Box(boxDef.dimensions);
        const itemsClone = cloneItems(itemsToPack);
        const packed: Item[] = [];
        const unpacked: Item[] = [];

        // Sort items by volume descending
        itemsClone.sort((a, b) => b.volume - a.volume);
        for (const item of itemsClone) {
          let placed = false;
          for (let rot = 0; rot < 6 && !placed; rot++) {
            const { width: w, length: l, height: h } = item.getDimensions(rot);
            for (let x = 0; x <= box.width - w && !placed; x++) {
              for (let y = 0; y <= box.length - l && !placed; y++) {
                for (let z = 0; z <= box.height - h && !placed; z++) {
                  if (box.placeItem(item, x, y, z, rot)) {
                    placed = true;
                    break;
                  }
                }
              }
            }
          }
          if (placed) {
            packed.push(item);
          } else {
            unpacked.push(item);
          }
        }
        // Heuristic: prefer box that fits the most items (and, for ties, the smallest box)
        if (
          !bestFit ||
          packed.length > bestFitPacked.length ||
          (packed.length === bestFitPacked.length &&
            box.volume <
              this.boxes[bestFitBoxIdx].dimensions.width *
                this.boxes[bestFitBoxIdx].dimensions.length *
                this.boxes[bestFitBoxIdx].dimensions.height)
        ) {
          bestFit = box;
          bestFitBoxIdx = boxIdx;
          bestFitPacked = packed;
          bestFitUnpacked = unpacked;
        }
      }
      if (!bestFit || bestFitPacked.length === 0) {
        // No more items can be packed
        break;
      }
      // Record packed box
      packedBoxes.push({
        boxName: this.boxes[bestFitBoxIdx].name,
        dimensions: this.boxes[bestFitBoxIdx].dimensions,
        utilization: bestFit.getVolumeUtilization(),
        items: bestFit.items.map((item) => ({
          name: item.name,
          position: item.position as [number, number, number],
          rotation: item.rotation as number,
          dimensions: item.getDimensions(item.rotation ?? 0),
        })),
      });
      // Remove packed items from itemsToPack
      const packedNames = new Set(bestFitPacked.map((i) => i.name + JSON.stringify(i.getDimensions(i.rotation ?? 0))));
      itemsToPack = itemsToPack.filter((item) => {
        const key = item.name + JSON.stringify(item.getDimensions(item.rotation ?? 0));
        if (packedNames.has(key)) {
          packedNames.delete(key);
          return false;
        }
        return true;
      });
      attempts++;
    }
    // Any items left are unpacked
    const unpackedItems = itemsToPack.map((item) => item.name);
    return { packedBoxes, unpackedItems };
  }
}
