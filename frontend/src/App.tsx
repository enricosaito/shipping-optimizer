import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Loader2, FileText, AlertCircle, Package, Truck, CreditCard, Calendar } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-neutral-900 to-stone-900 flex flex-col p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl mx-auto"
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

              {nfeDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mt-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - KPIs and Customer Info */}
                    <div className="space-y-6">
                      {/* KPIs Section */}
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
                                    <p className="text-xl font-semibold text-white">{nfeDetails.data.itens.length}</p>
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
                                    <p className="text-xl font-semibold text-white">
                                      R$ {nfeDetails.data.valorFrete.toFixed(2)}
                                    </p>
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
                                    <p className="text-xl font-semibold text-white">
                                      R$ {nfeDetails.data.valorNota.toFixed(2)}
                                    </p>
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
                                    <p className="text-xl font-semibold text-white">
                                      {nfeDetails.data.parcelas.length}x
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Customer Information */}
                      <Card className="border-stone-700 bg-stone-800/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-orange-600">Informações do Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-stone-400">Nome</p>
                              <p className="text-white">{nfeDetails.data.contato.nome}</p>
                            </div>
                            <div>
                              <p className="text-sm text-stone-400">Email</p>
                              <p className="text-white">{nfeDetails.data.contato.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-stone-400">Telefone</p>
                              <p className="text-white">{nfeDetails.data.contato.telefone}</p>
                            </div>
                            <div>
                              <p className="text-sm text-stone-400">Endereço</p>
                              <p className="text-white">
                                {nfeDetails.data.contato.endereco.endereco}, {nfeDetails.data.contato.endereco.numero}
                                {nfeDetails.data.contato.endereco.complemento &&
                                  ` - ${nfeDetails.data.contato.endereco.complemento}`}
                              </p>
                              <p className="text-white">
                                {nfeDetails.data.contato.endereco.bairro}, {nfeDetails.data.contato.endereco.municipio}{" "}
                                - {nfeDetails.data.contato.endereco.uf}
                              </p>
                              <p className="text-white">CEP: {nfeDetails.data.contato.endereco.cep}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Products List */}
                    <div className="lg:col-span-2">
                      <Card className="border-stone-700 bg-stone-800/50 h-full">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg text-orange-600">Produtos</CardTitle>
                            <Badge variant="outline" className="bg-amber-900/30 text-orange-300 border-orange-600">
                              Pedido #{nfeDetails.data.numeroPedidoLoja}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {nfeDetails.data.itens.map((item: any, index: number) => (
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
                                        <Badge
                                          variant="outline"
                                          className="bg-amber-900/30 text-orange-300 border-orange-600"
                                        >
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
                    </div>
                  </div>
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
