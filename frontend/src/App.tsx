import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ThemeProvider } from "./components/ui/theme-provider";
import { motion } from "framer-motion";
import { NFESearch } from "./components/NFESearch";
import { NFEKPIs } from "./components/NFEKPIs";
import { CustomerInfo } from "./components/CustomerInfo";
import { ProductList } from "./components/ProductList";
import ShippingBoxDisplay from "./components/ShippingBoxDisplay";

const App: React.FC = () => {
  const [barcode, setBarcode] = useState("");
  const [nfeDetails, setNfeDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBarcodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNfeDetails(null);
    if (!barcode) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/nfe?chaveAcesso=${barcode}`);
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
                <img src="/assets/nutrition-white-nobg.png" alt="Nutrition Icon" className="h-16 w-16 object-contain" />
              </div>
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
                Silva Nutrition - Consulta de NFE
              </CardTitle>
              <p className="text-gray-400 text-center text-sm mt-1">Nota Fiscal Eletrônica</p>
            </CardHeader>
            <CardContent>
              <NFESearch barcode={barcode} setBarcode={setBarcode} loading={loading} onSubmit={handleBarcodeSubmit} />

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
                    {/* Left Column - KPIs, Customer Info, Shipping Box */}
                    <div className="space-y-6">
                      <NFEKPIs
                        totalItems={nfeDetails.data.itens.length}
                        shippingCost={nfeDetails.data.valorFrete}
                        totalValue={nfeDetails.data.valorNota}
                        installments={nfeDetails.data.parcelas.length}
                      />
                      <CustomerInfo customer={nfeDetails.data.contato} />
                    </div>

                    {/* Right Column - Products List */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      <ProductList products={nfeDetails.data.itens} orderNumber={nfeDetails.data.numeroPedidoLoja} />
                      <ShippingBoxDisplay />
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
