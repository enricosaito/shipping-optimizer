import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package } from "lucide-react";

// Import product images
import creatinaImage from "../../assets/product-images/creatina.jpg";
import preTreinoImage from "../../assets/product-images/pre-treino.jpg";
import termogenicoImage from "../../assets/product-images/termogenico.jpg";
import whey900gImage from "../../assets/product-images/whey-900g.jpg";
import whey320gImage from "../../assets/product-images/whey-320g.jpg";

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

const getProductImage = (productName: string): string | null => {
  const normalizedName = productName.toLowerCase();

  if (normalizedName.includes("creatina") || normalizedName.includes("creatine")) {
    return creatinaImage;
  }
  if (
    normalizedName.includes("pre treino") ||
    normalizedName.includes("pre-treino") ||
    normalizedName.includes("pretreino")
  ) {
    return preTreinoImage;
  }
  if (normalizedName.includes("termogênico") || normalizedName.includes("termogenico")) {
    return termogenicoImage;
  }
  if (normalizedName.includes("whey 900g") || normalizedName.includes("whey 900")) {
    return whey900gImage;
  }
  if (normalizedName.includes("whey 320g") || normalizedName.includes("whey 320")) {
    return whey320gImage;
  }

  return null;
};

export const ProductList: React.FC<ProductListProps> = ({ products, orderNumber }) => {
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
          {products.map((item, index) => {
            const productImage = getProductImage(item.descricao);
            return (
              <Card key={index} className="bg-stone-900/50 border-stone-700" variant="compact">
                <CardContent variant="compact" className="p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-stone-800 rounded flex items-center justify-center shrink-0 overflow-hidden">
                      {productImage ? (
                        <img src={productImage} alt={item.descricao} className="w-full h-full object-cover" />
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
