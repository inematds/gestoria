import test from 'node:test';
import assert from 'node:assert/strict';
import { decide, metrics, parseState, promote, promotionCheck, simulate, type Evaluation } from '../src/domain.ts';
import { seed } from '../src/seed.ts';

test('métricas não confundem aprovação humana com autonomia e incluem custo pendente', () => {
  const s = seed(); const m = metrics(s);
  assert.equal(m.completed, 16); assert.equal(m.autonomous, 12); assert.equal(m.autonomy, 75);
  assert.equal(m.pending, 2); assert.ok(Math.abs(m.costPerCase! - 18 * .38 / 16) < 1e-10);
  decide(s, 'demo-run-16', true, 'Gestor', 'Evidência suficiente.');
  const after = metrics(s); assert.equal(after.completed, 17); assert.equal(after.autonomous, 12);
  assert.equal(after.autonomy, 12 / 17 * 100);
});
test('denominadores vazios são ausência de evidência, não zero ou 100%', () => {
  const s = seed(); s.runs = []; s.evaluations = [];
  const m = metrics(s); assert.equal(m.autonomy, null); assert.equal(m.accuracy, null); assert.equal(m.costPerCase, null);
});
test('cenário de rotina só conclui autonomamente a partir do nível 3; exceções sempre pedem humano', () => {
  for (let level = 0; level <= 4; level++) {
    const s = seed(); s.agents[0].level = level;
    const normal = simulate(s, 'researcher', 'normal');
    assert.equal(normal.status, level >= 3 ? 'completed' : 'review');
    for (const scenario of ['doubt', 'critical'] as const) assert.equal(simulate(s, 'researcher', scenario).status, 'review');
  }
});
test('agente pausado, orçamento estourado e aprovação duplicada são bloqueados', () => {
  const s = seed(); assert.throws(() => simulate(s, 'financial', 'normal'), /ativo/);
  s.processes[0].budget = 0; assert.throws(() => simulate(s, 'researcher', 'normal'), /orçamento/);
  decide(s, 'demo-run-16', false, 'Gestor', 'Faltam dados.');
  assert.throws(() => decide(s, 'demo-run-16', true, 'Gestor', 'Aprovar'), /aguardando/);
  assert.equal(s.runs.find(r => r.id === 'demo-run-16')!.status, 'rejected');
});
test('não aprova entrega com versão alterada ou agente pausado; permite devolução', () => {
  const s = seed(); s.agents[1].revision++;
  assert.throws(() => decide(s, 'demo-run-16', true, 'Gestor', 'Ok'), /versão alterada/);
  decide(s, 'demo-run-16', false, 'Gestor', 'Reexecutar nova versão.');
  s.agents[1].revision--; s.agents[1].active = false;
  assert.throws(() => decide(s, 'demo-run-17', true, 'Gestor', 'Ok'), /pausado/);
});
function evaluated() {
  const s = seed(); s.runs = [];
  s.evaluations = Array.from({ length: 100 }, (_, i): Evaluation => ({ id: `case-${i}`, agentId: 'qualifier', revision: 1, title: `Caso ${i}`, expected: `Gabarito ${i}`, produced: `Saída ${i}`, result: i < 95 ? 'correct' : 'acceptable', reviewer: 'Gestor', created: new Date().toISOString() }));
  return s;
}
test('promoção exige amostra, acerto, ausência de erro crítico e responsável; avança uma versão', () => {
  const s = evaluated(); const a = s.agents[1]; assert.equal(promotionCheck(s, a).eligible, true);
  assert.throws(() => promote(s, a.id, '', 'Justificativa'), /responsável/);
  s.evaluations[99].result = 'critical'; assert.equal(promotionCheck(s, a).eligible, false);
  s.evaluations[99].result = 'acceptable';
  promote(s, a.id, 'Gestor', 'Piloto aprovado, escopo restrito.');
  assert.equal(a.level, 3); assert.equal(a.revision, 2);
  assert.equal(promotionCheck(s, a).eligible, false); assert.equal(metrics(s).evaluated, 0);
});
test('avaliações históricas e casos pendentes não autorizam promoção', () => {
  const s = evaluated(); const a = s.agents[1]; s.evaluations[0].revision = 0;
  assert.equal(promotionCheck(s, a).eligible, false);
  s.evaluations[0].revision = 1; simulate(s, a.id, 'normal');
  assert.equal(promotionCheck(s, a).eligible, false);
});
test('importação faz roundtrip, ignora campos desconhecidos e rejeita estrutura, números e relações inválidas', () => {
  const original = seed(); assert.deepEqual(parseState(JSON.parse(JSON.stringify(original))), original);
  assert.throws(() => parseState(null)); assert.throws(() => parseState({ schemaVersion: 2 }));
  const invalids = [
    (s: any) => { s.agents[0].level = 5; },
    (s: any) => { s.agents[0].active = 'false'; },
    (s: any) => { s.runs[0].cost = -1; },
    (s: any) => { s.processes[0].volume = NaN; },
    (s: any) => { s.agents[0].processId = 'missing'; },
    (s: any) => { s.evaluations[0].revision = 900; },
    (s: any) => { s.processes.push(s.processes[0]); },
    (s: any) => { s.runs[0].processId = 'finance'; },
    (s: any) => { s.improvements[0].stage = 'validated'; s.improvements[0].evidence = ''; }
  ];
  for (const mutate of invalids) { const s = structuredClone(original); mutate(s); assert.throws(() => parseState(s)); }
  const extra = { ...original, secret: 'must not persist' }; assert.equal('secret' in parseState(extra), false);
});
