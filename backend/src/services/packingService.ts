import { loadMedidasJson } from "../bin_packing/medidasLoader";
import { BinPackingSolver } from "../bin_packing/BinPackingSolver";
import { OrderItem } from "../bin_packing/mockOrder";

export function packOrder(order: OrderItem[]) {
  const { boxes, products } = loadMedidasJson();
  const solver = new BinPackingSolver(boxes, products);
  return solver.pack(order);
}
