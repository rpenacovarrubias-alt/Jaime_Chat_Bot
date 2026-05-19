# FLUJOS DE CONVERSACIÓN — CHATBOT JAIME
## Hotel: Hotel Urbano BeWow© Querétaro
**Versión:** 1.0 | **Fecha:** 19 Mayo 2026 | **Plataforma:** ManyChat | **Modelo:** Opción A — Manual con agente humano en Recepción

---

## ARQUITECTURA GENERAL

```
KEYWORDS DE ENTRADA
Hola · Buenos días · Buenas tardes · Buenas noches
        ↓
BIENVENIDA JAIME
        ↓
MENÚ PRINCIPAL (8 opciones)
        ↓
SUBMENÚ correspondiente
        ↓
RESPUESTA ESPECÍFICA
        ↓
¿Puedo ayudarte en algo más?
[ 🔄 Ver menú ]  [ ✅ No, gracias ]
        ↓
CIERRE: "Soy Jaime, fue un placer asistirte. 😊"
```

---

## MENSAJE DE BIENVENIDA

**Keywords trigger:**
`Hola` · `Buenos días` · `Buenos dias` · `buenos dias` · `Buenas tardes` · `buenas tardes` · `Buenas Tardes` · `Buenas Noches` · `Buenas noches` · `buenas noches`

**Mensaje:**
> ¡Hola! 👋 Soy Jaime, tu asistente virtual en el Hotel BeWow.
> Estoy aquí para ayudarte. 😊
> ¿Cómo te puedo asistir hoy?

**Firma de cierre:**
> Soy Jaime, fue un placer asistirte. 😊

---

## MENÚ PRINCIPAL

```
¿Cómo te puedo asistir hoy?

[ 📋 Pre-Registro              ]  → Submenú Reservaciones
[ 🚪 Check Out Express        ]  → Submenú Info del Hotel
[ 🧾 Facturación              ]  → Submenú Info del Hotel
[ 🛎️  Servicios en habitación  ]  → Submenú Servicios
[ 🏨 Información del hotel    ]  → Submenú Info Hotel
[ 📅 Reservaciones            ]  → Submenú Reservaciones
[ 🎪 Eventos y salones        ]  → Submenú Eventos
[ 👤 Hablar con un agente     ]  → Transferencia a Recepción
```

---

## SUBMENÚ — RESERVACIONES

```
¿En qué te ayudo?

[ 📋 Pre-Registro              ]
[ ✅ Hacer una reservación     ]
[ ✏️  Modificar reservación    ]
[ ❌ Cancelar reservación      ]
[ 💳 Métodos de pago           ]
[ ← Menú principal             ]
```

---

## SUBMENÚ — INFORMACIÓN DEL HOTEL

```
¿Qué necesitas?

[ 🚪 Check Out Express        ]
[ 🧾 Facturación              ]
[ 📍 Ubicación y cómo llegar  ]
[ 🏊 Instalaciones            ]
[ 📋 Políticas del hotel      ]
[ 🛏️  Tipos de habitación      ]
[ ← Menú principal             ]
```

---

## SUBMENÚ — SERVICIOS EN HABITACIÓN

```
¿Qué necesitas?

[ 🪣 Amenidades               ]
[ 🔧 Reportar una falla       ]
[ 🧹 Limpieza                 ]
[ 🍽️  Room service             ]
[ ← Menú principal             ]
```

---

## SUBMENÚ — EVENTOS Y SALONES

```
¿Te ayudo con un evento?

[ 🏛️ Ver nuestros salones     ]
[ 💼 Solicitar cotización     ]
[ ← Menú principal             ]
```

---

## MENÚ DE ROOM SERVICE — RESTAURANTE CLETO

| # | Platillo | Descripción | Precio |
|---|---|---|---|
| 1 | 🌟 Desayuno Sinergy | Plato de fruta · Jugo · Huevos al gusto con Chilaquiles con pollo · Café · Pan | $350 MXN |
| 2 | 💼 Desayuno Empresarial | Huevos al gusto con Chilaquiles con pollo · Jugo · Café · Pan | $320 MXN |
| 3 | 🍳 Desayuno Americano | Huevos al gusto · Frijoles refritos · Café · Jugo o Fruta | $280 MXN |
| 4 | 🥐 Desayuno Continental | Fruta de la estación · Café · Pan | $260 MXN |

**Horario room service:** Hasta las 2:00 pm | **Tiempo de entrega:** 5 minutos

---

## FLUJO 1 — PRE-REGISTRO

```
PASO 1 — Solicitar número de reservación
───────────────────────────────────────────────
Jaime:
"Con gusto gestiono tu pre-registro. 😊
Por favor indícame tu número de reservación."

→ Jaime guarda: {{numero_reservacion}}


PASO 2 — Notificar a Recepción (+52 442 216-0100)
───────────────────────────────────────────────
┌──────────────────────────────────────────────┐
│ 📋 PRE-REGISTRO SOLICITADO                   │
│ Reservación: {{numero_reservacion}}          │
│ El huésped espera confirmación de status.    │
│ Por favor responde en ManyChat:              │
│ ✅ PAGADA  /  🔗 PENDIENTE + [link de pago] │
└──────────────────────────────────────────────┘


PASO 4A — Si PAGADA
───────────────────────────────────────────────
"✅ ¡Tu reservación está confirmada y pagada!
Solo preséntate en Recepción a partir de las 3:00 pm. 🗝️
¿Necesitas algo más antes de tu llegada?"

[ 📍 Cómo llegar al hotel ]
[ 🅿️ Estacionamiento      ]
[ 🔄 Ver menú             ]


PASO 4B — Si PENDIENTE
───────────────────────────────────────────────
"Tu reservación tiene un saldo pendiente de pago.
🔗 [link de pago enviado por Recepción]
¿Tienes alguna duda?"

[ 👤 Hablar con un agente ]
[ 🔄 Ver menú             ]
```

---

## FLUJO 2 — CHECK OUT EXPRESS

```
PASO 1-2 — Solicitar habitación y nombre
───────────────────────────────────────────────
Jaime: "¿Cuál es tu número de habitación?"
→ Jaime guarda: {{numero_habitacion}}

Jaime: "¿A nombre de quién está registrada?"
→ Jaime guarda: {{nombre_huesped}}


PASO 3 — Notificar a Recepción (+52 442 216-0100)
───────────────────────────────────────────────
┌──────────────────────────────────────────────┐
│ 🚪 CHECK OUT EXPRESS SOLICITADO              │
│ Habitación: {{numero_habitacion}}            │
│ A nombre de: {{nombre_huesped}}              │
│ Por favor envía: 1️⃣ Estado de cuenta  2️⃣ Link de pago │
└──────────────────────────────────────────────┘


PASO 4-5 — Recepción envía estado de cuenta
───────────────────────────────────────────────
"Aquí está tu estado de cuenta 📄
[estado de cuenta]
🔗 [link de pago]
Una vez pagado, envíame tu comprobante 🧾"


PASO 5 — Confirmación tras comprobante
───────────────────────────────────────────────
"✅ ¡Pago recibido! Para tu factura:
🔗 ephyr/facturacion.com.mx
Ha sido un placer hospedarte en BeWow. 🏨 ¡Te esperamos pronto!"
```

---

## FLUJO 3 — FACTURACIÓN (100% automático)

```
Jaime:
"Con gusto. Aquí puedes generar tu factura: 😊
🔗 ephyr/facturacion.com.mx
Si tienes algún problema, te conecto con nuestro equipo."

[ 🔄 Ver menú ]  [ ✅ No, gracias ]
```

---

## FLUJO 4 — AMENIDADES
**Notifica a:** Miguel Ángel +52 563 843-8477

```
PASO 1 — Selección de amenidad
───────────────────────────────────────────────
"¿Qué artículo requieres?"
[ 🛁 Toallas de baño ][ 🏊 Toallas de alberca ][ 🧻 Papel higiénico ]
[ 🛏️ Almohadas ][ 🫧 Cobertor/cobija ][ 💧 Agua embotellada ]
[ 🪥 Kit dental ][ 🧵 Kit de costura ][ ✏️ Otro (escribir) ]

→ Jaime guarda: {{amenidad_solicitada}}
→ Jaime: "¿Cuál es tu número de habitación?"
→ Jaime guarda: {{numero_habitacion}}


PASO 3 — Notificar a Miguel Ángel (+52 563 843-8477)
───────────────────────────────────────────────
┌──────────────────────────────────────┐
│ 🪣 SOLICITUD DE AMENIDAD             │
│ Habitación: {{numero_habitacion}}    │
│ Artículo: {{amenidad_solicitada}}    │
│ Prioridad: MEDIA                     │
└──────────────────────────────────────┘

"✅ ¡Listo! El artículo llegará en 10-15 minutos. 😊"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]
```

---

## FLUJO 5 — REPORTAR UNA FALLA
**Notifica a:** Miguel Ángel +52 563 843-8477 · Crítico: Héctor Parra +52 553 614-0206

```
PASO 1 — Tipo de falla
───────────────────────────────────────────────
[ 🚿 Agua caliente → ALTA ][ ❄️ A/C → ALTA ][ 💡 Luz → ALTA ]
[ 📺 TV → MEDIA ][ 📶 WiFi → MEDIA ][ 🔑 Cerradura → ALTA ]
[ 🚨 Detector de humo → CRÍTICA ][ ✏️ Otro → MEDIA ]

→ Jaime guarda: {{tipo_falla}} y {{nivel_urgencia}}
→ Solicita: {{numero_habitacion}} y {{nombre_huesped}}


PASO 3A — ALTA o MEDIA → Miguel Ángel (+52 563 843-8477)
───────────────────────────────────────────────
┌──────────────────────────────────────┐
│ 🔧 REPORTE DE FALLA                  │
│ Habitación: {{numero_habitacion}}    │
│ Huésped: {{nombre_huesped}}          │
│ Problema: {{tipo_falla}}             │
│ Prioridad: {{nivel_urgencia}}        │
└──────────────────────────────────────┘
"Un técnico estará contigo en 15-20 minutos. 🔧"


PASO 3B — CRÍTICA → Miguel Ángel Y Héctor Parra (+52 553 614-0206)
───────────────────────────────────────────────
┌──────────────────────────────────────┐
│ 🚨 ALERTA CRÍTICA — ATENCIÓN INMEDIATA│
│ Habitación: {{numero_habitacion}}    │
│ Problema: {{tipo_falla}}             │
└──────────────────────────────────────┘
"🚨 Equipo de seguridad notificado. Si hay fuego, llama al 911. 🆘"
```

---

## FLUJO 6 — LIMPIEZA
**Notifica a:** Miguel Ángel +52 563 843-8477

```
"¿Cuándo la prefieres?"
[ 🕐 Ahora ]  [ 🕒 En un horario específico ]

— AHORA: "¿Tu habitación?" → Notifica → "Llegamos en 5 min. 🧹"
— HORARIO: "¿A qué hora?" + "¿Tu habitación?" → Notifica → "Programada a las {{hora_limpieza}} ✅"

[ 🔄 Ver menú ]  [ ✅ No, gracias ]
```

---

## FLUJO 7 — ROOM SERVICE
**Horario:** Hasta las 2:00 pm | **Notifica a:** Recepción +52 442 216-0100

```
——— DENTRO DE HORARIO ———
Menú Restaurante Cleto:
🌟 Sinergy $350 · 💼 Empresarial $320 · 🍳 Americano $280 · 🥐 Continental $260

→ Guarda: {{platillo_seleccionado}} · {{cantidad_ordenes}} · {{numero_habitacion}} · {{nombre_huesped}}

Notifica a Recepción (+52 442 216-0100):
┌──────────────────────────────────────┐
│ 🍽️  PEDIDO ROOM SERVICE               │
│ Habitación: {{numero_habitacion}}    │
│ Huésped: {{nombre_huesped}}          │
│ Pedido: {{platillo_seleccionado}} x{{cantidad_ordenes}} │
└──────────────────────────────────────┘
"✅ Tu orden llegará en 20-30 minutos. 🍽️ ¡Buen provecho! 😊"

——— FUERA DE HORARIO (después de 2:00 pm) ———
"Lo sentimos 😔 Room Service solo hasta las 2:00 pm.
Desayuno Restaurante Cleto: 7:00 am — 12:00 pm."
```

---

## FLUJO 8 — UBICACIÓN Y CÓMO LLEGAR (100% automático)

```
"📍 Hotel Urbano BeWow Querétaro
Calle Constituyentes esq. Reforma Agraria, Querétaro.
📌 A 10 min caminando del Centro Histórico.
🔗 maps.app.goo.gl/WdH5xV43UNhV6n3X6"

[ ✈️ Vengo del aeropuerto ]  [ 🚗 Vengo en auto propio ]

— AEROPUERTO: "~45 min · Taxi aprox. $500 MXN · Estacionamiento gratuito incluido."
— AUTO PROPIO: "Estacionamiento gratuito con vigilancia nocturna. Sobre Calle Constituyentes."
```

---

## FLUJO 9 — INSTALACIONES (100% automático)

```
[ 🏊 Alberca ][ 🍳 Restaurante Cleto ][ 🅿️ Estacionamiento ][ 👔 Lavandería ][ 🎪 Eventos ]

— ALBERCA: "⏰ 9:00 am — 9:00 pm · Acceso incluido en tu estancia."
— RESTAURANTE: "Buffet gratuito · 7:00 am — 12:00 pm · +10 guisados, huevos, jugos, fruta, café..."
— ESTACIONAMIENTO: "Gratuito · Vigilancia nocturna."
— LAVANDERÍA: "Disponible con costo. Contacta Recepción: +52 442 216-0100"
— EVENTOS: → Redirige al Submenú de Eventos
```

---

## FLUJO 10 — POLÍTICAS (100% automático)

```
[ ⏰ Check-in/out ][ ❌ Cancelaciones ][ 🐾 Mascotas ][ 🚭 No fumar ][ 👶 Menores ][ 🌙 Silencio ]

— CHECK-IN/OUT: "Check-in 3:00 pm · Check-out 12:00 pm
  Early: desde 5am=media renta / desde 10am=$300 MXN
  Late: hasta 6pm=media renta / después=renta completa"

— CANCELACIONES: "Gratis hasta 8 hrs antes · 1ª noche si cancelas con 48+ hrs · No-show=1ª noche completa"

— MASCOTAS: "❌ No se permiten. Solo animales de asistencia acreditados."

— NO FUMAR: "100% libre de humo. Penalización: $10,000 MXN + autoridades."

— MENORES: "✅ Niños menores de 12 años no pagan (comparten habitación con padres)."

— SILENCIO: "10:00 pm — 7:00 am"
```

---

## FLUJO 11 — HABITACIONES Y TARIFAS (100% automático)

```
"70 habitaciones en 5 categorías. Desayuno buffet incluido."

[ 🛏️ Estándar Doble $1,326 ][ 👑 Estándar King $1,326 ][ 💑 Matrimonial $1,326 ]
[ 🌟 Junior Suite $1,426 ][ ♿ Habitación Adaptada $1,326 ]

— ESTÁNDAR DOBLE: "4 personas · 2 camas matrimoniales · 27 m² · $1,326/noche"
— ESTÁNDAR KING: "2 personas · 1 King Size · 27 m² · $1,326/noche"
— MATRIMONIAL: "2 personas · 1 cama doble · 18 m² · $1,326/noche"
— JUNIOR SUITE: "4 personas · 2 matrimoniales + cocineta · 28 m² · $1,426/noche"
— ADAPTADA: "4 personas · Accesible · 27 m² · $1,326/noche"

→ Reservar: "🔗 direct-book.com/properties/BeWowQueretaroDirect"
```

---

## FLUJO 12 — EVENTOS Y SALONES (100% automático)

```
"3 espacios para eventos corporativos."
[ 1️⃣ Sala "A" ][ 2️⃣ Sala "5B" ][ 3️⃣ Salón Corregidora 1 ]

— SALA "A": "Lobby · 9 personas · Pantalla 72" · A/C · WiFi
  💰 1hr=$150 · 2hrs=$300 · 4hrs=$600 MXN"

— SALA "5B": "5to piso · 6 personas · Pantalla 72" · A/C · WiFi
  💰 1hr=$150 · 2hrs=$300 · 4hrs=$600 MXN"

— CORREGIDORA 1: "20-40 personas · Montajes: Escuela/Herradura/Imperial/Conferencia/Cóctel
  Audio · Video · Proyección · WiFi segura · Cotización personalizada"

→ Cotizar: "🔗 bewow.mx/eventos-y-banquetes"
```

---

## MODELO OPERATIVO — OPCIÓN A

| Elemento | Valor |
|---|---|
| Plataforma | ManyChat |
| Canal | WhatsApp |
| WhatsApp Jaime | +52 1 442 216-0100 |
| Recepción (notificaciones) | +52 442 216-0100 |
| Escalamiento urgente | Miguel Ángel +52 563 843-8477 |
| Escalamiento crítico | Héctor Parra +52 553 614-0206 |
| Link de facturación | ephyr/facturacion.com.mx |
| PMS | E.pHyR |
| Channel Manager | SiteMinder |

---

## EVOLUCIÓN FUTURA — OPCIÓN B
- Integrar n8n con E.pHyR vía API
- n8n consulta status de reservación automáticamente
- Elimina intervención manual de Recepción
- Tiempo de respuesta: inmediato 24/7
