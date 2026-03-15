"use client";

import React, { useState, useEffect } from "react";
import { LanceResponse, LanceFormData, LanceRequest } from "@/lib/lances/types";
import { LanceForm, LanceTable } from "@/app/components/admin/lances";
import { BACKEND_URL } from "@/lib/config";

export default function LancesPage() {
  const [lances, setLances] = useState<LanceResponse[]>([]);
  const [selectedLance, setSelectedLance] = useState<LanceResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLances();
  }, []);

  const fetchLances = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/lances`);
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        setLances(list);
      } else {
        setLances([]);
      }
    } catch (e) {
      console.error("Erro ao buscar lances:", e);
      setLances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (lance?: LanceResponse) => {
    setSelectedLance(lance || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedLance(null);
  };

  const handleSubmit = async (data: LanceFormData & { id?: number }) => {
    setIsSaving(true);
    try {
      const payload: LanceRequest = {
        valor: parseFloat(data.valor),
        loteId: parseInt(data.loteId),
        usuarioId: parseInt(data.usuarioId),
      };

      let response;
      if (data.id) {
        // Update - usar PATCH conforme o backend
        response = await fetch(`${BACKEND_URL}/lances/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        response = await fetch(`${BACKEND_URL}/lances`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        handleCloseForm();
        await fetchLances();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao salvar lance");
      }
    } catch (e) {
      console.error("Erro ao salvar lance:", e);
      alert("Erro ao salvar lance");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este lance?")) return;

    try {
      const response = await fetch(`${BACKEND_URL}/lances/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchLances();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao deletar lance");
      }
    } catch (e) {
      console.error("Erro ao deletar lance:", e);
      alert("Erro ao deletar lance");
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-[#05050D]">Gerenciar Lances</h1>
          <button
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition"
          >
            + Novo Lance
          </button>
        </div>

        {isFormOpen && (
          <LanceForm
            lance={selectedLance}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isLoading={isSaving}
          />
        )}

        <div className="bg-white rounded-lg shadow">
          <LanceTable
            lances={lances}
            onEdit={handleOpenForm}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
