import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
          <div>
            <p className="text-sm text-stone-400">Nome</p>
            <p className="text-white">{customer.nome}</p>
          </div>
          <div>
            <p className="text-sm text-stone-400">Email</p>
            <p className="text-white">{customer.email}</p>
          </div>
          <div>
            <p className="text-sm text-stone-400">Telefone</p>
            <p className="text-white">{customer.telefone}</p>
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
      </CardContent>
    </Card>
  );
};
