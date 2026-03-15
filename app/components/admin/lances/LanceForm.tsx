"use client";

import React, { useState, useEffect } from "react";
import { LanceFormData, LanceResponse } from "@/lib/lances/types";

interface LanceFormProps {
  lance?: LanceResponse | null;
  onSubmit: (data: LanceFormData & { id?: number }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function LanceForm({
  lance,
  onSubmit,
  onCancel,
  isLoading,
}: LanceFormProps) {
  const [formData, setFormData] = useState<LanceFormData>({
    valor: "",
    loteId: "",
    usuarioId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lance) {
      setFormData({
        valor: String(lance.valor || ""),
        loteId: String(lance.lote?.id || ""),
        usuarioId: String(lance.usuario?.id || ""),
      });
    } else {
      setFormData({
        valor: "",
        loteId: "",
        usuarioId: "",
      });
    }
    setErrors({});
  }, [lance]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }
    if (!formData.loteId || parseInt(formData.loteId) <= 0) {
      newErrors.loteId = "Lote ID deve ser maior que zero";
    }
    if (!formData.usuarioId || parseInt(formData.usuarioId) <= 0) {
      newErrors.usuarioId = "Usuário ID deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof LanceFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        valor: parseFloat(formData.valor),
        loteId: parseInt(formData.loteId),
        usuarioId: parseInt(formData.usuarioId),
        ...(lance && { id: lance.id }),
      };
      await onSubmit(submitData as any);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-[#05050D] mb-4">
        {lance ? "Editar Lance" : "Novo Lance"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            Valor *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => handleChange("valor", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635EF2] ${
              errors.valor
                ? "border-[#F2A2A9] bg-[#FFF5F5]"
                : "border-[#E8E8EA]"
            }`}
            placeholder="0.00"
          />
          {errors.valor && (
            <p className="text-[#F2A2A9] text-xs mt-1">{errors.valor}</p>
          )}
        </div>

        {/* Lote ID */}
        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            ID do Lote *
          </label>
          <input
            type="number"
            value={formData.loteId}
            onChange={(e) => handleChange("loteId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635EF2] ${
              errors.loteId
                ? "border-[#F2A2A9] bg-[#FFF5F5]"
                : "border-[#E8E8EA]"
            }`}
            placeholder="ID do lote"
          />
          {errors.loteId && (
            <p className="text-[#F2A2A9] text-xs mt-1">{errors.loteId}</p>
          )}
        </div>

        {/* Usuário ID */}
        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            ID do Usuário *
          </label>
          <input
            type="number"
            value={formData.usuarioId}
            onChange={(e) => handleChange("usuarioId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635EF2] ${
              errors.usuarioId
                ? "border-[#F2A2A9] bg-[#FFF5F5]"
                : "border-[#E8E8EA]"
            }`}
            placeholder="ID do usuário"
          />
          {errors.usuarioId && (
            <p className="text-[#F2A2A9] text-xs mt-1">{errors.usuarioId}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition disabled:opacity-50"
        >
          {isLoading
            ? "Salvando..."
            : lance
            ? "Atualizar Lance"
            : "Criar Lance"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-[#E8E8EA] text-[#414059] rounded-lg hover:bg-[#F8F8FA] transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
