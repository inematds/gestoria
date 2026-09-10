---
name: Gestoria
description: Sistema visual observado do laboratório local de gestão de processos e agentes.
colors:
  primary: "#173f38"
  primary-hover: "#285b4d"
  accent: "#dcebaf"
  background: "#f6f8f7"
  surface: "#ffffff"
  text: "#243d38"
  muted: "#60736e"
  line: "#dce5e1"
  focus: "#507dce"
  success-bg: "#e5f0e5"
  success-text: "#376043"
  review-bg: "#f8edd4"
  review-text: "#7e5a1a"
  critical-bg: "#f8e4e3"
  critical-text: "#9c3535"
typography:
  display:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(26px, 2.7vw, 38px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-.035em"
  headline:
    fontSize: "18px"
    fontWeight: 600
    letterSpacing: "-.015em"
  title:
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  badge: "5px"
  field: "6px"
  control: "7px"
  container: "12px"
  dialog: "14px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "16px"
  section: "24px"
  main-inline: "42px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "11px 16px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "11px 16px"
  input:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.field}"
    padding: "11px 12px"
  navigation-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  badge-review:
    backgroundColor: "{colors.review-bg}"
    textColor: "{colors.review-text}"
    rounded: "{rounded.badge}"
    padding: "5px 8px"
  decision-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.container}"
    padding: "24px"
---

# Design System: Gestoria

## Overview

**Creative North Star: "Sala de operações diurna"**

A metáfora vem do contrato visual já presente em `index.html`: verde profundo, branco frio, linhas claras e tabelas legíveis. A interface acompanha processos, pendências humanas e registros com densidade moderada, tipografia de sistema e contraste entre o quadro de processo e as superfícies claras.

Este documento registra a implementação de `src/style.css` e `src/main.ts`; não constitui aprovação de uma identidade institucional. Gestoria é um nome provisório. A referência a INEMA aparece no laboratório e na proposta de formação, mas logotipo e identidade definitiva continuam em aberto conforme `PRODUCT.md`. A interface explicita simulação, dados fictícios e armazenamento local; os controles operam sobre esses registros e não representam uma IA conectada.

**Key Characteristics:**

- Superfícies claras com divisórias finas e verde profundo para ação e orientação.
- Números legíveis, rótulos concretos em pt-BR e estados descritos por texto.
- Navegação persistente no desktop e faixa horizontal rolável no celular.
- Formulários e decisões em diálogo, com retorno de sucesso ou erro.

## Colors

A paleta combina verde profundo, neutros esverdeados e um acento lima suave. Os valores normativos extraídos estão no frontmatter; os nomes descritivos abaixo são documentação da aparência observada.

### Primary

**Verde profundo:** navegação ativa, ações primárias, quadro de processo e introdução da biblioteca. O hover primário clareia esse verde.

### Secondary

**Lima suave:** última etapa do fluxo e números em destaque na introdução do curso. Não representa, por si só, aprovação de um caso.

### Neutral

**Branco frio e névoa verde:** branco nos painéis, barra superior e campos; fundo discretamente esverdeado na área de trabalho. Texto principal escuro, metadados em verde acinzentado e linhas claras estabelecem a hierarquia sem sombras nos painéis comuns.

### Semantic states

Sucesso e atividade usam verde claro; revisão humana usa âmbar; erro crítico usa vermelho claro. O foco usa azul. Erros de formulário e armazenamento têm um tratamento coral próprio, acompanhado de mensagem textual. Badges neutros identificam versão, autonomia e pausa.

**The Estado explícito Rule.** Preserve o texto do estado ao lado de sua cor: “Ativo”, “Pausado”, “Revisão humana”, “Aprovado” e “Devolvido”.

## Typography

**Display Font / Body Font:** fonte do sistema e seus fallbacks, conforme o frontmatter. Não há fonte remota nem família monoespaçada dedicada.

**Character:** sans-serif prática, com títulos de peso moderado e espaçamento de letras discretamente fechado. A escala diferencia título de página, seção e registro sem depender de caixa alta.

### Hierarchy

- **Display:** título principal fluido; no celular passa a tamanho fixo (29px).
- **Headline:** títulos de seção; algumas seções compactas ajustam tamanho para acomodar a informação.
- **Title:** títulos de registros e campos de detalhe; o quadro principal usa título maior (23px, chegando a 27px em telas amplas).
- **Body:** base de leitura da página; descrições principais limitadas a 72ch e descrições do quadro a 65ch. Tabelas, mensagens e campos usam tamanhos menores conforme o contexto.
- **Label:** botões; rótulos de formulário usam peso mais leve (500). Badges e metadados compactos chegam a 10px e alguns indicadores móveis a 9px.
- **Metrics:** valores principais usam números tabulares, tamanho de desktop (34px) e peso (550). Moeda, porcentagens e datas seguem pt-BR.

A tipografia pequena dos metadados é uma limitação observada para leitura confortável; este registro não equivale a uma certificação de acessibilidade.

## Layout

No desktop, a navegação fixa ocupa 240px. A área principal desloca-se pela mesma largura; a barra superior mede 78px de altura e o conteúdo tem largura máxima de 1600px, centralização e margens internas horizontais definidas no frontmatter. O topo reúne identificação da área, caminho atual, indicação de simulação e perfil local ilustrativo.

A primeira tela apresenta filtro de processo, título e ação, quatro indicadores em faixa dividida por linhas e uma grade com proporção 1,7:1: processo e portfólio à esquerda, pendências humanas à direita. O histórico local vem abaixo. Essa composição pertence à visão geral e não é obrigação de todas as páginas.

As páginas de processos usam linhas clicáveis; força de trabalho e avaliações usam tabelas com rolagem horizontal contida; decisões usam duas colunas; melhorias usam quatro colunas de etapas; método e curso usam introdução verde e links para baixar documentos Markdown. A formação está apresentada como plano, sem aulas completas publicadas na interface.

### Responsive behavior

- **A partir de 1550px:** grade principal passa a 2:1, com coluna lateral mínima de 340px e quadro de processo mais espaçoso.
- **Até 1150px:** lateral passa a 215px; margens internas a 27px. Visão geral vira uma coluna, painel de decisões organiza seus itens em duas colunas e melhorias ficam em duas colunas. A observação junto ao filtro é ocultada.
- **Até 760px:** navegação entra no fluxo da página como faixa horizontal com rolagem; área principal perde o deslocamento lateral. Margens internas passam a 20px e barra superior a 53px. Caminho, avatar e informações secundárias da lateral são ocultados. Título e ação se empilham; indicadores ficam em duas colunas, ou uma para o conjunto de três. Decisões, melhorias e formulários ficam em uma coluna. Botões principais têm altura mínima de 44px; navegação e ações textuais têm mínimo de 40px.

O fluxo de etapas usa uma grade de cinco colunas, com intervalo vertical de 20px. Processos com até 20 etapas ocupam múltiplas linhas; os conectores terminam no quinto item de cada linha. Textos das etapas e títulos de registros permitem quebra de palavras longas para permanecer dentro de seus espaços. Não há menu móvel recolhível nem modo escuro implementado.

## Elevation & Depth

O sistema é plano nos painéis comuns: fundo, bordas e mudança de tom delimitam os grupos. Sombras aparecem nas duas superfícies flutuantes, aviso e diálogo.

### Shadow Vocabulary

- **Aviso:** `0 8px 30px #102e3826`; destaca feedback temporário sobre a página.
- **Diálogo:** `0 20px 70px #0b292d40`; separa o formulário modal do contexto, com fundo de sobreposição `#102e3860`.

O diálogo pode entrar com opacidade e deslocamento vertical curto (6px durante 0,18s, ease-out), exclusivamente sob `prefers-reduced-motion: no-preference`. Não há outras animações ou estados de carregamento artificial implementados.

## Shapes

Controles têm cantos discretos, painéis cantos mais abertos e diálogo a maior curva. Badges são pequenos retângulos arredondados; etapas e perfil são circulares. A marca provisória usa um “g” textual em quadrado arredondado, seguido de “gestoria” e ponto colorido. Ícones são SVG de contorno, normalmente entre 16px e 20px, sem dependência de fontes de ícones.

Bordas de 1px e linhas horizontais organizam tabelas, listas, indicadores e rodapés de diálogo. Listas de processos mantêm linhas abertas, sem transformar cada registro em um cartão elevado.

## Components

### Buttons

A ação primária é sólida em verde; secundárias são brancas com borda clara; ação destrutiva é branca com texto e borda avermelhados. Ações textuais têm fundo transparente e sublinhado no hover. Botões normais têm altura mínima de 42px no desktop e espaçamento conforme o frontmatter.

O foco de links, botões, campos e seletores usa contorno azul (3px) e afastamento (4px). Botões desabilitados têm opacidade (0,55) e cursor indisponível; esse estilo existe, mas impedimentos de domínio geralmente aparecem como explicação, aviso ou ausência da ação elegível, em vez de botão desabilitado.

### Chips

Badges apresentam status, versão, nível de autonomia e contagens. São informativos, não filtros interativos. Fonte compacta (10px), peso (550) e ausência de quebra mantêm o rótulo unido. A contagem da navegação sinaliza pendências globais, enquanto o conteúdo pode estar filtrado por processo.

### Cards / Containers

Painel de decisões branco, com borda, cantos de painel e preenchimento definido no frontmatter. Quadro de processo verde, texto claro e etapas numeradas conectadas por linhas finas; a última etapa recebe o acento. Colunas de melhoria usam fundo esverdeado suave e registros separados por divisórias.

### Inputs / Fields

Rótulos visíveis envolvem os controles nativos. Campos têm fundo branco, borda clara, altura mínima (42px), preenchimento conforme o frontmatter e texto (13px). Textareas permitem redimensionamento vertical; formulários usam duas colunas e campos longos ocupam a largura toda.

Campos obrigatórios usam validação HTML nativa e limites por tipo. Erros de regra de negócio surgem no formulário com `role="alert"`; a gravação só conclui após validação. Contexto, Skills, ferramentas planejadas e evidências iniciais podem ser opcionais. A linguagem mantém a distinção entre configuração planejada e conexão real.

A busca de agentes usa campo nomeado para tecnologia assistiva. O filtro de processo usa label associado e aparece nas páginas operacionais, exceto biblioteca e dados. O seletor de arquivo fica visualmente oculto dentro de seu rótulo de ação, com foco visível no conjunto.

### Navigation

Oito destinos por hash: Visão geral, Processos, Força de trabalho, Decisões humanas, Avaliações, Melhoria contínua, Método e curso e Dados do laboratório. O item ativo usa fundo primário, texto branco e `aria-current="page"`; hover usa fundo suave. A marca retorna à visão geral. Destinos desconhecidos caem na visão geral.

A navegação tem nome acessível, ícones decorativos usam `aria-hidden` e existe link “Pular para o conteúdo”. O indicador de perfil é apenas identificação visual local, sem autenticação.

### Dialogs and feedback

Diálogo nativo com `showModal()`, título associado por `aria-labelledby`, botão Fechar, corpo rolável e cabeçalho fixo dentro do diálogo. A largura limita-se a 740px ou à janela com folga de 32px, e a altura a 90dvh. Formulários trazem Cancelar e ação de confirmação no rodapé. Restauração e importação mostram confirmação concreta antes de substituir registros.

Avisos de sucesso ou impedimento aparecem na parte inferior por seis segundos, usando `role="status"` e `aria-live="polite"`. Erro de leitura dos dados locais gera banner persistente com `role="alert"`, explicação de modo de leitura e acesso à recuperação. Estados vazios oferecem título, explicação e, quando aplicável, próxima ação. Indicadores sem base de cálculo exibem travessão, evitando sugerir uma porcentagem observada.

Não há estado de carregamento de IA: as operações são locais. Exportação e importação lidam com JSON, e a persistência é limitada ao navegador e origem atuais. Histórico e nome de responsável são registros locais, sem autenticação ou auditoria imutável.

## Do's and Don'ts

### Do:

- **Do** manter a indicação de laboratório e simulação nas superfícies operacionais.
- **Do** conservar rótulos textuais para estados e um foco visível nos controles.
- **Do** usar as superfícies, bordas e raios observados para preservar a continuidade entre páginas.
- **Do** apresentar responsável humano, justificativa e versão quando fizerem parte da decisão.
- **Do** preservar rolagem contida nas tabelas e empilhamento de formulários no celular.

### Don't:

- **Don't** apresentar o nome ou símbolo provisório como identidade institucional aprovada.
- **Don't** chamar uma simulação local de execução real de IA ou ação externa concluída.
- **Don't** atribuir significado de estado apenas à cor.
- **Don't** representar ausência de observações como porcentagem calculada.
