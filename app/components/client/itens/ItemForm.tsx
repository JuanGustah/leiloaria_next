"use client";

import React, { useState } from "react";
import { ItemFormData } from "@/lib/auctions/types";
import { CondicaoItem } from "@/lib/auctions/items";

interface ItemFormProps {
  item: ItemFormData;
  onItemChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCategoriesChange: (ids: number[]) => void;
  onAddItem: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ItemForm({
  item,
  onItemChange,
  onCategoriesChange,
  onAddItem,
  onCancel,
  isLoading,
}: ItemFormProps) {
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onItemChange(e);
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ids = e.target.value
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    onCategoriesChange(ids);
  };

  return (
    <div className="bg-[#F8F8FA] rounded-lg p-4 border border-[#F2F2F2]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Nome do Item */}
        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            Nome do Item *
          </label>
          <input
            type="text"
            name="nome"
            value={item.nome}
            onChange={handleFieldChange}
            className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
            placeholder="Nome do item"
            disabled={isLoading}
          />
        </div>

        {/* Condição */}
        <div>
          <label className="block text-sm font-medium text-[#414059] mb-2">
            Condição *
          </label>
          <select
            name="condicao"
            value={item.condicao}
            onChange={handleFieldChange}
            className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
            disabled={isLoading}
          >
            <option value={CondicaoItem.NOVO}>Novo</option>
            <option value={CondicaoItem.SEMI_NOVO}>Semi-novo</option>
            <option value={CondicaoItem.USADO}>Usado</option>
            <option value={CondicaoItem.AVARIADO}>Avariado</option>
          </select>
        </div>
      </div>

      {/* Descrição do Item */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#414059] mb-2">
          Descrição
        </label>
        <textarea
          name="descricao"
          value={item.descricao}
          onChange={handleFieldChange}
          className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
          placeholder="Descrição do item"
          rows={2}
          disabled={isLoading}
        />
      </div>

      {/* Categorias */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#414059] mb-2">
          Categorias *
        </label>
        <input
          type="text"
          placeholder="Ex: 1,2,3 (IDs das categorias)"
          value={item.categoriasId.join(",")}
          onChange={handleCategoriesChange}
          className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition"
          disabled={isLoading}
        />
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-[#F2F2F2] text-[#414059] rounded-lg hover:bg-[#F2F2F2] transition font-medium"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onAddItem}
          className="flex-1 px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4A47B5] transition disabled:opacity-50 font-medium"
          disabled={isLoading}
        >
          Adicionar Item
        </button>
      </div>
    </div>
  );
}
