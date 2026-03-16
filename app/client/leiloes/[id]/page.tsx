"use client";

import { useState, useEffect } from "react";
import { LeilaoResponse } from "@/lib/auctions/types";
import { useParams, useRouter } from "next/navigation";
import { CondicaoItem } from "@/lib/auctions/items";
import ItemList from "@/app/components/client/itens/itemList";
import LanceForm from "@/app/components/client/lances/LanceForm";
import { LanceFormData } from "@/lib/lances/types";

export default function LeiloesPage() {
  const { id } = useParams();
  const [leilao, setLeilao] = useState<LeilaoResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [lanceMinimo, setLanceMinimo] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("-------");
  const router = useRouter();
  useEffect(() => {
    fetchLeilao();
  }, []);

  useEffect(() => {
    if (leilao) {
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [leilao]);

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
        setLanceMinimo(
          maiorLance > 0 ? maiorLance : data.lote?.lanceMinimo || 0
        );
        console.log("Leilão carregado:", data);
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

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeilao();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateTimeRemaining = () => {
    if (!leilao?.fim) return "N/A";
    const now = new Date();
    const end = new Date(leilao.fim);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Leilão encerrado";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s restantes`;
  }

  const handleCloseForm = () => {
    router.push("/client/leiloes");
  };

  const handleSubmit = async (data: LanceFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/client/lances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Lance criado com sucesso");
        await fetchLeilao();
      } else {
        const error = await response.json();
        alert(error.message || "Erro ao criar lance");
      }
    } catch (e) {
      alert("Erro ao criar leilão");
    } finally {
      setIsSaving(false);
    }
  };

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 justify-between p-4 bg-white rounded shadow strength pt-8 min-h-screen">
      {leilao?.lote?.itens && leilao?.lote?.itens?.length > 0 && (
        <ItemList
          items={
            leilao?.lote?.itens?.map(item => ({
              ...item,
              condicao: item.condicao
                ? (item.condicao as CondicaoItem)
                : CondicaoItem.NOVO,
            }))
          }
          isLoading={isLoading}
        />
      )}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-[#F2F2F2] col-span-2">
        <h2 className="text-2xl font-bold text-[#635EF2] mb-6">{leilao?.lote?.nome}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ color: "#656565" }}>

          {/* Lance Mínimo */}
          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Lance Mínimo:
            </label>
            <p className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
              R$ {leilao?.lote?.lanceMinimo && leilao?.lote?.lanceMinimo.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Último Lance:
            </label>
            <p className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
              R$ {lanceMinimo}
            </p>
          </div>

          {/* Prazo de Pagamento */}
          <div className="mb-2 col-span-2">
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Prazo de Pagamento:
            </label>
            <p className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
              {leilao?.prazoPagamento ? new Date(leilao.prazoPagamento).toLocaleString() : "N/A"}
            </p>
          </div>


          {/* Tempo Restante */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#414059] mb-2 ">
              Tempo Restante:
            </label>
            <p className="w-full px-3 py-2 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition text-2xl font-bold text-[#635EF2] text-center">
              {timeRemaining}
            </p>
          </div>


          {/* Descrição */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#414059] mb-2">
              Descrição
            </label>
            <p className="w-full px-3 py-4 border border-[#F2F2F2] rounded-lg focus:outline-none focus:border-[#635EF2] transition">
              {leilao?.lote?.descricao || "N/A"}
            </p>
          </div>
        </div>
        <LanceForm onSubmit={handleSubmit} onCancel={handleCloseForm} lanceMinimo={(lanceMinimo + 10)} loteId={leilao?.lote?.id || ""} isLoading={isSaving} />
      </div>

    </div>
  );
}