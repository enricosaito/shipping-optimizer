import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package } from "lucide-react";

interface Product {
  codigo: string;
  descricao: string;
  quantidade: number;
  valorTotal: number;
  pesoLiquido: number;
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
  return (
    <Card className="border-stone-700 bg-stone-800/50 h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-orange-600">Produtos</CardTitle>
          <Badge variant="outline" className="bg-amber-900/30 text-orange-300 border-orange-600">
            Pedido #{orderNumber}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((item, index) => (
            <Card key={index} className="bg-stone-900/50 border-stone-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-stone-800 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{item.descricao}</h4>
                        <p className="text-sm text-stone-400">Código: {item.codigo}</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-900/30 text-orange-300 border-orange-600">
                        R$ {item.valorTotal.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex gap-4 text-sm text-stone-400">
                      <span>Qtd: {item.quantidade}</span>
                      <span>Peso: {item.pesoLiquido}kg</span>
                      <span>ICMS: {item.impostos.icms.aliquota}%</span>
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
