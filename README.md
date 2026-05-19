# 🤖 Jaime Chat Bot — Asistente Virtual para Hoteles

Jaime es un chatbot de atención a huéspedes que opera vía **WhatsApp** usando **ManyChat**.
Atiende solicitudes 24/7: pre-registro, check-out express, room service, amenidades, fallas, limpieza, políticas, salones y más.

---

## 📁 Estructura del repositorio

```
Jaime_Chat_Bot/
├── plantillas/
│   ├── PLANTILLA_FICHA_HOTEL.md       ← Ficha genérica con placeholders (llenar por hotel)
│   └── PLANTILLA_FLUJOS_JAIME.md      ← Flujos de conversación genéricos con placeholders
└── hoteles/
    └── BEWOW_QUERETARO/
        ├── BEWOW_QUERETARO_configuracion.md   ← Ejemplo real: Hotel BeWow Querétaro
        └── BEWOW_QUERETARO_flujos.md          ← Flujos implementados: Hotel BeWow Querétaro
```

---

## 🚀 Cómo agregar un nuevo hotel

1. Copia `plantillas/PLANTILLA_FICHA_HOTEL.md` → `hoteles/NOMBRE_HOTEL/NOMBRE_HOTEL_configuracion.md`
2. Llena todos los campos `{{PLACEHOLDER}}` con la información real del hotel
3. Copia `plantillas/PLANTILLA_FLUJOS_JAIME.md` → `hoteles/NOMBRE_HOTEL/NOMBRE_HOTEL_flujos.md`
4. Sustituye todos los `{{PLACEHOLDER}}` usando los datos de la ficha
5. Implementa en ManyChat siguiendo los flujos resueltos

---

## ✅ Hoteles activos

| Hotel | Ciudad | Estado | WhatsApp Jaime |
|---|---|---|---|
| Hotel Urbano BeWow© Querétaro | Querétaro, Qro. | ⬜ Configuración lista · ManyChat pendiente | +52 1 442 216-0100 |

---

## 🏗️ Modelo operativo — Opción A (actual)

ManyChat + agente humano en Recepción. Jaime capta, notifica y da seguimiento. Recepción responde los casos que requieren verificación en el PMS.

**Evolución futura — Opción B:** integración con n8n + PMS (API) para automatización 100% sin intervención humana.

---

## 📋 Flujos implementados

| # | Flujo | Automatización | Notifica a |
|---|---|---|---|
| 1 | Pre-Registro | Parcial (Recepción verifica) | Recepción |
| 2 | Check Out Express | Parcial (Recepción genera estado de cuenta) | Recepción |
| 3 | Facturación | 100% automático | — |
| 4 | Amenidades | 100% automático | Supervisor / Ama de llaves |
| 5 | Reportar falla | 100% automático | Mantenimiento / Gerencia |
| 6 | Limpieza | 100% automático | Supervisor / Ama de llaves |
| 7 | Room Service | 100% automático | Recepción / AyB |
| 8 | Ubicación y cómo llegar | 100% automático | — |
| 9 | Instalaciones | 100% automático | — |
| 10 | Políticas del hotel | 100% automático | — |
| 11 | Tipos de habitación y tarifas | 100% automático | — |
| 12 | Eventos y salones | 100% automático | — |

---

**Desarrollado por:** Ricardo Peña Covarrubias  
**Contacto:** rpenacovarrubias@gmail.com
