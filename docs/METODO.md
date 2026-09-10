# Gestoria — método de Gestão de IA

Proposta INEMA: desenvolver a capacidade de uma empresa de operar processos com humanos e agentes de IA, com responsabilidade, evidências e melhoria contínua. A unidade de gestão é **um processo com resultado mensurável**.

## O que está sendo construído

Três partes do mesmo sistema:

1. **Método:** linguagem, papéis, artefatos e critérios para construir uma operação híbrida.
2. **Formação:** curso aplicado em que cada módulo entrega uma parte dessa operação.
3. **Gestoria:** ferramenta que guarda os artefatos e ajuda o gestor a acompanhar trabalho, decisões e resultados.

Uma possível oferta futura é a implantação acompanhada: diagnóstico, piloto, validação e passagem para a equipe da empresa. É uma hipótese de produto, ainda sem preço ou promessa comercial.

## Princípios

- Começar por um processo, um responsável e um resultado.
- Documentar como um bom profissional trabalha antes de automatizar.
- Escolher modelos por evidência em tarefas reais, sem depender de um fornecedor.
- Dar a cada agente um cargo com limites, ferramentas e critérios de qualidade.
- Atribuir autonomia por ação e risco; o nível geral do agente é apenas um resumo.
- Encaminhar exceções com contexto e prazo, sem ciclos infinitos entre agentes.
- Medir resultado empresarial, qualidade, custo total e dependência humana juntos.
- Promover versões avaliadas; registrar e reverter alterações.

## Ciclo de implantação

| Etapa | Pergunta de gestão | Evidência para avançar |
|---|---|---|
| Mapear | Qual trabalho vale melhorar? | Fluxo atual, volume, tempo, retrabalho, custo e dono |
| Desenhar | Qual parte cabe à IA? | Fluxo futuro e divisão explícita de responsabilidades |
| Preparar | O agente sabe e pode fazer? | Cargo, conhecimento, Skills, ferramentas e permissões |
| Avaliar | Em quais condições podemos confiar? | Casos de referência, rubrica e resultados por versão |
| Pilotar | A operação funciona em escala limitada? | Execuções acompanhadas, exceções, custos e feedback |
| Operar | Quem responde pelo resultado? | Supervisão, alertas, decisões e procedimento de interrupção |
| Melhorar | Qual mudança produz ganho comprovável? | Experimento LOOP-R validado e decisão de promoção |

## Os cinco contratos

**Contrato do processo.** Objetivo, gatilho, entrada, saída, cliente interno, dono humano, volume, baseline, meta, prazo, risco, exclusões e critério de conclusão.

**Contrato do cargo.** Missão, processo, responsável, modelo/versão, entradas, entregas, critérios de qualidade, ações permitidas e proibidas, ferramentas, Skills, fontes de conhecimento e memória.

**Contrato de execução.** Identificador do caso, versão dos componentes, orçamento, prazo, contexto mínimo, passos realizados, decisões, saída, custo observado e encaminhamento das exceções.

**Contrato de avaliação.** Conjunto versionado, origem e autorização de uso dos dados, resultado esperado, rubrica, avaliador, limiares por risco e comparação com a versão anterior.

**Contrato de mudança.** Problema observado, hipótese, alteração proposta, responsável, teste, evidência, decisão, implantação gradual, monitoramento e reversão.

## Autonomia: responsabilidade progressiva

| Nível | Papel da IA | Papel humano | Exemplo |
|---|---|---|---|
| 0 — Consulta | Responde e explica | Decide e realiza todas as ações | Consultar critérios comerciais |
| 1 — Recomenda | Analisa e sugere uma ação | Executa a recomendação | Sugerir classificação de um lead |
| 2 — Prepara | Produz um trabalho pronto para revisão | Aprova antes do efeito externo | Preparar atualização do CRM |
| 3 — Executa | Realiza ações específicas dentro da política | Acompanha e trata exceções | Atualizar um campo permitido do CRM |
| 4 — Gerencia | Coordena agentes dentro de um processo aprovado | Responde pelo processo e decisões críticas | Distribuir pesquisa e qualificação |

Nível 4 não autoriza novas ferramentas, descontos ou decisões fora do escopo. Um supervisor recebe políticas e limites de orçamento; não pode ampliar permissões dos subordinados. Aprovações devem estar vinculadas ao conteúdo exato, à versão e a um prazo: mudar a proposta invalida a aprovação anterior.

Promoção é uma decisão do responsável humano baseada em avaliação representativa, ausência de falhas críticas no conjunto avaliado, capacidade de reversão e piloto acompanhado. “95% de acerto em 100 casos” é um limiar didático para qualificação comercial, não uma garantia de segurança ou um limiar universal. Amostra, representatividade e consequências precisam ser consideradas.

## Caso condutor: qualificação comercial

**Problema fornecido no briefing:** 300 leads por semana; vendedores pesquisam, consultam CRM, qualificam, escrevem mensagens, fazem contato e acompanham.

**Recorte inicial:** pesquisar e preparar a qualificação. Envio de mensagens, propostas e alterações externas ficam fora do primeiro piloto.

**Fluxo proposto:** entrada → validação de dados → pesquisa → consulta ao histórico → classificação pelo ICP → justificativa com evidências → revisão humana → entrega ao vendedor → feedback.

**Cargo:** agente de qualificação comercial. Recebe nome, empresa e dados de contato; entrega classificação, justificativa e próxima ação. Pode pesquisar fontes autorizadas e consultar o CRM. Não pode enviar propostas, conceder descontos ou fechar negócio. Meta inicial de avaliação: 95% de classificações corretas, sem erros críticos na amostra. Começa no nível 2.

**Equipe futura:** pesquisador → qualificador → registrador CRM → preparador de proposta → follow-up → analista. Só adicionar um cargo separado quando houver responsabilidade, especialização ou fronteira de permissão que justifique a separação. O supervisor coordena, e o gestor humano mantém a responsabilidade.

**Exceções:** dado insuficiente ou conflitante → revisão do supervisor; solicitação fora da política → gestor; conteúdo crítico → especialista humano definido pela empresa. Toda exceção carrega o caso, motivo, evidências, tentativas, ação pendente e prazo.

## Indicadores que não escondem o trabalho humano

Sempre mostrar período, população, denominador e origem dos valores. Separar métricas de teste, piloto e produção.

| Indicador | Definição |
|---|---|
| Acerto estrito | Casos corretos ÷ casos avaliados; aceitáveis são reportados separadamente |
| Qualidade aproveitável | (Corretos + aceitáveis) ÷ avaliados, quando essa rubrica fizer sentido |
| Erros críticos | Contagem e taxa; nunca esconder dentro da média de acerto |
| Trabalho autônomo | Concluídos sem qualquer intervenção humana ÷ todos os concluídos |
| Intervenção | Casos concluídos com participação humana ÷ todos os concluídos |
| Pendências e falhas | Casos abertos, falhos e cancelados, separados dos concluídos |
| Custo por caso | Custos observados de IA/ferramentas do período ÷ casos concluídos; inclui tentativas e falhas no numerador |
| Custo total do processo | IA + ferramentas + infraestrutura + revisão humana + manutenção e retrabalho |
| Tempo de ciclo | Conclusão − entrada; reportar mediana, p95 e tempo de espera |
| Resultado comercial | Conversão de coortes comparáveis, com janela de atribuição definida |
| Capacidade liberada | Tempo baseline − tempo humano após adoção; não equivale automaticamente a economia financeira |

Para planejamento: benefício potencial = horas liberadas × custo/hora. Resultado líquido estimado = benefício potencial − custos adicionais. ROI estimado = resultado líquido ÷ custos adicionais. Com custo adicional zero, ROI percentual é indefinido. O benefício só vira economia realizada se a empresa reduzir gasto ou realocar capacidade com resultado verificável. Separar investimento inicial do custo recorrente.

## LOOP-R

Neste projeto, LOOP-R é o nome do ciclo fornecido no briefing, sem atribuir significado não confirmado às letras:

**Executar → observar → medir → identificar problema → propor melhoria → testar → validar → promover.**

Feedback operacional abre uma proposta. Não altera automaticamente o agente em produção. Cada proposta aponta uma versão candidata, dados de teste separados do treinamento, evidência comparativa e um responsável. A validação autoriza promoção gradual; piora relevante ou falha crítica aciona pausa e reversão. Conhecimento, instruções, modelo, Skills e permissões são versionados como partes do pacote operacional.

## Rituais de gestão

- **Diário:** pendências, erros críticos, prazo, orçamento e operações interrompidas.
- **Semanal:** amostragem de qualidade, causas de exceção, gargalos e propostas LOOP-R.
- **Por mudança:** avaliação, revisão de permissões, aprovação, implantação e monitoramento.
- **Mensal:** resultado empresarial, custo total, capacidade liberada e priorização do próximo processo.

## Fronteiras da proposta

Gestoria começa como ferramenta de desenho e gestão. Um runtime com execução real, conectores e controles de acesso será outra etapa, detalhada no plano do produto. Regras implementadas no navegador servem ao laboratório; controles de produção precisam ser aplicados no servidor e nos próprios conectores.
