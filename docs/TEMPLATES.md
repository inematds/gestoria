# Gestoria — templates de trabalho

Copie um template por processo ou artefato. Substitua os campos entre colchetes. Use dados autorizados, anonimizados ou sintéticos, identificando a origem.

## 1. Canvas de processo

- Nome / área: [ ]
- Dono humano / substituto: [ ]
- Problema e cliente da entrega: [ ]
- Resultado empresarial: [ ]
- Gatilho / entradas obrigatórias: [ ]
- Saída e critério de conclusão: [ ]
- Fluxo atual: [ ]
- Volume / período / origem: [ ]
- Tempo humano por caso / espera / retrabalho: [ ]
- Custo atual e premissas: [ ]
- Indicador, denominador, baseline, meta e prazo: [ ]
- Recorte do piloto / exclusões: [ ]
- Fluxo futuro e pontos humanos: [ ]
- Riscos, exceções e condição de interrupção: [ ]

## 2. Ficha de cargo digital

- Nome / processo / versão: [ ]
- Missão: [ ]
- Responsável humano: [ ]
- Recebe: [ ]
- Entrega: [ ]
- Critérios de qualidade: [ ]
- Pode: [ações concretas]
- Não pode: [ações concretas]
- Conhecimento / fontes / validade: [ ]
- Skills e versões: [ ]
- Ferramentas e operações autorizadas: [ ]
- Modelo / configuração / alternativa: [ ]
- Memória: [campos, escopo, duração, quem corrige]
- Nível geral e matriz de ações: [ ]
- Limite de custo / prazo / tentativas: [ ]
- Quando escalar / para quem / com quais evidências: [ ]
- Avaliação exigida / dono da promoção: [ ]

## 3. Skill reutilizável

- Nome / versão / dono: [ ]
- Use quando: [gatilho]
- Não use quando: [exclusões]
- Entradas obrigatórias: [ ]
- Fontes e ferramentas permitidas: [ ]
- Procedimento: [passos verificáveis]
- Saída estruturada: [campos e exemplos]
- Critérios de sucesso: [ ]
- Falhas e encaminhamento: [ ]
- Exemplo bom / exemplo ruim: [ ]
- Casos de teste distintos dos exemplos: [ ]

## 4. Matriz de autonomia por ação

| Ação | Ferramenta | Condições / limites | Nível | Aprovação | Responsável | Expiração / reversão |
|---|---|---|---|---|---|---|
| [Consultar histórico] | [CRM leitura] | [Somente registros do processo] | [3] | [Dispensada no escopo] | [Gestor] | [Sem escrita] |
| [Atualizar classificação] | [CRM escrita] | [Somente campo aprovado] | [2] | [Conteúdo exato] | [Revisor] | [Prazo e valor anterior] |

Exemplos são propostas de laboratório, não autorizações reais.

## 5. Contrato de ferramenta

- Nome / ambiente / proprietário: [ ]
- Operação e efeito externo: [ ]
- Schema de entrada / saída: [ ]
- Credencial: [referência segura; nunca o segredo]
- Escopo permitido: [ ]
- Campos/destinos/valores proibidos: [ ]
- Aprovação e hash do conteúdo: [ ]
- Timeout / tentativas / limite de custo: [ ]
- Chave de idempotência: [ ]
- Tratamento de erro / compensação: [ ]
- Evidência da ação / retenção: [ ]

## 6. Caso de avaliação

- ID / dataset / versão / origem: [ ]
- Partição: [treino, desenvolvimento ou teste reservado]
- Categoria: [rotina, fronteira, dados insuficientes, conflito, risco crítico]
- Agente e pacote de configuração: [ ]
- Entrada autorizada: [ ]
- Resultado esperado: [ ]
- Resultado produzido: [ ]
- Rubrica: [critérios observáveis]
- Classificação: [correto / aceitável / incorreto / erro crítico]
- Justificativa e evidência: [ ]
- Avaliador / data: [ ]
- Custo / duração / intervenção: [ ]

Não multiplicar um exemplo repetido para alcançar a quantidade mínima de casos. Curar diversidade, reservar teste e revisar resultados controversos com especialista.

## 7. Pacote de exceção

- Caso / processo / agente / versão: [ ]
- Ação pendente e seu conteúdo: [ ]
- Motivo / severidade: [ ]
- Evidências e fontes: [ ]
- Tentativas já realizadas: [ ]
- Responsável / prazo / escalonamento: [ ]
- Recomendação, com limites: [ ]
- Decisão humana e justificativa: [ ]
- Efeito autorizado / execução confirmada: [ ]
- Aprendizado proposto: [ ]

## 8. Experimento LOOP-R

- Problema observado e casos de origem: [ ]
- Indicador e baseline: [ ]
- Causa provável / hipótese: [ ]
- Mudança candidata e versões afetadas: [ ]
- Dono: [ ]
- Teste, conjunto reservado e comparação: [ ]
- Métrica primária / limites de qualidade, custo e risco: [ ]
- Resultados, tamanho da amostra e limitações: [ ]
- Decisão: [rejeitar, revisar, validar ou promover]
- Justificativa / aprovador / data: [ ]
- Implantação gradual / monitoramento: [ ]
- Critério e procedimento de reversão: [ ]

## 9. Parecer econômico

- Período e volume comparável: [ ]
- Tempo humano baseline: [volume × minutos ÷ 60]
- Tempo humano novo: [revisão + exceções + manutenção + retrabalho]
- Capacidade liberada em horas: [baseline − novo]
- Valor potencial da capacidade: [horas × custo/hora]
- Custos de IA, ferramentas, infraestrutura e operação: [ ]
- Investimento inicial separado: [ ]
- Resultado líquido estimado: [valor potencial − custos adicionais]
- ROI estimado: [resultado líquido ÷ custos adicionais; indefinido se zero]
- Economia efetivamente realizada / resultado de realocação: [evidência ou ainda não observado]
- Incertezas, intervalo e decisão: [ ]

## 10. Revisão semanal do gestor

1. O resultado empresarial melhorou frente ao baseline comparável?
2. Qualidade, erros críticos e exceções mudaram?
3. Quanto trabalho humano foi necessário e onde?
4. Qual foi o custo completo, incluindo tentativas e retrabalho?
5. Que processos ou agentes precisam de pausa ou menor autonomia?
6. Qual hipótese de melhoria merece teste nesta semana?
7. Quem é responsável por cada ação e quando será revisada?
