import './style.css';
import { decide, levels, metrics, now, parseState, promote, promotionCheck, record, resultNames, simulate, stageNames, uid, type Agent, type State, type Improvement } from './domain';
import { seed } from './seed';
import courseUrl from '../docs/PLANO-CURSO.md?url';
import methodUrl from '../docs/METODO.md?url';
import productUrl from '../docs/PLANO-PRODUTO.md?url';
import templatesUrl from '../docs/TEMPLATES.md?url';

const KEY = 'gestoria.workspace.v1';
const app = document.querySelector<HTMLDivElement>('#app')!;
const dialog = document.querySelector<HTMLDialogElement>('#dialog')!;
let state: State;
let storageError = false;
let selected = '';
let search = '';
let noticeTimer: ReturnType<typeof setTimeout>;
try {
  const raw = localStorage.getItem(KEY);
  state = raw ? parseState(JSON.parse(raw)) : seed();
  if (!raw) localStorage.setItem(KEY, JSON.stringify(state));
}
catch { state = seed(); storageError = true; }
const nav = [ ['overview', 'Visão geral', 'overview'], ['processes', 'Processos', 'flow'], ['agents', 'Força de trabalho', 'agents'], ['decisions', 'Decisões humanas', 'check'], ['evaluations', 'Avaliações', 'eval'], ['improvements', 'Melhoria contínua', 'loop'], ['library', 'Método e curso', 'book'], ['settings', 'Dados do laboratório', 'settings'] ];
const iconPaths: Record<string, string> = {
  overview: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  flow: '<rect x="3" y="3" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/><path d="M6.5 9v9H14M10 6h7.5v9"/>',
  agents: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 4v2"/>',
  check: '<path d="m8 12 3 3 5-6"/><rect x="3" y="3" width="18" height="18" rx="4"/>',
  eval: '<path d="M5 3h14v18H5zM8 8h8M8 12h5M8 16h3"/>',
  loop: '<path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',
  book: '<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1zm0 0v15"/>',
  settings: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/>',
  play: '<path d="m8 4 12 8-12 8z"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
};
const icon = (name: string) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.flow}</svg>`;
const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const money = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const pct = (v: number | null) => v === null ? '—' : `${v.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
const number = (v: number) => v.toLocaleString('pt-BR');
const date = (v: string) => new Date(v).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const processName = (id: string) => state.processes.find(p => p.id === id)?.name || 'Processo';
const agentName = (id: string) => state.agents.find(a => a.id === id)?.name || 'Agente';
const route = () => nav.some(n => n[0] === location.hash.slice(1)) ? location.hash.slice(1) : 'overview';
const badge = (text: string, tone = '') => `<span class="badge ${tone}">${esc(text)}</span>`;
const action = (label: string, act: string, id = '', cls = 'button secondary', ico = '') => `<button type="button" class="${cls}" data-action="${act}" data-id="${esc(id)}">${ico ? icon(ico) : ''}${esc(label)}</button>`;
const empty = (title: string, description: string, button = '') => `<div class="empty"><h3>${esc(title)}</h3><p>${esc(description)}</p>${button}</div>`;
function notify(message: string) {
  const el = document.querySelector<HTMLDivElement>('#notice')!;
  clearTimeout(noticeTimer); el.textContent = message; el.classList.add('visible');
  noticeTimer = setTimeout(() => el.classList.remove('visible'), 6000);
}
function commit(change: (draft: State) => void, message: string) {
  if (storageError) throw new Error('O armazenamento está indisponível ou contém dados inválidos. Abra Dados do laboratório para recuperar.');
  const draft = structuredClone(state);
  change(draft);
  const clean = parseState(draft);
  try { localStorage.setItem(KEY, JSON.stringify(clean)); } catch { throw new Error('Não foi possível salvar no navegador. Exporte os dados e libere espaço antes de tentar novamente.'); }
  state = clean;
  render(); notify(message);
}
function header(title: string, subtitle: string, control = '') {
  return `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div>${control}</div>`;
}
function stat(label: string, value: string, detail: string) {
  return `<div class="stat"><dt>${label}</dt><dd>${value}</dd><span>${detail}</span></div>`;
}
function processRows() {
  const rows = state.processes.filter(p => !selected || p.id === selected);
  return rows.map(p => { const m = metrics(state, p.id); return `<button class="process-row" data-action="process-detail" data-id="${esc(p.id)}"><span class="process-symbol">${icon('flow')}</span><span class="grow"><strong>${esc(p.name)}</strong><small>${esc(p.owner)} · ${state.agents.filter(a => a.processId === p.id).length} agentes</small></span><span class="row-stat">${m.completed}<small>concluídos</small></span><span class="row-stat">${pct(m.autonomy)}<small>autonomia</small></span>${icon('arrow')}</button>`; }).join('') || empty('Comece por um processo', 'Defina o trabalho e o resultado antes de criar agentes.', action('Criar processo', 'new-process'));
}
function decisionsList(limit = 20) {
  const rows = state.runs.filter(r => r.status === 'review' && (!selected || r.processId === selected)).slice(0, limit);
  return rows.map(r => `<article class="decision-row"><div class="row-head">${badge('Revisão humana', 'amber')}<small>${date(r.created)}</small></div><h3>${esc(r.title)}</h3><p>${esc(r.reason)}</p><div class="row-head"><small>${esc(agentName(r.agentId))} · v${r.revision}</small>${action('Revisar caso', 'review', r.id, 'text-button', 'arrow')}</div></article>`).join('') || empty('Nenhuma decisão pendente', 'Os próximos casos que precisarem de intervenção aparecerão aqui.');
}
function overview() {
  const m = metrics(state, selected);
  const p = state.processes.find(p => p.id === selected) || state.processes[0];
  const started = state.runs.length ? date(state.runs.reduce((a, b) => a.created < b.created ? a : b).created) : 'agora';
  return header('Sua operação, sob gestão.', 'Pessoas e agentes trabalhando por um resultado em comum.', action('Simular execução', 'simulate', '', 'button primary', 'play')) +
    `<div class="section-line"><span>Resumo do laboratório</span><small>Acumulado desde ${started} · valores simulados</small></div>
    <dl class="stats">${stat('Casos concluídos', number(m.completed), `${m.pending} pendentes · ${m.rejected} devolvidos`)}${stat('Trabalho autônomo', pct(m.autonomy), `${m.autonomous} de ${m.completed} sem intervenção`)}${stat('Custo por caso', m.costPerCase === null ? '—' : money(m.costPerCase), `${money(m.cost)} em todas as tentativas`)}${stat('Acerto nas avaliações', pct(m.accuracy), `${m.evaluated} casos · ${m.critical} erros críticos`)}</dl>
    <div class="overview-grid"><section class="operation"><div class="section-heading"><h2>O trabalho vem primeiro</h2><a href="#processes" class="text-button">Ver processos ${icon('arrow')}</a></div>
    ${p ? `<div class="flow-board"><div class="row-head"><span class="flow-label">${esc(p.department)}</span>${badge('Processo de exemplo')}</div><h3>${esc(p.name)}</h3><p>${esc(p.objective)}</p><ol class="flow-steps">${p.steps.map((s, i) => `<li><span>${i + 1}</span><strong>${esc(s)}</strong></li>`).join('')}</ol><div class="flow-footer"><span>${icon('agents')} ${esc(p.owner)}</span>${action('Abrir processo', 'process-detail', p.id, 'text-button', 'arrow')}</div></div>` : ''}
    <div class="section-heading compact"><h2>Portfólio de processos</h2><small>${state.processes.length} cadastrados</small></div><div class="process-list">${processRows()}</div></section>
    <aside class="decision-panel"><div class="section-heading"><h2>Precisam de você</h2>${badge(String(m.pending), m.pending ? 'amber' : '')}</div>${decisionsList(3)}<a class="panel-link" href="#decisions">Abrir fila de decisões ${icon('arrow')}</a></aside></div>
    <section class="activity"><div class="section-heading"><h2>Últimos registros</h2><small>Histórico local do laboratório</small></div>${state.audit.slice(0, 5).map(a => `<div class="activity-row"><span class="activity-dot"></span><p>${esc(a.action)}</p><time>${date(a.created)}</time></div>`).join('')}</section>`;
}
function processes() {
  return header('Processos', 'Cada operação começa com um dono, uma entrega e uma meta.', action('Novo processo', 'new-process', '', 'button primary', 'plus')) + processRows() +
    `<div class="note"><h3>Escolha um recorte que você consiga acompanhar.</h3><p>Mapeie o trabalho atual, registre o tempo por caso e defina o que precisa melhorar. Só então distribua responsabilidades entre humanos e agentes.</p></div>`;
}
function agents() {
  const rows = state.agents.filter(a => (!selected || a.processId === selected) && `${a.name} ${a.owner} ${a.mission}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return header('Força de trabalho', 'Cargos digitais com missão, limites e responsabilidade humana.', action('Novo agente', 'new-agent', '', 'button primary', 'plus')) +
  `<label class="search-field">${icon('search')}<input id="agent-search" type="search" placeholder="Buscar agente ou responsável" value="${esc(search)}" aria-label="Buscar agente ou responsável"/></label>
  <div class="table-wrap"><table><thead><tr><th>Agente / processo</th><th>Responsável</th><th>Autonomia</th><th>Estado</th><th><span class="sr-only">Ação</span></th></tr></thead><tbody>${rows.map(a => `<tr><td><strong>${esc(a.name)}</strong><small>${esc(processName(a.processId))} · v${a.revision}</small></td><td>${esc(a.owner)}</td><td>${badge(`N${a.level} · ${levels[a.level]}`)}</td><td>${badge(a.active ? 'Ativo' : 'Pausado', a.active ? 'green' : '')}</td><td>${action('Abrir ficha', 'agent-detail', a.id, 'text-button', 'arrow')}</td></tr>`).join('')}</tbody></table></div>${!rows.length ? empty('Nenhum agente encontrado', search ? 'Tente outro nome ou responsável.' : 'Cadastre um cargo digital para um processo existente.') : ''}
  <div class="note"><h3>Autonomia se conquista com evidências.</h3><p>Novos agentes começam nos níveis 0, 1 ou 2. A promoção exige 100 avaliações da versão atual, a meta de acerto do processo, nenhum erro crítico e decisão humana. São critérios didáticos, a calibrar para cada operação.</p></div>`;
}
function decisions() {
  const completed = state.runs.filter(r => r.decidedBy && (!selected || r.processId === selected));
  return header('Decisões humanas', 'Revise a entrega, avalie o contexto e registre sua decisão.') + `<div class="decisions-grid">${decisionsList()}</div>` +
    `<section class="activity"><h2>Decisões registradas</h2>${completed.length ? completed.map(r => `<div class="activity-row">${badge(r.status === 'completed' ? 'Aprovado' : 'Devolvido', r.status === 'completed' ? 'green' : 'amber')}<p><strong>${esc(r.title)}</strong><br>${esc(r.decision)}<small>${esc(r.decidedBy)}</small></p>${action('Ver caso', 'run-detail', r.id, 'text-button')}</div>`).join('') : empty('Ainda sem decisões', 'A justificativa e o responsável ficarão registrados após a revisão.')}</section>`;
}
function evaluations() {
  const rows = state.evaluations.filter(e => state.agents.some(a => a.id === e.agentId && (!selected || a.processId === selected)));
  const m = metrics(state, selected);
  return header('Avaliações', 'Compare esperado × produzido e avalie cada versão antes de promovê-la.', action('Registrar avaliação', 'new-evaluation', '', 'button primary', 'plus')) +
    `<dl class="stats three">${stat('Acerto estrito', pct(m.accuracy), 'Corretos ÷ avaliados na versão atual')}${stat('Casos avaliados', number(m.evaluated), 'Somente versões atuais dos agentes')}${stat('Erros críticos', number(m.critical), 'Bloqueiam a promoção da versão')}</dl>
    <p class="muted">Registro manual, sem execução de modelo ou avaliação automática. Os três casos iniciais são exemplos fictícios, não uma base de validação.</p>
    <div class="table-wrap"><table><thead><tr><th>Caso / agente</th><th>Esperado</th><th>Produzido</th><th>Resultado</th><th>Avaliador</th></tr></thead><tbody>${rows.map(e => { const current = state.agents.find(a => a.id === e.agentId)!.revision === e.revision; return `<tr><td><strong>${esc(e.title)}</strong><small>${esc(agentName(e.agentId))} · v${e.revision}${current ? '' : ' · histórica'}</small></td><td>${esc(e.expected)}</td><td>${esc(e.produced)}</td><td>${badge(resultNames[e.result], e.result === 'correct' ? 'green' : e.result === 'critical' ? 'red' : 'amber')}</td><td>${esc(e.reviewer)}</td></tr>`; }).join('')}</tbody></table></div>${rows.length ? '' : empty('A evidência começa aqui', 'Registre casos diversos, incluindo exceções, com o resultado esperado e a saída observada.')}`;
}
function improvements() {
  const rows = state.improvements.filter(i => !selected || i.processId === selected);
  return header('Melhoria contínua', 'LOOP-R: transformar observações da operação em mudanças avaliadas.', action('Propor melhoria', 'new-improvement', '', 'button primary', 'plus')) +
    `<p class="loop-sequence">Executar <span>→</span> Observar <span>→</span> Medir <span>→</span> Identificar <span>→</span> Propor <span>→</span> Testar <span>→</span> Validar <span>→</span> Promover</p>
    <div class="kanban">${(Object.keys(stageNames) as Improvement['stage'][]).map(stage => `<section class="kanban-column"><div class="section-heading"><h2>${stageNames[stage]}</h2><span>${rows.filter(i => i.stage === stage).length}</span></div>${rows.filter(i => i.stage === stage).map(i => `<article class="improvement"><small>${esc(processName(i.processId))}</small><h3>${esc(i.title)}</h3><p>${esc(i.hypothesis)}</p><span class="owner">${esc(i.owner)}</span>${action('Abrir experimento', 'improvement-detail', i.id, 'text-button', 'arrow')}</article>`).join('') || '<p class="column-empty">Nenhum experimento nesta etapa.</p>'}</section>`).join('')}</div>
    <p class="muted">Promover um experimento registra a decisão. A alteração do agente é feita na ficha, cria uma nova versão e exige nova avaliação.</p>`;
}
function library() {
  return header('O método por trás da operação', 'Gestão de IA · proposta de formação INEMA') +
    `<div class="library-intro"><h2>Um processo real.<br>Uma operação que você consegue gerir.</h2><p>O curso acompanha a construção da operação: do mapeamento do trabalho ao primeiro ciclo de melhoria. Cada módulo deixa uma entrega utilizável na empresa.</p><div class="library-facts"><span><strong>10</strong> módulos</span><span><strong>60h</strong> carga proposta</span><span><strong>1</strong> projeto aplicado</span></div></div>
    <div class="document-list">${[
      ['Plano do curso', 'Aulas, laboratórios, entregas, critérios de aceite e projeto final.', courseUrl],
      ['Método de Gestão de IA', 'Contratos, níveis de autonomia, indicadores e rituais de gestão.', methodUrl],
      ['Plano da ferramenta', 'Escopo do MVP, arquitetura de produção e sequência de implantação.', productUrl],
      ['Templates de trabalho', 'Modelos para processo, cargo, Skills, avaliações e experimentos.', templatesUrl]
    ].map(([title, description, url]) => `<a class="document-row" href="${url}" download>${icon('book')}<span class="grow"><strong>${title}</strong><small>${description}</small></span><span>Baixar .md</span>${icon('download')}</a>`).join('')}</div><p class="muted">Esta entrega contém o plano da formação. Aulas completas, apostila e base revisada de 100 casos são próximas etapas editoriais.</p>`;
}
function settings() {
  return header('Dados do laboratório', 'Este espaço é local. Exporte uma cópia para guardar seu trabalho.') +
  `<div class="settings-section"><h2>Seu espaço de trabalho</h2><p>${state.processes.length} processos, ${state.agents.length} agentes, ${state.runs.length} execuções e ${state.evaluations.length} avaliações.</p><p>Os dados ficam neste navegador e nesta origem. Não há conta, sincronização nem execução real de IA. Use dados fictícios ou anonimizados.</p><div class="button-row">${action('Exportar dados (.json)', 'export', '', 'button primary', 'download')}<label class="button secondary file-button">Importar cópia<input id="import-file" type="file" accept=".json,application/json" /></label></div></div>
  <div class="settings-section"><h2>Recomeçar</h2><p>Substitui os dados locais pelo exemplo inicial. Exporte seu trabalho antes de continuar.</p>${action('Restaurar demonstração', 'reset', '', 'button danger')}</div>`;
}
function render() {
  const current = route();
  const pending = state.runs.filter(r => r.status === 'review').length;
  app.innerHTML = `<a class="skip-link" href="#main-content">Pular para o conteúdo</a><aside class="sidebar"><a class="brand" href="#overview"><span class="brand-symbol">g</span>gestoria<span class="brand-dot">.</span></a><div class="workspace"><span class="workspace-avatar">L</span><span>Laboratório INEMA<small>Gestão de IA</small></span></div><nav aria-label="Navegação principal">${nav.map(([id, label, ico], i) => `<a href="#${id}" class="nav-item ${current === id ? 'active' : ''} ${i === 6 ? 'nav-divider' : ''}" ${current === id ? 'aria-current="page"' : ''}>${icon(ico)}<span>${label}</span>${id === 'decisions' && pending ? `<span class="nav-count">${pending}</span>` : ''}</a>`).join('')}</nav><div class="sidebar-footer"><span class="local-dot"></span><span>Espaço local<small>Você mantém a decisão.</small></span></div></aside>
  <div class="main-shell"><header class="topbar"><span>Gestão de IA <span class="breadcrumb">/ ${nav.find(n => n[0] === current)?.[1]}</span></span><div class="topbar-actions"><span class="demo-label">Laboratório · simulação</span><span class="profile" title="Perfil local, sem autenticação">L</span></div></header>
  <main id="main-content" tabindex="-1">${storageError ? `<div class="error-banner" role="alert">Não foi possível carregar os dados locais. A demonstração está em leitura. <a href="#settings">Recupere ou restaure o laboratório.</a></div>` : ''}${!['library', 'settings'].includes(current) ? `<div class="scope-row"><label for="process-scope">Processo</label><select id="process-scope"><option value="">Todos os processos</option>${state.processes.map(p => `<option value="${esc(p.id)}" ${selected === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select><span>Dados fictícios / registros locais</span></div>` : ''}${({ overview, processes, agents, decisions, evaluations, improvements, library, settings }[current] || overview)()}</main><footer class="main-footer">Gestoria · método, formação e operação <span>Protótipo local v0.1</span></footer></div>`;
}
const input = (name: string, label: string, value: unknown = '', type = 'text', attrs = '') => `<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" maxlength="500" required ${attrs}/></label>`;
const textarea = (name: string, label: string, value = '', required = true) => `<label class="field full">${label}<textarea name="${name}" rows="3" maxlength="5000" ${required ? 'required' : ''}>${esc(value)}</textarea></label>`;
const select = (name: string, label: string, options: [string, string][], value = '') => `<label class="field">${label}<select name="${name}" required>${options.map(([v, t]) => `<option value="${esc(v)}" ${v === value ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
const processOptions = () => state.processes.map(p => [p.id, p.name] as [string, string]);
function openDialog(title: string, body: string, submitLabel?: string, onSubmit?: (f: FormData) => void) {
  dialog.innerHTML = `<div class="dialog-head"><h2 id="dialog-title">${esc(title)}</h2>${action('Fechar', 'close', '', 'icon-button', 'close')}</div><form id="dialog-form"><div class="dialog-body">${body}</div><p class="form-error" role="alert" hidden></p>${submitLabel ? `<div class="dialog-footer">${action('Cancelar', 'close')}<button class="button primary" type="submit">${esc(submitLabel)}</button></div>` : ''}</form>`;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const f = new FormData(form);
    for (const [key, value] of f) if (typeof value === 'string') f.set(key, value.trim());
    try { onSubmit?.(f); dialog.close(); } catch (error) { const el = dialog.querySelector<HTMLParagraphElement>('.form-error')!; el.textContent = error instanceof Error ? error.message : 'Não foi possível salvar.'; el.hidden = false; }
  });
}
const value = (f: FormData, key: string) => String(f.get(key) || '').trim();
function processForm(id = '') {
  const p = state.processes.find(p => p.id === id);
  openDialog(p ? 'Editar processo' : 'Novo processo', `<div class="form-grid">${input('name', 'Nome do processo', p?.name)}${input('department', 'Área', p?.department)}${input('owner', 'Responsável humano', p?.owner)}${input('volume', 'Volume semanal (casos)', p?.volume ?? 300, 'number', 'min="0" step="1"')}${textarea('objective', 'Resultado esperado', p?.objective)}${input('baseline', 'Tempo humano atual (min/caso)', p?.baseline ?? 12, 'number', 'min="0" step="0.1"')}${input('hourlyCost', 'Custo humano (R$/hora)', p?.hourlyCost ?? 60, 'number', 'min="0" step="0.01"')}${input('target', 'Meta de acerto (%)', p?.target ?? 95, 'number', 'min="1" max="100" step="0.1"')}${input('budget', 'Orçamento acumulado do laboratório (R$)', p?.budget ?? 250, 'number', 'min="0" step="0.01"')}${textarea('steps', 'Etapas do processo (uma por linha, até 20)', p?.steps.join('\n') ?? 'Receber\nAnalisar\nRevisar\nEntregar')}</div>`, 'Salvar processo', f => commit(s => {
    const steps = value(f, 'steps').split('\n').map(s => s.trim()).filter(Boolean);
    if (!steps.length || steps.length > 20) throw new Error('Informe entre 1 e 20 etapas.');
    const item = { id: p?.id || uid(), name: value(f, 'name'), department: value(f, 'department'), owner: value(f, 'owner'), objective: value(f, 'objective'), volume: Number(f.get('volume')), baseline: Number(f.get('baseline')), hourlyCost: Number(f.get('hourlyCost')), target: Number(f.get('target')), budget: Number(f.get('budget')), steps };
    if (p) s.processes[s.processes.findIndex(x => x.id === id)] = item; else s.processes.push(item);
    record(s, `${p ? 'Processo atualizado' : 'Processo criado'}: ${item.name}.`);
  }, 'Processo salvo.'));
}
function processDetail(id: string) {
  const p = state.processes.find(p => p.id === id)!; const m = metrics(state, id);
  openDialog(p.name, `<p>${esc(p.objective)}</p><dl class="detail-list"><dt>Responsável</dt><dd>${esc(p.owner)}</dd><dt>Volume planejado</dt><dd>${p.volume} casos/semana</dd><dt>Baseline informado</dt><dd>${p.baseline} min humanos/caso · ${money(p.hourlyCost)}/hora</dd><dt>Meta de acerto</dt><dd>${p.target}%</dd><dt>Orçamento do laboratório</dt><dd>${money(m.cost)} usados de ${money(p.budget)}</dd><dt>Autonomia observada</dt><dd>${pct(m.autonomy)} · ${m.autonomous}/${m.completed} concluídos</dd></dl><h3>Etapas</h3><ol class="detail-steps">${p.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><h3>Equipe digital</h3>${state.agents.filter(a => a.processId === id).map(a => `<div class="detail-agent"><span>${esc(a.name)}</span>${badge(`N${a.level} · ${levels[a.level]}`)}</div>`).join('') || '<p>Este processo ainda não tem agentes.</p>'}<div class="button-row">${action('Editar processo', 'edit-process', id)}${action('Simular execução', 'simulate-process', id, 'button primary', 'play')}</div>`);
}
function agentForm(id = '') {
  if (!state.processes.length) { notify('Cadastre um processo antes de criar agentes.'); return; }
  const a = state.agents.find(a => a.id === id);
  openDialog(a ? 'Editar cargo digital' : 'Novo cargo digital', `<p class="muted">${a ? 'Salvar cria uma nova versão. Avaliações anteriores permanecem no histórico e não contam para a nova promoção.' : 'Comece com autonomia limitada. Os níveis 3 e 4 são liberados por promoção após avaliação.'}</p><div class="form-grid">${input('name', 'Nome do agente', a?.name)}${a ? `<p class="field">Processo<strong>${esc(processName(a.processId))}</strong></p>` : select('processId', 'Processo', processOptions(), selected)}${input('owner', 'Responsável humano', a?.owner)}${input('model', 'Modelo / configuração planejada', a?.model || 'Simulador local')}${textarea('mission', 'Missão', a?.mission)}${textarea('input', 'Recebe', a?.input)}${textarea('output', 'Entrega', a?.output)}${textarea('allowed', 'Pode fazer', a?.allowed)}${textarea('forbidden', 'Não pode fazer', a?.forbidden)}${textarea('context', 'Contexto e fontes de conhecimento', a?.context, false)}${textarea('skills', 'Skills reutilizáveis', a?.skills, false)}${textarea('tools', 'Ferramentas planejadas (sem conexão real)', a?.tools, false)}${select('level', a ? 'Manter ou reduzir autonomia' : 'Autonomia inicial', levels.slice(0, a ? a.level + 1 : 3).map((l, i) => [String(i), `Nível ${i} — ${l}`]), String(a?.level ?? 1))}</div>`, 'Salvar cargo', f => commit(s => {
    const fields = ['name', 'owner', 'mission', 'input', 'output', 'allowed', 'forbidden', 'model', 'context', 'skills', 'tools'] as const;
    const item: Agent = { ...(Object.fromEntries(fields.map(k => [k, value(f, k)])) as Pick<Agent, typeof fields[number]>), id: a?.id || uid(), processId: a?.processId || value(f, 'processId'), level: Number(f.get('level')), revision: (a?.revision || 0) + 1, active: a?.active ?? true };
    if (item.level > (a?.level ?? 2)) throw new Error('Use a promoção avaliada para aumentar autonomia.');
    if (a) s.agents[s.agents.findIndex(x => x.id === id)] = item; else s.agents.push(item);
    record(s, `Cargo ${a ? 'atualizado' : 'criado'}: ${item.name}, v${item.revision}.`);
  }, 'Ficha do agente salva.'));
}
function agentDetail(id: string) {
  const a = state.agents.find(a => a.id === id)!; const check = promotionCheck(state, a);
  openDialog(a.name, `<div class="button-row">${badge(a.active ? 'Ativo' : 'Pausado', a.active ? 'green' : '')}${badge(`Nível ${a.level} · ${levels[a.level]}`)}${badge(`Versão ${a.revision}`)}</div><p>${esc(a.mission)}</p><dl class="detail-list">${[['Processo', processName(a.processId)], ['Responsável humano', a.owner], ['Modelo planejado', a.model], ['Recebe', a.input], ['Entrega', a.output], ['Pode', a.allowed], ['Não pode', a.forbidden], ['Conhecimento', a.context || 'Ainda não definido'], ['Skills', a.skills || 'Ainda não definidas'], ['Ferramentas', a.tools || 'Ainda não definidas']].map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl><h3>Próxima promoção</h3>${check.eligible ? '<p>A versão atende aos critérios didáticos. Registre a decisão humana para promover um nível.</p>' : `<ul class="criteria">${check.reasons.map(r => `<li>${esc(r)}</li>`).join('')}</ul>`}<div class="button-row">${action('Editar ficha', 'edit-agent', id)}${action(a.active ? 'Pausar agente' : 'Retomar agente', 'toggle-agent', id)}${check.eligible ? action('Promover um nível', 'promote-agent', id, 'button primary') : ''}</div>`);
}
function simulateForm(processId = selected) {
  const agents = state.agents.filter(a => a.active && (!processId || a.processId === processId));
  if (!agents.length) { notify('Cadastre ou retome um agente neste processo para simular.'); return; }
  openDialog('Simular uma execução', `<p>Exercite o fluxo de gestão com um caso fictício. Cada simulação usa custo de R$ 0,38 e duração de 42 segundos como valores didáticos, sem cobrança.</p><div class="form-grid">${select('agentId', 'Agente responsável', agents.map(a => [a.id, `${a.name} · N${a.level}`]))}${select('scenario', 'Cenário', [['normal', 'Rotina dentro da política'], ['doubt', 'Informações conflitantes'], ['critical', 'Solicitação fora da política']])}</div><p class="muted">Níveis 0–2 encaminham a próxima ação ao humano. Nos níveis 3–4, apenas o cenário normal conclui sem intervenção. O simulador não pesquisa, não classifica dados reais e não acessa ferramentas.</p>`, 'Criar caso simulado', f => commit(s => { simulate(s, value(f, 'agentId'), value(f, 'scenario') as 'normal' | 'doubt' | 'critical'); }, 'Simulação registrada. Consulte as decisões e os indicadores.'));
}
function review(id: string, readOnly = false) {
  const r = state.runs.find(r => r.id === id)!;
  const body = `<p>${badge(`Versão ${r.revision}`)} ${badge('Caso simulado', 'amber')}</p><h3>${esc(r.title)}</h3><p>${esc(r.reason)}</p><div class="output-box"><h3>Entrega preparada</h3><p>${esc(r.output)}</p></div><dl class="detail-list"><dt>Processo</dt><dd>${esc(processName(r.processId))}</dd><dt>Agente</dt><dd>${esc(agentName(r.agentId))}</dd><dt>Custo simulado</dt><dd>${money(r.cost)}</dd></dl>`;
  if (readOnly) { openDialog('Histórico do caso', `${body}<h3>Decisão</h3><p>${esc(r.decision)}</p><p>${esc(r.decidedBy)}</p>`); return; }
  openDialog('Revisar caso', `${body}<div class="form-grid">${input('reviewer', 'Seu nome / responsável', state.agents.find(a => a.id === r.agentId)?.owner)}${select('decision', 'Decisão', [['approve', 'Aprovar conclusão simulada'], ['reject', 'Devolver para correção']])}${textarea('reason', 'Justificativa da decisão')}</div><p class="muted">A aprovação conclui o caso no laboratório. Nenhuma ação externa é executada.</p>`, 'Registrar decisão', f => commit(s => decide(s, id, value(f, 'decision') === 'approve', value(f, 'reviewer'), value(f, 'reason')), 'Decisão registrada com intervenção humana.'));
}
function evaluationForm() {
  const agents = state.agents.filter(a => !selected || a.processId === selected);
  if (!agents.length) { notify('Cadastre um agente para registrar avaliações.'); return; }
  openDialog('Registrar avaliação', `<div class="form-grid">${select('agentId', 'Agente / versão atual', agents.map(a => [a.id, `${a.name} · v${a.revision}`]))}${input('title', 'Nome do caso')}${textarea('expected', 'Resultado esperado (gabarito)')}${textarea('produced', 'Resultado produzido (observado)')}${select('result', 'Classificação humana', Object.entries(resultNames))}${input('reviewer', 'Avaliador responsável')}</div><p class="muted">Avalie um caso distinto com evidências próprias. Registre erros críticos mesmo quando o restante da saída estiver correto.</p>`, 'Salvar avaliação', f => commit(s => {
    const agentId = value(f, 'agentId'); const a = s.agents.find(a => a.id === agentId)!;
    const expected = value(f, 'expected'), title = value(f, 'title');
    if (s.evaluations.some(e => e.agentId === agentId && e.revision === a.revision && e.title.toLowerCase() === title.toLowerCase())) throw new Error('Já existe um caso com esse nome nesta versão. Use um caso distinto.');
    s.evaluations.unshift({ id: uid(), agentId, revision: a.revision, title, expected, produced: value(f, 'produced'), result: value(f, 'result') as keyof typeof resultNames, reviewer: value(f, 'reviewer'), created: now() });
    record(s, `Avaliação registrada: ${title}, ${a.name} v${a.revision}.`);
  }, 'Avaliação salva. Indicadores recalculados.'));
}
function improvementForm(id = '') {
  if (!state.processes.length) { notify('Cadastre um processo antes de propor melhorias.'); return; }
  const i = state.improvements.find(i => i.id === id);
  const stages = Object.keys(stageNames) as Improvement['stage'][];
  const index = i ? stages.indexOf(i.stage) : 0;
  openDialog(i ? 'Experimento LOOP-R' : 'Propor melhoria', `<div class="form-grid">${input('title', 'Problema observado', i?.title)}${select('processId', 'Processo', processOptions(), i?.processId || selected)}${input('owner', 'Responsável humano', i?.owner)}${i ? select('stage', 'Etapa (avanço de uma etapa por vez)', stages.slice(index, index + 2).map(s => [s, stageNames[s]]), i.stage) : ''}${textarea('hypothesis', 'Hipótese e teste proposto', i?.hypothesis)}${textarea('evidence', 'Evidência: versões comparadas, resultados, decisão e reversão', i?.evidence, false)}</div><p class="muted">Para validar ou promover, registre evidências. O avanço documenta uma decisão humana; não modifica agentes automaticamente.</p>`, 'Salvar experimento', f => commit(s => {
    const stage = i ? value(f, 'stage') as Improvement['stage'] : 'proposal';
    const evidence = value(f, 'evidence');
    if (['validated', 'promoted'].includes(stage) && !evidence) throw new Error('Registre as evidências e a justificativa antes de validar ou promover.');
    if (i && !stages.slice(index, index + 2).includes(stage)) throw new Error('Avance uma etapa por vez.');
    const item: Improvement = { id: i?.id || uid(), processId: value(f, 'processId'), title: value(f, 'title'), hypothesis: value(f, 'hypothesis'), owner: value(f, 'owner'), evidence, stage, created: i?.created || now() };
    if (i) s.improvements[s.improvements.findIndex(x => x.id === id)] = item; else s.improvements.push(item);
    record(s, `${item.owner}: ${item.title} — ${stageNames[stage]}.`);
  }, 'Experimento atualizado.'));
}
function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]'); if (!btn) return;
  const id = btn.dataset.id || '';
  try {
    switch (btn.dataset.action) {
      case 'close': dialog.close(); break;
      case 'new-process': processForm(); break;
      case 'edit-process': processForm(id); break;
      case 'process-detail': processDetail(id); break;
      case 'new-agent': agentForm(); break;
      case 'edit-agent': agentForm(id); break;
      case 'agent-detail': agentDetail(id); break;
      case 'toggle-agent': commit(s => { const a = s.agents.find(a => a.id === id)!; a.active = !a.active; record(s, `${a.name}: ${a.active ? 'retomado' : 'pausado'}.`); }, 'Estado do agente atualizado.'); agentDetail(id); break;
      case 'promote-agent': { const a = state.agents.find(a => a.id === id)!; openDialog('Registrar promoção', `<p>Promover ${esc(a.name)} do nível ${a.level} ao nível ${a.level + 1}. A mudança cria uma nova versão, que deverá ser reavaliada antes de outra promoção.</p><div class="form-grid">${input('reviewer', 'Responsável', a.owner)}${textarea('reason', 'Justificativa, escopo e plano de reversão')}</div>`, 'Confirmar promoção local', f => commit(s => promote(s, id, value(f, 'reviewer'), value(f, 'reason')), 'Promoção registrada. Nova versão criada.')); break; }
      case 'simulate': simulateForm(); break;
      case 'simulate-process': simulateForm(id); break;
      case 'review': review(id); break;
      case 'run-detail': review(id, true); break;
      case 'new-evaluation': evaluationForm(); break;
      case 'new-improvement': improvementForm(); break;
      case 'improvement-detail': improvementForm(id); break;
      case 'export': { const raw = storageError ? localStorage.getItem(KEY) : JSON.stringify(state, null, 2); download(`gestoria-${new Date().toISOString().slice(0, 10)}${storageError ? '-recuperacao' : ''}.json`, raw || JSON.stringify(state)); notify('Cópia exportada.'); break; }
      case 'reset': openDialog('Restaurar demonstração?', '<p>Os dados atuais deste navegador serão substituídos pelos exemplos fictícios iniciais. Exporte uma cópia antes de restaurar.</p>', 'Restaurar dados de exemplo', () => { const fresh = seed(); localStorage.setItem(KEY, JSON.stringify(fresh)); state = fresh; storageError = false; selected = ''; render(); notify('Demonstração restaurada.'); }); break;
    }
  } catch (error) { notify(error instanceof Error ? error.message : 'Não foi possível concluir a ação.'); }
});
document.addEventListener('change', async e => {
  const target = e.target as HTMLInputElement;
  if (target.id === 'process-scope') { selected = target.value; render(); }
  if (target.id === 'import-file') {
    const file = target.files?.[0]; if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error('O arquivo deve ter no máximo 5 MB.');
      const imported = parseState(JSON.parse(await file.text()));
      openDialog('Importar espaço de trabalho?', `<p>A cópia contém ${imported.processes.length} processos, ${imported.agents.length} agentes e ${imported.runs.length} execuções. A importação substitui os dados atuais; exporte uma cópia antes de continuar.</p>`, 'Substituir pelos dados importados', () => { record(imported, 'Cópia de laboratório importada.'); localStorage.setItem(KEY, JSON.stringify(imported)); state = imported; selected = ''; storageError = false; render(); notify('Dados importados e validados.'); });
    } catch (error) { notify(error instanceof Error ? error.message : 'Arquivo JSON inválido.'); }
    target.value = '';
  }
});
document.addEventListener('input', e => {
  const el = e.target as HTMLInputElement; if (el.id !== 'agent-search') return;
  const position = el.selectionStart; search = el.value; render();
  const next = document.querySelector<HTMLInputElement>('#agent-search'); next?.focus(); if (position !== null) next?.setSelectionRange(position, position);
});
window.addEventListener('hashchange', () => { if (location.hash === '#main-content') return; search = ''; dialog.close(); render(); document.querySelector<HTMLElement>('main')?.focus(); });
window.addEventListener('storage', e => {
  if (e.key !== KEY) return;
  try { state = e.newValue ? parseState(JSON.parse(e.newValue)) : seed(); storageError = false; selected = ''; dialog.close(); render(); notify('Dados atualizados em outra aba. Formulários abertos foram fechados para evitar sobrescrita.'); }
  catch { storageError = true; dialog.close(); render(); }
});
render();
