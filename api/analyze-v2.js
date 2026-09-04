/**
 * /api/analyze-v2 — Vercel Serverless Function
 * Extractor de Jaime v2: clasifica la informacion del hotel en los 19 conceptos
 * usados por hoteles.ficha (ver docs/superpowers/specs/2026-08-29-jaime-v2-chatbot-hotelero-design.md).
 * Endpoint separado de /api/analyze (V1, ManyChat) para no romper esa herramienta existente.
 * Env var required: ANTHROPIC_API_KEY
 */

const SYSTEM_PROMPT = `Eres un extractor experto de información hotelera para el sistema Jaime v2.
Tu tarea es analizar todo el contenido proporcionado (URLs, imágenes, documentos, texto)
y clasificar la información del hotel en un JSON estructurado, agrupado por CONCEPTOS.

Esta clasificación por conceptos es la que luego usa el router de intenciones del chatbot
para responder rápido: cada concepto es la sección donde se busca la respuesta cuando se
detecta esa intención en la conversación del huésped (ej. una cancelación busca en "reservas",
una solicitud de factura busca en "pagos_facturacion").

REGLAS:
1. Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown.
2. Si un dato no se encuentra en las fuentes, usa null (o [] si el concepto es de tipo lista).
3. Sé preciso: no inventes información que no esté en las fuentes.
4. Para campos booleanos (sí/no) usa "Sí" o "No".
5. Extrae precios con su moneda y unidad (ej: "$1,500 MXN/noche").
6. Los conceptos marcados como LISTA deben devolver un array con un objeto por cada instancia
   real que encuentres (ej. un hotel con 3 restaurantes → 3 objetos en "restaurante"; un hotel
   con instalaciones únicas como viñedo o canchas de tenis → un objeto más en
   "servicios_instalaciones" con el "nombre" que corresponda, no inventes campos fijos).
7. No incluyas el concepto "horarios" — se arma automáticamente juntando los horarios de las
   demás secciones, no lo extraigas tú.
8. Cuando un bloque "=== CONTENIDO DE URL ===", "=== ARCHIVO ===" o "(Imagen anterior)" traiga
   "(categoría indicada por el usuario: X)", esa categoría es la fuente de verdad de qué es esa
   fuente (URL o archivo) — no la reclasifiques por tu cuenta. Úsala para decidir en qué
   concepto/objeto de lista va ese contenido (ej. categoría "Cotización Sala de Juntas" → un
   objeto en "ventas" con tipo "salon"; categoría "Spa" → un objeto en "servicios_instalaciones"
   con nombre "Spa" y ese contexto, sea que la fuente haya sido una URL, un PDF/Word o una foto).
9. PRIORIDAD DE FUENTE para servicios/instalaciones/cotizaciones (Spa, Room Service, Lavandería,
   Cafetería, Estacionamiento, Transporte, restaurantes, cotizaciones, convenio): si existe una URL
   etiquetada con esa categoría específica, esa URL es la fuente principal de los detalles de esa
   sección. Si NO hay URL etiquetada para una categoría, busca esa información en el contenido del
   sitio web general y en el texto proporcionado antes de darla por ausente — no la ignores solo
   porque no tiene URL propia.
10. Si después de revisar TODAS las fuentes disponibles (URL específica si existe, sitio web general,
    texto) — y solo cuando esas fuentes cubren de forma razonablemente amplia los servicios del hotel
    (una página de sitio web completa, una descripción general, no un fragmento suelto de un solo
    tema) — no hay ninguna evidencia de que el hotel ofrezca un servicio común de hotelería (ej. Spa,
    Lavandería, Cafetería), agrega igual una entrada en "servicios_instalaciones" con "nombre" el
    servicio, "disponible":"No" y "detalles":"No tiene este servicio", en vez de omitirlo en silencio
    — así queda explícito que se revisó y no se encontró, no que falta capturar el dato todavía.

ESQUEMA JSON A DEVOLVER (19 conceptos):
{
  "identificacion_marca": {
    "nombre_hotel": string|null, "marca_concepto": string|null, "categoria_estrellas": string|null,
    "total_habitaciones": string|null, "anio_apertura": string|null, "sitio_web": string|null,
    "motor_reservas_url": string|null, "facebook_url": string|null, "instagram_url": string|null,
    "googlemaps_url": string|null, "pms_nombre": string|null, "channel_manager": string|null
  },
  "ubicacion": {
    "direccion": string|null, "ciudad_estado": string|null, "distancia_aeropuerto": string|null,
    "distancia_centro": string|null, "referencias_ubicacion": string|null
  },
  "reservas": {
    "politica_cancelacion": string|null, "politica_noshow": string|null,
    "deposito_garantia": string|null, "deposito_monto": string|null
  },
  "checkin_checkout": {
    "checkin_hora": string|null, "checkout_hora": string|null, "early_checkin": string|null,
    "early_checkin_costo": string|null, "late_checkout": string|null, "late_checkout_costo": string|null,
    "documentos_checkin": string|null, "cama_extra": string|null, "cama_extra_costo": string|null
  },
  "habitaciones": [ // LISTA — un objeto por cada tipo de habitación
    {"tipo": string, "capacidad": string, "metros": string, "tarifa": string, "descripcion": string,
     "extras": string, "amenidades_wifi": string, "amenidades_ac": string, "amenidades_tv": string,
     "amenidades_caja": string, "amenidades_minibar": string, "amenidades_cocineta": string}
  ],
  "wifi": {
    "wifi_ssid": string|null, "wifi_password": string|null, "wifi_red_separada": string|null,
    "wifi_huespedes_ssid": string|null, "wifi_huespedes_pass": string|null, "wifi_velocidad": string|null
  },
  "desayuno": {
    "desayuno_incluido": string|null, "desayuno_tipo": string|null, "desayuno_horario": string|null,
    "desayuno_incluye": string|null, "desayuno_costo_extra": string|null, "desayuno_ubicacion": string|null
  },
  "restaurante": [ // LISTA — un objeto por cada restaurante del hotel
    {"nombre": string, "tipo_cocina": string, "horario_desayuno": string, "horario_comida": string,
     "horario_cena": string, "menu_url": string, "room_service": string, "room_service_horario": string}
  ],
  "servicios_instalaciones": [ // LISTA ABIERTA — una entrada por cada instalación/servicio (alberca,
    // gym, spa, sauna, business center, lavandería, bar, terraza, viñedo, canchas de tenis, etc.)
    {"nombre": string, "disponible": "Sí"|"No", "detalles": string, "horario": string}
  ],
  "politicas_generales": {
    "politica_mascotas": string|null, "mascotas_peso_max": string|null, "mascotas_costo": string|null,
    "politica_fumadores": string|null, "fumadores_sancion": string|null, "politica_menores": string|null,
    "horario_silencio": string|null, "politica_visitas": string|null, "politica_objetos": string|null
  },
  "pagos_facturacion": {
    "pago_efectivo": string|null, "pago_visa": string|null, "pago_mastercard": string|null,
    "pago_amex": string|null, "pago_debito": string|null, "pago_transferencia": string|null,
    "pago_digital": string|null, "pago_facturacion": string|null, "factura_url": string|null
  },
  "estacionamiento": {
    "estac_disponible": string|null, "estac_costo_tipo": string|null, "estac_costo": string|null,
    "estac_techado": string|null, "estac_vigilado": string|null, "estac_capacidad": string|null,
    "valet_parking": string|null, "valet_costo": string|null
  },
  "mantenimiento": {
    "protocolo_general": string|null
  },
  "ventas": [ // LISTA — Eventos, Banquetes, Conferencias, Cotizaciones, Convenios
    {"tipo": "salon"|"evento"|"conferencia"|"cotizacion"|"convenio", "nombre": string,
     "capacidad": string, "montajes": string, "equipo": string, "costo": string, "url": string}
  ],
  "preguntas_frecuentes": [ // LISTA
    {"pregunta": string, "respuesta": string}
  ],
  "concierge": [ // LISTA — Entretenimiento, Viajes, Tours
    {"tipo": "tour"|"entretenimiento"|"viaje", "nombre": string, "descripcion": string,
     "costo": string, "contacto": string}
  ],
  "transportacion": [ // LISTA — shuttle, taxi, renta de auto, etc.
    {"tipo": string, "descripcion": string, "costo": string, "contacto": string}
  ],
  "directorio_escalamiento": [ // NO va dentro de "ficha" — es su propia columna en hoteles
    {"nombre": string, "puesto": string, "departamento": string, "whatsapp": string, "tipo_solicitud": string}
  ]
}`;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY no configurada en variables de entorno de Vercel.' });

  const { urls = [], text = '', files = [] } = req.body || {};
  // urls puede venir como string[] (legado) o {url, hint}[] -- hint es la categoria que el
  // usuario ya le puso a esa URL en el extractor (ej. "Cotización Sala de Juntas"), asi la IA
  // no tiene que adivinar el tipo de contenido solo por lo que logre scrapear de la pagina.
  const rawUrlEntries = urls.map(u => (typeof u === 'string' ? { url: u, hint: null } : u)).filter(e => e && e.url);
  // kind:'image' = foto ya subida a MinIO por el extractor (bypass del limite de cuerpo de Vercel
  // para imagenes) -- se descarga y se relaya a Claude como imagen, no se scrapea como pagina web.
  const imageUrlEntries = rawUrlEntries.filter(e => e.kind === 'image');
  const allUrlEntries = rawUrlEntries.filter(e => e.kind !== 'image');

  if (!allUrlEntries.length && !imageUrlEntries.length && !text && !files.length) {
    return res.status(400).json({ error: 'No se proporcionaron fuentes de información.' });
  }

  // El sitio web general es la fuente de respaldo (regla 9 del prompt) para cualquier categoria
  // sin URL propia, asi que siempre debe entrar al cupo de fetch aunque haya mas de 5 URLs y no
  // sea de las primeras.
  const sitioWeb = allUrlEntries.filter(e => e.hint === 'Página web');
  const resto = allUrlEntries.filter(e => e.hint !== 'Página web');
  const urlEntries = [...sitioWeb, ...resto].slice(0, 6);

  try {
    // Build message content for Claude
    const userContent = [];

    // 1. Fetch URL content
    for (const { url, hint } of urlEntries) {
      const hintTag = hint ? ` (categoría indicada por el usuario: ${hint})` : '';
      try {
        const pageText = await fetchUrl(url);
        if (pageText) {
          userContent.push({
            type: 'text',
            text: `=== CONTENIDO DE URL${hintTag}: ${url} ===\n${pageText.slice(0, 15000)}\n`
          });
        } else if (hint) {
          // Sin contenido scrapeable (ej. redirecciones cortas de Google Maps) -- la categoria
          // que puso el usuario sigue siendo una senal util aunque no se pudo leer la pagina.
          userContent.push({ type: 'text', text: `=== URL${hintTag}: ${url} (sin contenido de texto extraíble, usa la categoría indicada) ===\n` });
        }
      } catch (e) {
        userContent.push({ type: 'text', text: `=== URL${hintTag} ${url}: No se pudo obtener el contenido ===\n` });
      }
    }

    // 1b. Fetch images uploaded to MinIO (bypass del body limit de Vercel) y relayarlas a Claude
    for (const { url, hint } of imageUrlEntries.slice(0, 20)) {
      const hintTag = hint ? ` (categoría indicada por el usuario: ${hint})` : '';
      try {
        const imgRes = await fetch(url);
        if (!imgRes.ok) throw new Error('HTTP ' + imgRes.status);
        const arrayBuf = await imgRes.arrayBuffer();
        const mediaType = imgRes.headers.get('content-type') || 'image/jpeg';
        userContent.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: Buffer.from(arrayBuf).toString('base64') }
        });
        userContent.push({ type: 'text', text: `(Imagen anterior${hintTag}: ${url})` });
      } catch (e) {
        userContent.push({ type: 'text', text: `(No se pudo descargar la imagen${hintTag}: ${url})` });
      }
    }

    // 2. Add text content
    if (text) {
      userContent.push({ type: 'text', text: `=== TEXTO PROPORCIONADO ===\n${text}\n` });
    }

    // 3. Add files
    for (const file of files.slice(0, 20)) {
      const hintTag = file.hint ? ` (categoría indicada por el usuario: ${file.hint})` : '';
      if (file.kind === 'image') {
        userContent.push({
          type: 'image',
          source: { type: 'base64', media_type: file.type || 'image/jpeg', data: file.content }
        });
        userContent.push({ type: 'text', text: `(Imagen anterior${hintTag}: ${file.name})` });
      } else if (file.kind === 'text' && file.content) {
        userContent.push({
          type: 'text',
          text: `=== ARCHIVO${hintTag}: ${file.name} ===\n${file.content.slice(0, 10000)}\n`
        });
      }
    }

    // 4. Final instruction
    userContent.push({
      type: 'text',
      text: 'Analiza TODA la información anterior y clasifica los datos del hotel por concepto. Devuelve SOLO el JSON sin ningún texto adicional.'
    });

    // Call Claude API
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }]
      })
    });

    if (!claudeRes.ok) {
      const errBody = await claudeRes.text();
      throw new Error(`Claude API error ${claudeRes.status}: ${errBody.slice(0, 200)}`);
    }

    const claudeData = await claudeRes.json();
    const rawText = claudeData.content?.[0]?.text || '';

    // Parse JSON from response
    let fields;
    try {
      // Strip markdown code blocks if present
      const clean = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
      fields = JSON.parse(clean);
    } catch (e) {
      // Try to extract JSON from response
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        fields = JSON.parse(match[0]);
      } else {
        throw new Error('No se pudo parsear la respuesta de Claude como JSON.');
      }
    }

    return res.status(200).json({ fields, model: claudeData.model, usage: claudeData.usage });

  } catch (err) {
    console.error('analyze-v2 error:', err);
    return res.status(500).json({ error: err.message || 'Error interno del servidor.' });
  }
}

// ─── URL FETCHER ─────────────────────────────────────────────────────────────
async function fetchUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JaimeBot/1.0; hotel info extractor)',
        'Accept': 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8'
      }
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    return htmlToText(html);
  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
}

function htmlToText(html) {
  // Remove scripts, styles, comments
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s{3,}/g, '\n\n')
    .trim();
  return text;
}
