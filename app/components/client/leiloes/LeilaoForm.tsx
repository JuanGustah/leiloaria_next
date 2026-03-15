"use client";

import React, { useState } from "react";
import { LeilaoFormData, ItemFormData } from "@/lib/auctions/types";
import { CondicaoItem } from "@/lib/auctions/items";
import ItemForm from "./ItemForm";

interface LeilaoFormProps {
  onSubmit: (data: LeilaoFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function LeilaoForm({
  onSubmit,
  onCancel,
  isLoading,
}: LeilaoFormProps) {
  const [formData, setFormData] = useState<LeilaoFormData>({
    nome: "",
    inicio: "",
    fim: "",
    prazoPagamento: "",
    lanceMinimo: "",
    descricao: "",
    itens: [],
  });

  const [currentItem, setCurrentItem] = useState<ItemFormData>({
    nome: "",
    descricao: "",
    condicao: CondicaoItem.NOVO,
    categoriasId: [],
    imagens: [],
  });

  const [showItemForm, setShowItemForm] = useState(false);

  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      itens: [...prev.itens, { ...currentItem }],
    }));

    // Reset do formulário de item
    setCurrentItem({
      nome: "",
      descricao: "",
      condicao: CondicaoItem.NOVO,
      categoriasId: [],
      imagens: [],
    });
    setShowItemForm(false);
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-[#F2F2F2]">
      <h2 className="text-2xl font-bold text-[#635EF2] mb-6">Novo Leilão</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grid de campos principais - Inline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Nome *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              placeholder="Nome do leilão"
              disabled={isLoading}
            />
          </div>

          {/* Lance Mínimo */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Lance Mínimo *
            </label>
            <input
              type="number"
              name="lanceMinimo"
              value={formData.lanceMinimo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={isLoading}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              placeholder="Descrição do leilão"
              rows={2}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Grid de datas - Inline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Início */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Início *
            </label>
            <input
              type="datetime-local"
              name="inicio"
              value={formData.inicio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              disabled={isLoading}
            />
          </div>

          {/* Fim */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Fim *
            </label>
            <input
              type="datetime-local"
              name="fim"
              value={formData.fim}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              disabled={isLoading}
            />
          </div>

          {/* Prazo de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Prazo de Pagamento *
            </label>
            <input
              type="datetime-local"
              name="prazoPagamento"
              value={formData.prazoPagamento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Seção de Itens */}
        <div className="border-t border-[#F2F2F2] pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#414059]">
              Itens ({formData.itens.length})
            </h3>
            <button
              type="button"
              onClick={() => setShowItemForm(!showItemForm)}
              className="px-3 py-2 bg-[#635EF2] text-white text-sm rounded-lg hover:bg-[#4A47B5] transition"
              disabled={isLoading}
            >
              {showItemForm ? "Cancelar" : "+ Adicionar Item"}
            </button>
          </div>



          {/* Formulário de Item */}
          {showItemForm && (
            <div className="mb-4">
              <ItemForm
                item={currentItem}
                onItemChange={(e) => setCurrentItem((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))}
                onCategoriesChange={(ids) =>
                  setCurrentItem((prev) => ({
                    ...prev,
                    categoriasId: ids,
                  }))
                }
                onAddItem={handleAddItem}
                onCancel={() => setShowItemForm(false)}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Lista de Itens Adicionados */}
          {formData.itens.length > 0 && (
            <div className="space-y-2">
              {formData.itens.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#F8F8FA] p-3 rounded-lg border border-[#F2F2F2]"
                >
                  <div className="flex-1">
                    <p className="font-medium text-[#414059]">{item.nome}</p>
                    <p className="text-xs text-[#8B86C4]">
                      {item.condicao} • Categorias: {item.categoriasId.join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="ml-4 px-3 py-2 text-[#F2A2A9] hover:bg-[#F2A2A9]/10 rounded-lg transition"
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t border-[#F2F2F2]">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-[#F2F2F2] text-[#414059] rounded-lg hover:bg-[#F8F8FA] transition font-medium"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4A47B5] transition disabled:opacity-50 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Criar Leilão"}
          </button>
        </div>
      </form>
    </div>
  );
}
