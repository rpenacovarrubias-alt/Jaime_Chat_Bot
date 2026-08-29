# Jaime v2 — Chatbot hotelero con router + agentes IA + RAG

**Fecha:** 29 agosto 2026
**Estado:** Diseño aprobado — pendiente de plan de implementación del Sub-proyecto 1
**Piloto:** Avanta Hotel & Villas

## 1. Contexto

Jaime v1 opera hoy en ManyChat con menús de botones fijos (Opción A del `README.md`), ya implementado para Hotel Urbano BeWow© Querétaro. Esta v2 formaliza la evolución ya prevista en el README ("Opción B") hacia un sistema con:

- Router de intención + agentes especializados por dominio
- Base de conocimiento RAG por hotel (marca, políticas, servicios)
- Arquitectura pensada como **plantilla replicable** para múltiples hoteles, no una solución particular de un cliente

Este documento cubre el diseño de alto nivel de todo el sistema y el diseño detallado del primer sub-proyecto a construir.

## 2. Principio de diseño no negociable: agnóstico de hotel

Jaime debe funcionar sin asumir integraciones que solo existen para un hotel específico. Aunque Avanta ya tiene workflows n8n propios (Factura, Creación de Reservación, Convenio_Avanta_Inicial, Cotizador_Sala_Nova), **Jaime no los invoca ni depende de ellos** — esos workflows no existirán para los hoteles futuros que usen la plantilla. En su lugar, los agentes de dominio usan una acción genérica replicable por cualquier hotel: capturar la solicitud y notificar al contacto correcto del directorio de escalamiento del hotel (mismo modelo que ya usa BeWow en Opción A).

## 3. Alcance dividido en 3 sub-proyectos

| # | Sub-proyecto | Contenido |
|---|---|---|
| 1 | **Cimiento** | Canal WhatsApp (Meta Cloud API), base RAG (pgvector), router de intención con taxonomía completa, resolución de preguntas libres. Sin agentes de dominio todavía. |
| 2 | **Agentes de dominio** | Reservaciones, Facturas, Recomendaciones, Restaurante, Horario, Mantenimiento — cada uno con captura de datos + notificación al staff + confirmación al huésped. |
| 3 | **Plantilla multi-hotel** | Proceso formal de onboarding de un hotel nuevo: las 3 capas de ingesta de contexto, alta en la tabla `hoteles`, número de WhatsApp propio. |

Cada sub-proyecto tiene su propio ciclo spec → plan → implementación. Este documento detalla a fondo el Sub-proyecto 1 y deja 2 y 3 a nivel de marco general.

## 4. Arquitectura general (los 3 sub-proyectos combinados)

```
Huésped · WhatsApp
        │
Meta WhatsApp Cloud API  (canal oficial, único canal huésped↔bot)
        │
n8n webhook (VPS EasyPanel)
        │
Resolver hotel_id  (por whatsapp_phone_number_id del número que recibió el mensaje)
        │
Router · Gemini Flash  (clasifica la intención con la taxonomía completa — ver §7)
        │
        ├── Pregunta libre ──────→ RAG (pgvector, contexto del hotel)
        │                              │
        │                    ¿confianza suficiente? (ver §8)
        │                    sí → responde al huésped
        │                    no → cae a "escalar directo"
        │
        ├── Intención de dominio ─→ Agente especializado (Fase 2 — no construido aún)
        │                              ├─→ Confirma al huésped (Meta Cloud API)
        │                              └─→ Evolution API → Staff del hotel
        │
        └── Escalar directo ──────→ (huésped lo pide explícitamente, o baja confianza)
                                       ├─→ Confirma al huésped (Meta Cloud API)
                                       └─→ Evolution API → Staff del hotel

Ingesta de contexto (Sub-proyecto 3)
  Extractor (sitio web) ─┐
  Archivos (manuales, cotizaciones, marca) ─┼──→ documentos_contexto (pgvector)
  APIs del hotel (futuro, opcional) ─┘

Postgres · EasyPanel (pgvector) — compartido por todo el sistema
  hoteles              — config, directorio de escalamiento, tono/personalidad de marca
  documentos_contexto  — chunks + embeddings, filtrados por hotel_id
  conversaciones       — memoria corta por (hotel_id, número del huésped)
```

Un solo workflow de n8n sirve a todos los hoteles: el `phone_number_id` de Meta identifica de qué hotel es cada mensaje entrante, y todo (RAG, directorio, tono) se filtra por `hotel_id` desde ahí. El "template" es el mismo workflow parametrizado, no una copia por hotel.

**Evolution API nunca se comunica con el huésped** — es exclusivamente el canal interno para notificar al staff. El huésped vive siempre y únicamente en Meta Cloud API.

## 5. Decisiones de infraestructura

| Decisión | Elegido | Razón |
|---|---|---|
| Canal huésped↔bot | Meta WhatsApp Cloud API (oficial) | Estable, sin riesgo de baneo del número real; ya usan el mismo ecosistema Meta en Avanta |
| Canal bot→staff | Evolution API, número dedicado y aislado | Más simple de aprovisionar (sin verificación de negocio); se valida su estabilidad real durante el piloto — ver §11 riesgos |
| LLM | Gemini 2.0/2.5 Flash (único proveedor) | Ya integrado en el n8n de Ricardo (`generador_de_contenido`), rápido y económico, consistente con el resto del stack |
| Vector store | PostgreSQL + pgvector en el VPS EasyPanel | Reutiliza infraestructura ya pagada (misma DB que Promo Solution), sin servicio externo nuevo |
| Hotel piloto | Avanta Hotel & Villas | Control total del negocio y datos; no tiene ficha Jaime llenada aún, se genera con el extractor (§9) |
| Número de WhatsApp (dev) | Número de prueba gratuito de Meta for Developers | El número real de Avanta está hoy en la app de WhatsApp Business (no Cloud API) — un número solo puede vivir en un lugar a la vez. Se evita tocar el número real hasta que el proyecto esté listo para decidir si se migra o se registra uno nuevo. |

## 6. Modelo de datos (Postgres, multi-tenant)

- **`hoteles`**: `hotel_id`, nombre, `whatsapp_phone_number_id`, directorio de escalamiento (JSON: nombre/puesto/WhatsApp/tipo de solicitud), tono/personalidad de marca, configuración general (horarios, etc.). El campo de tono se inyecta en el system prompt del router, del RAG y de cada agente — por defecto un tono único por hotel, con posibilidad futura de override por agente.
- **`documentos_contexto`**: `hotel_id`, contenido del chunk, embedding (pgvector), metadata (sección/fuente), fecha.
- **`conversaciones`**: `hotel_id`, número del huésped, rol (huésped/Jaime), mensaje, timestamp — memoria corta de la conversación activa.

## 7. Router con taxonomía completa desde el Sub-proyecto 1

El router clasifica desde el inicio con las 8 intenciones reales, aunque en el Cimiento solo 2 tengan agente real detrás:

`reservacion` · `factura` · `recomendacion` · `restaurante` · `horario` · `mantenimiento` · `pregunta_libre` · `escalar_directo`

En Sub-proyecto 1, las 6 intenciones de dominio caen temporalmente en el manejador de `escalar_directo` (no hay agente todavía). En Sub-proyecto 2, cada una se conecta a su agente real sin tocar el router. Esto evita reconstruir el clasificador entre sub-proyectos.

## 8. Manejo de confianza en el RAG

No basta con un umbral de similitud vectorial (poco confiable por sí solo, varía por corpus). El flujo de respuesta debe incluir un segundo paso: el propio LLM se autoevalúa con el contexto recuperado ("¿esta información basta para responder con certeza a lo que pidió el huésped?"). Solo si la respuesta es afirmativa se contesta al huésped; si no, cae a `escalar_directo`. El score de similitud se usa como filtro previo (top-k), no como criterio final de confianza.

## 9. Ingesta de contexto (3 capas)

1. **Extractor** (ya existe, `extractor/index.html` + `api/analyze.js`) — genera una ficha inicial a partir del sitio web del hotel.
2. **Archivos** — manuales, cotizaciones, información de marca, subidos directamente.
3. **APIs de sistemas del hotel** — PMS u otros, capa opcional y más avanzada, por hotel.

Para el piloto de Avanta: se corre el extractor sobre `avantahotel.com.mx`, se completa a mano donde falte información (usando lo ya documentado en tarifas.json, Sala NOVA, convenios), y el resultado se trocea, se generan embeddings y se inserta en `documentos_contexto` con `hotel_id = 'avanta'`.

## 10. Criterios de escalada humana obligatoria

- El huésped lo pide directamente ("quiero hablar con alguien")
- Mantenimiento — siempre escala, sin excepción, por seguridad/urgencia
- El bot no tiene contexto suficiente para entender o responder con certeza (§8)

## 11. Riesgos abiertos a validar durante el piloto

- **Estabilidad de Evolution API**: se corre en un número dedicado, aislado del canal de huéspedes. Si en el piloto se detectan desconexiones frecuentes, límite de mensajes insuficiente, o riesgo real de baneo, se reevalúa migrar la notificación al staff hacia Meta Cloud API (con el costo de fricción de plantillas/ventana de 24h que eso implica).
- **Ventana de 24 horas de Meta Cloud API**: fuera de esa ventana solo se pueden enviar mensajes con plantillas pre-aprobadas por Meta. Afecta cómo Jaime re-contacta a un huésped después de mucho tiempo — no se resuelve en el Cimiento, queda documentado para la fase productiva.
- **Contenido inicial de Avanta**: depende de qué tan completo esté `avantahotel.com.mx` — si el extractor arroja poco contenido, se completa a mano antes de dar por buena la ingesta del piloto.

## 12. Testing del Sub-proyecto 1

Contra el número de prueba de Meta (hasta 5 destinatarios verificados):
- Pregunta que el RAG resuelve con confianza → responde correctamente citando solo el contexto recuperado
- Pregunta que el RAG no puede resolver → cae a escalada, no inventa
- Solicitud explícita de "quiero hablar con alguien" → escala directo sin pasar por RAG
- Mensaje clasificado como intención de dominio (ej. "quiero hacer una reservación") → cae correctamente en el manejador temporal de `escalar_directo`

## 13. Manejo de errores

- El webhook debe confirmar recepción a Meta rápido; el procesamiento (LLM, RAG) corre de forma asíncrona.
- Si Evolution falla al notificar al staff, se reintenta y se deja registro — una escalada perdida (ej. mantenimiento) es peor que una respuesta tardía.

## 14. Sub-proyectos 2 y 3 (marco general, spec propio pendiente)

**Sub-proyecto 2 — Agentes de dominio**: un sub-workflow por dominio (reservación, factura, recomendación, restaurante, horario, mantenimiento). Cada uno extrae los datos necesarios de la conversación vía LLM con salida estructurada, y ejecuta las dos acciones en paralelo descritas en §4 (confirmar al huésped, notificar al staff). Mantenimiento notifica siempre, sin excepción.

**Sub-proyecto 3 — Plantilla multi-hotel**: formaliza el proceso de alta de un hotel nuevo usando las 3 capas de ingesta (§9), da de alta el registro en `hoteles` (incluyendo directorio de escalamiento y tono de marca), y asigna su propio `whatsapp_phone_number_id`. El extractor existente se extiende para alimentar directamente esta ingesta en vez de solo generar un markdown intermedio.
