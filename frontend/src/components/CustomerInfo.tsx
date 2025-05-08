import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";

interface Address {
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

interface Customer {
  nome: string;
  email: string;
  telefone: string;
  endereco: Address;
}

interface CustomerInfoProps {
  customer: Customer;
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer }) => {
  return (
    <Card className="border-stone-700 bg-stone-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-orange-600">Informações do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-900/30 rounded-full flex items-center justify-center shrink-0 mt-1">
              <User className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-stone-400">Nome</p>
              <p className="text-white">{customer.nome}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-900/30 rounded-full flex items-center justify-center shrink-0 mt-1">
              <Mail className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-stone-400">Email</p>
              <p className="text-white">{customer.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-900/30 rounded-full flex items-center justify-center shrink-0 mt-1">
              <Phone className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-stone-400">Telefone</p>
              <p className="text-white">{customer.telefone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-900/30 rounded-full flex items-center justify-center shrink-0 mt-1">
              <MapPin className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-stone-400">Endereço</p>
              <p className="text-white">
                {customer.endereco.endereco}, {customer.endereco.numero}
                {customer.endereco.complemento && ` - ${customer.endereco.complemento}`}
              </p>
              <p className="text-white">
                {customer.endereco.bairro}, {customer.endereco.municipio} - {customer.endereco.uf}
              </p>
              <p className="text-white">CEP: {customer.endereco.cep}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
