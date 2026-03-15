"use client";

import React, { useState, useEffect } from "react";
import { VendaResponse, VendaRequest, UpdateVendaRequest, StatusPagamento } from "@/lib/vendas/types";
import { VendaForm, VendaTable } from "@/app/components/admin/vendas";
import { BACKEND_URL } from "@/lib/config";

export default function VendasPage() {
  const [vendas, setVendas] = useState<VendaResponse[]>([]);
  const [selectedVenda, setSelectedVenda] = useState<VendaResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/vendas`);
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        setVendas(list);
      } else {
        setVendas([]);
      }
    } catch (e) {
      console.error("Erro ao buscar vendas:", e);
      setVendas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (venda?: VendaResponse) => {
    setSelectedVenda(venda || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedVenda(null);
  };

  const handleSubmit = async (data: VendaRequest) => {
    setIsSaving(true);
    try {
      let response;
      if (data.id) {
        // Update - apenas atualizar status
        const updateData: UpdateVendaRequest = {
          statusPagamento: StatusPagamento.PROCESSANDO,
        };
        response = await fetch(`${BACKEND_URL}/vendas/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
      } else {
        // Create
        response = await fetch(`${BACKEND_URL}/vendas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (response.ok) {
        handleCloseForm();
        await fetchVendas();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao salvar venda");
      }
    } catch (e) {
      console.error("Erro ao salvar venda:", e);
      alert("Erro ao salvar venda");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (id: number, status: StatusPagamento) => {
    try {
      const updateData: UpdateVendaRequest = {
        statusPagamento: status,
      };
      const response = await fetch(`${BACKEND_URL}/vendas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchVendas();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao atualizar status");
      }
    } catch (e) {
      console.error("Erro ao atualizar status:", e);
      alert("Erro ao atualizar status");
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-[#05050D]">Gerenciar Vendas</h1>
          <button
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition"
          >
            + Nova Venda
          </button>
        </div>

        {isFormOpen && (
          <VendaForm
            venda={selectedVenda}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isLoading={isSaving}
          />
        )}

        <div className="bg-white rounded-lg shadow">
          <VendaTable
            vendas={vendas}
            onEdit={handleOpenForm}
            onStatusChange={handleStatusChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
