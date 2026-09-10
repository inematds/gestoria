import { now, type State } from './domain';
export function seed(): State {
  const created = now();
  return {
    schemaVersion: 1,
    processes: [
      { id: 'commercial', name: 'Qualificação de leads', owner: 'Marina · Comercial', department: 'Comercial', objective: 'Entregar leads qualificados aos vendedores, com justificativa e próxima ação.', volume: 300, baseline: 12, hourlyCost: 60, target: 95, budget: 250, steps: ['Receber lead', 'Pesquisar', 'Qualificar', 'Revisar', 'Entregar ao vendedor'] },
      { id: 'finance', name: 'Conciliação financeira', owner: 'Rafael · Financeiro', department: 'Financeiro', objective: 'Preparar a conciliação e encaminhar divergências para revisão.', volume: 120, baseline: 8, hourlyCost: 65, target: 98, budget: 150, steps: ['Receber extrato', 'Conferir lançamentos', 'Identificar divergências', 'Revisar conciliação'] }
    ],
    agents: [
      { id: 'researcher', processId: 'commercial', name: 'Pesquisador comercial', owner: 'Marina · Comercial', mission: 'Reunir informações de empresas nas fontes autorizadas.', input: 'Empresa e domínio', output: 'Resumo da empresa com fontes', allowed: 'Consultar fontes públicas autorizadas e histórico de leitura do CRM.', forbidden: 'Enviar mensagens, alterar CRM, conceder descontos.', model: 'Simulador local', context: 'Procedimento de pesquisa v1; fontes autorizadas', skills: 'Pesquisar empresa; resumir evidências', tools: 'Navegador (planejado); CRM somente leitura (planejado)', level: 3, revision: 1, active: true },
      { id: 'qualifier', processId: 'commercial', name: 'Qualificador de leads', owner: 'Marina · Comercial', mission: 'Entregar leads classificados com justificativa e próxima ação.', input: 'Nome, empresa, telefone, e-mail e pesquisa', output: 'Classificação, justificativa e próxima ação', allowed: 'Analisar ICP, consultar histórico e preparar recomendação.', forbidden: 'Enviar proposta, dar desconto ou fechar negócio.', model: 'Simulador local', context: 'ICP v1; catálogo v1; critérios de qualificação', skills: 'Aplicar ICP; identificar exceções; recomendar próxima ação', tools: 'CRM leitura (planejado); documentos (planejado)', level: 2, revision: 1, active: true },
      { id: 'financial', processId: 'finance', name: 'Assistente de conciliação', owner: 'Rafael · Financeiro', mission: 'Preparar a comparação entre extrato e lançamentos.', input: 'Extrato e lançamentos anonimizados', output: 'Conciliação proposta e divergências', allowed: 'Comparar registros e preparar relatório.', forbidden: 'Movimentar dinheiro, alterar lançamentos ou acessar credenciais bancárias.', model: 'Simulador local', context: 'Procedimento financeiro v1', skills: 'Conferir lançamento; sinalizar divergência', tools: 'ERP leitura (planejado)', level: 1, revision: 1, active: false }
    ],
    runs: Array.from({ length: 18 }, (_, i) => ({ id: `demo-run-${i}`, processId: 'commercial', agentId: i < 12 ? 'researcher' : 'qualifier', revision: 1,
      title: ['Empresa Horizonte · ICP aderente', 'Empresa Aurora · informações conflitantes', 'Empresa Vértice · condição fora da política'][i % 3],
      output: 'Exemplo fictício: classificação comercial preparada a partir de um cenário de laboratório. Nenhum contato ou sistema externo foi acessado.',
      status: i >= 16 ? 'review' as const : 'completed' as const, human: i >= 12, cost: 0.38, seconds: 42 + (i % 4) * 6, created,
      reason: i >= 16 ? (i === 16 ? 'Informações conflitantes sobre o perfil da empresa.' : 'Pedido de condição comercial fora da política.') : '',
      decision: i >= 12 && i < 16 ? 'Resultado fictício revisado para demonstração.' : '', decidedBy: i >= 12 && i < 16 ? 'Marina · exemplo' : '' })),
    evaluations: [
      { id: 'eval-1', agentId: 'qualifier', revision: 1, title: 'Empresa no ICP', expected: 'Qualificado com evidência', produced: 'Qualificado com evidência', result: 'correct', reviewer: 'Marina · exemplo', created },
      { id: 'eval-2', agentId: 'qualifier', revision: 1, title: 'Empresa fora do segmento', expected: 'Não qualificado', produced: 'Não qualificado', result: 'correct', reviewer: 'Marina · exemplo', created },
      { id: 'eval-3', agentId: 'qualifier', revision: 1, title: 'Dados insuficientes', expected: 'Solicitar revisão por falta de dados', produced: 'Revisão recomendada, justificativa incompleta', result: 'acceptable', reviewer: 'Marina · exemplo', created }
    ],
    improvements: [{ id: 'loop-1', processId: 'commercial', title: 'Tratar dados incompletos antes de qualificar', hypothesis: 'Uma checagem de campos obrigatórios reduz classificações sem evidência. Comparar a versão candidata com a atual em casos separados do treinamento.', owner: 'Marina · Comercial', evidence: '', stage: 'proposal', created }],
    audit: [{ id: 'audit-1', action: 'Laboratório iniciado com dados fictícios de demonstração.', created }]
  };
}
