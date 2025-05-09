import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const BOX_P = {
  name: "Box P",
  width: 150,
  length: 140,
  height: 170,
};

const ShippingBoxDisplay: React.FC = () => (
  <Card className="border-stone-700 bg-stone-800/50">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg text-orange-600">Caixa de Envio Recomendada</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="text-2xl font-bold text-orange-400">{BOX_P.name}</div>
        <div className="text-base text-stone-300">
          <span className="font-semibold">Dimensões:</span>
          <br />
          {BOX_P.width}mm (L) × {BOX_P.length}mm (C) × {BOX_P.height}mm (A)
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ShippingBoxDisplay;
