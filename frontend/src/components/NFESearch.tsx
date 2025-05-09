import React, { useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Barcode } from "lucide-react";

interface NFESearchProps {
  barcode: string;
  setBarcode: (value: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const NFESearch: React.FC<NFESearchProps> = ({ barcode, setBarcode, loading, onSubmit }) => {
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-4">
      <div className="relative flex-1">
        <Barcode className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-500" />
        <Input
          ref={barcodeInputRef}
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Escaneie ou digite a chave de acesso"
          autoFocus
          className="flex-1 text-white bg-stone-800/50 border-stone-700 focus:border-orange-500 focus:ring-orange-500 pl-8 placeholder:text-stone-500"
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-[0_0_10px_rgba(234,88,12,0.3)]"
        disabled={loading || !barcode}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {loading ? "Buscando" : "Buscar"}
      </Button>
    </form>
  );
};
