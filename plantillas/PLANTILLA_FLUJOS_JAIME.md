# PLANTILLA DE FLUJOS — CHATBOT JAIME
**Versión:** 1.0 | **Fecha:** _______________ | **Plataforma:** ManyChat | **Modelo:** Opción A — Manual con agente humano en Recepción

> **Instrucciones:** Copia este archivo a `hoteles/NOMBRE_HOTEL/NOMBRE_HOTEL_flujos.md`
> y reemplaza cada `{{PLACEHOLDER}}` usando los valores de la ficha de configuración del hotel.
> Los placeholders siguen exactamente la misma nomenclatura que `PLANTILLA_FICHA_HOTEL.md`.

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
> ¡Hola! 👋 Soy Jaime, tu asistente virtual en {{HOTEL_NOMBRE}}.
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
*(accesible desde [📋 Pre-Registro] y desde [📅 Reservaciones])*

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
*(accesible desde [🚪 Check Out Express], [🧾 Facturación] y [🏨 Info Hotel])*

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

## FLUJO 1 — PRE-REGISTRO
**Entrada:** Botón [📋 Pre-Registro] desde Menú Principal o Submenú Reservaciones
**Modelo:** Opción A — Recepción responde manualmente

```
PASO 1 — Jaime solicita número de reservación
───────────────────────────────────────────────
Jaime:
"Con gusto gestiono tu pre-registro. 😊
Por favor indícame tu número de reservación."

→ Huésped escribe número de reservación
→ Jaime guarda: {{numero_reservacion}}


PASO 2 — Jaime notifica a Recepción (WhatsApp: {{RECEPCION_WA}})
───────────────────────────────────────────────
Mensaje automático a Recepción:
┌──────────────────────────────────────────────┐
│ 📋 PRE-REGISTRO SOLICITADO                   │
│ Reservación: {{numero_reservacion}}          │
│                                              │
│ El huésped espera confirmación de status.    │
│ Por favor responde en ManyChat:              │
│ ✅ PAGADA                                    │
│ 🔗 PENDIENTE + [link de pago]               │
└──────────────────────────────────────────────┘


PASO 3 — Recepción actualiza el status en ManyChat
───────────────────────────────────────────────
  Agente de Recepción marca campo en ManyChat:
  {{status_reservacion}} = PAGADA / PENDIENTE


PASO 4A — Si status = PAGADA
───────────────────────────────────────────────
Jaime al huésped:
"✅ ¡Tu reservación está confirmada y pagada!

Solo preséntate en Recepción el día de tu llegada
a partir de las {{CHECKIN_HORA}} y recoge tu llave. 🗝️

Recuerda que el check-in es a partir de las {{CHECKIN_HORA}}.

¿Necesitas algo más antes de tu llegada?"

[ 📍 Cómo llegar al hotel ]
[ 🅿️ Estacionamiento      ]
[ 🔄 Ver menú             ]


PASO 4B — Si status = PENDIENTE
───────────────────────────────────────────────
Jaime al huésped:
"Tu reservación tiene un saldo pendiente de pago.

Aquí tu link para completarla:
🔗 [link de pago enviado por Recepción]

Una vez realizado el pago tu reservación
quedará confirmada. 😊

¿Tienes alguna duda?"

[ 👤 Hablar con un agente ]
[ 🔄 Ver menú             ]
```

### Variables utilizadas
| Variable ManyChat | Descripción | Placeholder ficha |
|---|---|---|
| `{{numero_reservacion}}` | Número de reservación del huésped | — |
| `{{status_reservacion}}` | PAGADA / PENDIENTE — actualizado por Recepción | — |
| `{{link_pago}}` | Link enviado por Recepción cuando hay saldo | — |
| `{{CHECKIN_HORA}}` | Hora de check-in del hotel | §3 CHECKIN_HORA |
| `{{RECEPCION_WA}}` | WhatsApp de Recepción | §15 DIR_WA |

---

## FLUJO 2 — CHECK OUT EXPRESS
**Entrada:** Botón [🚪 Check Out Express] desde Menú Principal o Submenú Info Hotel
**Modelo:** Opción A — Recepción genera estado de cuenta manualmente

```
PASO 1 — Jaime solicita número de habitación
───────────────────────────────────────────────
Jaime:
"Con gusto proceso tu salida express. 😊
¿Cuál es tu número de habitación?"

→ Huésped escribe número de habitación
→ Jaime guarda: {{numero_habitacion}}


PASO 2 — Jaime solicita nombre del huésped
───────────────────────────────────────────────
Jaime:
"¿A nombre de quién está registrada la habitación?"

→ Huésped escribe su nombre
→ Jaime guarda: {{nombre_huesped}}


PASO 3 — Jaime notifica a Recepción (WhatsApp: {{RECEPCION_WA}})
───────────────────────────────────────────────
Mensaje automático a Recepción:
┌──────────────────────────────────────────────┐
│ 🚪 CHECK OUT EXPRESS SOLICITADO              │
│ Habitación: {{numero_habitacion}}            │
│ A nombre de: {{nombre_huesped}}              │
│                                              │
│ Por favor envía a Jaime:                     │
│ 1️⃣  Estado de cuenta                         │
│ 2️⃣  Link de pago                             │
└──────────────────────────────────────────────┘


PASO 4 — Recepción envía estado de cuenta + link de pago
───────────────────────────────────────────────
Jaime al huésped:
"Aquí está tu estado de cuenta 📄
[estado de cuenta]

Para liquidar tu saldo usa este link:
🔗 [link de pago]

Una vez realizado el pago,
envíame tu comprobante 🧾"


PASO 5 — Huésped envía comprobante de pago
───────────────────────────────────────────────
Jaime al huésped:
"✅ ¡Pago recibido! Gracias.

Para solicitar tu factura ingresa aquí:
🔗 {{FACTURACION_URL}}

Ha sido un placer hospedarte en {{HOTEL_NOMBRE}}. 🏨
¡Te esperamos pronto!

Soy Jaime, fue un placer asistirte. 😊"
```

### Variables utilizadas
| Variable ManyChat | Descripción | Placeholder ficha |
|---|---|---|
| `{{numero_habitacion}}` | Número de habitación | — |
| `{{nombre_huesped}}` | Nombre del titular | — |
| `{{estado_cuenta}}` | Enviado por Recepción | — |
| `{{link_pago}}` | Enviado por Recepción | — |
| `{{FACTURACION_URL}}` | URL del portal de facturación | §12 FACTURACION_URL |
| `{{HOTEL_NOMBRE}}` | Nombre del hotel | §1 HOTEL_NOMBRE |

---

## FLUJO 3 — FACTURACIÓN
**Entrada:** Botón [🧾 Facturación] desde Menú Principal o Submenú Info Hotel
**Automatización:** 100% automático

```
PASO 1 — Jaime envía link de facturación
───────────────────────────────────────────────
Jaime:
"Con gusto. Aquí puedes generar
tu factura de forma rápida y sencilla: 😊

🔗 {{FACTURACION_URL}}

Si tienes algún problema con tu factura
escríbeme y te conecto con nuestro equipo."


PASO 2 — Cierre
───────────────────────────────────────────────
Jaime:
"¿Puedo ayudarte en algo más?"

[ 🔄 Ver menú ]  [ ✅ No, gracias ]
```

---

## FLUJO 4 — AMENIDADES
**Entrada:** Botón [🪣 Amenidades] desde Submenú Servicios
**Notifica a:** `{{ESC_AMENIDADES}}` — WhatsApp: `{{ESC_AMENIDADES_WA}}`

```
PASO 1 — Jaime muestra opciones de amenidades
───────────────────────────────────────────────
Jaime:
"Con gusto te enviamos lo que necesitas. 😊
¿Qué artículo requieres?"

[ 🛁 Toallas de baño        ]
[ 🏊 Toallas de alberca     ]
[ 🧻 Papel higiénico        ]
[ 🛏️  Almohadas              ]
[ 🫧 Cobertor / cobija      ]
[ 💧 Agua embotellada       ]
[ 🪥 Kit dental             ]
[ 🧵 Kit de costura         ]
[ ✏️  Otro (escribir)        ]

→ Huésped selecciona o escribe
→ Jaime guarda: {{amenidad_solicitada}}


PASO 2 — Jaime solicita número de habitación
───────────────────────────────────────────────
Jaime:
"¿Cuál es tu número de habitación?"

→ Huésped escribe: {{numero_habitacion}}


PASO 3 — Jaime notifica al responsable
───────────────────────────────────────────────
Mensaje a {{ESC_AMENIDADES}} ({{ESC_AMENIDADES_WA}}):
┌──────────────────────────────────────┐
│ 🪣 SOLICITUD DE AMENIDAD             │
│ Habitación: {{numero_habitacion}}    │
│ Artículo: {{amenidad_solicitada}}    │
│ Prioridad: MEDIA                     │
└──────────────────────────────────────┘


PASO 4 — Confirmación al huésped
───────────────────────────────────────────────
Jaime:
"✅ ¡Listo! Tu solicitud fue registrada.
El artículo llegará a tu habitación
en aproximadamente 10-15 minutos. 😊

¿Puedo ayudarte en algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]
```

---

## FLUJO 5 — REPORTAR UNA FALLA
**Entrada:** Botón [🔧 Reportar una falla] desde Submenú Servicios
**Notifica a:** `{{ESC_FALLA_TECNICA}}` · Crítico también a `{{ESC_EMERGENCIA}}`

```
PASO 1 — Jaime pregunta el tipo de falla
───────────────────────────────────────────────
Jaime:
"Lamentamos el inconveniente. 😔
¿Qué problema estás experimentando?"

[ 🚿 Agua caliente          ]  → ALTA
[ ❄️  Aire acondicionado     ]  → ALTA
[ 💡 Luz / Electricidad     ]  → ALTA
[ 📺 Televisión             ]  → MEDIA
[ 📶 WiFi / Internet        ]  → MEDIA
[ 🔑 Cerradura / Llave      ]  → ALTA
[ 🚨 Detector de humo       ]  → CRÍTICA
[ ✏️  Otro (describir)       ]  → MEDIA

→ Jaime guarda: {{tipo_falla}} y {{nivel_urgencia}}


PASO 2 — Jaime solicita datos de la habitación
───────────────────────────────────────────────
Jaime: "¿Cuál es tu número de habitación?"
→ Jaime guarda: {{numero_habitacion}}

Jaime: "¿A nombre de quién está registrada la habitación?"
→ Jaime guarda: {{nombre_huesped}}


PASO 3A — Si urgencia = ALTA o MEDIA
───────────────────────────────────────────────
Notifica a {{ESC_FALLA_TECNICA}} ({{ESC_FALLA_TECNICA_WA}}):
┌──────────────────────────────────────┐
│ 🔧 REPORTE DE FALLA                  │
│ Habitación: {{numero_habitacion}}    │
│ Huésped: {{nombre_huesped}}          │
│ Problema: {{tipo_falla}}             │
│ Prioridad: {{nivel_urgencia}}        │
└──────────────────────────────────────┘

Jaime al huésped:
"Hemos notificado a nuestro equipo
de mantenimiento. Un técnico estará
en tu habitación en aproximadamente
15-20 minutos. 🔧

Lamentamos el inconveniente y
agradecemos tu paciencia. 😊"

[ 🔄 Ver menú ]  [ 👤 Hablar con un agente ]


PASO 3B — Si urgencia = CRÍTICA (detector de humo)
───────────────────────────────────────────────
Notifica a {{ESC_FALLA_TECNICA}} Y a {{ESC_EMERGENCIA}}:
┌──────────────────────────────────────┐
│ 🚨 ALERTA CRÍTICA — ATENCIÓN INMEDIATA│
│ Habitación: {{numero_habitacion}}    │
│ Huésped: {{nombre_huesped}}          │
│ Problema: {{tipo_falla}}             │
│ Prioridad: CRÍTICA                   │
└──────────────────────────────────────┘

Jaime al huésped:
"🚨 Hemos alertado de inmediato a nuestro
equipo de seguridad y mantenimiento.
Alguien acudirá a tu habitación ahora mismo.

Por tu seguridad: si percibes humo
real o fuego, llama al 911. 🆘"
```

---

## FLUJO 6 — LIMPIEZA
**Entrada:** Botón [🧹 Limpieza] desde Submenú Servicios
**Notifica a:** `{{ESC_LIMPIEZA}}` — WhatsApp: `{{ESC_LIMPIEZA_WA}}`

```
PASO 1 — Jaime pregunta preferencia de horario
───────────────────────────────────────────────
Jaime:
"Con gusto programamos la limpieza
de tu habitación. 😊
¿Cuándo la prefieres?"

[ 🕐 Ahora                   ]
[ 🕒 En un horario específico ]


PASO 2A — Si AHORA
───────────────────────────────────────────────
Jaime: "¿Cuál es tu número de habitación?"
→ Jaime guarda: {{numero_habitacion}}

Notifica a {{ESC_LIMPIEZA}} ({{ESC_LIMPIEZA_WA}}):
┌──────────────────────────────────────┐
│ 🧹 SOLICITUD DE LIMPIEZA INMEDIATA   │
│ Habitación: {{numero_habitacion}}    │
│ Prioridad: MEDIA                     │
└──────────────────────────────────────┘

Jaime al huésped:
"✅ ¡Listo! Nuestro equipo de ama de llaves
llegará a tu habitación en 5 minutos. 🧹
La limpieza completa toma
aproximadamente 20-30 minutos."


PASO 2B — Si HORARIO ESPECÍFICO
───────────────────────────────────────────────
Jaime: "¿A qué hora la prefieres?"
→ Jaime guarda: {{hora_limpieza}}

Jaime: "¿Cuál es tu número de habitación?"
→ Jaime guarda: {{numero_habitacion}}

Notifica a {{ESC_LIMPIEZA}} ({{ESC_LIMPIEZA_WA}}):
┌──────────────────────────────────────┐
│ 🧹 LIMPIEZA PROGRAMADA               │
│ Habitación: {{numero_habitacion}}    │
│ Hora solicitada: {{hora_limpieza}}   │
│ Prioridad: MEDIA                     │
└──────────────────────────────────────┘

Jaime al huésped:
"✅ ¡Perfecto! Programamos la limpieza
de tu habitación a las {{hora_limpieza}}. 😊"


PASO 3 — Cierre
───────────────────────────────────────────────
"¿Puedo ayudarte en algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]
```

---

## FLUJO 7 — ROOM SERVICE
**Entrada:** Botón [🍽️ Room service] desde Submenú Servicios
**Horario:** Hasta las `{{ROOMSERVICE_HORARIO}}` · Tiempo de entrega: `{{ROOMSERVICE_TIEMPO_ENTREGA}}`
**Notifica a:** `{{ESC_ROOMSERVICE}}` — WhatsApp: `{{ESC_ROOMSERVICE_WA}}`

```
PASO 1 — Verificación de horario
───────────────────────────────────────────────
¿Es antes de las {{ROOMSERVICE_HORARIO}}?


——— DENTRO DE HORARIO ———

PASO 2 — Jaime presenta el menú
───────────────────────────────────────────────
Jaime:
"¡Con gusto! 🍽️ Aquí está nuestro
menú del {{REST_NOMBRE}}:

{{RS_PLATILLO_1}} — {{RS_PRECIO_1}}
   {{RS_DESC_1}}

{{RS_PLATILLO_2}} — {{RS_PRECIO_2}}
   {{RS_DESC_2}}

{{RS_PLATILLO_3}} — {{RS_PRECIO_3}}
   {{RS_DESC_3}}

{{RS_PLATILLO_4}} — {{RS_PRECIO_4}}
   {{RS_DESC_4}}

¿Qué deseas ordenar?"

[ Botón 1: {{RS_PLATILLO_1}}  ]
[ Botón 2: {{RS_PLATILLO_2}}  ]
[ Botón 3: {{RS_PLATILLO_3}}  ]
[ Botón 4: {{RS_PLATILLO_4}}  ]


PASO 3 — Confirmar selección y cantidad
───────────────────────────────────────────────
→ Jaime guarda: {{platillo_seleccionado}}

Jaime: "Excelente elección. 😊
¿Cuántas órdenes deseas?"
→ Jaime guarda: {{cantidad_ordenes}}

Jaime: "¿Deseas agregar algo más?"
[ ✅ Sí, ver menú de nuevo  ]
[ ✅ No, continuar          ]


PASO 4 — Datos de entrega
───────────────────────────────────────────────
Jaime: "¿Cuál es tu número de habitación?"
→ Jaime guarda: {{numero_habitacion}}

Jaime: "¿A nombre de quién está registrada la habitación?"
→ Jaime guarda: {{nombre_huesped}}


PASO 5 — Notificar a {{ESC_ROOMSERVICE}}
───────────────────────────────────────────────
┌──────────────────────────────────────┐
│ 🍽️  PEDIDO ROOM SERVICE               │
│ Habitación: {{numero_habitacion}}    │
│ Huésped: {{nombre_huesped}}          │
│ Pedido: {{platillo_seleccionado}}    │
│ Cantidad: {{cantidad_ordenes}}       │
│ Prioridad: MEDIA                     │
└──────────────────────────────────────┘


PASO 6 — Confirmación al huésped
───────────────────────────────────────────────
Jaime:
"✅ ¡Tu pedido fue registrado!

📋 Resumen:
   {{platillo_seleccionado}} x{{cantidad_ordenes}}
   Habitación: {{numero_habitacion}}

Tu orden llegará en aproximadamente
20-30 minutos. 🍽️

¡Buen provecho! 😊"

[ 🔄 Ver menú ]  [ ✅ No, gracias ]


——— FUERA DE HORARIO ———

Jaime:
"Lo sentimos 😔 Nuestro servicio de
Room Service está disponible
únicamente hasta las {{ROOMSERVICE_HORARIO}}.

Nuestro {{REST_NOMBRE}} sirve
desayuno de {{REST_HORARIO_DESAYUNO}}.

¿Puedo ayudarte con algo más?"

[ 🔄 Ver menú ]  [ 👤 Hablar con un agente ]
```

---

## FLUJO 8 — UBICACIÓN Y CÓMO LLEGAR
**Automatización:** 100% automático

```
PASO 1 — Jaime comparte ubicación
───────────────────────────────────────────────
Jaime:
"Aquí nos encuentras: 📍

🏨 {{HOTEL_NOMBRE}}
{{HOTEL_DIRECCION}}
{{HOTEL_CIUDAD_ESTADO}}

📌 {{HOTEL_DISTANCIA_CENTRO}} del centro.

👇 Abre tu ruta aquí:
🔗 {{HOTEL_GOOGLEMAPS}}

¿Cómo vas a llegar?"

[ ✈️  Vengo del aeropuerto    ]
[ 🚗 Vengo en auto propio    ]
[ 🔄 Ver menú                ]


PASO 2A — Si AEROPUERTO
───────────────────────────────────────────────
Jaime:
"El aeropuerto más cercano está a
aproximadamente {{HOTEL_DISTANCIA_AEROPUERTO}}
del hotel. 🛫

Puedes llegar en:
🚕 Taxi de sitio o de aplicación
   Costo aproximado: {{HOTEL_COSTO_TAXI_AEROPUERTO}}

✅ {{ESTAC_DISPONIBLE_TEXTO}}

¿Necesitas algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]


PASO 2B — Si AUTO PROPIO
───────────────────────────────────────────────
Jaime:
"¡Perfecto! 🚗

✅ {{ESTAC_INFO_HUESPEDES}}

Nos encuentras en:
{{HOTEL_REFERENCIAS_UBICACION}}

📌 Aquí tu ruta:
🔗 {{HOTEL_GOOGLEMAPS}}

¿Necesitas algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]
```

---

## FLUJO 9 — INSTALACIONES
**Automatización:** 100% automático (Lavandería redirige a Recepción)

```
PASO 1 — Submenú de instalaciones
───────────────────────────────────────────────
Jaime:
"Contamos con las siguientes
instalaciones para tu disfrute 😊
¿Sobre cuál deseas saber más?"

[ 🏊 Alberca                 ]
[ 🍳 {{REST_NOMBRE}}         ]
[ 🅿️  Estacionamiento         ]
[ 👔 Lavandería y tintorería ]
[ 🎪 Eventos y salones       ]
[ 🔄 Ver menú                ]


— ALBERCA —
Jaime:
"🏊 Alberca {{HOTEL_NOMBRE}}

Disponible para todos los huéspedes.

⏰ Horario: {{ALBERCA_HORARIO}}
{{ALBERCA_COSTO_TEXTO}}

¿Necesitas algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]


— RESTAURANTE —
Jaime:
"🍳 {{REST_NOMBRE}}

Servicio de desayuno {{DESAYUNO_TIPO}}.
✅ {{DESAYUNO_INCLUIDO_TEXTO}}

⏰ Horario: {{REST_HORARIO_DESAYUNO}}

Incluye:
{{DESAYUNO_INCLUYE}}

¿Necesitas algo más?"
[ 🍽️  Room service            ]
[ 🔄 Ver menú                ]


— ESTACIONAMIENTO —
Jaime:
"🅿️  Estacionamiento {{HOTEL_NOMBRE}}

{{ESTAC_COSTO_TEXTO}}
{{ESTAC_VIGILADO_TEXTO}}

¿Necesitas algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]


— LAVANDERÍA —
Jaime:
"👔 Servicio de lavandería
   y tintorería disponible.

{{LAVAND_COSTO}}

Para solicitar el servicio,
comunícate con Recepción:
📞 {{RECEPCION_WA}}

¿Necesitas algo más?"
[ 👤 Hablar con un agente    ]
[ 🔄 Ver menú                ]


— EVENTOS Y SALONES —
→ Redirige al Submenú de Eventos y Salones
```

---

## FLUJO 10 — POLÍTICAS DEL HOTEL
**Automatización:** 100% automático

```
PASO 1 — Submenú de políticas
───────────────────────────────────────────────
Jaime:
"¿Sobre qué política deseas
información? 😊"

[ ⏰ Check-in y Check-out     ]
[ ❌ Cancelaciones            ]
[ 🐾 Mascotas                 ]
[ 🚭 No fumar                 ]
[ 👶 Menores de edad          ]
[ 🌙 Horario de silencio      ]
[ 🔄 Ver menú                 ]


— CHECK-IN Y CHECK-OUT —
Jaime:
"⏰ Horarios de estancia {{HOTEL_NOMBRE}}:

🔑 Check-in:  a partir de las {{CHECKIN_HORA}}
🚪 Check-out: hasta las {{CHECKOUT_HORA}}

¿Necesitas llegar antes
o salir después?

⏫ Early Check-in:
   {{EARLY_CHECKIN_COSTO}}

⏬ Late Check-out:
   {{LATE_CHECKOUT_COSTO}}

Para solicitarlo contáctanos
con anticipación. 😊"
[ 📋 Pre-Registro             ]
[ 🔄 Ver menú                 ]


— CANCELACIONES —
Jaime:
"❌ Política de cancelación:

{{POL_CANCELACION}}

😔 No-show (sin avisar):
   {{POL_NOSHOW}}

🚫 Tarifas no reembolsables:
   {{POL_NO_REEMBOLSO}}

¿Tienes alguna duda?"
[ 👤 Hablar con un agente     ]
[ 🔄 Ver menú                 ]


— MASCOTAS —
Jaime:
"🐾 Política de mascotas:

{{POL_MASCOTAS}}

¿Necesitas algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]


— NO FUMAR —
Jaime:
"🚭 Política de no fumar:

{{POL_FUMADORES}}

⚠️  Penalización:
   {{POL_FUMADORES_SANCION}}

¿Necesitas algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]


— MENORES DE EDAD —
Jaime:
"👶 Política de menores:

{{POL_MENORES}}

¿Necesitas algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]


— HORARIO DE SILENCIO —
Jaime:
"🌙 Horario de silencio:

{{POL_SILENCIO}}

¿Necesitas algo más?"
[ 🔄 Ver menú ]  [ ✅ No, gracias ]
```

---

## FLUJO 11 — TIPOS DE HABITACIÓN Y TARIFAS
**Automatización:** 100% automático

```
PASO 1 — Jaime presenta el catálogo
───────────────────────────────────────────────
Jaime:
"Contamos con {{HOTEL_HABITACIONES}} habitaciones. 🏨

Todas incluyen {{DESAYUNO_TIPO}} gratuito.
{{HAB_NOTA_TARIFAS}}

¿Cuál te interesa conocer?"

[ Botón: {{HAB_TIPO_1}}  ]
[ Botón: {{HAB_TIPO_2}}  ]
[ Botón: {{HAB_TIPO_3}}  ]
[ Botón: {{HAB_TIPO_4}}  ]
[ Botón: {{HAB_TIPO_5}}  ]
[ 🔄 Ver menú            ]


— DETALLE POR TIPO DE HABITACIÓN —
(Repetir para cada tipo)

Jaime:
"🛏️  {{HAB_TIPO_X}}

👥 Capacidad: hasta {{HABX_CAPACIDAD}} personas
🛏️  {{HABX_DESC}}
📐 {{HABX_M2}} m²

Incluye:
{{HABX_EXTRAS}}
✅ {{DESAYUNO_TIPO}} gratuito

💰 Desde {{HABX_TARIFA}} / noche

¿Te gustaría reservar?"
[ ✅ Reservar ahora           ]
[ 🔙 Ver otras habitaciones  ]


PASO 2 — Si RESERVAR AHORA
───────────────────────────────────────────────
Jaime:
"¡Excelente elección! 😊

Reserva de forma segura en
nuestro motor de reservas oficial:

🔗 {{HOTEL_MOTOR_RESERVAS_URL}}

¿Necesitas ayuda con tu reservación?"
[ 👤 Hablar con un agente     ]
[ 🔄 Ver menú                 ]
```

---

## FLUJO 12 — EVENTOS Y SALONES
**Automatización:** 100% automático — cotización vía `{{EVENTOS_URL_COTIZACION}}`

```
PASO 1 — Presentación de salones
───────────────────────────────────────────────
Jaime:
"🏛️ SALONES {{HOTEL_NOMBRE}}

Contamos con {{SALON_CANTIDAD}} espacios para
reuniones, capacitaciones y eventos.

¿Cuál te gustaría conocer?"

[ 1️⃣ {{SALON_1_NOMBRE}}  ]
[ 2️⃣ {{SALON_2_NOMBRE}}  ]
[ 3️⃣ {{SALON_3_NOMBRE}}  ]
[ 🔙 Menú principal       ]


PASO 2 — Detalle por salón
(Repetir para cada salón)
───────────────────────────────────────────────
Jaime:
"📋 {{SALON_X_NOMBRE}}

👥 Capacidad: {{SALON_X_CAPACIDAD}} personas
{{SALON_X_MONTAJES}}

Equipamiento:
{{SALON_X_EQUIPO}}

💰 {{SALON_X_COSTO}}

¿Te gustaría cotizar este espacio?"

[ 🔗 Cotizar en línea         ]
[ 🔙 Ver otros salones        ]
[ 🔄 Menú principal           ]

→ Botón "🔗 Cotizar en línea" → abre {{EVENTOS_URL_COTIZACION}}


PASO 3 — Cierre
───────────────────────────────────────────────
"¿Puedo ayudarte con algo más?"

[ 🔄 Ver menú  ]  [ ✅ No, gracias ]

↓ Si "No, gracias":
"Soy Jaime, fue un placer asistirte. 😊
¡Hasta pronto! 🏨"
```

---

## RESUMEN DE PLACEHOLDERS POR FLUJO

| Flujo | Placeholders clave de la ficha |
|---|---|
| Bienvenida | `HOTEL_NOMBRE` |
| Flujo 1 Pre-Registro | `CHECKIN_HORA` · `RECEPCION_WA` |
| Flujo 2 Check Out | `FACTURACION_URL` · `HOTEL_NOMBRE` · `RECEPCION_WA` |
| Flujo 3 Facturación | `FACTURACION_URL` |
| Flujo 4 Amenidades | `ESC_AMENIDADES` · `ESC_AMENIDADES_WA` |
| Flujo 5 Fallas | `ESC_FALLA_TECNICA` · `ESC_FALLA_TECNICA_WA` · `ESC_EMERGENCIA` |
| Flujo 6 Limpieza | `ESC_LIMPIEZA` · `ESC_LIMPIEZA_WA` |
| Flujo 7 Room Service | `ROOMSERVICE_HORARIO` · `REST_NOMBRE` · `RS_PLATILLO_1..5` · `RS_PRECIO_1..5` · `ESC_ROOMSERVICE_WA` |
| Flujo 8 Ubicación | `HOTEL_NOMBRE` · `HOTEL_DIRECCION` · `HOTEL_GOOGLEMAPS` · `HOTEL_DISTANCIA_AEROPUERTO` · `HOTEL_COSTO_TAXI_AEROPUERTO` · `HOTEL_DISTANCIA_CENTRO` |
| Flujo 9 Instalaciones | `REST_NOMBRE` · `ALBERCA_HORARIO` · `DESAYUNO_TIPO` · `RECEPCION_WA` |
| Flujo 10 Políticas | `CHECKIN_HORA` · `CHECKOUT_HORA` · `POL_CANCELACION` · `POL_MASCOTAS` · `POL_FUMADORES` · `POL_MENORES` · `POL_SILENCIO` |
| Flujo 11 Habitaciones | `HOTEL_HABITACIONES` · `HAB_TIPO_1..5` · `HAB_TARIFA_1..5` · `HOTEL_MOTOR_RESERVAS_URL` |
| Flujo 12 Eventos | `SALON_1..3_NOMBRE` · `SALON_1..3_CAPACIDAD` · `SALON_1..3_COSTO` · `EVENTOS_URL_COTIZACION` |

---

## MODELO OPERATIVO — OPCIÓN A

| Elemento | Valor |
|---|---|
| Plataforma | ManyChat |
| Canal | WhatsApp |
| WhatsApp de Jaime | `{{JAIME_WHATSAPP}}` |
| Notificaciones Recepción | `{{RECEPCION_WA}}` |
| Escalamiento urgente | `{{ESC_URGENTE_NOMBRE}}` — `{{ESC_URGENTE_WA}}` |
| Escalamiento crítico | `{{ESC_CRITICO_NOMBRE}}` — `{{ESC_CRITICO_WA}}` |
| Link de facturación | `{{FACTURACION_URL}}` |
| Motor de reservas | `{{HOTEL_MOTOR_RESERVAS_URL}}` |
| PMS | `{{PMS_NOMBRE}}` |
| Channel Manager | `{{CHANNEL_MANAGER}}` |

### Responsabilidades del agente de Recepción en ManyChat

| Acción de Jaime | Tarea del agente |
|---|---|
| Pre-Registro solicitado | Verificar status en `{{PMS_NOMBRE}}` y actualizar campo en ManyChat |
| Check Out Express solicitado | Generar estado de cuenta y link de pago, enviarlos a Jaime |
| Ticket de mantenimiento | Notificar a `{{ESC_FALLA_TECNICA}}` y dar seguimiento |
| Ticket de ama de llaves | Notificar a `{{ESC_LIMPIEZA}}` y dar seguimiento |
| Escalamiento a agente | Tomar el chat manualmente |

---

## EVOLUCIÓN FUTURA — OPCIÓN B
Cuando el hotel decida automatizar al 100%:
- Integrar n8n con `{{PMS_NOMBRE}}` vía API
- n8n consulta status de reservación automáticamente
- n8n genera link de pago automáticamente
- Elimina intervención manual de Recepción en ManyChat
- Tiempo de respuesta: inmediato 24/7
