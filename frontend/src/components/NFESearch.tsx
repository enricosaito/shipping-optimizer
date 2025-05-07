import React, { useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

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
      <Input
        ref={barcodeInputRef}
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Escaneie ou digite a chave de acesso"
        autoFocus
        className="flex-1 text-white bg-stone-800 border-stone-700 focus:border-orange-500 focus:ring-orange-500"
        disabled={loading}
      />
      <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={loading || !barcode}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {loading ? "Buscando" : "Buscar"}
      </Button>
    </form>
  );
};
