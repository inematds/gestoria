export type Process = { id: string; name: string; owner: string; department: string; objective: string; volume: number; baseline: number; hourlyCost: number; target: number; budget: number; steps: string[] };
export type Agent = { id: string; processId: string; name: string; owner: string; mission: string; input: string; output: string; allowed: string; forbidden: string; model: string; context: string; skills: string; tools: string; level: number; revision: number; active: boolean };
export type Run = { id: string; processId: string; agentId: string; revision: number; title: string; output: string; status: 'completed' | 'review' | 'rejected'; human: boolean; cost: number; seconds: number; created: string; reason: string; decision: string; decidedBy: string };
export type Evaluation = { id: string; agentId: string; revision: number; title: string; expected: string; produced: string; result: 'correct' | 'acceptable' | 'incorrect' | 'critical'; reviewer: string; created: string };
export type Improvement = { id: string; processId: string; title: string; hypothesis: string; owner: string; evidence: string; stage: 'proposal' | 'testing' | 'validated' | 'promoted'; created: string };
export type Audit = { id: string; action: string; created: string };
export type State = { schemaVersion: 1; processes: Process[]; agents: Agent[]; runs: Run[]; evaluations: Evaluation[]; improvements: Improvement[]; audit: Audit[] };
export const levels = ['Consulta', 'Recomenda', 'Prepara', 'Executa', 'Gerencia'];
export const resultNames = { correct: 'Correto', acceptable: 'Aceitável', incorrect: 'Incorreto', critical: 'Erro crítico' };
export const stageNames = { proposal: 'Proposta', testing: 'Em teste', validated: 'Validada', promoted: 'Promovida' };
export const uid = () => crypto.randomUUID();
export const now = () => new Date().toISOString();
export function record(state: State, action: string) {
  state.audit.unshift({ id: uid(), action, created: now() });
  state.audit = state.audit.slice(0, 300);
}
export function metrics(state: State, processId = '') {
  const runs = state.runs.filter(r => !processId || r.processId === processId);
  const completed = runs.filter(r => r.status === 'completed');
  const autonomous = completed.filter(r => !r.human).length;
  const cost = runs.reduce((s, r) => s + r.cost, 0);
  const evaluated = state.evaluations.filter(e => state.agents.some(a => a.id === e.agentId && a.revision === e.revision && (!processId || a.processId === processId)));
  return { total: runs.length, completed: completed.length, autonomous,
    autonomy: completed.length ? autonomous / completed.length * 100 : null,
    pending: runs.filter(r => r.status === 'review').length,
    rejected: runs.filter(r => r.status === 'rejected').length,
    cost, costPerCase: completed.length ? cost / completed.length : null,
    accuracy: evaluated.length ? evaluated.filter(e => e.result === 'correct').length / evaluated.length * 100 : null,
    critical: evaluated.filter(e => e.result === 'critical').length,
    evaluated: evaluated.length,
    avgSeconds: completed.length ? completed.reduce((s, r) => s + r.seconds, 0) / completed.length : null };
}
export function promotionCheck(state: State, agent: Agent) {
  const cases = state.evaluations.filter(e => e.agentId === agent.id && e.revision === agent.revision);
  const correct = cases.filter(e => e.result === 'correct').length;
  const accuracy = cases.length ? correct / cases.length * 100 : 0;
  const target = state.processes.find(p => p.id === agent.processId)!.target;
  const reasons: string[] = [];
  if (!agent.active) reasons.push('Retome o agente antes de solicitar promoção.');
  if (agent.level >= 4) reasons.push('O agente já está no nível máximo.');
  if (cases.length < 100) reasons.push(`${cases.length}/100 casos avaliados nesta versão.`);
  if (accuracy < target) reasons.push(`Acerto de ${accuracy.toFixed(1)}%; meta de ${target}%.`);
  if (cases.some(e => e.result === 'critical')) reasons.push('Há erro crítico na avaliação desta versão.');
  if (state.runs.some(r => r.agentId === agent.id && r.status === 'review')) reasons.push('Existem decisões humanas pendentes.');
  return { eligible: reasons.length === 0, reasons, count: cases.length, accuracy };
}
export function simulate(state: State, agentId: string, scenario: 'normal' | 'doubt' | 'critical') {
  if (!['normal', 'doubt', 'critical'].includes(scenario)) throw new Error('Cenário de simulação inválido.');
  const agent = state.agents.find(a => a.id === agentId);
  if (!agent?.active) throw new Error('Selecione um agente ativo.');
  const process = state.processes.find(p => p.id === agent.processId)!;
  const cost = 0.38;
  const spent = state.runs.filter(r => r.processId === process.id).reduce((s, r) => s + r.cost, 0);
  if (spent + cost > process.budget + 0.00001) throw new Error('O orçamento acumulado deste laboratório foi atingido. Revise o processo.');
  const human = agent.level < 3 || scenario !== 'normal';
  const reason = scenario === 'critical' ? 'Solicitação fora da política: decisão obrigatória do responsável humano.' : scenario === 'doubt' ? 'Informações conflitantes: revisar evidências antes de continuar.' : agent.level < 3 ? `Nível ${agent.level}: ${levels[agent.level].toLowerCase()}; a próxima ação depende do humano.` : '';
  const run: Run = { id: uid(), processId: process.id, agentId, revision: agent.revision,
    title: `Caso simulado ${state.runs.length + 1} · ${scenario === 'normal' ? 'Rotina' : scenario === 'doubt' ? 'Dados conflitantes' : 'Fora da política'}`,
    output: `Saída didática para “${agent.output}”. ${scenario === 'normal' ? 'Os dados fictícios atendem aos critérios do cenário.' : 'A simulação identificou uma condição que exige revisão.'} Nenhum modelo ou sistema externo foi acionado.`,
    status: human ? 'review' : 'completed', human, cost, seconds: 42, created: now(), reason, decision: '', decidedBy: '' };
  state.runs.unshift(run);
  record(state, `Simulação criada: ${run.title}, ${agent.name} v${agent.revision}.`);
  return run;
}
export function decide(state: State, id: string, approved: boolean, reviewer: string, reason: string) {
  const run = state.runs.find(r => r.id === id);
  if (!run || run.status !== 'review') throw new Error('Esta execução não está aguardando decisão.');
  if (!reviewer.trim() || !reason.trim()) throw new Error('Informe o responsável e a justificativa.');
  const agent = state.agents.find(a => a.id === run.agentId)!;
  if (approved && (!agent.active || agent.revision !== run.revision)) throw new Error('Agente pausado ou versão alterada. Devolva o caso e simule novamente com a versão atual.');
  run.status = approved ? 'completed' : 'rejected';
  run.human = true;
  run.decision = reason.trim();
  run.decidedBy = reviewer.trim();
  record(state, `${reviewer}: ${approved ? 'aprovou' : 'devolveu'} ${run.title}. ${reason}`);
}
export function promote(state: State, id: string, reviewer: string, reason: string) {
  const agent = state.agents.find(a => a.id === id);
  if (!agent) throw new Error('Agente não encontrado.');
  const check = promotionCheck(state, agent);
  if (!check.eligible) throw new Error(check.reasons.join(' '));
  if (!reviewer.trim() || !reason.trim()) throw new Error('Registre responsável e justificativa da promoção.');
  agent.level += 1;
  agent.revision += 1;
  record(state, `${reviewer} promoveu ${agent.name} para nível ${agent.level}, v${agent.revision}. ${reason}`);
}

// Importações são reconstruídas por campos conhecidos; dados externos nunca viram HTML ou código.
export function parseState(input: unknown): State {
  const fail = () => { throw new Error('Arquivo incompatível ou dados inválidos. Use uma exportação Gestoria versão 1.'); };
  const obj = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : fail();
  const str = (v: unknown): string => typeof v === 'string' && v.length <= 10000 ? v : fail();
  const nonempty = (v: unknown) => { const s = str(v); return s.trim() ? s : fail(); };
  const num = (v: unknown, min = 0, max = 1e9): number => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : fail();
  const integer = (v: unknown, min = 0, max = 1e9): number => { const n = num(v, min, max); return Number.isInteger(n) ? n : fail(); };
  const bool = (v: unknown): boolean => typeof v === 'boolean' ? v : fail();
  const date = (v: unknown) => { const s = str(v); return Number.isFinite(Date.parse(s)) ? s : fail(); };
  const choice = <T extends string>(v: unknown, options: T[]): T => options.includes(v as T) ? v as T : fail();
  const list = <T>(v: unknown, map: (r: Record<string, unknown>) => T): T[] => Array.isArray(v) && v.length <= 20000 ? v.map(x => map(obj(x))) : fail();
  const root = obj(input);
  if (root.schemaVersion !== 1) fail();
  const state: State = {
    schemaVersion: 1,
    processes: list(root.processes, p => ({ id: nonempty(p.id), name: nonempty(p.name), owner: nonempty(p.owner), department: nonempty(p.department), objective: nonempty(p.objective), volume: integer(p.volume), baseline: num(p.baseline), hourlyCost: num(p.hourlyCost), target: num(p.target, 1, 100), budget: num(p.budget), steps: Array.isArray(p.steps) && p.steps.length >= 1 && p.steps.length <= 20 ? p.steps.map(nonempty) : fail() })),
    agents: list(root.agents, a => ({ id: nonempty(a.id), processId: nonempty(a.processId), name: nonempty(a.name), owner: nonempty(a.owner), mission: nonempty(a.mission), input: nonempty(a.input), output: nonempty(a.output), allowed: nonempty(a.allowed), forbidden: nonempty(a.forbidden), model: nonempty(a.model), context: str(a.context), skills: str(a.skills), tools: str(a.tools), level: integer(a.level, 0, 4), revision: integer(a.revision, 1), active: bool(a.active) })),
    runs: list(root.runs, r => ({ id: nonempty(r.id), processId: nonempty(r.processId), agentId: nonempty(r.agentId), revision: integer(r.revision, 1), title: nonempty(r.title), output: nonempty(r.output), status: choice(r.status, ['completed', 'review', 'rejected']), human: bool(r.human), cost: num(r.cost), seconds: num(r.seconds), created: date(r.created), reason: str(r.reason), decision: str(r.decision), decidedBy: str(r.decidedBy) })),
    evaluations: list(root.evaluations, e => ({ id: nonempty(e.id), agentId: nonempty(e.agentId), revision: integer(e.revision, 1), title: nonempty(e.title), expected: nonempty(e.expected), produced: nonempty(e.produced), result: choice(e.result, ['correct', 'acceptable', 'incorrect', 'critical']), reviewer: nonempty(e.reviewer), created: date(e.created) })),
    improvements: list(root.improvements, i => ({ id: nonempty(i.id), processId: nonempty(i.processId), title: nonempty(i.title), hypothesis: nonempty(i.hypothesis), owner: nonempty(i.owner), evidence: str(i.evidence), stage: choice(i.stage, ['proposal', 'testing', 'validated', 'promoted']), created: date(i.created) })),
    audit: list(root.audit, a => ({ id: nonempty(a.id), action: nonempty(a.action), created: date(a.created) }))
  };
  for (const rows of [state.processes, state.agents, state.runs, state.evaluations, state.improvements, state.audit]) {
    if (new Set(rows.map(r => r.id)).size !== rows.length) fail();
  }
  for (const a of state.agents) if (!state.processes.some(p => p.id === a.processId)) fail();
  for (const r of state.runs) {
    if (!state.agents.some(a => a.id === r.agentId && a.processId === r.processId && r.revision <= a.revision)) fail();
    if (r.status !== 'completed' && !r.human) fail();
  }
  for (const e of state.evaluations) if (!state.agents.some(a => a.id === e.agentId && e.revision <= a.revision)) fail();
  for (const i of state.improvements) if (!state.processes.some(p => p.id === i.processId) || (['validated', 'promoted'].includes(i.stage) && !i.evidence.trim())) fail();
  return state;
}
