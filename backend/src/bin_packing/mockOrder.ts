import { loadMedidasJson } from "./medidasLoader";

export type OrderItem = {
  name: string;
  quantity: number;
};

export function generateMockOrder(): OrderItem[] {
  const { products } = loadMedidasJson();
  // Generate a mock order with random quantities for each product
  return products.map((product) => ({
    name: product.name,
    quantity: Math.floor(Math.random() * 3) + 1, // 1 to 3 of each
  }));
}
