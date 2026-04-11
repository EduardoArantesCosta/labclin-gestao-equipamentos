export type SituacaoDashboard = "VENCIDO" | "PROXIMO_DO_VENCIMENTO" | "OK" | "EM_CALIBRACAO";

export type DashboardEquipamentoCritico = {
  id: number;
  codigo: string;
  numeroSerie: string | null;
  localizacao: string | null;
  dataValidade: string | null;
  situacao: SituacaoDashboard;
};

export type DashboardUltimaCalibracao = {
  id: number;
  equipamentoId: number;
  codigo: string;
  numeroCertificado: string;
  dataCalibracao: string;
  empresa: string;
};

export type DashboardResponse = {
  totalAtivos: number;
  vencidos: number;
  proximosDoVencimento: number;
  ok: number;
  emCalibracao: number;
  vencendoEmBreve: DashboardEquipamentoCritico[];
  ultimasCalibracoes: DashboardUltimaCalibracao[];
};
