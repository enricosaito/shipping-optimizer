// src/components/ShippingBoxDisplay.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Box } from "lucide-react";
import { Badge } from "./ui/badge";

const ShippingBoxDisplay: React.FC = () => {
  const boxP = {
    name: "Caixa P",
    width: 150,
    length: 140,
    height: 170,
  };

  return (
    <Card className="border-stone-700 bg-stone-800/50 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-orange-600">Caixas de Envio</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="flex items-center gap-3 p-3 bg-orange-900/30 border border-orange-600/40 rounded">
          <div className="w-10 h-10 bg-orange-800/50 rounded flex items-center justify-center shrink-0">
            <Box className="h-5 w-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">{boxP.name}</h4>
                <p className="text-xs text-stone-400">
                  {boxP.width}mm × {boxP.length}mm × {boxP.height}mm
                </p>
              </div>
              <Badge variant="outline" className="bg-orange-900/30 text-orange-300 border-orange-600">
                Recomendada
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingBoxDisplay;
