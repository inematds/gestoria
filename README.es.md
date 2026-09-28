# Gestoria

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

Método, plan de formación INEMA y laboratorio web de Gestión de IA. La unidad de trabajo es **un proceso empresarial con un resultado medible**.

**[Abrir herramienta](https://inematds.github.io/gestoria/)** · **[Guía de uso](https://inematds.github.io/gestoria/guia/es/)** · **[Plan del curso](https://inematds.github.io/curso-gestao-ia/)**

## Abrir la herramienta

Requiere Node.js 22.12+ o 24+ y npm.

```bash
npm install
npm run dev
```

Abre la dirección que indica Vite (normalmente `http://localhost:5173`). Para generar los archivos estáticos:

```bash
npm run build
npm run preview
```

El directorio `dist/` es la salida de producción. `npm run build` genera la versión para la raíz de un dominio. `npm run build:pages` configura la base `/gestoria/` e incluye la guía y la portada. El workflow `.github/workflows/pages.yml` publica este paquete en GitHub Pages con cada push a `main`.

## Documentos

- [Plan del curso](docs/PLANO-CURSO.md): 10 módulos, 60 horas propuestas, clases, laboratorios, entregas y proyecto final.
- [Método](docs/METODO.md): contratos, cargos digitales, autonomía, métricas y LOOP-R.
- [Plan del producto](docs/PLANO-PRODUTO.md): alcance, arquitectura, datos, fases y criterios de evolución.
- [Plantillas](docs/TEMPLATES.md): modelos para aplicar el método a una operación.

Los cuatro documentos también se pueden descargar desde la pantalla **Método y curso**.

## Guía de uso

1. Abre **Procesos** y revisa el ejemplo de calificación comercial o crea un proceso.
2. En **Fuerza de trabajo**, crea un cargo, indica quién es responsable y define su alcance y autonomía inicial.
3. En **Vista general**, selecciona el proceso y simula un caso normal, dudoso o fuera de la política.
4. Abre **Decisiones humanas**, revisa el resultado y registra la aprobación o devolución con una justificación.
5. En **Evaluaciones**, registra casos distintos con el resultado esperado, el producido y la clasificación humana.
6. Abre la ficha del agente para consultar los criterios de promoción. La aprobación lo asciende un nivel y crea una nueva versión; las evaluaciones históricas siguen visibles.
7. En **Mejora continua**, registra una hipótesis y avanza con el experimento aportando evidencias.
8. En **Datos del laboratorio**, exporta tu trabajo en JSON. La importación y restauración reemplazan el espacio actual tras la confirmación.

## Límites de esta versión

Es un **MVP local de gestión con simulador didáctico**, sin backend ni llamadas a modelos. No se conecta a CRM, ERP, correo electrónico ni MCP. Las herramientas, el modelo, las Skills y el conocimiento de la ficha son descripciones planificadas, no integraciones activas.

Los ejemplos iniciales son ficticios. Cada nueva simulación usa R$ 0,38 y 42 segundos como valores didácticos, sin cobro. Los indicadores se calculan sobre el acumulado del laboratorio: la autonomía usa solo casos completados; el costo incluye intentos pendientes/devueltos; las evaluaciones usan solo las versiones actuales. El indicador de aciertos no equivale a una validación en producción.

Los datos se guardan en el `localStorage` de este navegador y origen (`gestoria.workspace.v1`). No hay identidad autenticada, aislamiento por empresa, copia de seguridad automática, autorización real ni auditoría inmutable. El historial local conserva hasta 300 eventos. No ingreses secretos ni información sensible. Las exportaciones se pueden editar; las reglas de producción deben aplicarse en el servidor.

Una importación se valida en cuanto a versión, tipos, límites, IDs y relaciones; se descartan los campos desconocidos. Los archivos tienen un límite de 5 MB. Los datos locales no válidos se conservan y bloquean las escrituras hasta que se recuperen, importen o restauren. Si otra pestaña modifica los datos, los formularios abiertos se cierran para evitar sobrescrituras.

El curso está planificado; todavía no se han producido las clases completas, los videos, las páginas del material de estudio ni el dataset revisado de 100 casos. El roadmap describe la transición de este laboratorio a una operación real.

## Verificación

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Las pruebas de dominio verifican métricas, presupuesto, autonomía, revisión, promoción e importación. Las pruebas de navegador cubren el flujo desde el registro hasta la evaluación, la persistencia, LOOP-R, la importación, el contenido HTML tratado como texto, la recuperación de datos no válidos, las descargas y los diseños de escritorio/móvil. Las capturas se guardan en `artifacts/`.

## Estructura

```text
docs/               método, plan del curso, plan del producto y plantillas
src/domain.ts       reglas de gestión y validación de las copias
src/seed.ts         ejemplos ficticios iniciales
src/main.ts         pantallas, formularios y persistencia local
src/style.css       interfaz adaptable
tests/              pruebas de dominio y navegador
