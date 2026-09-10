import { test, expect } from '@playwright/test';

test('fluxo completo: processo, cargo, simulação, revisão, avaliação e persistência', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/#processes');
  await page.getByRole('button', { name: 'Novo processo', exact: true }).click();
  await page.getByLabel('Nome do processo').fill('Triagem de chamados');
  await page.getByLabel('Área', { exact: true }).fill('Suporte');
  await page.getByLabel('Responsável humano', { exact: true }).fill('Ana');
  await page.getByLabel('Resultado esperado', { exact: true }).fill('Entregar chamados classificados para o suporte.');
  await page.getByRole('button', { name: 'Salvar processo', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('link', { name: 'Força de trabalho' }).click();
  await page.getByRole('button', { name: 'Novo agente' }).click();
  await page.getByLabel('Nome do agente').fill('Triador de suporte');
  await page.getByRole('dialog').getByRole('combobox', { name: 'Processo', exact: true }).selectOption({ label: 'Triagem de chamados' });
  await page.getByLabel('Responsável humano', { exact: true }).fill('Ana');
  await page.getByLabel('Missão', { exact: true }).fill('Preparar a triagem.');
  await page.getByLabel('Recebe', { exact: true }).fill('Chamado anonimizado');
  await page.getByLabel('Entrega', { exact: true }).fill('Categoria e evidências');
  await page.getByLabel('Pode fazer', { exact: true }).fill('Analisar chamados');
  await page.getByLabel('Não pode fazer', { exact: true }).fill('Enviar respostas');
  await page.getByRole('button', { name: 'Salvar cargo' }).click();
  await expect(page.getByText('Triador de suporte', { exact: true })).toBeVisible();
  await page.getByLabel('Buscar agente ou responsável').fill('triador');
  await expect(page.getByRole('row')).toHaveCount(2);
  await page.getByRole('link', { name: 'Visão geral' }).click();
  await page.getByLabel('Processo', { exact: true }).selectOption({ label: 'Triagem de chamados' });
  await page.getByRole('button', { name: 'Simular execução' }).click();
  await page.getByRole('button', { name: 'Criar caso simulado' }).click();
  await page.getByRole('button', { name: 'Revisar caso' }).click();
  await page.getByLabel('Justificativa da decisão').fill('Classificação confere com o procedimento.');
  await page.getByRole('button', { name: 'Registrar decisão' }).click();
  await expect(page.getByText('0 de 1 sem intervenção')).toBeVisible();
  await page.getByRole('link', { name: 'Avaliações', exact: true }).click();
  await page.getByRole('button', { name: 'Registrar avaliação' }).click();
  await page.getByLabel('Nome do caso').fill('Chamado técnico');
  await page.getByLabel('Resultado esperado (gabarito)').fill('Suporte técnico');
  await page.getByLabel('Resultado produzido (observado)').fill('Suporte técnico');
  await page.getByLabel('Avaliador responsável').fill('Ana');
  await page.getByRole('button', { name: 'Salvar avaliação' }).click();
  await expect(page.getByText('Chamado técnico', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Chamado técnico', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('LOOP-R exige evidência; importação rejeita inválidos e trata HTML como texto', async ({ page }) => {
  await page.goto('/#improvements');
  await page.getByRole('button', { name: 'Abrir experimento' }).click();
  await page.getByLabel('Etapa (avanço de uma etapa por vez)').selectOption('testing');
  await page.getByRole('button', { name: 'Salvar experimento' }).click();
  await page.getByRole('button', { name: 'Abrir experimento' }).click();
  await page.getByLabel('Etapa (avanço de uma etapa por vez)').selectOption('validated');
  await page.getByRole('button', { name: 'Salvar experimento' }).click();
  await expect(page.getByRole('alert')).toContainText('Registre as evidências');
  await page.getByLabel('Evidência: versões comparadas, resultados, decisão e reversão').fill('Versões 1 e 2 avaliadas. Revisão humana aprovou teste controlado com reversão para v1.');
  await page.getByRole('button', { name: 'Salvar experimento' }).click();
  await page.getByRole('link', { name: 'Dados do laboratório' }).click();
  await page.locator('#import-file').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"schemaVersion":4}') });
  await expect(page.getByRole('status')).toContainText('incompatível');
  const payload = await page.evaluate(() => JSON.parse(localStorage.getItem('gestoria.workspace.v1')!));
  payload.processes[0].name = '<img src=x onerror=alert(1)>';
  await page.locator('#import-file').setInputFiles({ name: 'test.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(payload)) });
  await page.getByRole('button', { name: 'Substituir pelos dados importados' }).click();
  await page.getByRole('link', { name: 'Processos', exact: true }).click();
  await expect(page.locator('.process-row strong').filter({ hasText: '<img src=x onerror=alert(1)>' })).toBeVisible();
  await expect(page.locator('main img')).toHaveCount(0);
});

test('desktop e mobile: navegação, documentos e ausência de overflow', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  for (const viewport of [{ width: 1440, height: 1080 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/#overview');
    await expect(page.getByRole('heading', { name: 'Sua operação, sob gestão.' })).toBeVisible();
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `artifacts/${viewport.width === 390 ? 'mobile' : 'desktop'}.png`, fullPage: true });
    for (const hash of ['processes', 'agents', 'decisions', 'evaluations', 'improvements', 'library', 'settings']) {
      await page.goto(`/#${hash}`);
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await page.goto('/#library');
  const links = await page.locator('.document-row').evaluateAll(nodes => nodes.map(n => (n as HTMLAnchorElement).href));
  for (const link of links) { const res = await page.request.get(link); expect(res.ok()).toBe(true); }
  expect(errors).toEqual([]);
});

test('dados inválidos não são sobrescritos na inicialização', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('gestoria.workspace.v1', 'corrupted'));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('leitura');
  await page.getByRole('button', { name: 'Simular execução' }).click();
  await page.getByRole('button', { name: 'Criar caso simulado' }).click();
  await expect(page.locator('.form-error')).toContainText('armazenamento');
  expect(await page.evaluate(() => localStorage.getItem('gestoria.workspace.v1'))).toBe('corrupted');
});
