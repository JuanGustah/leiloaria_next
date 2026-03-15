"use client";

import React from "react";
import { LanceResponse } from "@/lib/lances/types";

interface LanceTableProps {
  lances: LanceResponse[];
  onEdit: (lance: LanceResponse) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function LanceTable({
  lances,
  onEdit,
  onDelete,
  isLoading,
}: LanceTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Carregando...</p>
      </div>
    );
  }

  if (lances.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-[#414059]">Nenhum lance encontrado</p>
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
        second: "2-digit",
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#F8F8FA] border-b border-[#F2F2F2]">
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">ID</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Valor</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Lote</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Usuário</th>
            <th className="px-3 py-3 text-left font-semibold text-[#414059]">Timestamp</th>
            <th className="px-3 py-3 text-center font-semibold text-[#414059]">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lances.map((lance) => (
            <tr
              key={lance.id}
              className="border-b border-[#F2F2F2] hover:bg-[#F8F8FA] transition"
            >
              <td className="px-3 py-3 text-[#414059]">{lance.id}</td>
              <td className="px-3 py-3 text-[#414059] font-medium">
                {formatCurrency(lance.valor)}
              </td>
              <td className="px-3 py-3 text-[#414059]">
                {lance.lote?.nome || `#${lance.lote?.id}`}
              </td>
              <td className="px-3 py-3 text-[#414059]">
                {lance.usuario?.email || `#${lance.usuario?.id}`}
              </td>
              <td className="px-3 py-3 text-[#414059] text-xs">
                {formatDateTime(lance.timestamp)}
              </td>
              <td className="px-3 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(lance)}
                  className="px-3 py-1 rounded text-[#635EF2] hover:bg-[#635EF2] hover:text-white transition text-xs font-medium"
                  disabled={isLoading}
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(lance.id)}
                  className="px-3 py-1 rounded text-[#F2A2A9] hover:bg-[#F2A2A9] hover:text-white transition text-xs font-medium"
                  disabled={isLoading}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
