"use client";

import React, { useState, useEffect } from "react";
import { LeilaoResponse, LeilaoFormData } from "@/lib/auctions/types";
import { AuctionForm, AuctionTable } from "@/app/components/admin/auctions";
import { useUser } from "@/lib/context/UserContext";

export default function AuctionsPage() {
  const { user } = useUser();
  const [auctions, setAuctions] = useState<LeilaoResponse[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<LeilaoResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/auctions");
      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data.auctions) ? data.auctions : [];
        setAuctions(list);
      } else {
        setAuctions([]);
      }
    } catch (e) {
      setAuctions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (auction?: LeilaoResponse) => {
    setSelectedAuction(auction || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedAuction(null);
  };

  const handleSubmit = async (data: LeilaoFormData) => {
    setIsSaving(true);
    try {
      // Garantir que temos o userId do usuário autenticado
      if (!user?.id) {
        alert("Erro: Usuário não identificado");
        return;
      }

      let response;
      if (selectedAuction) {
        response = await fetch(`/api/admin/auctions/${selectedAuction.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // Para criar, passa idUsuario do contexto do usuário autenticado
        response = await fetch("/api/admin/auctions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            idUsuario: user.id,
          }),
        });
      }
      if (response.ok) {
        handleCloseForm();
        await fetchAuctions();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao salvar leilão");
      }
    } catch (e) {
      alert("Erro ao salvar leilão");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este leilão?")) return;
    try {
      const response = await fetch(`/api/admin/auctions/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchAuctions();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao excluir leilão");
      }
    } catch (e) {
      alert("Erro ao excluir leilão");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#635EF2]">Leilões</h1>
          <button
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-[#635EF2] text-white rounded-lg hover:bg-[#4F46E5] transition font-medium"
          >
            + Novo Leilão
          </button>
        </div>
        <p className="text-[#414059]">Gerencie os leilões da plataforma</p>
      </div>
      <div className="bg-white rounded-lg border border-[#F2F2F2] overflow-hidden">
        <AuctionTable
          auctions={auctions}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
      {isFormOpen && (
        <AuctionForm
          auction={selectedAuction}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
