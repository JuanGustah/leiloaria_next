"use client";

import React, { useState, useEffect } from "react";
import { VendaFormData, VendaRequest, FormaPagamento } from "@/lib/vendas/types";

interface VendaFormProps {
  venda?: any | null;
  onSubmit: (data: VendaRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function VendaForm({
  venda,
  onSubmit,
  onCancel,
  isLoading,
}: VendaFormProps) {
  const [formData, setFormData] = useState<VendaFormData>({
    valor: "",
    formaPagamento: "",
    lanceId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (venda) {
      setFormData({
        valor: String(venda.valor || ""),
        formaPagamento: FormaPagamento.PIX, // default ao editar
        lanceId: String(venda.lance?.id || ""),
      });
    } else {
      setFormData({
        valor: "",
        formaPagamento: "",
        lanceId: "",
      });
    }
    setErrors({});
  }, [venda]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }
    if (!formData.formaPagamento) {
      newErrors.formaPagamento = "Selecione uma forma de pagamento";
    }
    if (!formData.lanceId || parseInt(formData.lanceId) <= 0) {
      newErrors.lanceId = "Lance ID deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    field: keyof VendaFormData,
    value: string
  ) => {
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
      const submitData: VendaRequest = {
        valor: parseFloat(formData.valor),
        formaPagamento: formData.formaPagamento as FormaPagamento,
        lanceId: parseInt(formData.lanceId),
        ...(venda && { id: venda.id }),
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold text-[#05050D] mb-4">
        {venda ? "Editar Venda" : "Nova Venda"}
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

        {/* Forma de Pagamento */}
        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            Forma de Pagamento *
          </label>
          <select
            value={formData.formaPagamento}
            onChange={(e) => handleChange("formaPagamento", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635EF2] ${
              errors.formaPagamento
                ? "border-[#F2A2A9] bg-[#FFF5F5]"
                : "border-[#E8E8EA]"
            }`}
          >
            <option value="">Selecione...</option>
            <option value={FormaPagamento.CARTAO}>Cartão</option>
            <option value={FormaPagamento.PIX}>PIX</option>
            <option value={FormaPagamento.BOLETO}>Boleto</option>
          </select>
          {errors.formaPagamento && (
            <p className="text-[#F2A2A9] text-xs mt-1">
              {errors.formaPagamento}
            </p>
          )}
        </div>

        {/* Lance ID */}
        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            ID do Lance *
          </label>
          <input
            type="number"
            value={formData.lanceId}
            onChange={(e) => handleChange("lanceId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635EF2] ${
              errors.lanceId
                ? "border-[#F2A2A9] bg-[#FFF5F5]"
                : "border-[#E8E8EA]"
            }`}
            placeholder="ID do lance"
          />
          {errors.lanceId && (
            <p className="text-[#F2A2A9] text-xs mt-1">{errors.lanceId}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition disabled:opacity-50"
        >
          {isLoading ? "Salvando..." : venda ? "Atualizar Venda" : "Criar Venda"}
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
