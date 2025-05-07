import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Badge } from "./components/ui/badge";
import { motion } from "framer-motion";

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
    <ThemeProvider defaultTheme="dark" forcedTheme="dark">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-purple-700 bg-gray-900/80 backdrop-blur-sm shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-2">
                <FileText className="size-10 text-purple-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Consulta de NFE
              </CardTitle>
              <p className="text-gray-400 text-center text-sm mt-1">Nota Fiscal Eletrônica</p>
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
                  className="flex-1 bg-gray-800 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loading || !barcode}
                >
                  {loading ? <Loader2 className="size-4 animate-spin me-2" /> : null}
                  {loading ? "Buscando" : "Buscar"}
                </Button>
              </form>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-4 bg-red-900/50 border-red-700">
                    <AlertCircle className="size-4" />
                    <AlertTitle className="font-semibold">Erro</AlertTitle>
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {nfe && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="mt-4 border-gray-700 bg-gray-800/50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-purple-400">Dados da NFE</CardTitle>
                        <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
                          {nfe.id || "ID não disponível"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="rounded-md bg-gray-950 p-3 border border-gray-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-400">Dados completos</span>
                            <Badge variant="secondary" className="text-xs bg-gray-800">
                              JSON
                            </Badge>
                          </div>
                          <pre className="text-xs text-gray-300 overflow-x-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                            {JSON.stringify(nfe, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-4 pt-0">
              <p className="text-gray-500 text-xs">Sistema de consulta NFE • {new Date().getFullYear()}</p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </ThemeProvider>
  );
};

export default App;
