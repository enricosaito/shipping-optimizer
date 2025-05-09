import fs from "fs";
import path from "path";
import { Dimensions } from "./Item";

export type BoxDefinition = {
  name: string;
  dimensions: Dimensions;
};

export type ProductDefinition = {
  name: string;
  dimensions: Dimensions;
};

export function loadMedidasJson(): { boxes: BoxDefinition[]; products: ProductDefinition[] } {
  const medidasPath = path.resolve(__dirname, "../../medidas.json");
  const raw = fs.readFileSync(medidasPath, "utf-8");
  const data = JSON.parse(raw);

  const boxes: BoxDefinition[] = data.boxes.map((box: any) => ({
    name: box.name,
    dimensions: {
      width: Math.round(box.width_mm),
      length: Math.round(box.length_mm),
      height: Math.round(box.height_mm),
    },
  }));

  const products: ProductDefinition[] = data.products.map((prod: any) => ({
    name: prod.name,
    dimensions: {
      width: Math.round(prod.width_mm),
      length: Math.round(prod.length_mm),
      height: Math.round(prod.height_mm),
    },
  }));

  return { boxes, products };
}
