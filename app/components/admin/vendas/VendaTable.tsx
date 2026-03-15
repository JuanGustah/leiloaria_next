"use client";

import React from "react";
import { VendaResponse, StatusPagamento } from "@/lib/vendas/types";

interface VendaTableProps {
  vendas: VendaResponse[];
  onEdit: (venda: VendaResponse) => void;
  onStatusChange: (id: number, status: StatusPagamento) => void;
  isLoading: boolean;
}

export default function VendaTable({
  vendas,
  onEdit,
  onStatusChange,
  isLoading,
}: VendaTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Carregando...</p>
      </div>
    );
  }

  if (vendas.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Nenhuma venda encontrada</p>
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadgeColor = (status?: StatusPagamento) => {
    switch (status) {
      case StatusPagamento.APROVADO:
        return "bg-[#E8F5E9] text-[#2E7D32]";
      case StatusPagamento.PENDENTE:
        return "bg-[#FFF3E0] text-[#E65100]";
      case StatusPagamento.PROCESSANDO:
        return "bg-[#E3F2FD] text-[#1565C0]";
      case StatusPagamento.RECUSADO:
        return "bg-[#FFEBEE] text-[#C62828]";
      case StatusPagamento.CANCELADO:
        return "bg-[#F3E5F5] text-[#6A1B9A]";
      default:
        return "bg-[#F2F2F2] text-[#414059]";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#F8F8FA] border-b border-[#F2F2F2]">
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">ID</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Valor</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Lance</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Status</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Criado em</th>
            <th className="px-3 py-3 text-center font-semibold text-[#414059]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda) => (
            <tr
              key={venda.id}
              className="border-b border-[#F2F2F2] hover:bg-[#F8F8FA] transition"
            >
              <td className="px-3 py-3 text-[#414059]">{venda.id}</td>
              <td className="px-3 py-3 text-[#414059] font-medium">
                {formatCurrency(venda.valor)}
              </td>
              <td className="px-3 py-3 text-[#414059]">
                {venda.lance ? `#${venda.lance.id}` : "-"}
              </td>
              <td className="px-3 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                    venda.metodoPagamento?.statusPagamento
                  )}`}
                >
                  {venda.metodoPagamento?.statusPagamento || "SEM STATUS"}
                </span>
              </td>
              <td className="px-3 py-3 text-[#414059] text-xs">
                {formatDateTime(venda.createdAt)}
              </td>
              <td className="px-3 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(venda)}
                  className="px-3 py-1 rounded text-[#635EF2] hover:bg-[#635EF2] hover:text-white transition text-xs font-medium"
                >
                  Editar
                </button>
                {venda.metodoPagamento?.statusPagamento === StatusPagamento.PENDENTE && (
                  <button
                    onClick={() =>
                      onStatusChange(venda.id, StatusPagamento.APROVADO)
                    }
                    className="px-3 py-1 rounded text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition text-xs font-medium"
                  >
                    Aprovar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
