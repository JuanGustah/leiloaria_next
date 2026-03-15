export const metadata = {
  title: "Admin Dashboard",
  description: "Painel de administração",
};

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h1 className="text-4xl font-bold text-[#05050D] mb-2">Bem-vindo ao Admin</h1>
        <p className="text-[#414059] mb-8">Gerencie a plataforma Leiloaria</p>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#635EF2]">
            <div>
              <p className="text-[#414059] text-sm">Total de Usuários</p>
              <p className="text-3xl font-bold text-[#05050D] mt-2">1,234</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#F2A2A9]">
            <div>
              <p className="text-[#414059] text-sm">Leilões Ativos</p>
              <p className="text-3xl font-bold text-[#05050D] mt-2">45</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#635EF2]">
            <div>
              <p className="text-[#414059] text-sm">Receita (Mês)</p>
              <p className="text-3xl font-bold text-[#05050D] mt-2">R$ 12.5k</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#F2A2A9]">
            <div>
              <p className="text-[#414059] text-sm">Taxa de Conversão</p>
              <p className="text-3xl font-bold text-[#05050D] mt-2">3.8%</p>
            </div>
          </div>
        </div>

        {/* Seção de atividades */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#05050D] mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-[#F2F2F2]">
              <div className="w-2 h-2 bg-[#635EF2] rounded-full"></div>
              <div>
                <p className="font-medium text-[#05050D]">Novo usuário cadastrado</p>
                <p className="text-sm text-[#414059]">João Silva se registrou na plataforma</p>
              </div>
              <p className="ml-auto text-sm text-[#414059]">há 2 horas</p>
            </div>
            <div className="flex items-center gap-4 pb-4 border-b border-[#F2F2F2]">
              <div className="w-2 h-2 bg-[#F2A2A9] rounded-full"></div>
              <div>
                <p className="font-medium text-[#05050D]">Leilão concluído com sucesso</p>
                <p className="text-sm text-[#414059]">Leilão #1234 foi finalizado</p>
              </div>
              <p className="ml-auto text-sm text-[#414059]">há 4 horas</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-[#635EF2] rounded-full"></div>
              <div>
                <p className="font-medium text-[#05050D]">Pagamento processado</p>
                <p className="text-sm text-[#414059]">Transação de R$ 1.200 foi aprovada</p>
              </div>
              <p className="ml-auto text-sm text-[#414059]">há 6 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
