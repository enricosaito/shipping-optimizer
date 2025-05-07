import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Package, Truck, CreditCard, Calendar } from "lucide-react";

interface NFEKPIsProps {
  totalItems: number;
  shippingCost: number;
  totalValue: number;
  installments: number;
}

export const NFEKPIs: React.FC<NFEKPIsProps> = ({ totalItems, shippingCost, totalValue, installments }) => {
  return (
    <Card className="border-stone-700 bg-stone-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-orange-600">Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-stone-900/50 border-stone-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-stone-400">Total de Itens</p>
                  <p className="text-xl font-semibold text-white">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-stone-900/50 border-stone-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-stone-400">Frete</p>
                  <p className="text-xl font-semibold text-white">R$ {shippingCost.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-stone-900/50 border-stone-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-stone-400">Valor Total</p>
                  <p className="text-xl font-semibold text-white">R$ {totalValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-stone-900/50 border-stone-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-stone-400">Parcelas</p>
                  <p className="text-xl font-semibold text-white">{installments}x</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
