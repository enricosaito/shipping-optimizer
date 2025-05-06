// App.tsx with enhanced 3D visualization
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const App: React.FC = () => {
  const [barcode, setBarcode] = useState("");
  const [nfe, setNfe] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const handleBarcodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNfe(null);
    if (!barcode) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/nfe?chaveAcesso=${barcode}`);
      setNfe(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Erro ao buscar NFE. Tente novamente.");
    } finally {
      setLoading(false);
      setBarcode("");
      if (barcodeInputRef.current) barcodeInputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-300 flex flex-col items-center justify-start py-12">
      <Card className="w-full max-w-md shadow-lg border-orange-400 border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-600 font-bold text-center">
            Consulta de Nota Fiscal Eletrônica (NFE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBarcodeSubmit} className="flex gap-2 mb-4">
            <Input
              ref={barcodeInputRef}
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Escaneie ou digite a chave de acesso"
              autoFocus
              className="flex-1 border-orange-400 focus:ring-orange-500"
              disabled={loading}
            />
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading || !barcode}
            >
              {loading ? "Buscando..." : "Buscar"}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {nfe && (
            <Card className="mt-4 border-orange-300">
              <CardHeader>
                <CardTitle className="text-lg text-orange-700">Dados da NFE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">ID:</span> {nfe.id}
                  </div>
                  {/* Render more NFE fields as needed */}
                  <div>
                    <span className="font-semibold">JSON:</span>
                    <pre className="bg-orange-50 rounded p-2 text-xs overflow-x-auto mt-1">
                      {JSON.stringify(nfe, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
