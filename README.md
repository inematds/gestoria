# Gestoria

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

Método, plano de formação INEMA e laboratório web de Gestão de IA. A unidade de trabalho é **um processo empresarial com resultado mensurável**.

**[Abrir ferramenta](https://inematds.github.io/gestoria/)** · **[Guia de uso](https://inematds.github.io/gestoria/guia/)** · **[Plano do curso](https://inematds.github.io/curso-gestao-ia/)**

## Abrir a ferramenta

Requer Node.js 22.12+ ou 24+ e npm.

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente `http://localhost:5173`). Para gerar os arquivos estáticos:

```bash
npm run build
npm run preview
```

O diretório `dist/` é a saída de produção. `npm run build` gera a versão para a raiz de um domínio. `npm run build:pages` configura a base `/gestoria/` e inclui guia e capa. O workflow `.github/workflows/pages.yml` publica esse pacote no GitHub Pages a cada push em `main`.

## Documentos

- [Plano do curso](docs/PLANO-CURSO.md): 10 módulos, 60 horas propostas, aulas, laboratórios, entregas e projeto final.
- [Método](docs/METODO.md): contratos, cargos digitais, autonomia, métricas e LOOP-R.
- [Plano do produto](docs/PLANO-PRODUTO.md): escopo, arquitetura, dados, fases e critérios de evolução.
- [Templates](docs/TEMPLATES.md): modelos para aplicar o método a uma operação.

Os quatro documentos também podem ser baixados na tela **Método e curso**.

## Roteiro de uso

1. Abra **Processos** e examine o exemplo de qualificação comercial ou crie um processo.
2. Em **Força de trabalho**, crie um cargo, indique seu responsável, escopo e autonomia inicial.
3. Na **Visão geral**, selecione o processo e simule um caso normal, duvidoso ou fora da política.
4. Abra **Decisões humanas**, revise a saída e registre aprovação ou devolução com justificativa.
5. Em **Avaliações**, registre casos distintos com esperado, produzido e classificação humana.
6. Abra a ficha do agente para consultar os critérios de promoção. A aprovação promove um nível e cria nova versão; avaliações históricas continuam visíveis.
7. Em **Melhoria contínua**, registre uma hipótese e avance o experimento com evidências.
8. Em **Dados do laboratório**, exporte seu trabalho em JSON. Importação e restauração substituem o espaço atual após confirmação.

## Limites desta versão

É um **MVP local de gestão com simulador didático**, sem backend e sem chamada a modelos. Não conecta CRM, ERP, e-mail ou MCP. Ferramentas, modelo, Skills e conhecimento na ficha são descrições planejadas, não integrações ativas.

Os exemplos iniciais são fictícios. Cada nova simulação usa R$ 0,38 e 42 segundos como valores didáticos, sem cobrança. Indicadores são calculados sobre o acumulado do laboratório: autonomia usa apenas casos concluídos; custo inclui tentativas pendentes/devolvidas; avaliações usam somente versões atuais. O indicador de acerto não equivale a validação em produção.

Dados ficam no `localStorage` deste navegador e origem (`gestoria.workspace.v1`). Não há identidade autenticada, isolamento por empresa, backup automático, autorização real ou auditoria imutável. O histórico local conserva até 300 eventos. Não inserir segredos ou informações sensíveis. Exportações são editáveis; regras de produção precisam ser aplicadas no servidor.

Uma importação é validada quanto a versão, tipos, limites, IDs e relações; campos desconhecidos são descartados. Arquivos têm limite de 5 MB. Dados locais inválidos são preservados e bloqueiam gravações até recuperação/importação/restauração. Se outra aba alterar os dados, formulários abertos são fechados para evitar sobrescrita.

O curso está planejado; aulas completas, vídeos, páginas de apostila e dataset revisado de 100 casos ainda não foram produzidos. O roadmap descreve a passagem deste laboratório para uma operação real.

## Verificação

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Testes de domínio verificam métricas, orçamento, autonomia, revisão, promoção e importação. Testes de navegador cobrem o fluxo de cadastro até avaliação, persistência, LOOP-R, importação, conteúdo HTML tratado como texto, recuperação de dados inválidos, downloads e layouts desktop/mobile. Capturas são gravadas em `artifacts/`.

## Estrutura

```text
docs/               método, plano do curso, plano do produto e templates
src/domain.ts       regras de gestão e validação das cópias
src/seed.ts         exemplos fictícios iniciais
src/main.ts         telas, formulários e persistência local
src/style.css       interface responsiva
tests/              testes de domínio e navegador
```
