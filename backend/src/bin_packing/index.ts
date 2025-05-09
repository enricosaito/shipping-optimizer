import { loadMedidasJson } from "./medidasLoader";
import { generateMockOrder } from "./mockOrder";
import { BinPackingSolver } from "./BinPackingSolver";

function main() {
  const { boxes, products } = loadMedidasJson();
  const order = generateMockOrder();
  const solver = new BinPackingSolver(boxes, products);
  const result = solver.pack(order);
  console.log(JSON.stringify({ order, ...result }, null, 2));
}

main();
