# Checkpoint — Sub-proyecto 1 (Cimiento), 30 agosto 2026

Continuación de [2026-08-29-jaime-v2-chatbot-hotelero-design.md](./2026-08-29-jaime-v2-chatbot-hotelero-design.md). Este documento es el punto de retoma para la siguiente sesión — no repite el diseño, solo el estado de implementación.

## Estado: infraestructura ya funcionando

### Base de datos (pgvector)
- Servicio EasyPanel: `jaime_db` (proyecto `chatbotventas`), imagen `pgvector/pgvector:pg16`
- Base de datos: `jaime_v2` — usuario `Jaime` — extensión `vector` (0.8.6) confirmada activa (`\dx` verificado)
- Contraseña: solo la tiene Ricardo (nunca pasó por el chat)
- **Pendiente:** crear las tablas `hoteles`, `documentos_contexto`, `conversaciones` descritas en el diseño (§6 del spec de diseño) — todavía no se crearon

### App de Meta
- App: **Hotel_Bot**, App ID / Client ID: `1748806339780763`
- Business ID: `4733793256848968`
- WhatsApp Business Account ID: `1081866714203277`
- Número de prueba: **+1 (555) 677-3095**, Phone Number ID: `1297265956804079`
- Número verificado como destinatario de prueba: `+52-442-131-4203` (el de Ricardo)
- Webhook (Configurar webhooks) verificado correctamente con la URL y token del workflow v2 (ver abajo) — el paso "Configurar webhooks" aparece con check verde en Meta

### n8n — credenciales
| Nombre | Tipo | Estado |
|---|---|---|
| `Jaime_Avanta` | `whatsAppTriggerApi` (Client ID/Secret) | Creada, pero su botón de prueba de conexión falla con "Bad Request" — **bug conocido y sin fix confirmado de n8n** (ver GitHub issue #23845, cerrado como "not planned"). No bloquea nada porque ya no se usa el nodo WhatsApp Trigger nativo. |
| `Jaime_Avanta_WhatsApp_Send` | `whatsAppApi` (Access Token) | **Pendiente de crear** — necesaria para (a) enviar mensajes reales desde n8n y (b) hacer la llamada de suscripción del webhook (ver "Bloqueo actual" abajo) |

### n8n — workflows
- ~~`Jaime Avanta - Cimiento WhatsApp`~~ (ID `JzNCxtjwosY4l7Ib`) — versión abandonada, usaba el nodo nativo WhatsApp Trigger (bloqueado por el bug de credencial). No continuar con este.
- **`Jaime Avanta - Cimiento WhatsApp (webhook genérico)`** (ID `NqA2aJqpHWXRG4Ug`) — **la versión activa/correcta**. Usa un nodo Webhook genérico (sin credencial rota) + lógica manual para responder al reto de verificación de Meta.
  - URL: `https://chatbotventas-n8n.h0w0dc.easypanel.host/workflow/NqA2aJqpHWXRG4Ug`
  - Webhook path: `jaime-avanta-whatsapp`
  - Verify token (definido por nosotros, no por Meta): `jaime_avanta_verify_2026`
  - **Publicado y activo.** Verificación del webhook con Meta confirmada exitosa.
  - Nodos: `WhatsApp Webhook` → `Es verificacion de Meta?` (IF) → rama verdadera: `Responder challenge` / rama falsa: `Mensaje recibido` → `Responder ack`

## Bloqueo actual (justo donde se quedó la sesión)

El webhook está verificado, pero **los mensajes reales no están llegando a n8n** (0 ejecuciones nuevas tras varias pruebas de envío). Causa identificada: verificar la URL del callback no suscribe automáticamente la cuenta de WhatsApp Business a mandar eventos — falta una llamada explícita a la API:

```bash
curl.exe -X POST "https://graph.facebook.com/v21.0/1081866714203277/subscribed_apps" -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

Esto requiere el Access Token (secreto) de Ricardo — no se ejecutó en esta sesión porque el token no estaba a la mano. **Este es el primer paso a retomar.**

### Cómo hacerlo la próxima vez (2 opciones)
1. **Directo en PowerShell** (Ricardo corre el comando de arriba con su token real), o
2. **Vía n8n** (recomendado, evita manejar el token en texto plano en ningún lado fuera de n8n): Ricardo crea la credencial `Jaime_Avanta_WhatsApp_Send` (tipo `whatsAppApi`, campo Access Token) en n8n, y Claude arma un nodo HTTP Request que referencia esa credencial para hacer la misma llamada de suscripción — mismo patrón que ya funcionó con `Jaime_Avanta`.

## Siguientes pasos después de resolver la suscripción

1. Confirmar con un mensaje real de WhatsApp que la ejecución aparece en n8n (`search_workflow_executions` sobre el workflow `NqA2aJqpHWXRG4Ug`)
2. Crear las 3 tablas de Postgres (`hoteles`, `documentos_contexto`, `conversaciones`) en `jaime_v2`
3. Correr el extractor sobre `avantahotel.com.mx` para poblar el contenido inicial de Avanta (§9 del spec de diseño)
4. Construir el Router (Gemini Flash, taxonomía completa de 8 intenciones — §7 del spec de diseño) y el flujo de RAG con autoevaluación de confianza (§8)
5. Validar si la credencial de Gemini (`Query Auth account`, tipo `httpQueryAuth`, ID `Ei2CbbRh89Bqb84K`) sirve también para el modelo de embeddings — no se confirmó en esta sesión (no hay nodo nativo de embeddings de Gemini en este n8n; habría que usar un nodo HTTP Request contra el endpoint de embeddings reutilizando esa misma credencial)

## Notas de proceso para la siguiente sesión

- Ricardo se frustró bastante con la fricción de UI de Meta/n8n y con que Claude no pudiera manejar tokens/contraseñas directamente — vale la pena, al retomar, ofrecer hacer lo más posible vía n8n MCP (como se hizo con el workflow del webhook genérico) para minimizar cuánto tiene que navegar manualmente.
- Screenshots de Meta mostraron tokens/passwords en texto plano varias veces durante la sesión (session log) — no se reutilizaron ni se actuó con ellos, pero como práctica, si se retoma pronto, considerar regenerar el Access Token de WhatsApp una vez más por higiene antes de usarlo en producción.
