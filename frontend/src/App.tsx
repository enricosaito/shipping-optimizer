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
  const [nfeDetails, setNfeDetails] = useState<any | null>(null);
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
    setNfeDetails(null);
    if (!barcode) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/nfe?chaveAcesso=${barcode}`);
      setNfe(response.data);

      // If we have an ID, fetch the detailed information
      const nfeId = response.data?.data?.[0]?.id;
      if (nfeId) {
        const detailsResponse = await axios.get(`/api/nfe/${nfeId}`);
        setNfeDetails(detailsResponse.data);
      }
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
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-neutral-900 to-stone-900 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <Card className="border-orange-600 bg-stone-900/90 backdrop-blur-sm shadow-[0_0_15px_rgba(234,88,12,0.3)]">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-2">
                <FileText className="h-10 w-10 text-orange-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
                Silva Nutrition - Consulta de NFE
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
                  className="flex-1 text-white bg-stone-800 border-stone-700 focus:border-orange-500 focus:ring-orange-500"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={loading || !barcode}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {loading ? "Buscando" : "Buscar"}
                </Button>
              </form>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-4 bg-rose-900/40 border-rose-800">
                    <AlertCircle className="h-4 w-4" />
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
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Card className="mt-4 border-stone-700 bg-stone-800/50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-orange-600">Dados da NFE</CardTitle>
                        <Badge variant="outline" className="bg-amber-900/30 text-orange-300 border-orange-600">
                          {"ID " + nfe?.data?.[0]?.id || "ID não disponível"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="rounded-md bg-stone-950 p-3 border border-stone-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-stone-400">Dados completos</span>
                            <Badge variant="secondary" className="text-xs bg-stone-800">
                              JSON
                            </Badge>
                          </div>
                          <pre className="text-xs text-amber-100 overflow-x-auto max-h-60 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900">
                            {JSON.stringify(nfe, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {nfeDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Card className="mt-4 border-stone-700 bg-stone-800/50">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg text-orange-600">Detalhes da NFE</CardTitle>
                            <Badge variant="outline" className="bg-amber-900/30 text-orange-300 border-orange-600">
                              Detalhes
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="rounded-md bg-stone-950 p-3 border border-stone-800">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-stone-400">Dados detalhados</span>
                                <Badge variant="secondary" className="text-xs bg-stone-800">
                                  JSON
                                </Badge>
                              </div>
                              <pre className="text-xs text-amber-100 overflow-x-auto max-h-60 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900">
                                {JSON.stringify(nfeDetails, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pt-0 pb-4">
              <p className="text-stone-500 text-xs">Sistema de consulta NFE • {new Date().getFullYear()}</p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </ThemeProvider>
  );
};

export default App;
