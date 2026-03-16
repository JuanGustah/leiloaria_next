"use client";

import { useState, useEffect } from "react";
import { LeilaoFormData, LeilaoResponse } from "@/lib/auctions/types";
import { useParams, useRouter } from "next/navigation";
import { LeilaoForm } from "@/app/components/client/leiloes";

export default function LeiloesPage() {
  const { id } = useParams();
  const [leilao, setLeilao] = useState<LeilaoResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchLeilao();
  }, []);

  const fetchLeilao = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/client/leiloes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLeilao(data);
        let lances = data.lote?.lances || [];
        let maiorLance = lances.reduce((max: number, lance: any) => {
          return lance.valor > max ? lance.valor : max;
        }, 0);
      } else {
        if (response.status === 404) {
          alert("Leilão não encontrado");
        } else {
          alert("Erro ao buscar leilão");
        }
        handleCloseForm();
      }
    } catch (e) {
      alert("Erro ao buscar leilão");
      handleCloseForm();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    router.push("/client/leiloes");
  };

  const handleSubmit = async (data: LeilaoFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/client/leiloes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await handleCloseForm();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao criar leilão");
      }
    } catch (e) {
      alert("Erro ao criar leilão");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LeilaoForm
      viewOnly={false}
      leilao={leilao}
      onSubmit={handleSubmit}
      onCancel={handleCloseForm}
      isLoading={isSaving}
      isEditing={true}
    />
  );
}