# Programa de Ingeniería de Software AI-First

**Arquitectura, automatización y sistemas agénticos**

## 1. Resumen del programa

Programa técnico orientado a transformar el trabajo de ingeniería de software mediante modelos de lenguaje, agentes locales, especificaciones vivas, sistemas multiagente, recuperación de conocimiento, observabilidad y evaluación continua.

| Elemento | Descripción |
| --- | --- |
| Duración total | 33 horas |
| Formato | 11 sesiones de 3 horas |
| Nivel I | Fundamentos, herramientas CLI y arquitectura de documentación - 12 horas acumuladas |
| Nivel II | Frameworks, conectividad e inteligencia de datos - 24 horas acumuladas |
| Nivel III | Orquestación, observabilidad y gobierno corporativo - 33 horas acumuladas |
| Metodología | Profundización técnica, resultados de aprendizaje y taller práctico en cada sesión |

### Recorrido formativo

1. Comprender cómo funcionan los LLM y ejecutarlos localmente.
2. Integrar agentes de terminal en el flujo de desarrollo.
3. Convertir las especificaciones en la fuente de verdad para la IA.
4. Estructurar el contexto y controlar la degradación arquitectónica.
5. Automatizar el ciclo de software con equipos multiagente.
6. Incorporar autocorrección y validación contra criterios de aceptación.
7. Conectar agentes con sistemas externos de forma segura mediante MCP.
8. Construir sistemas RAG de nivel productivo.
9. Orquestar comportamientos con estado mediante grafos.
10. Observar, auditar y proteger sistemas agénticos en producción.
11. Integrar evaluaciones en CI/CD y escalar una cultura de ingeniería AI-First.

---

## 2. Nivel I - Fundamentos, CLI y arquitectura de la documentación

**Hito de salida:** 12 horas acumuladas.

**Enfoque:** comprender los modelos más allá de la interfaz conversacional, operar agentes locales desde la terminal y establecer las especificaciones como reglas de desarrollo.

### Sesión 1 - Anatomía de los LLM y entornos locales

**Duración:** 3 horas.

#### Objetivo

Comprender la mecánica interna de los modelos de lenguaje, diagnosticar problemas de inferencia y contexto, y ejecutar modelos abiertos en un entorno local.

#### Contenidos

- **Inferencia y Transformer:** mecanismo de *self-attention* y conversión del texto en distribuciones probabilísticas para predecir el siguiente token.
- **Embeddings y espacios vectoriales:** representación multidimensional del texto y cálculo de similitud del coseno.
- **Economía del contexto:** gestión de la ventana de contexto, mitigación de *Lost in the Middle* y cálculo de costes a partir de tokens de entrada y salida.
- **Parámetros de inferencia:** calibración de `temperature`, `top-p`, `top-k` y penalizaciones de frecuencia y presencia.
- **Orquestación local:** instalación de Ollama, descarga y ejecución aislada de modelos abiertos orientados a código, como Llama 3 y Qwen Coder, y comparación de su rendimiento en hardware local.

#### Resultados de aprendizaje

- Dejar de tratar los modelos como cajas negras.
- Diagnosticar fallos de contexto y analizar alucinaciones.
- Ajustar parámetros de inferencia para controlar el comportamiento.
- Estimar y optimizar el consumo de APIs basado en tokens.

#### Taller práctico

Configurar Ollama y comparar respuestas de un modelo variando la temperatura entre `0.0` y `1.5`. Medir cómo cambia el determinismo de la salida de código.

### Sesión 2 - Claude Code como agente nativo de terminal

**Duración:** 3 horas.

#### Objetivo

Transformar un asistente conversacional en un agente integrado en el sistema de archivos, las reglas del repositorio y el ciclo de control de versiones.

#### Contenidos

- **Arquitectura de Claude Code:** interacción con el sistema de archivos, indexación dinámica del contexto y uso de estructuras sintácticas, como AST, para comprender el proyecto.
- **Comandos y skills extensibles:** creación de instrucciones y automatizaciones reutilizables alineadas con los patrones arquitectónicos del equipo.
- **Gobernanza mediante reglas:** definición de directrices en `.claudecode/rules` para imponer nomenclatura, patrones de diseño y restricciones arquitectónicas como un linter semántico.
- **Git Hooks:** integración con `pre-commit` y `pre-push` para revisar deuda técnica y generar mensajes bajo Conventional Commits.

#### Resultados de aprendizaje

- Integrar un agente autónomo en el flujo diario de terminal.
- Delegar refactorizaciones de archivos completos.
- Mantener las modificaciones alineadas con las políticas del repositorio.

#### Taller práctico

Crear una regla que prohíba importaciones o malas prácticas concretas y ordenar una refactorización automática de un módulo heredado que cumpla totalmente la nueva regla.

### Sesión 3 - SDD, especificaciones abiertas y ejecución agéntica

**Duración:** 3 horas.

#### Objetivo

Pasar de documentación narrativa y ambigua a especificaciones vivas que un agente pueda interpretar como contratos de implementación.

#### Contenidos

- **Filosofía SDD:** sustitución de documentación obsoleta por OpenAPI, AsyncAPI, diagramas Mermaid y Markdown estructurado.
- **SDD optimizado para IA:** definición explícita de límites, invariantes de negocio, modelos de datos y flujos lógicos.
- **Inyección contextual:** organización del repositorio para que el SDD funcione como fuente única de verdad y pueda referenciarse desde comandos de Claude Code.

#### Resultados de aprendizaje

- Redactar especificaciones técnicas sin ambigüedades relevantes.
- Convertir el diseño arquitectónico en instrucciones ejecutables por agentes.
- Mantener sincronizados contrato, estructura y código.

#### Taller práctico - Implementación *zero-shot*

1. Recibir un requerimiento de negocio ambiguo.
2. Redactar un SDD en Markdown con contratos claros de API.
3. Indexar el SDD y solicitar a Claude Code la estructura de carpetas, interfaces y clases iniciales.
4. Ejecutar un hook que valide el andamiaje contra el contrato del SDD.

### Sesión 4 - Control de entropía con Engram y Gentle-ai

**Duración:** 3 horas.

#### Objetivo

Reducir la pérdida de contexto y la degradación arquitectónica que aparecen cuando el código asistido por IA crece en escala y complejidad.

#### Contenidos

- **Entropía en código asistido:** fragmentación del contexto, pérdida del hilo de diseño y ausencia de un lenguaje arquitectónico común.
- **Contexto estructurado:** esquemas jerárquicos de documentación legibles por personas y modelos.
- **Engram:** modelado mediante árboles de contexto que representan dependencias, dominios, flujos y entidades esenciales.
- **Gentle-ai:** traducción de la estructura definida en Engram a contexto preciso para la interfaz de inferencia antes de modificar código.

#### Resultados de aprendizaje

- Operar una infraestructura documental comprensible para el LLM.
- Anticipar impactos colaterales antes de una refactorización.
- Reducir regresiones y roturas de lógica heredada.

#### Taller práctico

Mapear el árbol de dependencias de un módulo existente con Engram, simular un cambio arquitectónico profundo y usar Gentle-ai para guiar la refactorización sin alterar componentes aislados.

---

## 3. Nivel II - Frameworks, conectividad e inteligencia de datos

**Hito de salida:** 24 horas acumuladas.

**Enfoque:** automatizar el ciclo de software con marcos multiagente, conectar APIs de forma resiliente y construir sistemas corporativos de recuperación de conocimiento.

### Sesión 5 - Automatización del ciclo de software con BMAD Core

**Duración:** 3 horas.

#### Objetivo

Configurar un ecosistema local de agentes especializados y orquestar un ciclo de desarrollo desde la idea hasta un artefacto validado.

#### Contenidos

- **Filosofía BMAD:** desarrollo ágil guiado por agentes y ventajas de distribuir responsabilidades frente a un único prompt.
- **Roles especializados:** Arquitecto, Desarrollador, QA y Analista de Producto.
- **Configuración e infraestructura:** entorno de ejecución, variables de entorno, claves de API y herramientas de terminal.
- **Descomposición de tareas:** conversión de requisitos funcionales en microtareas atómicas, secuenciales y procesables por agentes.

#### Resultados de aprendizaje

- Inicializar e integrar BMAD en un flujo de ingeniería.
- Coordinar responsabilidades entre agentes especializados.
- Completar un primer ciclo desde una idea de producto hasta clases validadas.

#### Taller práctico

Inicializar BMAD para resolver un ticket técnico real y analizar en los registros cómo colaboran analista, arquitecto y desarrollador hasta producir el artefacto final.

### Sesión 6 - BMAD avanzado y mecanismos de autocorrección

**Duración:** 3 horas.

#### Objetivo

Construir flujos multiagente capaces de revisar sus resultados, detectar errores y repararlos antes de requerir intervención humana.

#### Contenidos

- **Personalización avanzada:** adaptación de plantillas para imponer arquitecturas empresariales y convenciones del equipo.
- **Pipelines multiagente:** topologías en las que varios agentes diseñan, discuten y refinan una solución común.
- **Reflexión y autocorrección:** bucles cerrados, incluido *Dual-Reflection*, en los que QA ejecuta pruebas, captura errores y devuelve el *stack trace* al agente desarrollador.
- **Gobernanza:** validación de los resultados contra criterios de aceptación derivados del SDD.

#### Resultados de aprendizaje

- Diseñar agentes de ingeniería con mayor autonomía y fidelidad.
- Automatizar iteraciones sobre errores de sintaxis, compilación y lógica.
- Conservar la supervisión mediante criterios de aceptación inmutables.

#### Taller práctico

Inyectar un error intencionado en una clase de negocio y configurar un flujo que compile, detecte el fallo mediante pruebas, lo comunique al agente desarrollador, se autocorrija y entregue el código limpio.

### Sesión 7 - MCP, Harness Engineering y Claude Code

**Duración:** 3 horas.

#### Objetivo

Conectar agentes con APIs, bases de datos y automatizaciones mediante MCP, aplicando controles que garanticen una ejecución predecible y aislada.

#### Contenidos

- **Arquitectura MCP:** modelo cliente-servidor, ciclo de vida de llamadas a herramientas e intercambio de recursos, herramientas y prompts dinámicos.
- **Harness Engineering:** entornos de contención, prueba y control para validar esquemas de entrada y salida, mitigar ejecuciones fallidas o maliciosas y aislar al agente.
- **Servidor MCP personalizado:** implementación con el SDK oficial en Node.js/TypeScript o Python para exponer APIs privadas, bases de datos o automatizaciones.
- **Integración con Claude Code:** registro, autenticación, descubrimiento y uso de servidores MCP desde el agente CLI.

#### Resultados de aprendizaje

- Romper el aislamiento del modelo mediante conexiones estandarizadas y seguras.
- Diseñar herramientas agénticas con contratos verificables.
- Permitir que Claude Code interactúe de forma controlada con el stack de la empresa.

#### Taller práctico

1. **Construcción:** crear un servidor MCP que consulte un microservicio local o analice un archivo de configuración crítico.
2. **Conectividad:** registrarlo globalmente en Claude Code y verificar el *handshake* y el descubrimiento de herramientas.
3. **Ejecución:** resolver desde la terminal un problema técnico que obligue a utilizar la herramienta para extraer datos en tiempo real y aplicar la refactorización correspondiente.

### Sesión 8 - RAG de grado de producción

**Duración:** 3 horas.

#### Objetivo

Diseñar sistemas empresariales de conocimiento que recuperen información precisa y reduzcan las alucinaciones mediante una selección rigurosa del contexto.

#### Contenidos

- **Ingesta e indexación:** segmentación semántica y jerárquica *parent-child*, superando el corte por número fijo de caracteres.
- **Bases vectoriales y búsqueda híbrida:** combinación de recuperación densa basada en embeddings y recuperación dispersa mediante BM25.
- **Query Rewriting:** reescritura, expansión y desambiguación semántica de consultas mediante una capa LLM previa a la recuperación.
- **Reranking:** uso de *cross-encoders* para evaluar y reordenar los fragmentos recuperados antes de incorporarlos al prompt final.

#### Resultados de aprendizaje

- Implementar motores de conocimiento empresarial precisos.
- Mejorar la relevancia del contexto recuperado.
- Reducir alucinaciones mediante recuperación y reordenamiento selectivos.

#### Taller práctico

Construir un flujo RAG que reciba una pregunta ambigua, la optimice mediante *Query Rewriting*, ejecute una búsqueda híbrida y aplique un *reranker* para seleccionar los fragmentos más relevantes.

---

## 4. Nivel III - Orquestación, observabilidad y gobierno corporativo

**Hito de salida:** 33 horas acumuladas y finalización del programa.

**Enfoque:** orquestar grafos con estado, instrumentar sistemas de IA, automatizar su evaluación en CI/CD y desarrollar una cultura de mentoría técnica AI-First.

### Sesión 9 - Comportamiento complejo con LangGraph

**Duración:** 3 horas.

#### Objetivo

Construir sistemas autónomos capaces de conservar estado, ramificar decisiones, utilizar herramientas y reaccionar ante fallos en tiempo de ejecución.

#### Contenidos

- **Arquitecturas con estado:** transición desde cadenas lineales rígidas hacia grafos cíclicos dirigidos que preservan y modifican memoria.
- **Primitivas de LangGraph:** nodos, bordes, transiciones condicionales y compilación del grafo.
- **Patrón ReAct:** razonamiento sobre el uso secuencial de herramientas, inspección de resultados, actualización del estado e iteración hasta alcanzar el objetivo.

#### Resultados de aprendizaje

- Programar flujos autónomos con decisiones complejas.
- Manejar ramificaciones y ciclos controlados.
- Reaccionar ante fallos de herramientas o sistemas externos.

#### Taller práctico

Crear un grafo que reciba un problema de desarrollo, elija una herramienta de pruebas, interprete los errores y decida si termina o vuelve a un nodo de corrección.

### Sesión 10 - Observabilidad y mitigación de riesgos con LangSmith

**Duración:** 3 horas.

#### Objetivo

Instrumentar sistemas agénticos para auditar su comportamiento, controlar costes, detectar cuellos de botella y aplicar defensas de producción.

#### Contenidos

- **Trazabilidad:** captura e inspección del árbol completo de llamadas e interacciones de cada ciclo de inferencia.
- **Rendimiento y costes:** medición de latencia por nodo, tokens de entrada y salida, y prompts dinámicos utilizados durante la ejecución.
- **Guardrails:** validaciones contra *prompt injection*, fugas de información sensible y respuestas fuera del tono institucional.

#### Resultados de aprendizaje

- Operar IA de forma observable y auditable en producción.
- Localizar cuellos de botella y optimizar el consumo de tokens.
- Incorporar controles de seguridad alrededor de los endpoints.

#### Taller práctico

Instrumentar con LangSmith la aplicación de la sesión anterior, ejecutar ráfagas de solicitudes y analizar el panel para encontrar el nodo con mayor latencia y coste.

### Sesión 11 - CI/CD de agentes, evaluación y mentoría AI-First

**Duración:** 3 horas.

#### Objetivo

Cerrar el ciclo de vida de los sistemas agénticos mediante evaluaciones automatizadas y preparar al equipo para adoptar prácticas sostenibles de ingeniería asistida por IA.

#### Contenidos

- **Evaluaciones automatizadas:** suites para modelos e infraestructura agéntica con métricas de fidelidad (*faithfulness*), relevancia de respuesta (*answer relevancy*) y aislamiento de contexto.
- **Agentes en CI/CD:** pruebas de regresión de prompts en el despliegue continuo para detectar degradaciones provocadas por cambios en instrucciones o modelos.
- **Mentoría y adopción:** *pair programming* asistido, revisión humana del código generado y políticas institucionales de gobernanza.

#### Resultados de aprendizaje

- Automatizar el control de calidad antes del despliegue.
- Prevenir regresiones al cambiar prompts, agentes o modelos.
- Actuar como mentor e impulsar una cultura de desarrollo AI-First con supervisión humana.

#### Taller práctico

Construir una suite de evaluación con 20 escenarios representativos y comprobar programáticamente que la fidelidad se mantenga por encima del 95 % antes de autorizar un despliegue simulado.

---

## 5. Resultado global esperado

Al completar las 33 horas, el participante podrá:

- Explicar y ajustar el comportamiento de un LLM con criterio técnico.
- Operar modelos y agentes desde entornos locales y herramientas CLI.
- Diseñar especificaciones estructuradas que gobiernen la generación de código.
- Coordinar equipos multiagente con validación y autocorrección.
- Conectar agentes con sistemas corporativos mediante MCP y controles de ejecución.
- Construir sistemas RAG con recuperación híbrida, reescritura y reordenamiento.
- Implementar grafos con estado y comportamientos ReAct.
- Observar latencia, coste, trazas y riesgos de seguridad.
- Integrar evaluaciones de IA en pipelines CI/CD.
- Guiar a otros desarrolladores en una adopción responsable y gobernada de la IA.

## Fuente

Síntesis estructurada de la propuesta original de entrenamiento AI-First en PDF. El documento conserva el alcance temático, los hitos de aprendizaje y los talleres planteados, reorganizados para facilitar su consulta y posterior desarrollo por sesiones.
