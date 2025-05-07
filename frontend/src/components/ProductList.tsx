import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package } from "lucide-react";
import axios from "axios";

interface Product {
  codigo: string;
  descricao: string;
  quantidade: number;
  valorTotal: number;
  pesoLiquido: number;
  imagemURL?: string;
  impostos: {
    icms: {
      aliquota: number;
    };
  };
}

interface ProductListProps {
  products: Product[];
  orderNumber: string;
}

export const ProductList: React.FC<ProductListProps> = ({ products, orderNumber }) => {
  const [productsWithImages, setProductsWithImages] = useState<Product[]>(products);

  useEffect(() => {
    const fetchProductImages = async () => {
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            const response = await axios.get(`/api/produtos/${product.codigo}`);
            return {
              ...product,
              imagemURL: response.data.imagemURL || undefined,
            };
          } catch (error) {
            console.error(`Error fetching image for product ${product.codigo}:`, error);
            return product;
          }
        })
      );
      setProductsWithImages(updatedProducts);
    };

    fetchProductImages();
  }, [products]);

  return (
    <Card className="border-stone-700 bg-stone-800/50 h-full">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-orange-600">Produtos</CardTitle>
          <Badge variant="outline" className="bg-amber-900/30 text-orange-300 border-orange-600">
            Pedido #{orderNumber}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-1.5">
          {productsWithImages.map((item, index) => (
            <Card key={index} className="bg-stone-900/50 border-stone-700" variant="compact">
              <CardContent variant="compact" className="p-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imagemURL ? (
                      <img src={item.imagemURL} alt={item.descricao} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-medium text-white truncate text-sm">{item.descricao}</h4>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <span>Cód: {item.codigo}</span>
                          <span>•</span>
                          <span>Qtd: {item.quantidade}</span>
                          <span>•</span>
                          <span>Peso: {item.pesoLiquido}kg</span>
                          <span>•</span>
                          <span>ICMS: {item.impostos.icms.aliquota}%</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-900/30 text-orange-300 border-orange-600 shrink-0 text-sm"
                      >
                        R$ {item.valorTotal.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
