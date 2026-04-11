export type SituacaoDashboard = "VENCIDO" | "PROXIMO_DO_VENCIMENTO" | "OK" | "EM_CALIBRACAO";

export function calcularSituacaoDashboard(
  statusOperacional: string,
  dataValidade?: Date | null,
): SituacaoDashboard {
  if (statusOperacional === "EM_CALIBRACAO") {
    return "EM_CALIBRACAO";
  }

  if (!dataValidade) {
    return "VENCIDO";
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const validade = new Date(dataValidade);
  validade.setHours(0, 0, 0, 0);

  const diferencaMs = validade.getTime() - hoje.getTime();
  const diferencaDias = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

  if (diferencaDias < 0) {
    return "VENCIDO";
  }

  if (diferencaDias <= 30) {
    return "PROXIMO_DO_VENCIMENTO";
  }

  return "OK";
}

export function formatarDataBR(data: string | Date | null | undefined) {
  if (!data) return "-";

  const dataObj = new Date(data);

  return new Intl.DateTimeFormat("pt-BR").format(dataObj);
}
